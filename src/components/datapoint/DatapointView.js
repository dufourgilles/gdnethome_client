import React from 'react';
import { connect } from 'react-redux';
import DatapointList from '../common/DatapointList';
import DatapointEditor from './DatapointEditor';
import { EMPTY_DATAPOINT} from "../../reducers/datapointReducer";
import FreezeView from "../common/FreezeView";
import './DatapointView.css'
import {deleteAllDatapoints} from "../../actions/datapointActions";
import PropTypes from "prop-types";
import { toastr } from "react-redux-toastr";

class DatapointView extends FreezeView {
    state = {
        selectedDatapoint: EMPTY_DATAPOINT,
    };

    selectDatapoint = (datapoint) => {
        if (this.state.freeOn === true) {
            return;
        }
        this.setState({selectedDatapoint: datapoint});
    };

    handleDeleteAll = () =>  {
        this.setFreezeOn();
        this.props.deleteAllDatapoints()
            .catch(e => {
                toastr.error('Error', e.message);
            })
            .then(() => {
                toastr.success('Success', "Delete All");
                this.setFreezeOff();
            });
    };

    render() {
        return (
            <div className="gdnet-view">
                <div className="gdnet-title">DataPoints</div>
                <div className={`datapoint-view ${this.state.freezeOn === true ? "blurred" : ""}`}>
                    <div className="datapoint-view-delete-btn" onClick={this.handleDeleteAll}>
                        Delete ALL Datapoints
                    </div>
                    <div className="datapoint-view-info">
                        <DatapointList datapoints={this.props.datapoints} select={this.selectDatapoint}/>
                        <DatapointEditor
                            datapoint={this.state.selectedDatapoint}
                            setFreeze={this.setFreeze}
                            freeze={this.state.freeOn}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

DatapointView.propTypes = {
    deleteAllDatapoints: PropTypes.func.isRequired,
    datapoints: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    datapoints: state.datapoints.items
});

const mapDispatchToProps = dispatch => {
    return {
        deleteAllDatapoints: deleteAllDatapoints(dispatch),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(DatapointView);


