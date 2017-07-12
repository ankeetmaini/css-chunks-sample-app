import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
} from 'react-router-dom';
import ReactDOM from 'react-dom';

import Bundle from './components/Bundle';

import a from 'bundle-loader?lazy&name=a!./components/A';
import b from 'bundle-loader?lazy&name=b!./components/B';
import c from 'bundle-loader?lazy&name=c!./components/C';

import 'flexboxgrid/dist/flexboxgrid.min.css';

// import global stylesheets
import './styles/global-styles.scss';

const Loader = () => <h2>Loading...</h2>;

const App = () => (
  <Router>
    <div>
      <Link to='/a'>A</Link>
      <Link to='/b'>B</Link>
      <Link to='/c'>C</Link>
      <Switch>
        <Route
          path='/a'
          render={props => (
            <Bundle load={a}>
              {A => A ? <A {...props} /> : <Loader /> }
            </Bundle>
          )}
        />
        <Route
          path='/b'
          render={props => (
            <Bundle load={b}>
              {B => B ? <B {...props} /> : <Loader /> }
            </Bundle>
          )}
        />
        <Route
          path='/c'
          render={props => (
            <Bundle load={c}>
              {C => C ? <C {...props} /> : <Loader /> }
            </Bundle>
          )}
        />
        <Redirect exact to='/a' from='/' />
      </Switch>
    </div>
  </Router>
);

ReactDOM.render(<App />, document.getElementById('root'));
