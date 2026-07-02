// @ts-nocheck
import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import ActionCreator from "./ActionCreator";
import ActionMonitor from "./ActionMonitor";
import ActionEditor from "./ActionEditor";

class ActionTabs extends Component {
    state = {
        key: "Create"
    };
    render() {
        return (
            <div className="action-dashboard-panel action-tabs-panel">
               <Tabs
                   id="action-tabs"
                   activeKey={this.state.key}
                   onSelect={key => this.setState({ key })}
               >
                   <Tab eventKey="Create" title="Create">
                       <ActionCreator />
                   </Tab>
                   <Tab eventKey="Edit" title="Edit">
                       <ActionEditor />
                   </Tab>
                   <Tab eventKey="Monitor" title="Monitor">
                       <ActionMonitor />
                   </Tab>
               </Tabs>
            </div>
        );
    }
}


export default ActionTabs;
