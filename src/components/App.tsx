// @ts-nocheck
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Redirect, Route, Switch} from 'react-router';
import Dashboard from './dashboard/Dashboard';
import ActionView from "./action/ActionView";
import ConditionView from "./condition/ConditionView";
import ReplayView from "./replay/ReplayView";
import SettingsView from "./settings/SettingsView";
import StatusView from "./status/StatusView";
import '../themes/GDNetBoostrapThemes.css';
import './App.scss';
import './appheader/AppHeader';
import {subscribeToEvents, eventProcessor} from '../socket/clientSocket';
import AppHeader from "./appheader/AppHeader";
import DatapointView from './datapoint/DatapointView';
import DataPointCtlView from './dataPointCtl/DataPointCtlView';
import { useAppQueryStatus } from '../hooks/queryState';
//import SettingsViews from './settings/SettingsView';

class App extends Component {
    componentDidMount() {
        subscribeToEvents(this.props.eventProcessor);
    }

    render() {
        if(!this.props.app.isReady) return (<div>...waiting for server...</div>);
        return (
          <div className="container-fluid">
              <div className="row">
                <AppHeader/>
              </div>
            <div className="gdnet-app">
                <Switch>
                    <Route path="/action" component={ActionView}/>
                    <Route path="/condition" component={ConditionView}/>
                    <Route path="/dashboard" component={Dashboard}/>
                    <Route path="/datapointlist" component={DatapointView}/>
                    <Route path="/datapointctl" component={DataPointCtlView}/>
                    <Route path="/replay" component={ReplayView}/>
                    <Route path="/settings" component={SettingsView}/>
                    <Route path="/status" component={StatusView}/>
                  <Redirect from="/" to="/dashboard"/>
                </Switch>
            </div>
          </div>
        );
    }
}

App.propTypes = {
    eventProcessor: PropTypes.func.isRequired
};

export default function AppQuery() {
    const state = useAppQueryStatus();
    return <App app={state.app} eventProcessor={eventProcessor} />;
}
