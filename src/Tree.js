import classnames from 'classnames';
import React from 'react';
import Octicon from 'react-component-octicons';

function Icon({open}) {
  if (open) {
    return <Octicon name="dash" zoom="100%" />;
  }
  return <Octicon name="plus" zoom="100%" />;
}

export default function Tree({
  node,
  open,
  onSelectDn,
  onExpandDn,
  childrenStatus,
  forceOpen = false,
  name = null
}) {
  const transferProps = {
    open,
    onSelectDn,
    onExpandDn,
    childrenStatus
  };
  if (!node || !(node.dn || name)) {
    return <h6 className="px-2">Loading...</h6>;
  }

  if (!name) {
    return (
      <ul className="pt-1">
        <Tree node={node} name={node.dn} forceOpen={true} {...transferProps} />
      </ul>
    );
  }

  const {dn} = node;
  const childNames = Object.keys(node);
  const isOpen = forceOpen || open[dn];
  return (
    <li>
      <span className="d-flex align-items-center">
        <a
          href="#"
          onClick={() => onExpandDn(dn)}
          className={classnames('px-1', {
            'd-none': forceOpen,
            invisible: childrenStatus[dn] === 0
          })}
        >
          <div style={{width: '12px', height: '12px'}}>
            <Icon open={isOpen} />
          </div>
        </a>
        <a href="#" onClick={() => onSelectDn(dn)}>
          <span className={classnames({h4: forceOpen})}>{name}</span>
        </a>
      </span>
      <ul className={classnames({'d-none': !isOpen})}>
        {childNames.map((k, i) => (
          <Tree
            key={`${name}_${i}`}
            node={node[k]}
            name={k}
            {...transferProps}
          />
        ))}
      </ul>
    </li>
  );
}
