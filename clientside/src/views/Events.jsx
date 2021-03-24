import { Switch, Route, useRouteMatch, useParams, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Card, Form, Button, InputGroup, FormControl, FormLabel } from 'react-bootstrap';
import { fetch_events, post_post } from '../api';
import flatpickr from "flatpickr";

function Index({events}) {

  // TODO fetch events and display
  let { path, url } = useRouteMatch();

  return (
    <div>
      <h1>{"TODO"}</h1>
      <Button
        className="btn btn-primary"
        onClick={fetch_events}>
        {"Fetch"}
      </Button>
      <Container className="d-flex flex-wrap justify-content-around">
        {events?.mapaa(event => {
          (<Card key={event.id}>
            <Card.Title>{event.name}</Card.Title>
            <Card.Subtitle className="mb-3 text-muted">
              {event.owner?.name}
            </Card.Subtitle>
            <Card.Text className="text-break">
              {event.description}
            </Card.Text>
            <Card.Link
              href={`${path}/${event.id}`}
              className="btn btn-outline-primary">
              {"View"}
            </Card.Link>
          </Card>);
        })}
      </Container>
    </div>
  );
}

function New() {

  let opts = {
    enableTime: true,
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d H:i",
  };

  flatpickr("#pick-date", opts);

  function submitHandler(ev) {
    ev.preventDefault();
    // TODO get form values and pkg
    // let resp = post_post("/entries/new", form_params);
    // TODO dispatch depending on result, redirect on success
  }

  // Derived from react bootstrap examples here:
  // https://react-bootstrap.netlify.app/components/input-group/

  return (
    <div className="w-50 mx-auto">
      <h1 className="display-4 fw-lighter my-3">{"Create an event"}</h1>
      <div>
        <Form onSubmit={submitHandler}>
          <FormLabel>
            <h2 className="display-5">{"What"}</h2>
          </FormLabel>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">{"Name"}</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              aria-label="name"
              aria-describedby="basic-addon1"
              />
          </InputGroup>

          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>{"Description"}</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl as="textarea" aria-label="description" />
          </InputGroup>

          <FormLabel><h2 className="display-5 mt-3">{"When"}</h2></FormLabel>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>{"Date"}</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              id="pick-date"
              aria-label="date"
              />
          </InputGroup>
          <Button className="btn btn-primary" size="lg">
            {"Create"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

function Show() {
  // The <Route> that rendered this component has a
  // path of `/topics/:topicId`. The `:topicId` portion
  // of the URL indicates a placeholder that we can
  // get from `useParams()`.

  let { event_id } = useParams();

  return (
    <h1>{`Viewing event(entry) ${event_id}`}</h1>
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
        <Index events={events} />
      </Route>
      <Route path={`${path}/new`}>
        <New />
      </Route>
      <Route path={`${path}/:event_id`}>
        <Show />
      </Route>
    </Switch>
  );
}

function state_to_props({session, events}) {
  return {session, events};
}

export default connect(state_to_props)(Events);
