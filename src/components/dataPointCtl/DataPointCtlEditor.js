import React from 'react';
import { connect } from 'react-redux';
import FreezeView from "../common/FreezeView";
import PropTypes from 'prop-types';
import DatapointParameter from '../datapoint/DatapointParameter';
import {getDataPointCtlByID } from "../../reducers/dataPointCtlReducer";
import {fetchDPCTLTypes, createNewDataPointCtl, updateDataPointCtl, deleteDataPointCtl} from "../../actions/dataPointCtlAction";
import { toastr } from "react-redux-toastr";
import DataPointCtlActions from "./DataPointCtlActions";

const DATAPOINTCTL_NONE = {id: null, name: "none"};

const isNewDataPointCtl = dataPointCtl => dataPointCtl == null || dataPointCtl.id == null || dataPointCtl.id === "";


class DataPointCtlEditor extends FreezeView {
    state = {
        dataPointCtl: Object.assign({}, this.props.dataPointCtl),
        editableID: isNewDataPointCtl(this.props.dataPointCtl),
        modified: false,
        isNew: isNewDataPointCtl(this.props.dataPointCtl),
        valid: !isNewDataPointCtl(this.props.dataPointCtl),
        ctltypes: []
    };

    newDataPointCtl = () => {
        this.props.newDataPointCtl();
    };

    saveDataPointCtl = () => {
        this.setFreezeOn();
        let action;
        if (this.state.isNew) {
            action = this.props.createNewDataPointCtl(this.state.dataPointCtl)
        }
        else {
            action = this.props.updateDataPointCtl(this.state.dataPointCtl);
        }
        return action
        .then(() => {
            toastr.success('Success', "Save OK");
        })
        .catch(e => {
            toastr.error('Error', e.message);
        })
        .then(() => {
            this.setFreezeOff();
        });
    };

    deleteDataPointCtl = () => {
        if (this.state.isNew) {
            this.newDataPointCtl();
            return Promise.resolve();
        }
        return this.props.deleteDataPointCtl(this.state.dataPointCtl)
        .then(() => {
            toastr.success('Success', "Delete OK");
            this.newDataPointCtl();
        })
        .catch(e => {
            toastr.error('Error', e.message);
        })
        .then(() => {
            this.setFreezeOff();
        });
    };

    validateID = id => {
        const dp = this.props.getDataPointCtlByID(id);
        if (((this.state.isNew === true) && (dp != null)) ||
            (id != null && id.trim() === "")) {
            return false;
        }
        return true;
    };

    validateDataPointCtl = dp => {
        return this.validateID(dp.id);
    };

    handleValueChange = (key, value) => {
        if (this.isFreezed() === true) {
            return;
        }
        const dataPointCtl = Object.assign({}, this.state.dataPointCtl);
        if (key === "statusReaderID") {
            if (value.id === "none") {
                dataPointCtl[key] = null;
            }
            else {
                dataPointCtl[key] = value.id;
            }
        }
        else if (key === "commandWriterID") {
            if (value.id === "none") {
                dataPointCtl[key] = null;
            }
            else {
                dataPointCtl[key] = value.id;
            }
        }
        else {
            dataPointCtl[key] = value;
        }
        this.setState({
            modified: true,
            dataPointCtl: dataPointCtl,
            valid: this.validateDataPointCtl(dataPointCtl)
        });
    };

