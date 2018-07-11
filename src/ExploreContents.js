import React, {Component} from 'react';
import './ExploreContents.css';

import classnames from 'classnames';

export default class ExploreContents extends Component {
  constructor(props) {
    super(props);
    this.state = {filter: ''};
  }

  onFilterUpdate({target: {value: filter}}) {
    this.setState({filter});
  }

  render() {
    const filter = this.state.filter.toLowerCase();
    const data = this.props.selected || [];
    const filteredData = filter
      ? data.filter(values =>
          values.some(value => value.toLowerCase().includes(filter))
        )
      : data;
    const [_, dn] = data.find(([name]) => name === 'dn') || [];

    return (
      <div className="py-1 px-3">
        <div className="d-flex py-2">
          <h4 className="m-0 content-heading">{dn || 'Loading...'}</h4>
          <input
            className="form-control form-control-sm w-auto ml-auto"
            placeholder="Filter Attributes"
            type="text"
            size="20"
            onChange={e => this.onFilterUpdate(e)}
          />
        </div>
        <div className="table-responsive table-bordered border-bottom-0">
          <table className="table table-striped m-0" ref="table">
            <thead>
              <tr className="table-primary">
                <th className="border-left-0 border-top-0 border-bottom-0">
                  Attribute
                </th>
                <th className="border-right-0 border-top-0 border-bottom-0">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(([name, value]) => (
                <tr key={name}>
                  <th className="border-left-0" scope="row">
                    {name}
                  </th>
                  <td className="border-right-0">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
