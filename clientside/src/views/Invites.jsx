import React from 'react';
import { Switch, Route, useRouteMatch, useHistory, useParams, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Jumbotron, Col, Row, Card, Form, Button, InputGroup, FormControl, FormLabel } from 'react-bootstrap';
import { fetch_events, fetch_event, fetch_invites, post_post, patch_event, post_invites } from '../api';
import flatpickr from "flatpickr";
import { convertDateTime } from '../util';
import store from '../store';


function Responses({eventId, session}) {

  let { event_inv } = store.getState();
  console.log("event inv", event_inv);
  let { invitations, stats } = event_inv;

  React.useEffect(() => {
    // FIXME user id?
    fetch_invites({entry_id: eventId});
  }, []);

  return (
    <div className="mx-auto">
      <h1 className="display-4 fw-lighter my-3">
        {"Responses"}
      </h1>
      {Object.keys(event_inv) > 0 &&
        <Jumbotron className="text-dark p-4">
          <Row className="mx-auto text-center">
            <Col><h3>{`Accepted: ${stats.accepted}`}</h3></Col>
            <Col><h3>{`Declined: ${stats.declined}`}</h3></Col>
            <Col><h3>{`Maybe: ${stats.none}`}</h3></Col>
          </Row>
        </Jumbotron>}
      </div>
    );
  }

  function New({eventId, session}) {

    let history = useHistory();

    function handle_submit(ev) {
      ev.preventDefault();
      console.log(ev)
      let form_params = {
        emails: ev.target[0].value,
        entry_id: eventId
      }
      let success = () => history.replace(`/events/${eventId}`);

      post_invites(form_params, success);
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
      </Switch>
    );
  }

  function state_to_props({session, event_inv}) {
    return {session, event_inv};
  }

  export default connect(state_to_props)(Invites);