    componentDidMount() {
        fetchDPCTLTypes().then(ctltypes => {
            this.setState({ctltypes});
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.dataPointCtl === this.props.dataPointCtl) {
            return;
        }
        const isNew = isNewDataPointCtl(this.props.dataPointCtl);
        this.setState({
            dataPointCtl: Object.assign({}, this.props.dataPointCtl),
            modified: false,
            valid: !isNew,
            isNew,
            editableID: isNew
        });
    }

    renderContent() {
        const dataPointCtl = this.state.dataPointCtl;
        let savebtnClassname, saveFunc;
        if (this.state.valid && this.state.modified) {
            savebtnClassname = "datapoint-editor-button";
            saveFunc = this.saveDataPointCtl;
        }
        else {
            savebtnClassname = "datapoint-editor-button-disabled";
        }
        const statusReaders = this.props.dataPoints.concat(DATAPOINTCTL_NONE);
        const commandWriters = this.props.dataPoints.concat(DATAPOINTCTL_NONE);
        const actions = this.state.isNew ? "" : (<DataPointCtlActions dataPointCtl={dataPointCtl} />);
        const displayDataPointItem = item => {
            const protocol = item.protocol == null ? "knx" : item.protocol;
            const command = item.somfyCommandName ? ` -> ${item.somfyCommandName}` : "";
            const state = item.somfyStateName ? ` / ${item.somfyStateName}` : "";
            return `${item.name}${state}${command} (${protocol}:${item.id})`;
        }
        return (
            <div className="datapoint-editor datapointctl-editor">
                <div className="datapoint-editor-actions datapointctl-editor-actions">
                    <button className="datapointctl-button" type="button" onClick={this.newDataPointCtl}>New</button>
                    <button className={savebtnClassname} type="button" onClick={saveFunc}>Save</button>
                    <button className="datapointctl-button datapointctl-button-danger" type="button" onClick={this.deleteDataPointCtl}>Delete</button>
                </div>
                <DatapointParameter
                    key="id"
                    validator={this.validateID}
                    onChange={this.handleValueChange}
                    editable={this.state.editableID}
                    label="id"
                    name="id"
                    data={dataPointCtl}
                />
                <DatapointParameter
                    key="name"
                    editable={!this.isFreezed()}
                    label="name"
                    name="name"
                    onChange={this.handleValueChange}
                    data={dataPointCtl}
                />
                <DatapointParameter
                    key="type"
                    label="type"
                    name="type"
                    onChange={this.handleValueChange}
                    data={dataPointCtl}
                    list={this.state.ctltypes}
                    display="id"
                    match="id"
                />
                <DatapointParameter
                    key="statusReaderID"
                    data={dataPointCtl}
                    label="Status Reader"
                    name="statusReaderID"
                    onChange={this.handleValueChange}
                    list={statusReaders}
                    filterKeys={["id", "name", "protocol", "somfyStateName", "somfyCommandName", "somfyDeviceURL"]}
                    match="id"
                    display={displayDataPointItem}
                />
                <DatapointParameter
                    key="commandWriterID"
                    data={dataPointCtl}
                    label="Command Writer"
                    name="commandWriterID"
                    onChange={this.handleValueChange}
                    list={commandWriters}
                    filterKeys={["id", "name", "protocol", "somfyStateName", "somfyCommandName", "somfyDeviceURL"]}
                    match="id"
                    display={displayDataPointItem}
                />
                {actions}
            </div>
        );
    }
}

DataPointCtlEditor.propTypes = {
    dataPointCtl: PropTypes.object.isRequired,
    dataPointCtls: PropTypes.array.isRequired,
    dataPoints: PropTypes.array.isRequired,
    types: PropTypes.array.isRequired,
    getDataPointCtlByID: PropTypes.func.isRequired,
    createNewDataPointCtl: PropTypes.func.isRequired,
    updateDataPointCtl: PropTypes.func.isRequired,
    newDataPointCtl: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    types: state.datapoints.types,
    dataPointCtls: state.datapointctls.items,
    dataPoints: state.datapoints.items,
    getDataPointCtlByID: getDataPointCtlByID(state)

});

const mapDispatchToProps = dispatch => {
    return {
        createNewDataPointCtl: createNewDataPointCtl(dispatch),
        updateDataPointCtl: updateDataPointCtl(dispatch),
        deleteDataPointCtl: deleteDataPointCtl(dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(DataPointCtlEditor);
