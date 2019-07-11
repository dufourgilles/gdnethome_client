import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';
import ActionCreator from "./ActionCreator";
import ActionMonitor from "./ActionMonitor";
import ActionEditor from "./ActionEditor";

class ActionTabs extends Component {
    state = {
        key: this.props.key
    };
    render() {
        return (
            <div>
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


export default connect(undefined, undefined)(ActionTabs);


