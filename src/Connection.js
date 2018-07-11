import React, {Component} from 'react';
import './Connection.css';

import TestConnectionButton from './TestConnectionButton';
import DeleteConnectionButton from './DeleteConnectionButton';

import {Link} from 'react-router-dom';

class Connection extends Component {
  render() {
    const {
      connectionName = '',
      bindName = '',
      bindPassword = '',
      hostName = '',
      hostPort = '',
      baseDn = ''
    } = this.props;
    return (
      <Link
        className="connection-link py-2 px-3 d-block list-group-item list-group-item-action"
        to={`/explore/${connectionName}`}
      >
        <h4 className="m-0 text-primary d-flex align-items-center">
          <span className="mr-2">{connectionName}</span>
          <small className="text-muted mr-1">{`${hostName}:${hostPort}`}</small>
          <DeleteConnectionButton
            className="invisible hidden-button ml-auto btn-sm border"
            name={connectionName}
          />
        </h4>
      </Link>
    );
  }
}

export default Connection;
