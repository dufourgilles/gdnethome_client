// @ts-nocheck
import React from 'react';
import FreezeView from "../common/FreezeView";
import PropTypes from 'prop-types';
import DatapointParameter from '../datapoint/DatapointParameter';
import {getById} from "../../hooks/domain";
import { toastr } from "../../hooks/toastr";
import DataPointCtlActions from "./DataPointCtlActions";
import { useDatapointQuery } from "../../hooks/useDatapoint";
import { useDatapointCtl } from "../../hooks/useDatapointCtl";

const DATAPOINTCTL_NONE = {id: null, name: "none"};

const isNewDataPointCtl = dataPointCtl => dataPointCtl == null || dataPointCtl.id == null || dataPointCtl.id === "";


class DataPointCtlEditor extends FreezeView {
    state = {
        dataPointCtl: Object.assign({}, this.props.dataPointCtl),
        editableID: isNewDataPointCtl(this.props.dataPointCtl),
        modified: false,
        isNew: isNewDataPointCtl(this.props.dataPointCtl),
        valid: !isNewDataPointCtl(this.props.dataPointCtl),
        ctltypes: this.props.ctltypes || []
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

    componentDidUpdate(prevProps) {
        if (prevProps.ctltypes !== this.props.ctltypes) {
            this.setState({ctltypes: this.props.ctltypes || []});
        }
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
            savebtnClassname = "gdnet-button";
            saveFunc = this.saveDataPointCtl;
        }
        else {
            savebtnClassname = "gdnet-button disabled";
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
            <div className="gdnet-block">
                <div className="row">
                    <button className="gdnet-button" type="button" onClick={this.newDataPointCtl}>New</button>
                    <button className={savebtnClassname} type="button" onClick={saveFunc}>Save</button>
                    <button className="gdnet-button gdnet-button-danger" type="button" onClick={this.deleteDataPointCtl}>Delete</button>
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

export default function DataPointCtlEditorQuery(props) {
    const datapoints = useDatapointQuery();
    const datapointCtl = useDatapointCtl();
    const dataPointCtls = datapointCtl.datapointCtls.data || [];
    return (
        <DataPointCtlEditor
            {...props}
            types={datapointCtl.types.data || []}
            ctltypes={datapointCtl.types.data || []}
            dataPointCtls={dataPointCtls}
            dataPoints={datapoints.data || []}
            getDataPointCtlByID={getById(dataPointCtls)}
            createNewDataPointCtl={value => datapointCtl.create.mutateAsync(value)}
            updateDataPointCtl={value => datapointCtl.update.mutateAsync(value)}
            deleteDataPointCtl={value => datapointCtl.delete.mutateAsync(value)}
        />
    );
}
