import React from 'react';
import { Switch, Route, useRouteMatch, useHistory, useParams, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Jumbotron, Col, Row, Card, Form, Button, InputGroup, FormControl, FormLabel } from 'react-bootstrap';
import { fetch_events, fetch_event, post_post, patch_event, post_invites, post_comment, delete_comment } from '../api';
import flatpickr from "flatpickr";
import { convertDateTime } from '../util';
import store from '../store';
import Invites from './Invites';

function Index({session, events}) {

  console.log("Events listing", events);

  // TODO fetch events and display
  let { path, url } = useRouteMatch();
  React.useEffect(() => {
    fetch_events();
  }, [session]);

  return (
    <div>
      <h3 className="mb-5 fw-lighter display-4">{"All events"}</h3>
      <Container className="d-flex my-2 flex-wrap justify-content-around text-dark">
        {events.map(event =>
          <Card
            key={`event_${event.id}`}
            className="w-25 p-4 mx-1 mb-3">
            <Card.Title>{event.name}</Card.Title>
            <Card.Subtitle className="mb-3 text-muted">
              {convertDateTime(event.date)}
            </Card.Subtitle>
            <Card.Text className="text-break">
              {event.description}
            </Card.Text>
            <Link
              to={`${path}/${event.id}`}
              className="btn btn-primary">
              {"View"}
            </Link>
            {session.id === event.owner_id &&
              <Link
                to={`${path}/${event.id}`}
                size="sm"
                className="btn btn-outline-primary">
                {"View"}
              </Link>}
            </Card>
        )}
      </Container>
    </div>
  );
}

