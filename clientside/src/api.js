import store from './store';

function api_base(path) {
  return `http://localhost:4000/api/v1${path}`;
}

async function api_get(path) {
  console.log("GET at", api_base(path));
  let resp = await fetch(api_base(path), {});
  let data = await resp.json();
  console.log("GET response", JSON.stringify(data, null, 2));
  return data;
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
  let resp_data = resp.json();
  console.log("POST response", JSON.stringify(resp_data, null, 2));
  return resp_data;
}

export function api_auth(email, password) {
  // post at session endpoint, dispatch set/session, redirect?
  api_post("/session", {email, password})
    .then(data => {
      console.log("AUTH response", JSON.stringify(data, null, 2));
      let error_resp = data["error"];
      if (error_resp) {
        store.dispatch({ type: "error/one", data: error_resp});
      } else {
        store.dispatch({ type: "session/set", data: data });
        store.dispatch({ type: "error/set", data: [] });
      }
    })
    .catch(err => {
      console.error("AUTH failed", err);
      store.dispatch({ type: "error/one", data: err });
    });
}

export function fetch_events() {
  api_get("/entries", {})
    .then(data => {
      let error_resp = data["error"];
      if (error_resp) {
        store.dispatch({ type: "error/one", data: error_resp});
      } else {
        store.dispatch({ type: "events/add", data: Object.values(data)});
      }
    })
    .catch(err => {
      console.error("FETCH EVENTS failed", err);
      store.dispatch({ type: "error/one", data: err });
    });
}

export function post_post(form_params) {
  api_post("entries/new", form_params)
    .then(resp => {
      let error_resp = resp["error"];
      if (error_resp) {
        store.dispatch({ type: "error/one", data: error_resp});
      } else {
        // FIXME
      }
    })
    .catch(err => {
      console.error("POST POST failed", err);
      store.dispatch({ type: "error/one", data: err });
    });
}
