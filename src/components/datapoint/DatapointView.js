import React from 'react';
import { connect } from 'react-redux';
import DatapointList from '../common/DatapointList';
import DatapointEditor from './DatapointEditor';
import { getEmptyDatapoint } from "../../reducers/datapointReducer";
import FreezeView from "../common/FreezeView";
import './DatapointView.css'
import {deleteAllDatapoints, uploadFile} from "../../actions/datapointActions";
import PropTypes from "prop-types";
import { toastr } from "react-redux-toastr";
import PopupBox from "../common/PopupBox";

class DatapointView extends FreezeView {
    state = {
        selectedDatapoint: getEmptyDatapoint(),
        openPopupBox: false,
        fileName: "",
        file: null
    };

    selectDatapoint = (datapoint) => {
        if (this.isFreezed()) {
            return;
        }
        this.setState({selectedDatapoint: datapoint});
    };

    newDataPoint = () => {
        this.setState({
            selectedDatapoint: getEmptyDatapoint()
        });
    }
    
    openFileSelect = () => {
        this.setState({openPopupBox: true});
    }

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

    uploadFile = () => {
        // DO Something with the file
        this.setFreezeOn();
        this.setState({openPopupBox: false});
        var reader = new FileReader();
        reader.onload = event => {
            return this.props.uploadFile(reader.result)
            .catch(e => {
                console.log(e);
            })
            .then(() => {
                this.setFreezeOff()
            });
        }
        reader.onerror = e => {
            console.log(e);
            this.setFreezeOff();
        }
        console.log(this.state.fileName);
        reader.readAsText(this.state.file, "UTF-8");
    }

    getPopupBoxContent = () => {
        const handleFileChange = event => {
            event.stopPropagation();
            event.preventDefault();
            if (event.target.files.length === 0) {
                return;
            }
            const f = event.target.files[0];
            this.setState({fileName: event.target.value, file: f});
        }
        return (
            <input type="file" name="filename" value={this.state.fileName} onChange={handleFileChange} />
        );
    }

    render() {
        return (
            <div className="gdnet-view">
                <div className="gdnet-title">DataPoints</div>
                <div className={`datapoint-view ${this.state.freezeOn === true ? "blurred" : ""}`}>
                    <div className="datapoint-view-buttons">
                        <div className="datapoint-view-btn" onClick={this.openFileSelect}>
                            Upload ETS5 File
                        </div>
                        <div className="datapoint-view-btn" onClick={this.handleDeleteAll}>
                            Delete ALL Datapoints
                        </div>
                    </div>
                    <div className="datapoint-view-info">
                        <DatapointList datapoints={this.props.datapoints} select={this.selectDatapoint}/>
                        <DatapointEditor
                            datapoint={this.state.selectedDatapoint}
                            setFreeze={this.setFreeze}
                            freeze={this.state.freeOn}
                            newDataPoint={this.newDataPoint}
                        />
                    </div>
                </div>
                <PopupBox 
                    visible={this.state.openPopupBox}
                    title="Seleft ETS5 file"
                    content={this.getPopupBoxContent}
                    onConfirm={this.uploadFile}
                    onExit={() => this.setState({openPopupBox: false})}
                />
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
        uploadFile: uploadFile(dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(DatapointView);


