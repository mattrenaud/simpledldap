import React, {Component} from 'react';
import classnames from 'classnames';
import './DeleteConnectionButton.css';

import Octicon from 'react-component-octicons';

import connStore from './ConnectionStore';

import swal from 'sweetalert';

export default class DeleteConnectionButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async deleteConnection(e) {
    e.preventDefault();
    e.stopPropagation();

    const {name} = this.props;

    if (
      await swal({
        title: 'Are you sure?',
        text: 'This will delete the connection!',
        icon: 'warning',
        buttons: true,
        dangerMode: true
      })
    ) {
      await connStore.removeItem(name);
    }
  }
  render() {
    return (
      <button
        className={classnames('btn', 'btn-light', this.props.className)}
        onClick={e => this.deleteConnection(e)}
      >
        <Octicon name="trashcan" />
      </button>
    );
  }
}
