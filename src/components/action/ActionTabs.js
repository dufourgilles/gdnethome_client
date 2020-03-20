import React, { Component } from "react";
import { connect } from "react-redux";
import { Tabs } from "antd";
import ActionCreator from "./ActionCreator";
import ActionMonitor from "./ActionMonitor";
import ActionEditor from "./ActionEditor";

const { TabPane } = Tabs;

class ActionTabs extends Component {
  render() {
    return (
      <Tabs id="action-tabs" defaultActiveKey="Create">
        <TabPane key="Create" tab="Create">
          <ActionCreator />
        </TabPane>
        <TabPane key="Edit" tab="Edit">
          <ActionEditor />
        </TabPane>
        <TabPane key="Monitor" tab="Monitor">
          <ActionMonitor />
        </TabPane>
      </Tabs>
    );
  }
}

export default connect(undefined, undefined)(ActionTabs);
