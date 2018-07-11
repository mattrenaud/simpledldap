import React, {Component} from 'react';

import './ConnectionList.css';
import Connection from './Connection';

function Connections({empty, conns}) {
  if (empty) {
    return (
      <h6>
        You don't have any connections yet. Add a connection to get started.
      </h6>
    );
  }
  return (
    <div className="list-group">
      {conns.map((conn, i) => <Connection {...conn} key={`Connection_${i}`} />)}
    </div>
  );
}

export default ({conns = []}) => (
  <div className="connection-list px-5">
    <h3 className="mb-4">Connections</h3>
    <Connections empty={!conns.length} conns={conns} />
  </div>
);
