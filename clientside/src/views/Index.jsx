import { Jumbotron } from 'react-bootstrap';

export default function Index() {
  return (
    <Jumbotron>
      <h1>{"Events @ measuringworm"}</h1>
      <h3>
        <small>
          {"Your new favorite event planner!"}
        </small>
      </h3>
      <p>{"Focus on preparing for your event and let us do the planning."}</p>
      <p>{"By \"us\", we mean this awesome single-page web-app"}</p>
    </Jumbotron>
  );
}
