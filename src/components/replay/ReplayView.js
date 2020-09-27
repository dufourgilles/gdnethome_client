import React from "react";
import DatapointParameter from "../datapoint/DatapointParameter";
import { fetchReplayInfo, updateReplayInfo } from "../../actions/replayActions";
import { toastr } from "react-redux-toastr";
import { connect } from "react-redux";
import { Button, Form, Typography } from "antd";

class ReplayView extends React.Component {
  state = {
    replayInfo: null
  };

  componentDidMount() {
    return this.refreshReplayInfo();
  }

  refreshReplayInfo = () => {
    return fetchReplayInfo()
      .then(replayInfo => this.setState({ replayInfo }))
      .catch(e => toastr.error("Error", e.message))
  };

  handleValueChange = (key, value) => {
    const replayInfo = Object.assign({}, this.state.replayInfo);
    replayInfo[key] = value;
    this.setState({ replayInfo });
  };

  render() {
    if (this.state.replayInfo == null) {
      return (
        <div className="gdnet-view">
          <div className="gdnet-title">Replay</div>
        </div>
      );
    }
    const saveFunc = () => {
      updateReplayInfo(this.state.replayInfo)
        .then(() => toastr.success("Success", "Save OK"))
        .catch(e => toastr.error("Error", e.message))
        .then(() => this.refreshReplayInfo());
    };

    const cancelFunc = () => {
      this.refreshReplayInfo();
    };
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 8 }
    };
    return (
      <>
        <Typography>
          <Typography.Title level={3}>Replay</Typography.Title>
        </Typography>
        <Form {...layout} name="ReplayView">
          <Form.Item wrapperCol={{ offset: 8 }}>
            <Button type="primary" onClick={saveFunc}>Save</Button>
            <Button onClick={cancelFunc}>Cancel</Button>
          </Form.Item>
          <DatapointParameter
            key="enable"
            onChange={this.handleValueChange}
            label="enabled"
            name="enable"
            data={this.state.replayInfo}
            list={[
              { id: "true", value: true },
              { id: "false", value: false }
            ]}
            display="id"
            match="value"
          />
          <DatapointParameter
            key="filename"
            onChange={this.handleValueChange}
            editable={true}
            label="filename"
            name="filename"
            data={this.state.replayInfo}
          />
          <DatapointParameter
            key="startTime"
            onChange={this.handleValueChange}
            editable={true}
            label="Start Time"
            name="startTime"
            data={this.state.replayInfo}
          />
          <DatapointParameter
            key="duration"
            onChange={this.handleValueChange}
            editable={true}
            label="duration"
            name="duration"
            data={this.state.replayInfo}
          />
          <DatapointParameter
            key="filters"
            onChange={this.handleValueChange}
            editable={true}
            label="filters"
            name="filters"
            data={this.state.replayInfo}
          />
        </Form>
      </>
    );
  }
}

export default connect(undefined, undefined)(ReplayView);
