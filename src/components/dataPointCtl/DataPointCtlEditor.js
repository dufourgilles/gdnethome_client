import React from 'react';
import { connect } from 'react-redux';
import FreezeView from "../common/FreezeView";
import PropTypes from 'prop-types';
import DatapointParameter from '../datapoint/DatapointParameter';
import {getDataPointCtlByID } from "../../reducers/dataPointCtlReducer";
import {fetchDPCTLTypes, createNewDataPointCtl, updateDataPointCtl, deleteDataPointCtl} from "../../actions/dataPointCtlAction";
import { toastr } from "react-redux-toastr";
import DataPointCtlActions from "./DataPointCtlActions";
import { Button } from 'antd';

const DATAPOINTCTL_NONE = {id: null, name: "none"};


class DataPointCtlEditor extends FreezeView {
    state = {
        dataPointCtl: this.props.dataPointCtl,
        editableID: true,
        modified: false,
        isNew: true,
        valid: false,
        ctltypes: []
    };

    componentWillReceiveProps(newProps) {
        if (newProps.dataPointCtl.id !== this.state.dataPointCtl.id) {
            this.setState({dataPointCtl: this.props.dataPointCtl});
        }
    }
    
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
        debugger;
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
        if (((this.props.dataPointCtl == null) && (prevProps.dataPointCtl == null)) ||
                ((this.props.dataPointCtl != null) && (prevProps.dataPointCtl != null) &&
                    (this.props.dataPointCtl.id === prevProps.dataPointCtl.id))) {
            return;
        }
        this.setState({
            dataPointCtl: Object.assign({}, this.props.dataPointCtl),
            modified: false,
            valid: true,
            isNew: false,
            editableID: false
        });
    }

    renderContent() {
        const dataPointCtl = this.state.dataPointCtl;
        const statusReaders = this.props.dataPoints.concat(DATAPOINTCTL_NONE);
        const commandWriters = this.props.dataPoints.concat(DATAPOINTCTL_NONE);
        const actions = this.state.isNew ? "" : (<DataPointCtlActions dataPointCtl={dataPointCtl} />);
        const displayDataPointItem = item => {
            return `${item.name}(${item.id})`;
        }
        return (
            <div className="datapoint-editor">
                <div className="datapoint-editor-actions">
                    <Button onClick={this.newDataPointCtl}>New</Button>
                    <Button disabled={!(this.state.valid && this.state.modified)} onClick={this.saveDataPointCtl}>Save</Button>
                    <Button onClick={this.deleteDataPointCtl}>Delete</Button>
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
                    filterKeys={["id", "name"]}
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
                    filterKeys={["id", "name"]}
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


