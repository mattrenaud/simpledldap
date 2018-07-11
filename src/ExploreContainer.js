import React, {Component} from 'react';

import connStore from './ConnectionStore';
import ExploreHeader from './ExploreHeader';

import './ExploreContainer.css';
import ExploreTree from './ExploreTree';
import ExploreContents from './ExploreContents';

import SplitPane from 'react-split-pane';

import {LDAPClient} from './LDAPClient';

import get from 'lodash.get';
import set from 'lodash.set';

const {parseDN, EqualityFilter, AndFilter} = window.require('ldapjs');

function mapToFilter(map) {
  return new AndFilter({
    filters: Object.entries(map).map(
      ([attribute, value]) =>
        new EqualityFilter({
          attribute,
          value
        })
    )
  });
}

function mkobj(dn, o = {}) {
  if (!o.dn) {
    Object.defineProperty(o, 'dn', {
      value: dn,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
  return o;
}

function parseEntries(prevTree, newEntries) {
  const entriesData = newEntries.map(({dn}) => ({
    dn,
    rdns: parseDN(dn).rdns.map(r => r.toString())
  }));

  const entriesToParse = prevTree ? entriesData : entriesData.slice(1);
  const seedTree = prevTree || mkobj(entriesData[0].dn);
  const {rdns: baseRDNS} = parseDN(seedTree.dn);

  const tree = entriesToParse.reduce((tree, {dn, rdns}) => {
    const prefixRdns = rdns.slice(0, -1 * baseRDNS.length).reverse();
    const value = mkobj(dn, get(tree, prefixRdns));
    set(tree, prefixRdns, value);
    return tree;
  }, seedTree);

  return {tree};
}

function parseSelected(selectedToParse = {}) {
  const selected = Object.keys(selectedToParse)
    .filter(name => [].concat(selectedToParse[name]).length)
    .map(name => [name, [].concat(selectedToParse[name]).join(', ')]);

  return {selected};
}
export default class ExploreContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {tree: null, childrenStatus: {}};
  }
  async componentDidMount() {
    const {
      match: {
        params: {name}
      }
    } = this.props;
    const conn = await connStore.getCredentials(name);
    this.client = new LDAPClient(conn);
    await this.onSelectDn(/* use default base */);
    return this.onExpandDn(/* use default base */);
  }

  async onSelectDn(baseDn) {
    const filter = '(objectclass=*)';

    const entries = await this.client.search({
      baseDn,
      filter
    });

    const [selected] = entries;

    const formatedSelected = parseSelected(selected);

    const formatedBase = baseDn ? {} : parseEntries(this.state.tree, entries);

    this.setState({...formatedBase, ...formatedSelected});
  }

  async onExpandDn(baseDn) {
    if (baseDn && this.state.childrenStatus[baseDn] === 0) {
      return;
    }

    const filter = '(objectclass=*)';

    const entries = await this.client.search({
      baseDn,
      filter,
      attributes: ['dn', 'sn', 'cn'],
      scope: 'one'
    });

    const formatedChildren = parseEntries(this.state.tree, entries);

    const childrenStatus = baseDn
      ? {
          ...this.state.childrenStatus,
          [baseDn]: entries.length
        }
      : this.state.childrenStatus;
    this.setState({...formatedChildren, childrenStatus});
  }

  render() {
    const {tree, selected, childrenStatus} = this.state;
    return (
      <div className="w-100 h-100 d-flex flex-column">
        <ExploreHeader {...this.state.conn || {}} />
        <div className="w-100 h-100 position-relative">
          <SplitPane split="vertical" minSize={200} defaultSize={250}>
            <ExploreTree
              tree={tree}
              childrenStatus={childrenStatus}
              onSelectDn={dn => this.onSelectDn(dn)}
              onExpandDn={dn => this.onExpandDn(dn)}
            />
            <ExploreContents selected={selected} />
          </SplitPane>
        </div>
      </div>
    );
  }
}
