import { Nav, Alert, Navbar, Row, Col, Button, Form, FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import store from '../store';
import { api_auth } from '../api';
import { capitalize } from '../util';

function Header({currentPage, errors, success, info, session, dispatch}) {


  console.log("Header errors", errors);
  console.log("Header success", success);


  function handleSignin(ev) {
    ev.preventDefault();
    let email = ev.target[0].value;
    let password = ev.target[1].value;
    let form_params = {
      email: email,
      password: password
    };

    dispatch({ type: "acct_form/set", data: form_params });
    api_auth(email, password);
  }

  function handleSignout() {
    dispatch({ type: "session/set", data: {} });
  }

  return (
    <div>
      <Navbar variant="dark" bg="dark" className="p-4 justify-content-between">
        <Navbar.Brand href="/">{"Events"}</Navbar.Brand>
        {!session.token ?
          (<Form inline
            onSubmit={handleSignin}
            className="">
            <FormControl type="email" placeholder="Email" className="mr-sm-2" />
            <FormControl type="password" placeholder="Password" className="mr-sm-2" />
            <Button type="submit" variant="outline-primary">
              {"Sign in"}
            </Button>
          </Form>) :
          <Row>
            <Nav className="mx-3">
              <Nav.Link href="/events">{"View Events"}</Nav.Link>
              <Nav.Link href="/events/new">{"Create an Event"}</Nav.Link>
            </Nav>
            <Row className="align-items-center">
              <Col>
                {`Hello, ${session.username}`}
              </Col>
              <Col>
                <Button
                  className="btn btn-primary h-auto w-auto text-nowrap"
                  onClick={handleSignout}>
                  {"Sign out"}
                </Button>
              </Col>
            </Row>
          </Row>}
        </Navbar>
        {success.map((msg, i) =>
          <Alert key={i} variant="success">
            {capitalize(msg)}
          </Alert>)}
        {info.map((msg, i) =>
          <Alert key={i} variant="info">
            {capitalize(msg)}
          </Alert>)}
        {errors.map((msg, i) =>
          <Alert key={i} variant="danger">
            {capitalize(msg)}
          </Alert>)}
        </div>
      );
    }

    // Take state and condense to the props needed for the
    // component
    function state_to_props({errors, success, info, session}) {
      return {errors, success, info, session};
    }

    export default connect(state_to_props)(Header);
