import { createStore, combineReducers } from 'redux';

function error_reducer(state = [], action) {
  switch (action.type) {
    case "errors/set":
      return action.data;
      break;
    case "errors/one":
      return [action.data];
      break;
    case "errors/add":
      return state.concat([action.data]);
      break;
    default:
      return state;
  }
}

function acct_form_reducer(state = {}, action) {
  switch (action.type) {
    case "acct_form/set":
      return action.data;
      break;
    case "acct_form/set/name":
      return { ...state, name: action.data };
      break;
    case "acct_form/set/email":
      return { ...state, email: action.data };
      break;
    case "acct_form/set/passcode":
      return { ...state, passcode: action.data };
      break;
    case "acct_form/set/valid":
      return { ...state, isvalid: action.data };
      break;
    default:
      return state;
  }
}

function events_reducer(state = [], action) {
  switch (action.type) {
    case "events/set":
      return action.data;
      break;
    case "events/add":
      return state.concat(action.data);
      break;
    default:
      return state;
  }
}

function invitation_reducer(state = {}, action) {
  switch (action.type) {
    case "invite/set":
      return action.data;
      break;
    default:
      return state;
  }
}

function event_invites_reducer(state = {}, action) {
  switch (action.type) {
    case "event_inv/set":
      return action.data;
      break;
    case "event_inv/add":
      return state.concat(action.data);
      break;
    default:
      return state;
  }
}

function show_reducer(state = {}, action) {
  switch (action.type) {
    case "show/set":
      return action.data;
      break;
    default:
      return state;
  }
}

function info_reducer(state = [], action) {
  switch (action.type) {
    case "info/set":
      return action.data;
      break;
    case "info/add":
      return state.concat([action.data]);
      break;
    default:
      return state;
  }
}

function flags_reducer(state = {}, action) {
  switch (action.type) {
    case "flags/set":
      return action.data;
      break;
    case "flags/add":
      return { ...state, ...action.data };
      break;
    default:
      return state;
  }
}

function success_reducer(state = [], action) {
  switch (action.type) {
    case "success/set":
      return action.data;
      break;
    case "success/add":
      return state.concat([action.data]);
      break;
    default:
      return state;
  }
}

function session_reducer(state = {}, action) {
  switch (action.type) {
    case "session/set":
      return action.data;
      break;
    default:
      return state;
  }
}

// Combine state reducers to create global state reducer
let root_reducer = combineReducers({
  errors: error_reducer,
  acct_form: acct_form_reducer,
  info: info_reducer,
  success: success_reducer,
  events: events_reducer,
  invite: invitation_reducer,
  flags: flags_reducer,
  event_inv: event_invites_reducer,
  session: session_reducer,
  show: show_reducer
});

/* Now, we create our global, in-memory app store.
 * It will have everything it needs to receive a dispatched
 * action, run it through to the appropriate sub-reducer and
 * return a new global state.
 *
 * A store has this API:
 *    getState() --- self-explanatory
 *    dispatch(action) --- synchronously applies action to state
 *                          reducer and sets new state
 *    subscribe(listener) --- adds a change listener to execute
 *                            when an action is dispatched
 *    replaceReducer(nextReducer) --- self-explanatory
 */
let store = createStore(root_reducer);

// Finally, we expose the store to the App.
export default store;
