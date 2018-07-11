import React from 'react';
import classnames from 'classnames';
import './Spinner.css';
export default props => (
  <div className={classnames(props.className)}>
    <div className="loader" />
  </div>
);
