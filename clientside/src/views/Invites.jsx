import React from 'react';
import { Switch, Route, useRouteMatch, useHistory, useParams, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Jumbotron, Col, Row, Card, Form, Button, InputGroup, FormControl, FormLabel, Table } from 'react-bootstrap';
import { fetch_events, fetch_event, fetch_invites, post_post, patch_event, post_invites, patch_invite, fetch_invite } from '../api';
import flatpickr from "flatpickr";
import { convertDateTime } from '../util';
import store from '../store';


function Show({eventId, session}) {

  let { path, url } = useRouteMatch();
  let { event_inv } = store.getState();
  console.log("event inv", event_inv);
  let { invitations, stats } = event_inv;

  function inv_url(invit_id) {
    return `http://events-spa.measuringworm.com/events/${eventId}/invites/${invit_id}`;
  }

  function translateResponse(inv_resp) {
    switch (inv_resp) {
      case 1: return "Accepted"; break;
      case -1: return "Declined"; break;
      default: return "..."; break;
    }
  }

  React.useEffect(() => {
    // FIXME user id?
    fetch_invites({entry_id: eventId});
  }, []);

  return (
    <div className="mx-auto">
      <h1 className="display-4 fw-lighter my-3">
        {"Responses"}
      </h1>
      {stats &&
        <Jumbotron className="text-dark p-4">
          <Row className="mx-auto text-center">
            <Col><h3>{`Accepted: ${stats.accepted}`}</h3></Col>
            <Col><h3>{`Declined: ${stats.declined}`}</h3></Col>
            <Col><h3>{`Maybe: ${stats.none}`}</h3></Col>
          </Row>
        </Jumbotron>}
      {invitations &&
      <Table className="bordered hover w-50 mx-auto text-center" variant="dark">
        <thead>
          <tr>
            <th>Invited</th>
            <th>Response</th>
            <th>{"Invite link"}</th>
          </tr>
        </thead>
        <tbody>
          {invitations.map((inv, i) =>
            <tr key={inv.id}>
              <td>{inv.email}</td>
              <td>{translateResponse(inv.response)}</td>
              <td>{`${inv_url(inv.id)}`}</td>
            </tr>)}
        </tbody>
      </Table>}
    </div>
  );
}

function invite_state_to_props({event_inv}) {
  return {event_inv};
}
let Responses = connect(invite_state_to_props)(Show);

function InvResp({eventId, events, invite, session}) {

  // TODO only those invited can respond

  let { inviteId } = useParams();
  let history = useHistory();

  console.log("Ivites event is", events)
  console.log("IINVITE ID", inviteId)
  console.log("invite is", invite)
  let [ entry ] = events

  function handle_respond(response) {
    // post 'UPDATE' invite response
    let form_params = {
      id: inviteId,
      entry_id: eventId,
      response: response
    }
    let success = () => history.replace(`/events/${eventId}`);

    patch_invite(eventId, inviteId, form_params, success);
  }

  React.useEffect(() => {
    if (eventId && inviteId) {
      console.log("FEWTCHING WITH", eventId, inviteId)
      fetch_invite(eventId, inviteId);
    }
  }, [eventId, inviteId, session]);

  React.useEffect(() => {
    if (Object.keys(invite).length > 0) {
      fetch_event(eventId);
    }
  }, []);

  let body;
  if (entry && Object.keys(invite).length > 0) {
    body =
    <div>
      <h3 className="fw-lighter display-3">{"You've been invited"}</h3>
      <Jumbotron className="text-dark py-5">
        <h3 className="fw-lighter display-3">{entry.name}</h3>
        <h4>{convertDateTime(entry.date)}</h4>
        <h5>{`${entry.user.name} is hosting`}</h5>
        <p className="pt-3">{entry.description}</p>
        <Row className="justify-content-start mx-auto align-items-end">
          <div>
            <Button
              variant="success"
              size="lg"
              className="mt-4 mr-3"
              onClick={() => handle_respond(1)}>
              {"Accept"}
            </Button>
            <Button
              variant="danger"
              size="lg"
              className="mt-4 mr-3"
              onClick={() => handle_respond(-1)}>
              {"Decline"}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="mt-4 mr-3"
              onClick={() => handle_respond(0)}>
              {"Maybe"}
            </Button>
          </div>
        </Row>
      </Jumbotron>
    </div>;
  } else {
    body =
      <div>
        <h3 className="fw-lighter display-3">{"Oh no"}</h3>
        <p>{"You either don't have an account or weren't invited to this event"}</p>
        <Col>
          <Row><Link to="/users/new" className="btn btn-primary mb-3">{"Register"}</Link>
        </Row>
        <Row><Link to="/" className="btn btn-secondary">{"Go home"}</Link></Row>
      </Col>
    </div>;
  }

  return (<div>{body}</div>);
}

function respond_state_to_props({events, invite, session}) {
  return {events, invite, session};
}
let Respond = connect(respond_state_to_props)(InvResp);

function New({eventId, session}) {

  let history = useHistory();

  function handle_submit(ev) {
    ev.preventDefault();
    console.log(ev)
    let form_params = {
      emails: ev.target[0].value,
      entry_id: eventId
    }
    let success = () => history.replace(`/events/${eventId}/invites/responses`);

    post_invites(eventId, form_params, success);
  }


  return (
    <div>
      <h3 className="fw-lighter display-3">Invite</h3>
      <Jumbotron className="text-dark">
        <Form onSubmit={handle_submit}>
          <FormLabel>
            <h2 className="display-5 mt-3">{"Who"}</h2>
          </FormLabel>
          <FormControl
            as="textarea"
            placeholder="Enter email addresses separated by commas"
            />
          <Row className="pl-3 mt-4">
            <Button type="submit" className="btn btn-primary mr-3" size="lg">
              {"Invite"}
            </Button>
            <Link to={`/events/${eventId}`} className="btn h-100 btn-lg btn-secondary">Back</Link>
          </Row>
        </Form>
      </Jumbotron>
    </div>
  );
}

function Invites({eventId, event_inv, session}) {

  let { path, url } = useRouteMatch();

  // TODO fetch entry invitation details and tabulate

  return (
    <Switch>
      <Route exact path={path}>
        <New eventId={eventId} session={session} />
      </Route>
      <Route path={`${path}/responses`}>
        <Responses eventId={eventId} session={session} />
      </Route>
      <Route path={`${path}/:inviteId`}>
        <Respond eventId={eventId} session={session} />
      </Route>
    </Switch>
  );
}

function state_to_props({session, event_inv}) {
  return {session, event_inv};
}

export default connect(state_to_props)(Invites);
