import store from './store';
import { capitalize } from './util';

function api_base(path) {
  return `http://localhost:4000/api/v1${path}`;
}

async function api_get(path, body = {}) {
  console.log("GET at", api_base(path), "with", JSON.stringify(body, null, 2));
  let resp = await fetch(api_base(path), body);
  let data = await resp.json(); // YOU HAVE TO AWAIT THIS
  console.log("GET response", JSON.stringify(data, null, 2));
  return data;
}

function clear_errors() {
  store.dispatch({ type: "errors/set", data: [] });
}

// Based on Nat Tuck lecture code here:
// https://github.com/NatTuck/scratch-2021-01/blob/master/4550/0319/photo-blog-spa/web-ui/src/api.js
async function api_post(path, data) {
  let req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  console.log("POST at", api_base(path), "with", JSON.stringify(req, null, 2))
  let resp = await fetch(api_base(path), req);
  let resp_data = await resp.json();
  console.log("POST response", JSON.stringify(resp_data, null, 2));
  return resp_data;
}

async function api_patch(path, data) {
  let req = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  console.log("PATCH at", api_base(path), "with", JSON.stringify(req, null, 2))
  let resp = await fetch(api_base(path), req);
  let resp_data = await resp.json();
  console.log("PATCH response", JSON.stringify(resp_data, null, 2));
  return resp_data;
}

async function api_delete(path, data) {
  let req = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  console.log("DELETE at", api_base(path), "with", JSON.stringify(req, null, 2))
  let resp = await fetch(api_base(path), req);
  // let resp_data = await resp.json();
  // console.log("DELETE response", JSON.stringify(resp_data, null, 2));
  // return resp_data;
}

export function api_auth(email, password) {
  // post at session endpoint, dispatch set/session, redirect?
  api_post("/session", {email, password})
    .then(data => {
      console.log("AUTH response", JSON.stringify(data, null, 2));
      let error_resp = data["errors"];
      if (error_resp) {
        store.dispatch({ type: "errors/one", data: error_resp});
      } else {
        store.dispatch({ type: "session/set", data: data });
        clear_errors();
      }
    })
    .catch(err => {
      console.error("AUTH failed", err);
      store.dispatch({ type: "errors/one", data: err });
    });
}

export function fetch_events() {
  api_get("/entries", {})
    .then(resp => {
      let error_resp = resp["errors"];
      if (error_resp) {
        store.dispatch({ type: "errors/set", data: error_resp});
      } else {
        store.dispatch({ type: "events/add", data: resp["data"] });
        clear_errors();
      }
    })
    .catch(err => {
      console.error("FETCH EVENTS failed", err);
      store.dispatch({ type: "errors/one", data: err });
    });
}

export function fetch_event(event_id) {
  api_get(`/entries/${event_id}`, {})
    .then(resp => {
      let error_resp = resp["errors"];
      if (error_resp) {
        store.dispatch({ type: "errors/set", data: error_resp });
      } else {
        store.dispatch({ type: "events/set", data: [resp["data"]] });
        clear_errors();
      }
    })
    .catch(err => {
      console.error("FETCH EVENT failed", err);
      store.dispatch({ type: "errors/one", data: err });
    });
}


function parse_errors(resp_errors) {
  // combine errors array for resp.errors keys
  let errors = Object.keys(resp_errors).reduce((acc, field) => {
    return acc.concat(capitalize(`${field} ${resp_errors[field]}`));
  }, []);
  console.log(resp_errors)
  return errors;
}

export function post_post(form_params, success) {
  api_post("/entries", {entry: form_params})
    .then(resp => {
      let error_resp = resp["errors"];
      if (error_resp) {
        store.dispatch({ type: "errors/set", data: parse_errors(resp["errors"]) });
      } else {
        store.dispatch({ type: "success/set", data: ["Created event"] })
        store.dispatch({ type: "events/add", data: resp });
        clear_errors();
        success();
      }
    })
    .catch(err => {
      console.error("POST POST failed", err);
      store.dispatch({ type: "errors/one", data: err });
    });
}

export function post_comment(eventId, form_params, success) {
  api_post(`/entries/${eventId}/comments`, {comment: form_params})
    .then(resp => {
      let error_resp = resp["errors"];
      if (error_resp) {
        store.dispatch({ type: "errors/set", data: parse_errors(resp["errors"]) });
      } else {
        store.dispatch({ type: "success/set", data: ["Comment posted"] })
        store.dispatch({ type: "events/add", data: resp });
        clear_errors();
        success();
      }
    })
    .catch(err => {
      console.error("POST POST failed", err);
      store.dispatch({ type: "errors/one", data: err });
    });
}

export function patch_event(eventId, form_params, success) {
  api_patch(`/entries/${eventId}`, {id: eventId, entry: form_params})
    .then(resp => {
      let error_resp = resp["errors"];
      if (error_resp) {
        store.dispatch({ type: "errors/set", data: parse_errors(resp["errors"]) });
      } else {
        store.dispatch({ type: "success/set", data: ["Updated event details"] })
        store.dispatch({ type: "events/set", data: [] });
        clear_errors();
        success();
      }
    })
    .catch(err => {
      console.error("POST POST failed", err);
      store.dispatch({ type: "errors/one", data: err });
    });
}

export function post_invites(form_params, success) {
  api_post("/invitations", {invitations: form_params})
  .then(resp => {
    store.dispatch({ type: "success/set", data: resp["succeeded"].map(suc => `Invited ${suc}`) });
    let errors = resp["malformed"].map(mal => `Couldn't recognize \'${mal}\'. Check your spelling`).concat(resp["failed"].map(fail => `Failed to invite ${fail}`));
    store.dispatch({ type: "errors/set", data: errors });
  })
  .catch(err => {
    console.error("POST POST failed", err);
    store.dispatch({ type: "errors/one", data: err });
  });
}

export function patch_invite(entry_id, invit_id, form_params, success) {
  api_patch(`/entries/${entry_id}/invitations/${invit_id}`, {invitation: form_params})
  .then(resp => {
    let errors = resp["errors"];
    if (errors) {
      store.dispatch({ type: "errors/set", data: parse_errors(resp["errors"]) });
    } else {
      store.dispatch({ type: "success/set", data: ["Response recorded"] });
      clear_errors();
      success();
    }
  })
  .catch(err => {
    console.error("POST POST failed", err);
    store.dispatch({ type: "errors/one", data: err });
  });
}

export function fetch_invites({entry_id}) {
  api_get(`/entries/${entry_id}/invitations`, {entry_id: entry_id})
  .then(resp => {
    let errors = resp["errors"];
    if (errors) {
      store.dispatch({ type: "errors/set", data: resp["errors"] });
    } else {
      store.dispatch({ type: "event_inv/set", data: resp });
    }
  })
  .catch(err => {
    console.error("POST POST failed", err);
    store.dispatch({ type: "errors/one", data: err });
  });
}

export function delete_comment(eventId, comm_id, success) {
  api_delete(`/entries/${eventId}/comments/${comm_id}`, {id: comm_id})
    .then(resp => {
      clear_errors();
    })
    .catch(err => {
      console.error("POST POST failed", err);
      store.dispatch({ type: "errors/one", data: err });
    });
}
