import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DatapointParameter from './DatapointParameter';
import {getDatapointByID } from "../../reducers/datapointReducer";
import {createNewDatapoint, updateDatapoint, deleteDatapoint} from "../../actions/datapointActions";
import './DatapointEditor.scss';
import { toastr } from "react-redux-toastr";

const DATAPOINT_PROTOCOLS = [
    {id: "knx", name: "KNXDataPoint"},
    {id: "somfy", name: "SomfyDataPoint"}
];

const getProtocol = datapoint => datapoint.protocol || "knx";

const getCommandParametersText = datapoint => {
    if (datapoint.somfyCommandParameters == null) {
        return "[]";
    }
    if (typeof datapoint.somfyCommandParameters === "string") {
        return datapoint.somfyCommandParameters;
    }
    return JSON.stringify(datapoint.somfyCommandParameters);
};

const normalizeDatapoint = datapoint => ({
    protocol: "knx",
    somfyCommandParameters: [],
    ...datapoint
});

const isNewDatapoint = datapoint => datapoint == null || datapoint.id == null || datapoint.id === "";

class DatapointEditor extends Component {
    state = {
        datapoint: normalizeDatapoint(this.props.datapoint),
        somfyCommandParametersText: getCommandParametersText(this.props.datapoint),
        editableID: isNewDatapoint(this.props.datapoint),
        modified: false,
        isNew: isNewDatapoint(this.props.datapoint),
        valid: !isNewDatapoint(this.props.datapoint),
        freezeOn: false
    };

