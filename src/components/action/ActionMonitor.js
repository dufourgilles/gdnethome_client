import React from 'react';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import FreezeView from "../common/FreezeView";
import DatapointParameter from "../datapoint/DatapointParameter";
import {fetchActionData, fetchActionFiles} from "../../actions/actionActions";
import { toastr } from "react-redux-toastr";
import GraphData from "../common/GraphData";

class ActionMonitor extends FreezeView {
    state = {
        action: "",
        data: null,
        file: "",
        files: [],
        selectedFiles: new Set()
    }

    handleActionSelect = (name, action) => {
        this.setFreezeOn();
        fetchActionFiles(action).then(files => {
            this.setState({action, files});
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
                title="Wind Speed" 
                height={200} 
                width={1000} 
                data={this.state.data}
                getX={ d => Math.floor(Number(d.timestamp) / 1000)}
                getY={ d => Number(d.data)}
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
            if (action.type === "SaveValueAction") {
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
                        name="action"
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
};

const mapStateToProps = state => ({
    actions: state.actions.items || []
});

export default connect(mapStateToProps, undefined)(ActionMonitor);


