import React from 'react';
import { connect } from 'react-redux';
import DatapointList from '../common/DatapointList';
import DatapointEditor from './DatapointEditor';
import { getEmptyDatapoint } from "../../reducers/datapointReducer";
import FreezeView from "../common/FreezeView";
import './DatapointView.scss'
import {deleteAllDatapoints, importSomfy, uploadFile} from "../../actions/datapointActions";
import PropTypes from "prop-types";
import { toastr } from "react-redux-toastr";
import PopupBox from "../common/PopupBox";

class DatapointView extends FreezeView {
    state = {
        selectedDatapoint: getEmptyDatapoint(),
        selectionVersion: 0,
        openPopupBox: false,
        fileName: "",
        file: null
    };

    selectDatapoint = (datapoint) => {
        if (this.isFreezed()) {
            return;
        }
        this.setState({
            selectedDatapoint: datapoint,
            selectionVersion: this.state.selectionVersion + 1
        });
    };

    newDataPoint = () => {
        this.setState({
            selectedDatapoint: getEmptyDatapoint(),
            selectionVersion: this.state.selectionVersion + 1
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

    downloadDatapoints = () => {
        const data = JSON.stringify(this.props.datapoints, null, 2);
        const blob = new Blob([data], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "datapoints.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    importSomfy = () => {
        this.setFreezeOn();
        return this.props.importSomfy()
            .then(result => {
                toastr.success('Success', `Somfy import: ${result.added} added, ${result.skipped} skipped`);
            })
            .catch(e => {
                toastr.error('Error', e.message);
            })
            .then(() => this.setFreezeOff());
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
        const selected = this.state.selectedDatapoint;
        const selectedTitle = selected.id === "" ? "New datapoint" : selected.name || selected.id;
        const protocolSummary = selected.protocol == null ? "knx" : selected.protocol;
        return (
            <div className="gdnet-view datapoint-view">
                <div className="datapoint-dashboard-header">
                    <div>
                        <div className="gdnet-title">DataPoints</div>
                        <div className="datapoint-dashboard-subtitle">{this.props.datapoints.length} datapoints available</div>
                    </div>
                    <div className="datapoint-dashboard-toolbar">
                        <button className="datapoint-dashboard-button" type="button" onClick={this.newDataPoint}>
                            New Datapoint
                        </button>
                        <button className="datapoint-dashboard-button" type="button" onClick={this.openFileSelect}>
                            Upload ETS5
                        </button>
                        <button className="datapoint-dashboard-button" type="button" onClick={this.importSomfy}>
                            Import Somfy
                        </button>
                        <button className="datapoint-dashboard-button" type="button" onClick={this.downloadDatapoints}>
                            Download
                        </button>
                        <button className="datapoint-dashboard-button datapoint-dashboard-button-danger" type="button" onClick={this.handleDeleteAll}>
                            Delete All
                        </button>
                    </div>
                </div>
                <div className={`view-container datapoint-dashboard-container ${this.state.freezeOn === true ? "blurred" : ""}`}>
                    <div className="datapoint-dashboard-panel datapoint-dashboard-list-panel">
                        <div className="datapoint-dashboard-panel-header">
                            <span>Datapoints</span>
                        </div>
                        <DatapointList datapoints={this.props.datapoints} select={this.selectDatapoint} showProtocol/>
                    </div>
                    <div className="datapoint-dashboard-panel datapoint-dashboard-editor-panel">
                        <div className="datapoint-dashboard-panel-header">
                            <span>{selectedTitle}</span>
                            <span className="datapoint-dashboard-panel-meta">{protocolSummary} / {selected.type}</span>
                        </div>
                        <DatapointEditor
                            key={this.state.selectionVersion}
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
    importSomfy: PropTypes.func.isRequired,
    datapoints: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    datapoints: state.datapoints.items
});

const mapDispatchToProps = dispatch => {
    return {
        deleteAllDatapoints: deleteAllDatapoints(dispatch),
        importSomfy: importSomfy(dispatch),
        uploadFile: uploadFile(dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(DatapointView);
