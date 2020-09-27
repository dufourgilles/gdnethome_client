import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, Form } from "antd";
import DatapointParameter from "./DatapointParameter";
import { getDatapointByID } from "../../reducers/datapointReducer";
import {
  createNewDatapoint,
  updateDatapoint,
  deleteDatapoint,
} from "../../actions/datapointActions";
import { toastr } from "react-redux-toastr";

class DatapointEditor extends Component {
  state = {
    datapoint: this.props.datapoint,
    editableID: true,
    modified: false,
    isNew: true,
    valid: false,
    freezeOn: false,
  };

  componentWillReceiveProps(newProps) {
    if (newProps.datapoint.id !== this.state.datapoint.id) {
      this.setState({
        datapoint: newProps.datapoint,
        modified: false,
        valid: false,
        isNew: false,
        editableID: false,
      });
    }
  }

  newDataPoint = () => {
    this.props.newDataPoint();
  };

  setFreeze = (status) => {
    if (this.props.setFreeze) {
      this.props.setFreeze(status);
    }
  };

  saveDatapoint = () => {
    this.props.setFreeze(true);
    let action;
    if (this.state.isNew) {
      action = this.props.createNewDatapoint(this.state.datapoint);
    } else {
      action = this.props.updateDatapoint(this.state.datapoint);
    }
    return action
      .then(() => toastr.success("Success", "Save OK"))
      .catch((e) => toastr.error("Error", e.message))
      .then(() => this.props.setFreeze(false));
  };

  deleteDatapoint = () => {
    return this.props
      .deleteDatapoint(this.state.datapoint.id)
      .catch((e) => {
        toastr.error("Error", e.message);
      })
      .then(() => {
        toastr.success("Success", "Delete OK");
        this.setState({ freezeOn: false });
      });
  };

  validateID = (id) => {
    const dp = this.props.getDatapointByID(id);
    return !(
      (this.state.isNew === true && dp != null) ||
      id.match(/\d+[.]\d+[.]\d+/) == null
    );
  };

  validateDatapoint = (dp) => {
    return this.validateID(dp.id);
  };

  handleValueChange = (key, value) => {
    if (this.state.freezeOn === true) {
      return;
    }
    const datapoint = Object.assign({}, this.state.datapoint);
    datapoint[key] = value;
    this.setState({
      modified: true,
      datapoint: datapoint,
      valid: this.validateDatapoint(datapoint),
    });
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.freeze === prevProps.freeze &&
      ((this.props.datapoint == null && prevProps.datapoint == null) ||
        (this.props.datapoint != null &&
          prevProps.datapoint != null &&
          this.props.datapoint.id === prevProps.datapoint.id))
    ) {
      return;
    }
    this.setState({
      datapoint: Object.assign({}, this.props.datapoint),
      modified: false,
      valid: true,
      isNew: false,
      editableID: false,
      freezeOn: this.props.freeze,
    });
  }

  render() {
    const datapoint = this.state.datapoint;
    let savebtnDisabled = !(this.state.valid && this.state.modified);
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 8 }
    };

    return (
      <Form {...layout} name="EditDatapoint">
        <Form.Item wrapperCol={{offset: 8}}>
          <Button onClick={this.newDatapoint}>New</Button>
          <Button onClick={this.saveDatapoint} disabled={savebtnDisabled}>
            Save
          </Button>
          <Button onClick={this.deleteDatapoint}>Delete</Button>
        </Form.Item>
        <DatapointParameter
          key="id"
          validator={this.validateID}
          onChange={this.handleValueChange}
          editable={this.state.editableID}
          label="id"
          name="id"
          data={datapoint}
        />
        <DatapointParameter
          key="name"
          editable={!this.state.freezeOn}
          label="name"
          name="name"
          onChange={this.handleValueChange}
          data={datapoint}
        />
        <DatapointParameter
          key="knxName"
          label="KNX name"
          data={datapoint}
          name="knxName"
        />
        <DatapointParameter
          key="description"
          editable={!this.state.freezeOn}
          label="description"
          name="description"
          onChange={this.handleValueChange}
          data={datapoint}
        />
        <DatapointParameter
          label="KNX Group"
          data={datapoint}
          name="knxGroupName"
        />
        <DatapointParameter
          key="type"
          label="type"
          name="type"
          onChange={this.handleValueChange}
          data={datapoint}
          list={this.props.types}
          display="name"
          match="name"
        />
      </Form>
    );
  }
}

DatapointEditor.propTypes = {
  datapoint: PropTypes.object.isRequired,
  datapoints: PropTypes.array.isRequired,
  types: PropTypes.array.isRequired,
  getDatapointByID: PropTypes.func.isRequired,
  createNewDatapoint: PropTypes.func.isRequired,
  updateDatapoint: PropTypes.func.isRequired,
  deleteDatapoint: PropTypes.func.isRequired,
  newDatapoint: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  types: state.datapoints.types,
  datapoints: state.datapoints.items,
  getDatapointByID: getDatapointByID(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    createNewDatapoint: createNewDatapoint(dispatch),
    updateDatapoint: updateDatapoint(dispatch),
    deleteDatapoint: deleteDatapoint(dispatch),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(DatapointEditor);
