import { combineReducers, createStore } from 'react-redux';

function error_reducer(state = [], action) {
  switch (action.type) {
    case "error/set":
      return action.data;
    case "error/one":
      return [action.data];
    case "error/add":
      return state.concat([action.data]);
    default:
      return state;
  }
}

function acct_form_reducer(state = {}, action) {
  switch (action.type) {
    case "acct_form/set":
      return action.data;
    case "acct_form/set/name":
      return { ...state, name: action.data };
    case "acct_form/set/email":
      return { ...state, email: action.data };
    case "acct_form/set/passcode":
      return { ...state, passcode: action.data };
    case "acct_form/set/valid":
      return { ...state, isvalid: action.data };
    default:
      return state;
  }
}

function events_reducer(state = [], action) {
  switch (action.type) {
    case "events/set":
      return action.data;
    case "events/add":
      return state.concat([action.data]);
    default:
      return state;
  }
}

function info_reducer(state = [], action) {
  switch (action.type) {
    case "info/set":
      return action.data;
    case "info/add":
      return state.concat([action.data]);
    default:
      return state;
  }
}

function feed_reducer(state = [], action) {
  switch (action.type) {
    case "feed/add":
      return state.concat([action.data]);
    case "feed/set":
      return action.data;
    default:
      return state;
  }
}

function popular_reducer(state = [], action) {
  switch (action.type) {
    case "popular/add":
      return state.concat([action.data]);
    case "popular/set":
      return action.data;
    default:
      return state;
  }
}

function tags_reducer(state = [], action) {
  switch (action.type) {
    case "tags/add":
      return state.concat([action.data]);
    case "tags/set":
      return action.data;
    default:
      return state;
  }
}

function show_reducer(state = [], action) {
  switch (action.type) {
    case "show/set":
      return action.data;
    default:
      return state;
  }
}

// Combine state reducers to create global state reducer
let root_reducer = combineReducers({
  error: error_reducer,
  acct_form: acct_form_reducer,
  join_form: join_form_reducer,
  create_form: create_form_reducer,
  local_dispos: local_dispos_reducer,
  info: info_reducer,
  feed: feed_reducer,
  popular: popular_reducer,
  tags: tags_reducer,
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
