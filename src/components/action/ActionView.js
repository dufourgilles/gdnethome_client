import React from "react";
import { Tabs, Typography } from "antd";
import ActionCreator from "./ActionCreator";
import ActionMonitor from "./ActionMonitor";
import ActionEditor from "./ActionEditor";

const { Title } = Typography;
const { TabPane } = Tabs;

export default function ActionView() {
  return (
    <>
      <Typography>
        <Title level={3}>Actions</Title>
      </Typography>
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
    </>
  );
}
