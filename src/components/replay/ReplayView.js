import React from 'react';
import FreezeView from "../common/FreezeView";
import DatapointParameter from "../datapoint/DatapointParameter";
import { fetchReplayInfo, updateReplayInfo } from "../../actions/replayActions";
import { toastr } from "react-redux-toastr";
import {connect} from 'react-redux';
import "./ReplayView.scss";

class ReplayView extends FreezeView {
    state = {
        replayInfo: null
    };

    componentDidMount() {
        return this.refreshReplayInfo();
    }

    refreshReplayInfo = () => {
        return fetchReplayInfo()
        .then(replayInfo => this.setState({replayInfo}))
        .catch(e => toastr.error('Error', e.message))        
        .then(() => this.setFreezeOff());
    }

    handleValueChange = (key,value) => {
        const replayInfo = Object.assign({}, this.state.replayInfo);
        replayInfo[key] = value;
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
                .then(() => this.refreshReplayInfo())
        };

        const cancelFunc = () => {
            this.setFreezeOn();
            this.refreshReplayInfo();
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
                        editable={true}
                        label="filename"
                        name="filename"
                        data={this.state.replayInfo}                    
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
            </div>
        );
    }

}


export default connect(undefined, undefined)(ReplayView);