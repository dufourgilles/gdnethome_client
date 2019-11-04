import React from 'react';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import FreezeView from "../common/FreezeView";
import DatapointParameter from "../datapoint/DatapointParameter";
import {fetchActionData, fetchActionFiles} from "../../actions/actionActions";
import {getDatapointByID} from "../../reducers/datapointReducer";
import {getActionByID} from "../../reducers/actionReducer";
import { toastr } from "react-redux-toastr";
import GraphData from "../common/GraphData";

class ActionMonitor extends FreezeView {
    state = {
        actionID: "",
        action: null,
        data: null,
        dataInfo: null,
        file: "",
        files: [],
        selectedFiles: new Set()
    }

    handleActionSelect = (name, actionID) => {
        this.setFreezeOn();
        fetchActionFiles(actionID).then(files => {
            const action = this.props.getActionByID(actionID);
            let dataInfo = [];
            if (action == null) {
                throw new Error(`Invalid action ${actionID}`);
            }
            if (action.triggerEventID != null) {
                const datapoint = this.props.getDatapointByID(action.triggerEventID);
                if (datapoint != null) {
                    dataInfo.push({name: datapoint.name, enable: true});
                }
            }
            else if (action.parameters.dataPoints) {
                dataInfo = action.parameters.dataPoints.map(id => {
                    const datapoint = this.props.getDatapointByID(id);
                    if (datapoint != null) {
                        return {name: datapoint.name, enable: true};
                    }
                    return {name: "unknown", enable: true}
                });
            }
            this.setState({action, actionID, dataInfo, files});
        }).catch(e => {
            console.log(e);
            toastr.error('Error', e.message);
        }).then(() => {
            this.setFreezeOff();
        });    
    }

    handleFilesSelect = name => {
        const files = this.state.selectedFiles;
        if (files.has(name)) {
            files.delete(name);
        }
        else {
            files.add(name);
        }
        this.setState({selectedFiles: files});
    }

    handleSubmit = () => {
        this.setFreezeOn();
        fetchActionData([...this.state.selectedFiles]).then(data => {
            this.setState({data});
        })
        .catch(e => {
            console.log(e);
            toastr.error('Error', e.message);
        })
        .then(() => {
            this.setFreezeOff();
        });
    }

    renderFileSelector = () => {
        const files = this.state.files;
        if (files.length === 0) {
            return "";
        }
        let count = 0;
        const renderedFiles = files.map(file => {
            count++;
            const name = `file-${count}`;
            const handleFilesSelect = () => this.handleFilesSelect(file);      
            return (
                <div key={name}>
                    {file}
                    <input name={name} value={file} type="checkbox" onChange={handleFilesSelect} checked={this.state.selectedFiles.has(file)} />
                </div>
            )
        })
        return (
            <div className="action-monitor-files-select">
                {renderedFiles}
            </div>

        )
    }

    renderData() {
        if (this.state.data == null) {
            return "";
        }
        const width = Math.max(500, window.innerWidth);
        return (
            <GraphData 
                title={this.state.actionID} 
                height={300} 
                width={1000} 
                data={this.state.data}
                dataInfo={this.state.dataInfo}
                onDataInfoChanged={(index, key, value) => { const dataInfo = this.state.dataInfo; dataInfo[index][key] = value; this.setState(dataInfo);}}
                getX={ d => Math.floor(Number(d.timestamp) / 1000)}
                getY={ d => {return d.data.map(x => Number(x));}}
                xView={3600}
                xInterval={300}
                xDisplay={x => {const d = new Date(1000 * x); return `${x} / ${d.toString()}`;}}
            />
        );
    } 

    renderContent() {
        const fileSelector = this.renderFileSelector();
        const actions = [{id: ""}];
        this.props.actions.map(action => {
            if (action.type === "SaveValueAction" || 
                action.type === "SaveMultiValueAction"
               ) {
                actions.push(action);
            }
            return null;
        });
        const renderedData = this.renderData();
        return (
            <div className="action-monitor">
                <div className="action-monitor-action-select">
                    <DatapointParameter 
                        list={actions}
                        label="Action"
                        data={this.state}
                        display="id"
                        match="id"
                        name="actionID"
                        onChange={this.handleActionSelect}
                    />        
                    <input type="submit" onClick={this.handleSubmit} />            
                </div>
                {fileSelector}
                {renderedData}
            </div>
        );
    }
}

ActionMonitor.propTypes = {
    action: PropTypes.object,
    actions: PropTypes.array.isRequired,
    getDatapointByID: PropTypes.func.isRequired,
    getActionByID: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    actions: state.actions.items || [],
    getDatapointByID: getDatapointByID(state),
    getActionByID: getActionByID(state)
});


export default connect(mapStateToProps, undefined)(ActionMonitor);