function New({session, eventId}) {

  let history = useHistory();

  let opts = {
    enableTime: true,
    altInput: true,
    dateFormat: "Y-m-d H:i",
  };

  //let name, date, description = "";
  let [ entry ] = store.getState().events;
  let name = entry?.name || ""
  let date = convertDateTime(entry?.date) || ""
  let description = entry?.description || ""

  React.useEffect(() => {
    if (eventId) {
      fetch_event(eventId);
    }
  }, []);

  React.useEffect(() => {
    flatpickr("#pick-date", opts);
  }, []);

  function handle_create(ev) {
    ev.preventDefault();
    let form_params = {
      name: ev.target[0].value,
      date: ev.target[2].value,
      description: ev.target[1].value,
      user_id: session.user_id // FIXME use auth plug
    };

    let success = () => history.replace("/events");
    post_post(form_params, success);
  }

  function handle_update(ev) {
    ev.preventDefault();
    let form_params = {
      name: ev.target[0].value,
      date: ev.target[2].value,
      description: ev.target[1].value,
      user_id: session["user_id"] // FIXME use auth plug
    };

    let success = () => history.replace("/events");
    patch_event(eventId, form_params, success);
  }

  // Derived from react bootstrap examples here:
  // https://react-bootstrap.netlify.app/components/input-group/

  return (
    <div className="w-50 mx-auto">
      <h1 className="display-4 fw-lighter my-3">
        {eventId ? "Edit event details" : "Create an event"}
      </h1>
      <div>
        <Form onSubmit={eventId ? handle_update : handle_create}>
          <FormLabel>
            <h2 className="display-5">{"What"}</h2>
          </FormLabel>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">{"Name"}</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              defaultValue={name}
              aria-label="name"
              aria-describedby="basic-addon1"
              />
          </InputGroup>

          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>{"Description"}</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              as="textarea"
              defaultValue={description}
              aria-label="description" />
          </InputGroup>

          <FormLabel>
            <h2 className="display-5 mt-3">{"When"}</h2>
          </FormLabel>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>{"Date"}</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              id="pick-date"
              defaultValue={date}
              aria-label="date"
              />
          </InputGroup>

          <Button type="submit" className="btn btn-primary mt-4" size="lg">
            {eventId ? "Update" : "Create"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

function Display({eventId, session, success}) {

  let { path, url } = useRouteMatch();

  function handle_comment(ev) {
    ev.preventDefault();
    let form_params = {
      body: ev.target[0].value,
      entry_id: eventId,
      user_id: session.user_id
    };
    let successCallback = () => {
      store.dispatch({ type: "flags/add", data: {commenting: undefined} });
      fetch_event(eventId);
    };
    post_comment(eventId, form_params, successCallback);
  }

  function handle_delete_comment(comm_id) {
    // FIXME update (refetch on success)
    delete_comment(eventId, comm_id);
    fetch_event(eventId);
  }

  // TODO fetch full event at id
  React.useEffect(() => {
    console.log("Fetching event to display...")
    fetch_event(eventId);
  }, [success]);

  React.useEffect(() => {
    fetch_event(eventId);
  }, []);

  let entry;
  let temp = store.getState().events; // meh
  if (temp.length === 1) {
    [ entry ] = temp;
  }
  let { flags } = store.getState();
  console.log("show event flags", flags);
  console.log("Showing event:", entry);
  console.log("id is", eventId)
  let body;
  if (entry) {
    body = (
      <div>
        <Jumbotron className="text-dark py-5">
          <h3 className="fw-lighter display-3">{entry.name}</h3>
          <h4>{convertDateTime(entry.date)}</h4>
          <h5>{`${entry.user.name} is hosting`}</h5>
          <p className="pt-3">{entry.description}</p>
          <Row className="justify-content-start mx-auto align-items-end">
            {entry.owner_id === session.user_id &&
              <div>
                <Link to={`/events/${eventId}/invites`}
                  className="btn btn-primary mt-4 mr-3">Invite</Link>
                <Link to={`/events/${eventId}/invites/responses`}
                  className="btn btn-primary mt-4 mr-3">
                  {"View invitations"}
                </Link>
                <Link to={`/events/${eventId}/edit`}
                  className="btn btn-primary mt-4 mr-3">Edit</Link>
              </div>}
              {!flags.commenting &&
                <Button
                  variant="success"
                  onClick={() => store.dispatch({
                    type: "flags/add", data: {commenting: true}
                  })}>
                  {"Comment"}
                </Button>}
              </Row>
              {flags.commenting &&
                <Form
                  onSubmit={handle_comment}
                  className="d-flex flex-row w-75">
                  <Form.Row className="w-100 pt-4">
                    <Col xs={6}>
                      <Form.Control
                        type="text"
                        className="text-wrap"
                        placeholder="Post a comment"/>
                    </Col>
                    <Col xs="auto">
                      <Button type="submit" variant="success">Post</Button>
                    </Col>
                    <Col xs="auto">
                      <Button
                        variant="secondary"
                        onClick={() => store.dispatch({
                          type: "flags/add", data: {commenting: undefined}
                        })}>
                        Cancel
                      </Button>
                    </Col>
                  </Form.Row>
                </Form>}
            </Jumbotron>
        <h2>Comments</h2>
        {entry.comments.map((comm, i) =>
          <div key={`comm_${comm.id}`} className="p-3 mb-2">
            <Row className="mx-auto d-flex align-items-center">
              <Col xs="auto"><h4>{comm.user.name}</h4></Col>
              <Col>{convertDateTime(comm.inserted_at)}</Col>
              {(comm.user.id === session.user_id || comm.user.id === entry.owner_id) &&
                <Col>
                  <Button
                    onClick={() => handle_delete_comment(comm.id)}
                    variant="danger"
                    size="sm">Delete</Button>
                </Col>}
            </Row>
            <Row className="px-5">{comm.body}</Row>
          </div>)}
        </div>
      );
    } else {
      body = (
        <h3 className="fw-lighter display-3">
          {"Event not found"}</h3>
      );
    }

    return (
      <Col className="p-3 my-3">
        {body}
      </Col>
    );
  }

  function show_state_to_props({session, success}) {
    return {session, success};
  }
  let Show = connect(show_state_to_props)(Display);

  function Event({session}) {
    // The <Route> that rendered this component has a
    // path of `/topics/:topicId`. The `:topicId` portion
    // of the URL indicates a placeholder that we can
    // get from `useParams()`.

    let { eventId } = useParams();
    let { path, url } = useRouteMatch();
    console.log("In show", path, eventId)

    return (
      <Switch>
        <Route exact path={path}>
          <Show eventId={eventId} />
        </Route>
        <Route path={`${path}/invites`}>
          <Invites eventId={eventId} />
        </Route>
        <Route path={`${path}/edit`}>
          <New session={session} eventId={eventId} />
        </Route>
      </Switch>
    );
  }

  function Events({session, events, dispatch}) {

    // This how get the component to act as a dispatcher
    // to nested routes. Path is local to the domain while
    // url is the fully expanded current url
    let { path, url } = useRouteMatch();
    console.log("Events session", JSON.stringify(session, null, 2));

    return (
      <Switch>
        <Route exact path={path}>
          <Index session={session} events={events} />
        </Route>
        <Route path={`${path}/new`}>
          <New session={session} />
        </Route>
        <Route path={`${path}/:eventId`}>
          <Event session={session} />
        </Route>
      </Switch>
    );
  }

  function state_to_props({session, events, flags}) {
    return {session, events, flags};
  }

  export default connect(state_to_props)(Events);
