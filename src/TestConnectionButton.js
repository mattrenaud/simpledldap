import React, {Component} from 'react';
import classnames from 'classnames';
import './TestConnectionButton.css';

import Octicon from 'react-component-octicons';

import Spinner from './Spinner';

import {LDAPClient} from './LDAPClient';

import pickBy from 'lodash.pickby';

function wait(sec = 0) {
  return new Promise(r => setTimeout(r, 1000 * sec));
}

export default class TestConnectionButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      success: false
    };
  }
  async testConnection(e) {
    e.preventDefault();
    e.stopPropagation();

    const start = Date.now() / 1000;

    function addWaitTime() {
      const duration = Date.now() / 1000 - start;
      const secs = 2 - Math.min(duration, 2);
      return wait(secs);
    }

    const onFinally = (error = false) => {
      const success = !error;
      return async e => {
        await addWaitTime();
        this.setState({loading: false, success, error});
        if (e) {
          console.error('error', e);
        }
        await wait(2.7);
        this.setState({
          loading: false,
          success: false,
          error: false
        });
      };
    };

    const onError = onFinally(true);
    const onSuccess = onFinally(false);

    this.setState({
      loading: true,
      success: false,
      error: false
    });

    try {
      const conn = pickBy(this.props.conn);
      const client = new LDAPClient(conn);
      const {length = 0} = await client.search({
        filter: '(objectclass=*)'
      });

      if (length) {
        onSuccess();
      } else {
        throw new Error('no results found');
      }
    } catch (e) {
      onError(e);
    }
  }
  render() {
    return (
      <button
        className={classnames(
          'btn',
          'btn-light',
          'btn-test-connection',
          this.props.className,
          {
            'no-pointer-events':
              this.state.loading || this.state.success || this.state.error,
            'show-icon': this.state.loading
          }
        )}
        onClick={e => this.testConnection(e)}
      >
        <Spinner
          className={{
            spinner: true,
            'opacity-1': this.state.loading
          }}
        />
        <Octicon
          className={classnames({
            'status-icon': true,
            'text-success': true,
            'opacity-1': this.state.success
          })}
          name="verified"
        />
        <Octicon
          className={classnames({
            'status-icon': true,
            'text-warning': true,
            'opacity-1': this.state.error
          })}
          name="unverified"
        />
        Test Connection
      </button>
    );
  }
}
