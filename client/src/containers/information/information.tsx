import React from "react";
import { Collapse } from "antd";
const { Panel } = Collapse;

const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

export function Information() {
  return (
    <Collapse accordion>
      <Panel className="panel" showArrow={false} header="About Us" key={1}>
        <p>{text}</p>
      </Panel>
      <Panel className="panel" showArrow={false} header="Rules" key={2}>
        <p>{text}</p>
      </Panel>
      <Panel
        className="panel"
        showArrow={false}
        header="More Information"
        key={3}
      >
        <p>{text}</p>
      </Panel>
    </Collapse>
  );
}
