import React from 'react';
import { connect } from 'react-redux';
import FreezeView from "../common/FreezeView";
import DatapointList from '../common/DatapointList';
import DataPointCtlEditor from './DataPointCtlEditor';
import { getEmptyDatapointCtl } from "../../reducers/dataPointCtlReducer";
import {deleteAllDataPointCtls} from "../../actions/dataPointCtlAction";
import PropTypes from "prop-types";
import { toastr } from "react-redux-toastr";

class DataPointCtlView extends FreezeView {
    state = {
        selectedDataPointCtl: getEmptyDatapointCtl()
    };

    selectDataPointCtl = dataPointCtl => {
        if (this.state.freeOn === true) {
            return;
        }
        this.setState({selectedDataPointCtl: dataPointCtl});
    };

    newDataPointCtl = () => {
        this.setState({selectedDataPointCtl: getEmptyDatapointCtl()})
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
        return (
            <div className="gdnet-view">
                <div className="gdnet-title">DataPointCtl</div>
                <div className={`view-container ${this.isFreezed() === true ? "blurred" : ""}`}>
                    <div className="datapoint-view-buttons">
                        <div className="datapoint-editor-button" onClick={this.handleDeleteAll}>
                            Delete DP Controllers
                        </div>
                    </div>
                    <div className="datapoint-view-info">
                        <DatapointList datapoints={this.props.dataPointCtls} select={this.selectDataPointCtl}/>
                        <DataPointCtlEditor
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


