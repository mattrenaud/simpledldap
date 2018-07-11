import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import ConnectionsContainer from './ConnectionsContainer';
import ExploreContainer from './ExploreContainer';
import NoMatch from './NoMatch';

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/" component={ConnectionsContainer} />
      <Route path="/explore/:name" component={ExploreContainer} />
      <Route component={NoMatch} />
    </Switch>
  </Router>,
  document.getElementById('root')
);

registerServiceWorker();
