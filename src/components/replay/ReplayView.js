import React from 'react';
import FreezeView from "../common/FreezeView";
import DatapointParameter from "../datapoint/DatapointParameter";
import { updateReplayInfo, getReplayFile } from "../../actions/replayActions";
import { toastr } from "react-redux-toastr";
import {connect} from 'react-redux';
import "./ReplayView.css";
import PropTypes from 'prop-types';

class ReplayView extends FreezeView {
    state = {
        replayInfo: this.props.replayInfo,
        fileContent: "",
        filteredContent: ""
    };

    applyFilter(filters, content) {
        if (filters == null) {
            this.setState({filteredContent: content, fileContent: content});
            return;
        }
        const re = new RegExp(filters)
        const filteredContent = [];
        content.split("\n").map(line => {
            const m = line.match(re);
            if (m) {
                filteredContent.push(line);
            }
        });
        this.setState({fileContent: content, filteredContent: filteredContent.join("\n")});
    }

    handleValueChange = (key,value) => {
        const replayInfo = Object.assign({}, this.state.replayInfo);
        replayInfo[key] = value;
        if (key === "filename") {
            getReplayFile(value).then((fileContent) => {
                this.applyFilter(this.state.replayInfo.filters, fileContent);
            });
        }
        else if (key === "filters") {
            this.applyFilter(value, this.state.fileContent);
        }
        else if (key === "enable") {
            replayInfo[key] = value === "true";
        }
        this.setState({replayInfo});
    }

    renderContent() {
        if (this.state.replayInfo == null) {
            return (
                <div className="gdnet-view">
                    <div className="gdnet-title">Replay</div>
                </div>
            );
        }
        const saveFunc = () => {
            this.setFreezeOn();
            updateReplayInfo(this.state.replayInfo)
                .then(() => toastr.success('Success', "Save OK"))
                .catch(e => toastr.error('Error', e.message))
                .then(() => this.setFreezeOff());
        };

        const cancelFunc = () => {
            this.setState({replayInfo: this.props.replayInfo});
        };

        return (
            <div className="gdnet-view">
                <div className="gdnet-title">Replay</div>
                <div className="replay-view">
                    <div className="replay-view-actions">
                        <div className="datapoint-editor-button" onClick={saveFunc}>Save</div>
                        <div className="datapoint-editor-button" onClick={cancelFunc}>Cancel</div>
                    </div>
                    <DatapointParameter 
                        key="enable"
                        onChange={this.handleValueChange}
                        label="enabled"
                        name="enable"
                        data={this.state.replayInfo}
                        list={[{id: "true", value: true}, {id: "false", value: false}]}
                        display="id"
                        match="value"
                    />
                    <DatapointParameter 
                        key="filename"
                        onChange={this.handleValueChange}
                        label="filename"
                        name="filename"
                        data={this.state.replayInfo}
                        list={this.props.replayFiles}
                        match="id"
                        display="id"
                    />
                    <DatapointParameter 
                        key="startTime"
                        onChange={this.handleValueChange}
                        editable={true}
                        label="Start Time"
                        name="startTime"
                        data={this.state.replayInfo}                    
                    />
                    <DatapointParameter 
                        key="duration"
                        onChange={this.handleValueChange}
                        editable={true}
                        label="duration"
                        name="duration"
                        data={this.state.replayInfo}                    
                    />
                    <DatapointParameter 
                        key="filters"
                        onChange={this.handleValueChange}
                        editable={true}
                        label="filters"
                        name="filters"
                        data={this.state.replayInfo}                    
                    />
                </div>
                <div className="replay-file">
                    <pre>
                    {this.state.filteredContent}
                    </pre>
                </div>
            </div>
        );
    }

}

ReplayView.propTypes = {
    replayInfo: PropTypes.object.isRequired,
    replayFiles: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    replayFiles: state.replaydata.replayFiles,
    replayInfo: state.replaydata.info,
});


export default connect(mapStateToProps, undefined)(ReplayView);