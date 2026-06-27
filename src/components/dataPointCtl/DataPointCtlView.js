import React from 'react';
import { connect } from 'react-redux';
import FreezeView from "../common/FreezeView";
import DatapointList from '../common/DatapointList';
import DataPointCtlEditor from './DataPointCtlEditor';
import { getEmptyDatapointCtl } from "../../reducers/dataPointCtlReducer";
import {deleteAllDataPointCtls} from "../../actions/dataPointCtlAction";
import PropTypes from "prop-types";
import { toastr } from "react-redux-toastr";
import './DataPointViewCtl.scss';

class DataPointCtlView extends FreezeView {
    state = {
        selectedDataPointCtl: getEmptyDatapointCtl(),
        selectionVersion: 0
    };

    selectDataPointCtl = dataPointCtl => {
        if (this.state.freeOn === true) {
            return;
        }
        this.setState({
            selectedDataPointCtl: dataPointCtl,
            selectionVersion: this.state.selectionVersion + 1
        });
    };

    newDataPointCtl = () => {
        this.setState({
            selectedDataPointCtl: getEmptyDatapointCtl(),
            selectionVersion: this.state.selectionVersion + 1
        });
    }

    handleDeleteAll = () =>  {
        this.setFreezeOn();
        this.props.deleteAllDataPointCtls()
            .catch(e => {
                toastr.error('Error', e.message);
            })
            .then(() => {
                toastr.success('Success', "Delete All");
                this.setFreezeOff();
            });
    };

    renderContent() {
        const selected = this.state.selectedDataPointCtl;
        const selectedTitle = selected.id === "" ? "New controller" : selected.name || selected.id;
        return (
            <div className="gdnet-view datapointctl-view">
                <div className="datapointctl-header">
                    <div>
                        <div className="gdnet-title">DataPointCtl</div>
                        <div className="datapointctl-subtitle">{this.props.dataPointCtls.length} controllers configured</div>
                    </div>
                </div>
                <div className={`view-container datapointctl-container ${this.isFreezed() === true ? "blurred" : ""}`}>
                    <div className="datapointctl-panel datapointctl-list-panel">
                        <div className="datapointctl-panel-header">
                            <span>Controllers</span>
                        </div>
                        <DatapointList datapoints={this.props.dataPointCtls} select={this.selectDataPointCtl}/>
                    </div>
                    <div className="datapointctl-editor-panel">
                        <div className="datapointctl-panel-header">
                            <span>{selectedTitle}</span>
                            <span className="datapointctl-panel-meta">{selected.type}</span>
                        </div>
                        <DataPointCtlEditor
                            key={this.state.selectionVersion}
                            dataPointCtl={this.state.selectedDataPointCtl}
                            newDataPointCtl={this.newDataPointCtl}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

DataPointCtlView.propTypes = {
    deleteAllDataPointCtls: PropTypes.func.isRequired,
    dataPointCtls: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    dataPointCtls: state.datapointctls.items
});

const mapDispatchToProps = dispatch => {
    return {
        deleteAllDataPointCtls: deleteAllDataPointCtls(dispatch),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(DataPointCtlView);

