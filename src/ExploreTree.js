import React, {Component} from 'react';

import Tree from './Tree';

import './ExploreTree.css';

export default class ExploreTree extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onSelectDn(dn) {
    this.props.onSelectDn(dn);
  }
  onExpandDn(dn) {
    const willBeOpen = !this.state[dn];
    this.setState({[dn]: willBeOpen});
    if (willBeOpen) {
      this.props.onExpandDn(dn);
    }
  }
  render() {
    const {childrenStatus, tree} = this.props;
    return (
      <div className="tree p-2">
        <Tree
          childrenStatus={childrenStatus}
          node={tree}
          open={this.state}
          onSelectDn={dn => this.onSelectDn(dn)}
          onExpandDn={dn => this.onExpandDn(dn)}
        />
      </div>
    );
  }
}
