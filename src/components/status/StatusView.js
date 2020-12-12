import React from 'react';
import { connect } from 'react-redux';
import FreezeView from "../common/FreezeView";
import {fetchStatus, getLogFilePath} from "../../actions/statusActions";
import PieGraph from "../common/PieGraph";

import "./StatusView.css";

class StatusView extends FreezeView {
    state = {
        status: null,
        diskThresholds: [80, 90],
        advanced: false
    };

    componentDidMount() {
        this.setFreezeOn();
        fetchStatus()
        .then(status => this.setState({status}))
        .catch(e => {
            console.log(e);
        })
        .then(() => this.setFreezeOff());
    }

    getLogs() {

    }

    renderDiskInfo(name, percent) {
        let color = "green";
        if (percent >= this.state.diskThresholds[1]) {
            color = "red";
        }
        else if (percent >= this.state.diskThresholds[0]) {
            color = "organge";
        }
        return (
            <div className="status-disk" key={`disk-${name}`}>
                <div className="status-disk-name">{name}</div>
                <div className="status-disk-pie">
                    <PieGraph height={100} width={100} xpadding={5} values={[percent, 100 - percent]} colors={[ color, "lightblue"]}/>
                </div>
                <div className="status-disk-value">{`${percent}%`}</div>
            </div>
        );
    }

    renderAllDiskInfo() {
        if (this.state.status == null) {
            return "";
        }
        const mountPaths = Object.keys(this.state.status.disksInfo);
        const res = [];
        for(let mountPath of mountPaths) {
            const disksInfo = this.state.status.disksInfo[mountPath];
            res.push(this.renderDiskInfo(mountPath, disksInfo.diskPercentUsage));
        }
        return res;
    }

    renderResourceInfo(name, info) {
        let color = "green";
        if (info.cpu >= this.state.diskThresholds[1]) {
            color = "red";
        }
        else if (info.cpu >= this.state.diskThresholds[0]) {
            color = "organge";
        }
        let memPercent= 100;
        if (info.freememory > 0) {
            memPercent = ((info.memory - info.freememory) / info.memory) * 100;
        }
        const cpu = Math.round(info.cpu * 100) / 100;
        return (
            <div className="status-resource-info">
                <div className="status-resource-name">{name}</div>
                <div className="status-cpu-pie">
                    <PieGraph height={100} width={100} xpadding={5} values={[info.cpu, 100 - info.cpu]} colors={[ color, "lightblue"]}/>
                </div>
                <div className="status-cpu-value">{`${cpu}%`}</div>
                <div className="status-mem-pie">
                    <PieGraph height={100} width={100} xpadding={5} values={[memPercent, 100 - memPercent]} colors={[ "red", "lightblue"]}/>
                </div>
                <div className="status-mem-value">{`${Math.round(info.memory / (1024 * 1024))}MB`}</div>
            </div>
        )
    }

    renderRessources() {
        if (this.state.status == null) {
            return "";
        }
        const res = [];
        const resourceNames = Object.keys(this.state.status.resourceInfo);
        for(let name of resourceNames) {
            res.push(this.renderResourceInfo(name, this.state.status.resourceInfo[name]));
        }
        return res;
    }

    renderContent() {

        return (
            <div className="gdnet-view">
                <div className="gdnet-title">Settings</div>
                <div className="status-view-container">
                    <div className="status-disks" >
                        {this.renderAllDiskInfo()}
                    </div>
                    <div className="status-resources">
                        {this.renderRessources()}
                    </div>
                    <div>
                        <form method="get" action={getLogFilePath()}>
                            <button type="submit">Get Logs</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}


export default connect(undefined, undefined)(StatusView);

