import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ReduxToastr from 'react-redux-toastr';
import {Redirect, Route, Switch} from 'react-router';
import Dashboard from './dashboard/Dashboard';
import ActionView from "./action/ActionView";
import ConditionView from "./condition/ConditionView";
import ReplayView from "./replay/ReplayView";
import SettingsView from "./settings/SettingsView";
import {pollSystem} from '../actions/systemActions';
import '../themes/GDNetBoostrapThemes.css';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import './App.css';
import './appheader/AppHeader';
import {subscribeToEvents, eventProcessor} from '../socket/clientSocket';
import AppHeader from "./appheader/AppHeader";
import DatapointView from './datapoint/DatapointView';
import DataPointCtlView from './dataPointCtl/DataPointCtlView';
import SettingsViews from './settings/SettingsView';

class App extends Component {
    componentDidMount() {
        this.props.pollSystem();
        subscribeToEvents(this.props.eventProcessor);
    }

    render() {
        if(!this.props.app.isReady) return (<div>...waiting for server...</div>);
        return (
          <div className="container-fluid">
              <div className="row">
                <AppHeader/>
              </div>
            <div className="row gdnet-app">
                <Switch>
                    <Route path="/action" component={ActionView}/>
                    <Route path="/condition" component={ConditionView}/>
                    <Route path="/dashboard" component={Dashboard}/>
                    <Route path="/datapointlist" component={DatapointView}/>
                    <Route path="/datapointctl" component={DataPointCtlView}/>
                    <Route path="/replay" component={ReplayView}/>
                    <Route path="/settings" component={SettingsView}/>
                  <Redirect from="/" to="/dashboard"/>
                </Switch>
            </div>
            <ReduxToastr
              timeOut={2000}
              newestOnTop={true}
              preventDuplicates
              position="top-right"
              transitionIn="fadeIn"
              transitionOut="fadeOut"
              progressBar={true}/>
          </div>
        );
    }
}

App.propTypes = {
    pollSystem: PropTypes.func.isRequired,
    eventProcessor: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    app: state.app,
});

const mapDispatchToProps = dispatch => ({
    eventProcessor: () => eventProcessor()(dispatch),
    pollSystem: () => pollSystem()(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps )(App);

