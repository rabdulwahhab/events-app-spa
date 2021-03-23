import { Switch, Route, useRouteMatch, useParams, Link } from 'react-router-dom';
import { Form, InputGroup, FormControl, FormLabel } from 'react-bootstrap';
import flatpickr from "flatpickr";

function Index() {

  // TODO fetch events and display

  return (
    <div>
      <h1>{"TODO"}</h1>
      <Link to="/" className="btn btn-primary">{"Go home"}</Link>
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

  // Derived from react bootstrap examples here:
  // https://react-bootstrap.netlify.app/components/input-group/

  return (
    <div>
      <h1 className="display-4 fw-lighter my-3">{"Create an event"}</h1>
      <div>
        <FormLabel><h2 className="display-5">{"What"}</h2></FormLabel>
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
      </div>
    </div>
  );
}

function Event() {
  // The <Route> that rendered this component has a
  // path of `/topics/:topicId`. The `:topicId` portion
  // of the URL indicates a placeholder that we can
  // get from `useParams()`.

  let { event_id } = useParams();

  return (
    <h1>{`Viewing event(entry) ${event_id}`}</h1>
  );
}

// TODO connect with redux
export default function Events() {

  // This how get the component to act as a dispatcher
  // to nested routes. Path is local to the domain while
  // url is the fully expanded current url
  let { path, url } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <Index />
      </Route>
      <Route path={`${path}/new`}>
        <New />
      </Route>
      <Route path={`${path}/:event_id`}>
        <Event />
      </Route>
    </Switch>
  );
}
