import React from 'react';
import { Switch, Route, useRouteMatch, useHistory, useParams, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Jumbotron, Col, Row, Card, Form, Button, InputGroup, FormControl, FormLabel } from 'react-bootstrap';
import { fetch_events, fetch_event, post_post, patch_event, post_invites, post_comment, delete_comment, post_user } from '../api';
import flatpickr from "flatpickr";
import { convertDateTime } from '../util';
import store from '../store';
import Invites from './Invites';

function Index() {

  return (
    <h1>user Index</h1>
  );
}

function New() {

  let history = useHistory();

  function handle_create(ev) {
    ev.preventDefault();
    // TODO post to users
    let form_params = {
      name: ev.target[0].value,
      email: ev.target[1].value,
      password: ev.target[2].value
    };

    let success = () => history.replace("/events");

    console.log("User submit form", form_params);
    post_user(form_params, success);
  }

  return (
    <Form
      onSubmit={handle_create}
      className="w-50 mx-auto">
      <h3 className="fw-lighter display-3 my-3">{"Register"}</h3>
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text id="basic-addon1">{"Name"}</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          aria-label="name"
          aria-describedby="basic-addon1"
          />
      </InputGroup>

      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text>{"Email"}</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          type="email"
          aria-label="email" />
      </InputGroup>

      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text>{"Password"}</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          type="password"
          aria-label="date"
          />
      </InputGroup>

      <Button type="submit" className="btn btn-primary mt-4" size="lg">
        {"Register"}
      </Button>
    </Form>
  );
}

export default function Users() {

  let { path, url } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <Index />
      </Route>
      <Route path={`${path}/new`}>
        <New />
      </Route>
    </Switch>
  );
}
