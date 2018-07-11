const {createClient} = window.require('ldapjs');

function promisify(func, that) {
  return function wrapped(...args) {
    const target = that || this;
    return new Promise((resolve, reject) =>
      func.call(
        target,
        ...args,
        (err, res) => (err ? reject(err) : resolve(res))
      )
    );
  };
}

const BASE_DN = 'dc=example,dc=com';
const BIND_NAME = 'cn=Directory Manager';
const HOST_NAME = 'localhost';
const HOST_PORT = 389;

export const LDAPDefaultValues = {
  BASE_DN,
  BIND_NAME,
  HOST_NAME,
  HOST_PORT
};

export class LDAPClient {
  constructor({
    baseDn = BASE_DN,
    hostName = HOST_NAME,
    hostPort = HOST_PORT,
    bindName = BIND_NAME,
    bindPassword
  }) {
    const client = createClient({
      url: `ldap://${hostName}:${hostPort}`
    });

    const bind = promisify(client.bind, client);

    this.asyncSearch = async (passedBaseDn, opts) => {
      await bind(bindName, bindPassword);

      const searchBaseDn = passedBaseDn || baseDn;
      const result = await new Promise((resolve, reject) =>
        client.search(
          searchBaseDn,
          opts,
          (err, res) =>
            err
              ? reject(err)
              : res
                  .on('searchEntry', entry =>
                    (res.__result = res.__result || []).push(entry.object)
                  )
                  .on('error', reject)
                  .on('end', result => resolve(res.__result || []))
        )
      );
      return result;
    };
  }

  search({filter, attributes, baseDn, scope = 'base'}) {
    return this.asyncSearch(baseDn, {filter, scope, attributes});
  }
}