    componentDidUpdate(prevProps) {
        if(prevProps.datapoint !== this.props.datapoint) {
            const datapoint = normalizeDatapoint(this.props.datapoint);
            const isNew = isNewDatapoint(datapoint);
            this.setState({
                datapoint,
                somfyCommandParametersText: getCommandParametersText(datapoint),
                modified: false,
                valid: !isNew,
                isNew,
                editableID: isNew
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
        this.setFreeze(true);
        const datapoint = this.prepareDatapointForSave();
        if (datapoint == null) {
            this.setFreeze(false);
            return Promise.resolve();
        }
        let action;
        if (this.state.isNew) {
            action = this.props.createNewDatapoint(datapoint)
        }
        else {
            action = this.props.updateDatapoint(datapoint);
        }
        return action
            .then(() => toastr.success('Success', "Save OK"))
            .catch(e => toastr.error('Error', e.message))
            .then(() => this.setFreeze(false));
    };

    deleteDatapoint = () => {
        if (this.state.isNew) {
            this.newDataPoint();
            return Promise.resolve();
        }
        return this.props.deleteDatapoint(this.state.datapoint).catch(e => {
                toastr.error('Error', e.message);
            })
            .then(() => {
                toastr.success('Success', "Delete OK");
                this.setState({freezeOn: false});
            });
    };

    validateIDForDatapoint = (id, datapoint) => {
        const dp = this.props.getDatapointByID(id);
        if ((this.state.isNew === true) && (dp != null)) {
            return false;
        }
        if (id == null || id.trim() === "") {
            return false;
        }
        if (getProtocol(datapoint) === "knx") {
            return id.match(/\d+[.]\d+[.]\d+/) != null;
        }
        return true;

    };

    validateID = id => this.validateIDForDatapoint(id, this.state.datapoint);

    validateDatapoint = (dp, somfyCommandParametersText = this.state.somfyCommandParametersText) => {
        if (!this.validateIDForDatapoint(dp.id, dp) || dp.type == null || dp.type.trim() === "") {
            return false;
        }
        if (getProtocol(dp) === "somfy") {
            if (dp.somfyDeviceURL == null || dp.somfyDeviceURL.trim() === "") {
                return false;
            }
            try {
                const parameters = JSON.parse(somfyCommandParametersText || "[]");
                return Array.isArray(parameters);
            }
            catch (e) {
                return false;
            }
        }
        return true;
    };

    handleValueChange = (key, value) => {
        if (this.state.freezeOn === true) {
            return;
        }
        const datapoint = Object.assign({}, this.state.datapoint);
        datapoint[key] = value;
        if (key === "protocol") {
            datapoint.protocol = value;
        }
        this.setState({
            modified: true,
            datapoint: datapoint,
            valid: this.validateDatapoint(datapoint)
        });
    };

    handleSomfyCommandParametersChange = (_key, value) => {
        if (this.state.freezeOn === true) {
            return;
        }
        const datapoint = Object.assign({}, this.state.datapoint, {
            somfyCommandParameters: value
        });
        this.setState({
            modified: true,
            datapoint,
            somfyCommandParametersText: value,
            valid: this.validateDatapoint(datapoint, value)
        });
    };

    prepareDatapointForSave = () => {
        const datapoint = Object.assign({}, this.state.datapoint);
        if (getProtocol(datapoint) === "somfy") {
            try {
                const parameters = JSON.parse(this.state.somfyCommandParametersText || "[]");
                if (!Array.isArray(parameters)) {
                    throw new Error("Somfy command parameters must be a JSON array");
                }
                datapoint.somfyCommandParameters = parameters;
            }
            catch (e) {
                toastr.error("Error", e.message);
                return null;
            }
        }
        return datapoint;
    };

    renderKNXFields = datapoint => {
        if (getProtocol(datapoint) !== "knx") {
            return null;
        }
        return (
            <React.Fragment>
                <DatapointParameter key="knxName" label="KNX name" data={datapoint} name="knxName"/>
                <DatapointParameter label="KNX Group" data={datapoint} name="knxGroupName"/>
            </React.Fragment>
        );
    };

    renderSomfyFields = datapoint => {
        if (getProtocol(datapoint) !== "somfy") {
            return null;
        }
        const somfyParameters = Object.assign({}, datapoint, {
            somfyCommandParameters: this.state.somfyCommandParametersText
        });
        return (
            <React.Fragment>
                <DatapointParameter
                    key="somfyDeviceURL"
                    editable={!this.state.freezeOn}
                    label="Somfy device URL"
                    name="somfyDeviceURL"
                    onChange={this.handleValueChange}
                    data={datapoint}
                />
                <DatapointParameter
                    key="somfyStateName"
                    editable={!this.state.freezeOn}
                    label="Somfy state"
                    name="somfyStateName"
                    onChange={this.handleValueChange}
                    data={datapoint}
                />
                <DatapointParameter
                    key="somfyCommandName"
                    editable={!this.state.freezeOn}
                    label="Somfy command"
                    name="somfyCommandName"
                    onChange={this.handleValueChange}
                    data={datapoint}
                />
                <DatapointParameter
                    key="somfyCommandParameters"
                    editable={!this.state.freezeOn}
                    label="Command parameters"
                    name="somfyCommandParameters"
                    onChange={this.handleSomfyCommandParametersChange}
                    data={somfyParameters}
                />
            </React.Fragment>
        );
    };


    // componentDidUpdate(prevProps) {
    //     if ((this.props.freeze === prevProps.freeze) &&
    //         (((this.props.datapoint == null) && (prevProps.datapoint == null)) ||
    //             ((this.props.datapoint != null) && (prevProps.datapoint != null) &&
    //         (this.props.datapoint.id === prevProps.datapoint.id)))) {
    //         return;
    //     }
    //     this.setState({
    //         datapoint: Object.assign({}, this.props.datapoint),
    //         modified: false,
    //         valid: true,
    //         isNew: false,
    //         editableID: false,
    //         freezeOn: this.props.freeze
    //     });
    // }

    render() {
        const datapoint = this.state.datapoint;
        let savebtnClassname, saveFunc;
        if (this.state.valid && this.state.modified) {
            savebtnClassname = "datapoint-editor-button";
            saveFunc = this.saveDatapoint;
        }
        else {
            savebtnClassname = "datapoint-editor-button-disabled";
        }

        return (
            <div className="datapoint-editor datapoint-dashboard-editor">
                <div className="datapoint-editor-actions datapoint-dashboard-editor-actions">
                    <button className="datapoint-dashboard-button" type="button" onClick={this.newDataPoint}>New</button>
                    <button className={savebtnClassname} type="button" onClick={saveFunc}>Save</button>
                    <button className="datapoint-dashboard-button datapoint-dashboard-button-danger" type="button" onClick={this.deleteDatapoint}>Delete</button>
                </div>
                <DatapointParameter
                    key="protocol"
                    label="protocol"
                    name="protocol"
                    onChange={this.handleValueChange}
                    data={datapoint}
                    list={DATAPOINT_PROTOCOLS}
                    display="name"
                    match="id"
                />
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
                    key="description"
                    editable={!this.state.freezeOn}
                    label="description"
                    name="description"
                    onChange={this.handleValueChange}
                    data={datapoint}
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
                {this.renderKNXFields(datapoint)}
                {this.renderSomfyFields(datapoint)}
            </div>
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
    newDataPoint: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    types: state.datapoints.types,
    datapoints: state.datapoints.items,
    getDatapointByID: getDatapointByID(state)

});

const mapDispatchToProps = dispatch => {
  return {
      createNewDatapoint: createNewDatapoint(dispatch),
      updateDatapoint: updateDatapoint(dispatch),
      deleteDatapoint: deleteDatapoint(dispatch)
  }
};
export default connect(mapStateToProps, mapDispatchToProps)(DatapointEditor);
