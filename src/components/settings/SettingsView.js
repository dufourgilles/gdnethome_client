import React from 'react';
import { connect } from 'react-redux';
import FreezeView from "../common/FreezeView";
import {fetchConfig, updateConfig} from "../../actions/configActions";
import DatapointParameter from "../datapoint/DatapointParameter";
import InterfaceEditor from "./InterfacesEditor";

import "./SettingsView.css";

class SettingsView extends FreezeView {
    state = {
        config: null,
        advanced: false
    };

    componentDidMount() {
        this.setFreezeOn();
        fetchConfig()
        .then(config => this.setState({config}))
        .catch(e => {
            console.log(e);
        })
        .then(() => this.setFreezeOff());
    }

    handleValueChange = (group, name, value) => {
        const config = this.state.config;
        if (group === "KNX") {
            config.KNX.gateway[name] = value;
        }
        else {
            config[group][name] = value;
        }
        this.setState({config});
    }

    cancel = () => {
        this.componentDidMount();
    }
    
    submit = () => {
        this.setFreezeOn();
        updateConfig(this.state.config)
        .then(config => this.setState({config}))
        .catch(e => {
            console.log(e);
        })
        .then(() => this.setFreezeOff());
    }

    renderContent() {
        const handleDBValueChange = (name, value) => this.handleValueChange("DB", name, value);
        const handleKNXValueChange = (name, value) => this.handleValueChange("KNX", name, value);
        const handleLOGGINGValueChange = (name, value) => this.handleValueChange("LOGGING", name, value);
        const handleGLOBALValueChange = (name, value) => this.handleValueChange("GLOBAL", name, value);
        const handleWEBSERVERValueChange = (name, value) => this.handleValueChange("WEBSERVER", name, value);
        const handleNETWORKValueChange = (name, value) => this.handleValueChange("NETWORK", name, value);

        const toggleAdvancedParams = () => {
            this.setState({advanced: !this.state.advanced})
        }
        if (this.state.config == null) {
            return "";
        }

        const advancedParams = (
            <div className="settings-advanced-params">                
                <DatapointParameter
                    key="workingdir"
                    onChange={handleGLOBALValueChange}
                    label="Working Directory"
                    name="workingdir"
                    data={this.state.config.GLOBAL}
                    editable={true}
                />
                <DatapointParameter
                    key="refreshInterval"
                    onChange={handleGLOBALValueChange}
                    label="Refresh Interval"
                    name="refreshInterval"
                    data={this.state.config.GLOBAL}
                    editable={true}
                />
                <DatapointParameter
                    key="serverPort"
                    onChange={handleWEBSERVERValueChange}
                    label="Server Port"
                    name="port"
                    data={this.state.config.WEBSERVER}
                    editable={true}
                />
                <DatapointParameter
                    key="serverAPIPort"
                    onChange={handleWEBSERVERValueChange}
                    label="Server API Port"
                    name="apiport"
                    data={this.state.config.WEBSERVER}
                    editable={true}
                />
                <DatapointParameter
                    key="serverIOPort"
                    onChange={handleWEBSERVERValueChange}
                    label="Server SocketIO Port"
                    name="socketIOPort"
                    data={this.state.config.WEBSERVER}
                    editable={true}
                />
                <InterfaceEditor networkConfig={this.state.config.NETWORK} onChange={handleNETWORKValueChange}/>
            </div>
        );
        return (
            <div className="gdnet-view">
                <div className="gdnet-title">Settings</div>
                <div className="settings-view-container">
                    <DatapointParameter
                        key="dbName"
                        onChange={handleDBValueChange}
                        label="DB Name"
                        name="name"
                        data={this.state.config.DB}
                        editable={true}
                    />
                    <DatapointParameter
                        key="dbURL"
                        onChange={handleDBValueChange}
                        label="DB URL"
                        name="url"
                        data={this.state.config.DB}
                        editable={true}
                    />
                    <DatapointParameter
                        key="knxGatewayHost"
                        onChange={handleKNXValueChange}
                        label="KNX Address (auto)"
                        name="host"
                        data={this.state.config.KNX.gateway}
                        editable={true}
                    />
                    <DatapointParameter
                        key="knxGatewayPort"
                        onChange={handleKNXValueChange}
                        label="KNX port"
                        name="port"
                        data={this.state.config.KNX.gateway}
                        editable={true}
                    />
                    <DatapointParameter
                        key="loggingLevel"
                        onChange={handleLOGGINGValueChange}
                        label="Logging Level"
                        name="level"
                        data={this.state.config.LOGGING}
                        list={[
                            {id: "error", value: "error"},
                            {id: "warning", value: "warning"},
                            {id: "info", value: "info"}, 
                            {id: "debug", value: "debug"}
                        ]}
                        match="id"
                        display="id"
                    />
                    <div onMouseUp={toggleAdvancedParams}>Advanced Params</div>
                    {this.state.advanced == true ? advancedParams : ""}
                    <div className="settings-view-btns">               
                        <div className="btn" onClick={this.submit}>Submit</div>
                        <div className="btn" onClick={this.cancel}>Cancel</div>
                    </div>
                </div>
            </div>
        );
    }
}


export default connect(undefined, undefined)(SettingsView);


