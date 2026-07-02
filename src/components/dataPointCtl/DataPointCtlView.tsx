// @ts-nocheck
import React from 'react';
import FreezeView from "../common/FreezeView";
import DatapointList from '../common/DatapointList';
import DataPointCtlEditor from './DataPointCtlEditor';
import { getEmptyDatapointCtl } from "../../hooks/domain";
import PropTypes from "prop-types";
import { toastr } from "../../hooks/toastr";
import './DataPointViewCtl.scss';
import { useDatapointCtl } from "../../hooks/useDatapointCtl";

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
            <div className="gdnet-view">
                <div className="gdnet-container-header">
                    <div>
                        <div className="gdnet-title">DataPointCtl</div>
                        <div className="gdnet-subtitle">{this.props.dataPointCtls.length} controllers configured</div>
                    </div>
                </div>
                <div className={`gdnet-container ${this.isFreezed() === true ? "blurred" : ""}`}>
                    <div className="gdnet-container-panel datapointctl-list-panel">
                        <div className="gddnet-container-header">
                            <span>Controllers</span>
                        </div>
                        <DatapointList datapoints={this.props.dataPointCtls} select={this.selectDataPointCtl}/>
                    </div>
                    <div className="gdnet-container-panel">
                        <div className="gddnet-container-header">
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

export default function DataPointCtlViewQuery() {
    const datapointCtl = useDatapointCtl();
    return (
        <DataPointCtlView
            dataPointCtls={datapointCtl.datapointCtls.data || []}
            deleteAllDataPointCtls={() => datapointCtl.deleteAll.mutateAsync()}
        />
    );
}
