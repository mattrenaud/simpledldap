import React, {Component} from 'react';

import changeCase from 'change-case';

import './ConnectionForm.css';

import connStore from './ConnectionStore';

import pickBy from 'lodash.pickby';

import TestConnectionButton from './TestConnectionButton';

import {LDAPDefaultValues} from './LDAPClient';

const {titleCase, noCase} = changeCase;

function TextInput({
  name,
  type = 'text',
  value,
  placeholder,
  required,
  pattern
}) {
  return (
    <div>
      <label htmlFor={name}>{titleCase(name)}:</label>
      <input
        className="w-100 form-control"
        id={name}
        name={name}
        {...{required, placeholder, type, pattern}}
      />
      <div className="invalid-feedback">
        Please provide a valid {noCase(name)}.
      </div>
    </div>
  );
}

export default class ConnectionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connectionName: '',
      bindName: '',
      bindPassword: '',
      hostName: '',
      hostPort: '',
      baseDn: ''
    };
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onClick(event) {
    event.preventDefault();
    event.stopPropagation();
    if (event.target.form.checkValidity()) {
      const formValues = pickBy(this.state);
      connStore.saveCredentials(formValues);
      event.target.form.reset();
    } else {
      event.target.form.classList.add('was-validated');
    }
  }

  render() {
    return (
      <form
        name="new-connection"
        className="new-connection px-5"
        onChange={e => this.handleChange(e)}
        noValidate
      >
        <h3>Add A New Connection</h3>
        <TextInput name="connectionName" required={true} />
        <div className="host-port">
          <TextInput
            name="hostName"
            placeholder={LDAPDefaultValues.HOST_NAME}
            pattern="[A-Za-z0-9.]+"
          />
          <TextInput
            name="hostPort"
            placeholder={LDAPDefaultValues.HOST_PORT}
            pattern="[0-9]+"
          />
        </div>
        <TextInput name="baseDn" placeholder={LDAPDefaultValues.BASE_DN} />
        <TextInput name="bindName" placeholder={LDAPDefaultValues.BIND_NAME} />
        <TextInput name="bindPassword" type="password" required={true} />

        <div className="pt-4 d-flex">
          <TestConnectionButton
            conn={this.state}
            className="ml-auto"
            onClick={e => this.onClick(e)}
          />
          <input
            type="submit"
            className="ml-2 btn btn-primary"
            value="Add"
            onClick={e => this.onClick(e)}
          />
        </div>
      </form>
    );
  }
}
