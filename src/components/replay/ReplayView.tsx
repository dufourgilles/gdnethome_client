// @ts-nocheck
import React from 'react';
import FreezeView from "../common/FreezeView";
import DatapointParameter from "../datapoint/DatapointParameter";
import { getReplayFile, useReplay } from "../../hooks/useReplay";
import { toastr } from "../../hooks/toastr";
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
                    <div className="gdnet-container-header">
                        <div>
                            <div className="gdnet-title">Replay</div>
                        </div>
                    </div>
                </div>
            );
        }
        const saveFunc = () => {
            this.setFreezeOn();
            this.props.updateReplayInfo(this.state.replayInfo)
                .then(() => toastr.success('Success', "Save OK"))
                .catch(e => toastr.error('Error', e.message))
                .then(() => this.setFreezeOff());
        };

        const cancelFunc = () => {
            this.setState({replayInfo: this.props.replayInfo});
        };

        return (
            <div className="gdnet-view">
                <div className="gdnet-container-header">
                    <div>
                        <div className="gdnet-title">Replay</div>
                    </div>
                </div>

                <div className="gdnet-block">
                    <div className="row">
                        <button className="gdnet-button" onClick={saveFunc}>Save</button>
                        <button className="gdnet-button" onClick={cancelFunc}>Cancel</button>
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
                <div className="gdnet-container-panel gdnet-log-panel">
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

export default function ReplayViewQuery() {
    const replay = useReplay();
    return (
        <ReplayView
            replayInfo={replay.info.data || {}}
            replayFiles={replay.files.data || []}
            updateReplayInfo={value => replay.update.mutateAsync(value)}
        />
    );
}
