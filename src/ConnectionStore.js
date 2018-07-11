import localforage from 'localforage';

const {setPassword, getPassword} = window.require('keytar');

const ALL_KEY = '__all_keys';

import {LDAPDefaultValues} from './LDAPClient';

class ConnectionStore {
  constructor(name = 'connections') {
    this.store = localforage.createInstance({
      name
    });
    this.listeners = {};
  }

  addListener(key, listener) {
    if (!listener) {
      this.addListener(ALL_KEY, key);
      return;
    }
    this.listeners[key] = this.listeners[key] || [];
    this.listeners[key].push(listener);
    if (key === ALL_KEY) {
      this.connectionNames.then(names => names && names.length && listener());
    } else {
      this.getItem(key).then(result => {
        console.log('result', result);
        return result && listener();
      });
    }
  }

  getItem(key) {
    return this.store.getItem(key);
  }

  async setItem(...args) {
    const [key] = args;
    const val = await this.store.setItem(...args);
    await this.callListeners(key);
    return val;
  }

  async removeItem(...args) {
    const [key] = args;
    const val = await this.store.removeItem(...args);
    await this.callListeners(key);
    return val;
  }

  async clear() {
    const val = await this.store.clear();
    await Promise.all(this.store.keys().map(key => this.callListeners(key)));
    return val;
  }

  get connectionNames() {
    return this.store.keys();
  }

  get allConnections() {
    return this.connectionNames.then(names =>
      Promise.all(names.map(name => this.getCredentials(name)))
    );
  }

  callListeners(key) {
    const listenersForAll = this.listeners[ALL_KEY] || [];
    const listenersForKey = this.listeners[key] || [];
    return Promise.all(
      listenersForKey.concat(listenersForAll).map(listener => listener())
    );
  }

  saveCredentials({
    connectionName,
    bindName = LDAPDefaultValues.BIND_NAME,
    bindPassword,
    baseDn = LDAPDefaultValues.BASE_DN,
    hostName = LDAPDefaultValues.HOST_NAME,
    hostPort = LDAPDefaultValues.HOST_PORT
  }) {
    setPassword(connectionName, bindName, bindPassword);
    return this.setItem(connectionName, {
      connectionName,
      hostName,
      baseDn,
      bindName,
      hostPort
    });
  }

  async getCredentials(connectionName) {
    const result = await this.getItem(connectionName);
    if (!result) {
      return null;
    }
    const {hostName, bindName, hostPort, baseDn} = result;
    const bindPassword = await getPassword(connectionName, bindName);
    return {
      connectionName,
      bindName,
      bindPassword,
      hostName,
      baseDn,
      hostPort
    };
  }
}

export default new ConnectionStore();
