import React, {Component} from 'react';

import connStore from './ConnectionStore';

import ConnectionList from './ConnectionList';

import ConnectionForm from './ConnectionForm';

import './ConnectionsContainer.css';

export default class ConnectionsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {conns: []};
  }

  componentDidMount() {
    connStore.addListener(async () => {
      const conns = await connStore.allConnections;
      this.setState({conns});
    });
  }

  render() {
    const {conns = []} = this.state;
    return (
      <div className="w-100">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary pt-4">
          <h1 className="w-100 text-center text-light mb-3">SimpleLDAP</h1>
        </nav>
        <div className="w-100 pt-4 pb-5">
          <div className="connections-page-container">
            <ConnectionForm />
            <div className="h-100 border-right" />
            <ConnectionList conns={conns} />
          </div>
        </div>
      </div>
    );
  }
}
