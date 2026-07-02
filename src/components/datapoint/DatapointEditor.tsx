// @ts-nocheck
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DatapointParameter from './DatapointParameter';
import {getById} from "../../hooks/domain";
import './DatapointEditor.scss';
import { toastr } from "../../hooks/toastr";
import { useDatapoint } from "../../hooks/useDatapoint";

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

const emptySomfyKNXMapping = () => ({somfyValue: "", knxValue: ""});

const normalizeDatapoint = datapoint => {
    const normalized = {
        protocol: "knx",
        somfyCommandParameters: [],
        knx_id: "",
        somfy_id: "",
        ...datapoint
    };
    const link = normalized.somfyKNXLink;
    normalized.knx_id = link != null && link.knxDataPointID != null ? link.knxDataPointID : (normalized.knx_id || "");
    normalized.somfyKNXMappings = link != null && Array.isArray(link.mappings) && link.mappings.length > 0
        ? link.mappings.map(mapping => ({somfyValue: mapping.somfyValue, knxValue: mapping.knxValue}))
        : [emptySomfyKNXMapping()];
    normalized.hadSomfyKNXLink = link != null;

    const somfyLink = normalized.knxSomfyLink;
    normalized.somfy_id = somfyLink != null && somfyLink.somfyDataPointID != null
        ? somfyLink.somfyDataPointID : (normalized.somfy_id || "");
    normalized.knxSomfyMappings = somfyLink != null && Array.isArray(somfyLink.mappings) && somfyLink.mappings.length > 0
        ? somfyLink.mappings.map(mapping => ({knxValue: mapping.knxValue, somfyValue: mapping.somfyValue}))
        : [emptySomfyKNXMapping()];
    normalized.hadKNXSomfyLink = somfyLink != null;
    return normalized;
};

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
            .then(() => this.syncSomfyKNXLink(datapoint))
            .then(() => this.syncKNXSomfyLink(datapoint))
            .then(() => toastr.success('Success', "Save OK"))
            .catch(e => toastr.error('Error', e.message))
            .then(() => this.setFreeze(false));
    };

    /**
     * Persist the Somfy->KNX link using the dedicated /knxlink route once the
     * datapoint itself has been saved.
     */
    syncSomfyKNXLink = datapoint => {
        if (getProtocol(datapoint) !== "somfy") {
            return Promise.resolve();
        }
        const knxId = (datapoint.knx_id || "").trim();
        if (knxId === "") {
            return datapoint.hadSomfyKNXLink ? this.props.deleteSomfyKNXLink(datapoint.id) : Promise.resolve();
        }
        const mappings = (datapoint.somfyKNXMappings || [])
            .filter(mapping => String(mapping.somfyValue).trim() !== "" && String(mapping.knxValue).trim() !== "")
            .map(mapping => ({somfyValue: mapping.somfyValue, knxValue: mapping.knxValue}));
        return this.props.updateSomfyKNXLink(datapoint.id, {knxDataPointID: knxId, mappings});
    };

    /**
     * Persist the KNX->Somfy link using the dedicated /somfylink route once the
     * datapoint itself has been saved.
     */
    syncKNXSomfyLink = datapoint => {
        if (getProtocol(datapoint) !== "knx") {
            return Promise.resolve();
        }
        const somfyId = (datapoint.somfy_id || "").trim();
        if (somfyId === "") {
            return datapoint.hadKNXSomfyLink ? this.props.deleteKNXSomfyLink(datapoint.id) : Promise.resolve();
        }
        const mappings = (datapoint.knxSomfyMappings || [])
            .filter(mapping => String(mapping.knxValue).trim() !== "" && String(mapping.somfyValue).trim() !== "")
            .map(mapping => ({knxValue: mapping.knxValue, somfyValue: mapping.somfyValue}));
        return this.props.updateKNXSomfyLink(datapoint.id, {somfyDataPointID: somfyId, mappings});
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

    handleSomfyKNXMappingChange = (field, index, value) => {
        if (this.state.freezeOn === true) {
            return;
        }
        const mappings = (this.state.datapoint.somfyKNXMappings || []).map((mapping, i) =>
            i === index ? Object.assign({}, mapping, {[field]: value}) : mapping
        );
        const datapoint = Object.assign({}, this.state.datapoint, {somfyKNXMappings: mappings});
        this.setState({
            modified: true,
            datapoint,
            valid: this.validateDatapoint(datapoint)
        });
    };

    addSomfyKNXMapping = () => {
        if (this.state.freezeOn === true) {
            return;
        }
        const mappings = [...(this.state.datapoint.somfyKNXMappings || []), emptySomfyKNXMapping()];
        const datapoint = Object.assign({}, this.state.datapoint, {somfyKNXMappings: mappings});
        this.setState({modified: true, datapoint});
    };

    removeSomfyKNXMapping = index => {
        if (this.state.freezeOn === true) {
            return;
        }
        let mappings = (this.state.datapoint.somfyKNXMappings || []).filter((_mapping, i) => i !== index);
        if (mappings.length === 0) {
            mappings = [emptySomfyKNXMapping()];
        }
        const datapoint = Object.assign({}, this.state.datapoint, {somfyKNXMappings: mappings});
        this.setState({modified: true, datapoint, valid: this.validateDatapoint(datapoint)});
    };

    handleKNXSomfyMappingChange = (field, index, value) => {
        if (this.state.freezeOn === true) {
            return;
        }
        const mappings = (this.state.datapoint.knxSomfyMappings || []).map((mapping, i) =>
            i === index ? Object.assign({}, mapping, {[field]: value}) : mapping
        );
        const datapoint = Object.assign({}, this.state.datapoint, {knxSomfyMappings: mappings});
        this.setState({
            modified: true,
            datapoint,
            valid: this.validateDatapoint(datapoint)
        });
    };

    addKNXSomfyMapping = () => {
        if (this.state.freezeOn === true) {
            return;
        }
        const mappings = [...(this.state.datapoint.knxSomfyMappings || []), emptySomfyKNXMapping()];
        const datapoint = Object.assign({}, this.state.datapoint, {knxSomfyMappings: mappings});
        this.setState({modified: true, datapoint});
    };

    removeKNXSomfyMapping = index => {
        if (this.state.freezeOn === true) {
            return;
        }
        let mappings = (this.state.datapoint.knxSomfyMappings || []).filter((_mapping, i) => i !== index);
        if (mappings.length === 0) {
            mappings = [emptySomfyKNXMapping()];
        }
        const datapoint = Object.assign({}, this.state.datapoint, {knxSomfyMappings: mappings});
        this.setState({modified: true, datapoint, valid: this.validateDatapoint(datapoint)});
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
                <DatapointParameter
                    key="somfy_id"
                    editable={!this.state.freezeOn}
                    label="Somfy id"
                    name="somfy_id"
                    onChange={this.handleValueChange}
                    data={datapoint}
                />
                {this.renderKNXSomfyMappings(datapoint)}
            </React.Fragment>
        );
    };

    renderKNXSomfyMappings = datapoint => {
        const mappings = datapoint.knxSomfyMappings || [];
        return (
            <div className="datapoint-editor-entry somfy-knx-mappings">
                <div className="datapoint-editor-key">KNX / Somfy mapping</div>
                <div className="somfy-knx-mappings-table">
                    <div className="somfy-knx-mappings-header">
                        <span>KNX</span>
                        <span>Somfy</span>
                        <span></span>
                    </div>
                    {mappings.map((mapping, index) => (
                        <div className="somfy-knx-mappings-row" key={index}>
                            <input
                                value={mapping.knxValue == null ? "" : mapping.knxValue}
                                disabled={this.state.freezeOn}
                                onChange={e => this.handleKNXSomfyMappingChange("knxValue", index, e.target.value)}
                            />
                            <input
                                value={mapping.somfyValue == null ? "" : mapping.somfyValue}
                                disabled={this.state.freezeOn}
                                onChange={e => this.handleKNXSomfyMappingChange("somfyValue", index, e.target.value)}
                            />
                            <button
                                type="button"
                                className="somfy-knx-mappings-remove"
                                disabled={this.state.freezeOn}
                                onClick={() => this.removeKNXSomfyMapping(index)}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="gdnet-button somfy-knx-mappings-add"
                        disabled={this.state.freezeOn}
                        onClick={this.addKNXSomfyMapping}
                    >
                        Add mapping
                    </button>
                </div>
            </div>
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
                <DatapointParameter
                    key="knx_id"
                    editable={!this.state.freezeOn}
                    label="KNX id"
                    name="knx_id"
                    onChange={this.handleValueChange}
                    data={datapoint}
                />
                {this.renderSomfyKNXMappings(datapoint)}
            </React.Fragment>
        );
    };

    renderSomfyKNXMappings = datapoint => {
        const mappings = datapoint.somfyKNXMappings || [];
        return (
            <div className="datapoint-editor-entry somfy-knx-mappings">
                <div className="datapoint-editor-key">Somfy / KNX mapping</div>
                <div className="somfy-knx-mappings-table">
                    <div className="somfy-knx-mappings-header">
                        <span>Somfy</span>
                        <span>KNX</span>
                        <span></span>
                    </div>
                    {mappings.map((mapping, index) => (
                        <div className="somfy-knx-mappings-row" key={index}>
                            <input
                                value={mapping.somfyValue == null ? "" : mapping.somfyValue}
                                disabled={this.state.freezeOn}
                                onChange={e => this.handleSomfyKNXMappingChange("somfyValue", index, e.target.value)}
                            />
                            <input
                                value={mapping.knxValue == null ? "" : mapping.knxValue}
                                disabled={this.state.freezeOn}
                                onChange={e => this.handleSomfyKNXMappingChange("knxValue", index, e.target.value)}
                            />
                            <button
                                type="button"
                                className="somfy-knx-mappings-remove"
                                disabled={this.state.freezeOn}
                                onClick={() => this.removeSomfyKNXMapping(index)}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="gdnet-button somfy-knx-mappings-add"
                        disabled={this.state.freezeOn}
                        onClick={this.addSomfyKNXMapping}
                    >
                        Add mapping
                    </button>
                </div>
            </div>
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
            savebtnClassname = "gdnet-button";
            saveFunc = this.saveDatapoint;
        }
        else {
            savebtnClassname = "gdnet-button disabled";
        }

        return (
            <div className="gdnet-block">
                <div className="datapoint-editor-actions">
                    <button className="gdnet-button" type="button" onClick={this.newDataPoint}>New</button>
                    <button className={savebtnClassname} type="button" onClick={saveFunc}>Save</button>
                    <button className="gdnet-button gdnet-button-danger" type="button" onClick={this.deleteDatapoint}>Delete</button>
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
    updateSomfyKNXLink: PropTypes.func.isRequired,
    deleteSomfyKNXLink: PropTypes.func.isRequired,
    updateKNXSomfyLink: PropTypes.func.isRequired,
    deleteKNXSomfyLink: PropTypes.func.isRequired,
    newDataPoint: PropTypes.func.isRequired
};

export default function DatapointEditorQuery(props) {
    const datapoint = useDatapoint();
    const datapoints = datapoint.datapoints.data || [];
    return (
        <DatapointEditor
            {...props}
            types={datapoint.types.data || []}
            datapoints={datapoints}
            getDatapointByID={getById(datapoints)}
            createNewDatapoint={value => datapoint.create.mutateAsync(value)}
            updateDatapoint={value => datapoint.update.mutateAsync(value)}
            deleteDatapoint={value => datapoint.delete.mutateAsync(value)}
            updateSomfyKNXLink={(id, link) => datapoint.updateSomfyKNXLink.mutateAsync({id, link})}
            deleteSomfyKNXLink={id => datapoint.deleteSomfyKNXLink.mutateAsync(id)}
            updateKNXSomfyLink={(id, link) => datapoint.updateKNXSomfyLink.mutateAsync({id, link})}
            deleteKNXSomfyLink={id => datapoint.deleteKNXSomfyLink.mutateAsync(id)}
        />
    );
}
