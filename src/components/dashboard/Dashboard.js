import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import StatusLine from "./StatusLine";
import TitleBox from './TitleBox';
import EventBox from '../common/EventBox';
import LineChart from '../common/LineChart';

import DataPointListEditor from '../common/DataPointListEditor';
import {getGroupByName} from '../../reducers/groupReducer';
import {getDatapointByID} from '../../reducers/datapointReducer';
import { toastr } from "react-redux-toastr";
import { executeAction } from "../../actions/dataPointCtlAction";

import './Dashboard.css';
import '../common/LineChart.css';

const STATUS_GROUPNAME = "dashboard_status";
const VALUES_GROUPNAME = "dashboard_values";

const {addEndpoint, removendpoint} = require("../../actions/groupActions");
const MAX_WIND_ENTRIES = 100;

class Dashboard extends Component {
    state = {
        openEditor: false,
        groupEdited: this.props.groups(STATUS_GROUPNAME),
        dpctl: true,
        windValues: [],
        luxValues: []
    };

    updateCharts = () => {
        this.windUpdate();
        this.luxUpdate();
        setTimeout(this.updateCharts, 1000);
    };

    windUpdate = () => {
        const len = this.state.windValues.length > MAX_WIND_ENTRIES ? MAX_WIND_ENTRIES : this.state.windValues.length;
        const windValues = this.state.windValues.slice(
            this.state.windValues.length - len,
            len
            );
        const windDP = this.props.datapoints("9.1.2");
        if (windDP == null) { return; }
        windValues.push(windDP.value);
        this.setState({windValues});
    };

    luxUpdate = () => {
        const len = this.state.luxValues.length > MAX_WIND_ENTRIES ? MAX_WIND_ENTRIES : this.state.luxValues.length;
        const luxValues = this.state.luxValues.slice(
            this.state.luxValues.length - len,
            len
        );
        const luxDP = this.props.datapoints("9.1.0");
        if (luxDP == null) { return; }
        luxValues.push(luxDP.value);
        this.setState({luxValues});
    };

    componentDidMount() {
        setTimeout(this.updateCharts, 1000);
    }

    selectDatapoint = (datapoint) => {
        return this.props.addEndpoint(this.state.groupEdited.name, datapoint.id)
            .then(() => {
                this.setState({groupEdited: this.props.groups(this.state.groupEdited.name)});
            })
            .catch(e => {
                toastr.error('Error', e.message);
            });
    };

    unselectDatapoint = (datapoint) => {
        return this.props.removendpoint(this.state.groupEdited.name, datapoint.id)
            .catch(e => {
                toastr.error('Error', e.message);
            })
            .then(() => {
                this.setState({groupEdited: this.props.groups(this.state.groupEdited.name)});
            });
    };

    render() {
        if (this.props.statusGroup == null) {
            console.log("no status group");
            return;
        }
        const statusLines = this.props.statusGroup.elements.map(dpctl => {
            const toggleSwitch = () => {
                this.props.executeAction(dpctl, "toggle");
            }
            return <StatusLine key={dpctl.id} name={dpctl.name} status={dpctl.value == null ? "unknown" : dpctl.value} onClick={toggleSwitch} />
        });

        const valuesLines = this.props.valuesGroup.elements.map(dp => {
            return <StatusLine key={dp.id} name={dp.name} status={dp.value == null ? "unknown" : dp.value}/>
        });

        const openStatusBoxEditor = () => {
            this.setState({openEditor: true, groupEdited: this.props.statusGroup, dpctl:true});
        };
        const openValuesBoxEditor = () => {
            this.setState({openEditor: true, groupEdited: this.props.valuesGroup, dpctl: false});
        };
        const closeDataPointEditor = () => this.setState({openEditor: false});

        const width = Math.round(0.49 * window.innerWidth);
        return (
            <div className="dashboard">
                <div className="dashboard-charts">
                    <div style={{width: width, overflow: "hidden"}}>
                        <LineChart title="Wind Speed" height={100} width={width - 15} interval={10} maxVal={15} minVal={0} values={this.state.windValues}/>
                    </div>
                    <div style={{width: width}}>
                        <LineChart title="Lux" height={100} width={width - 15} interval={10} maxVal={150000} minVal={0} values={this.state.luxValues}/>
                    </div>
                </div>
                <div className="dashboard-box">
                    <TitleBox
                        title="Status"
                        edit={openStatusBoxEditor}
                        content={statusLines}
                    />
                    <TitleBox
                        title="Values"
                        edit={openValuesBoxEditor}
                        content={valuesLines}
                    />
                </div>
                <EventBox/>
                <DataPointListEditor
                    visible={this.state.openEditor}
                    close={closeDataPointEditor}
                    group={this.state.groupEdited}
                    select={this.selectDatapoint}
                    unselect={this.unselectDatapoint}
                    dpctl={this.state.dpctl}
                />
            </div>
        );
    }
}

Dashboard.propTypes = {
    statusGroup: PropTypes.object.isRequired,
    valuesGroup: PropTypes.object.isRequired,
    addEndpoint: PropTypes.func.isRequired,
    removendpoint: PropTypes.func.isRequired,
    executeAction: PropTypes.func.isRequired,
    groups: PropTypes.func.isRequired,
    datapoints: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    statusGroup: getGroupByName(state)(STATUS_GROUPNAME),
    valuesGroup: getGroupByName(state)(VALUES_GROUPNAME),
    groups: getGroupByName(state),
    datapoints: getDatapointByID(state)
});

const mapDispatchToProps = dispatch => ({
  addEndpoint: addEndpoint(dispatch),
  executeAction: executeAction(dispatch),
  removendpoint: removendpoint(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);


