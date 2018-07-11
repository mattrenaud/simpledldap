import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './ExploreHeader.css';
import Octicon from 'react-component-octicons';

export default class ExploreHeader extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary py-4">
        <Link
          className="btn btn-outline-secondary d-inline-flex align-items-center"
          to="/"
        >
          {/* <Octicon name="chevron-left" className="mr-2" /> */}
          <h6 className="m-0">Connections</h6>
        </Link>
      </nav>
    );
  }
}
