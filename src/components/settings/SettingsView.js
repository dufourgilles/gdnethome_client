import React from "react";
import { fetchConfig, updateConfig } from "../../actions/configActions";
import DatapointParameter from "../datapoint/DatapointParameter";
import InterfaceEditor from "./InterfacesEditor";
import { Button, Form, Switch, Typography } from "antd";

export default class SettingsView extends React.Component {
  state = {
    config: null,
    advanced: false
  };

  componentDidMount() {
    fetchConfig()
      .then(config => this.setState({ config }))
      .catch(e => {
        console.log(e);
      });
  }

  handleValueChange = (group, name, value) => {
    const config = this.state.config;
    if (group === "KNX") {
      config.KNX.gateway[name] = value;
    } else {
      config[group][name] = value;
    }
    this.setState({ config });
  };

  cancel = () => {
    this.componentDidMount();
  };

  submit = () => {
    updateConfig(this.state.config)
      .then(config => this.setState({ config }))
      .catch(e => {
        console.log(e);
      });
  };

  render() {
    const handleDBValueChange = (name, value) =>
      this.handleValueChange("DB", name, value);
    const handleKNXValueChange = (name, value) =>
      this.handleValueChange("KNX", name, value);
    const handleLOGGINGValueChange = (name, value) =>
      this.handleValueChange("LOGGING", name, value);
    const handleGLOBALValueChange = (name, value) =>
      this.handleValueChange("GLOBAL", name, value);
    const handleWEBSERVERValueChange = (name, value) =>
      this.handleValueChange("WEBSERVER", name, value);
    const handleNETWORKValueChange = (name, value) =>
      this.handleValueChange("NETWORK", name, value);

    const toggleAdvancedParams = () => {
      this.setState({ advanced: !this.state.advanced });
    };
    if (this.state.config == null) {
      return "";
    }
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 8 }
    };

    const advancedParams = (
      <>
        <DatapointParameter
          onChange={handleGLOBALValueChange}
          label="Working Directory"
          name="workingdir"
          data={this.state.config.GLOBAL}
          editable={true}
        />
        <DatapointParameter
          onChange={handleGLOBALValueChange}
          label="Refresh Interval"
          name="refreshInterval"
          data={this.state.config.GLOBAL}
          editable={true}
        />
        <DatapointParameter
          onChange={handleWEBSERVERValueChange}
          label="Server Port"
          name="port"
          data={this.state.config.WEBSERVER}
          editable={true}
        />
        <DatapointParameter
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
        <InterfaceEditor
          networkConfig={this.state.config.NETWORK}
          onChange={handleNETWORKValueChange}
        />
      </>
    );
    return (
      <>
        <Typography>
          <Typography.Title level={3}>Settings</Typography.Title>
        </Typography>
        <Form {...layout} name="Settings">
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
              { id: "error", value: "error" },
              { id: "warning", value: "warning" },
              { id: "info", value: "info" },
              { id: "debug", value: "debug" }
            ]}
            match="id"
            display="id"
          />
          <Form.Item label="advanced params">
            <Switch onMouseUp={toggleAdvancedParams} />
          </Form.Item>
          {this.state.advanced && advancedParams}
          <Form.Item wrapperCol={{ offset: 8 }}>
            <Button onClick={this.submit}>Submit</Button>
            <Button onClick={this.cancel}>Cancel</Button>
          </Form.Item>
        </Form>
      </>
    );
  }
}
