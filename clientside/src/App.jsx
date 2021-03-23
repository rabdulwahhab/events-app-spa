import React from 'react';
import { Switch, Route } from 'react-router-dom';
// import { load_page } from './api';
import { Container } from 'react-bootstrap';
import Default from './views/404';
import Index from './views/Index';
import Header from './comp/Header';
import Events from './views/Events';

function App() {

  React.useEffect(() => {
    // FIXME only if auth
    // load_page();
  }, []);

  return (
    <Container>
      <Header />
      <Switch>
        <Route exact path="/">
          <Index />
        </Route>
        <Route path="/events">
          <Events />
        </Route>
        <Route path="*">
          <Default />
        </Route>
      </Switch>
    </Container>
  );
}

export default App;
