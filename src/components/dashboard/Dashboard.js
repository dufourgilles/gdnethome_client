import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { Col, Row } from "antd";
import { AutoSizer } from "react-virtualized";
import StatusLine from "./StatusLine";
import TitleBox from "./TitleBox";
import EventBox from "../common/EventBox";
import LineChart from "../common/LineChart";
import DataPointListEditor from "../common/DataPointListEditor";
import { getGroupByName } from "../../reducers/groupReducer";
import { getDatapointByID } from "../../reducers/datapointReducer";
import { executeAction } from "../../actions/dataPointCtlAction";
import PopupBox from "../common/PopupBox";
import DataPointSelect from "../common/DataPointSelect";
import WallSwitch from "./WallSwitch";
import "../common/LineChart.scss";

const STATUS_GROUPNAME = "dashboard_status";
const VALUES_GROUPNAME = "dashboard_values";

const { addEndpoint, removendpoint } = require("../../actions/groupActions");
const MAX_WIND_ENTRIES = 100;

class Dashboard extends Component {
  state = {
    openEditor: false,
    openPopupBox: false,
    popupBoxContent: null,
    editedChart: null,
    groupEdited: this.props.groups(STATUS_GROUPNAME),
    dpctl: true,
    leftValues: new Array(MAX_WIND_ENTRIES).fill(0),
    rightValues: new Array(MAX_WIND_ENTRIES).fill(0),
    leftDPID: "9.1.2",
    rightDPID: "9.1.0",
    leftTitle: "Wind Speed",
    rightTitle: "Lux",
  };

  updateCharts = () => {
    this.leftUpdate();
    this.rightUpdate();
    setTimeout(this.updateCharts, 1000);
  };

  leftUpdate = () => {
    const len =
      this.state.leftValues.length > MAX_WIND_ENTRIES
        ? MAX_WIND_ENTRIES
        : this.state.leftValues.length;
    const leftValues = this.state.leftValues.slice(
      this.state.leftValues.length - len,
      len
    );
    const leftDP = this.props.datapoints(this.state.leftDPID);
    if (leftDP == null) {
      return;
    }
    leftValues.push(leftDP.value == null ? 0 : leftDP.value);
    this.setState({ leftValues });
  };

  rightUpdate = () => {
    const len =
      this.state.rightValues.length > MAX_WIND_ENTRIES
        ? MAX_WIND_ENTRIES
        : this.state.rightValues.length;
    const rightValues = this.state.rightValues.slice(
      this.state.rightValues.length - len,
      len
    );
    const rightDP = this.props.datapoints(this.state.rightDPID);
    if (rightDP == null) {
      return;
    }

    rightValues.push(rightDP.value == null ? 0 : rightDP.value);
    this.setState({ rightValues });
  };

  editChart = (name) => {
    const dpid = this.state[`${name}DPID`];
    const content = (onChange) => {
      return (
        <DataPointSelect selection={{ datapoint: dpid }} onChange={onChange} />
      );
    };
    this.setState({
      popupBoxContent: content,
      openPopupBox: true,
      editedChart: name,
    });
  };

  chartDPSelect = (dpid) => {
    const name = this.state.editedChart;
    const dp = this.props.datapoints(dpid);
    localStorage.setItem(`${name}DPID`, dpid);
    localStorage.setItem(`${name}Title`, dp.name);
    this.setState({
      [`${name}Title`]: dp.name,
      [`${name}Values`]: [],
      [`${name}DPID`]: dpid,
      openPopupBox: false,
      editedChart: null,
      popupBoxContent: null,
    });
  };

  componentDidMount() {
    const leftDPID = localStorage.getItem("leftDPID") || this.state.leftDPID;
    const rightDPID = localStorage.getItem("rightDPID") || this.state.rightDPID;
    const leftTitle = localStorage.getItem("leftTitle") || this.state.leftTitle;
    const rightTitle =
      localStorage.getItem("rightTitle") || this.state.rightTitle;
    this.setState({ leftDPID, rightDPID, leftTitle, rightTitle });
    setTimeout(this.updateCharts, 1000);
  }

  selectDatapoint = (datapoint) => {
    return this.props
      .addEndpoint(this.state.groupEdited.name, datapoint.id)
      .then(() => {
        this.setState({
          groupEdited: this.props.groups(this.state.groupEdited.name),
        });
      })
      .catch((e) => {
        toastr.error("Error", e.message);
      });
  };

  unselectDatapoint = (datapoint) => {
    return this.props
      .removendpoint(this.state.groupEdited.name, datapoint.id)
      .catch((e) => {
        toastr.error("Error", e.message);
      })
      .then(() => {
        this.setState({
          groupEdited: this.props.groups(this.state.groupEdited.name),
        });
      });
  };

  // formatStatus = (status) => {
  //   if (status === 1) {
  //     return <FontAwesomeIcon icon={faLightbulb} style={{ color: "yellow" }} />;
  //   } else {
  //     //RegularFA.faLightbulb
  //     return <FontAwesomeIcon icon={RegularFA.faLightbulb} />;
  //   }
  // };

  render() {
    const { executeAction, statusGroup, valuesGroup } = this.props;
    const {
      leftTitle,
      leftValues,
      rightTitle,
      rightValues,
      openPopupBox,
      popupBoxContent,
      openEditor,
      groupEdited,
      dpctl,
    } = this.state;
    if (statusGroup == null) {
      console.log("no status group");
      // TODO NO CONTENT
      return;
    }
    // const statusLines = this.props.statusGroup.elements.map((dpctl) => {
    //   const toggleSwitch = () => {
    //     this.props.executeAction(dpctl, "toggle");
    //   };
    //   return (
    //     <StatusLine
    //       key={dpctl.id}
    //       name={dpctl.name}
    //       status={dpctl.value == null ? "unknown" : dpctl.value}
    //       onClick={toggleSwitch}
    //       formatStatus={this.formatStatus}
    //     />
    //   );
    // });

    const valuesLines = valuesGroup.elements.map((dp) => {
      return (
        <StatusLine
          key={dp.id}
          name={dp.name}
          status={dp.value == null ? "unknown" : dp.value}
        />
      );
    });

    const openStatusBoxEditor = () => {
      this.setState({
        openEditor: true,
        groupEdited: statusGroup,
        dpctl: true,
      });
    };
    const openValuesBoxEditor = () => {
      this.setState({
        openEditor: true,
        groupEdited: valuesGroup,
        dpctl: false,
      });
    };
    const closeDataPointEditor = () => this.setState({ openEditor: false });
    const editLeftChart = () => {
      return this.editChart("left");
    };
    const editRightChart = () => {
      return this.editChart("right");
    };
    return (
      <>
        <Row gutter={[8, 8]}>
          <Col xs={24} lg={12} onClick={editLeftChart}>
            <AutoSizer disableHeight>
              {({ width }) => (
                <LineChart
                  title={leftTitle}
                  height={100}
                  width={width}
                  interval={10}
                  maxVal={15}
                  minVal={0}
                  values={leftValues}
                />
              )}
            </AutoSizer>
          </Col>
          <Col xs={24} lg={12} onClick={editRightChart}>
            <AutoSizer disableHeight>
              {({ width }) => (
                <LineChart
                  title={rightTitle}
                  height={100}
                  width={width}
                  interval={10}
                  maxVal={150000}
                  minVal={0}
                  values={rightValues}
                />
              )}
            </AutoSizer>
          </Col>
        </Row>
        <Row gutter={[8, 8]}>
          <Col xs={24} lg={12}>
            <TitleBox
              title="Status"
              edit={openStatusBoxEditor}
              content={statusGroup.elements.map(({ id, name, value }) => (
                <WallSwitch
                  key={id}
                  name={name}
                  value={value == null ? 0 : value}
                  onClick={() => executeAction(id, "toggle")}
                />
              ))}
            />
          </Col>
          <Col xs={24} lg={12}>
            <TitleBox
              title="Values"
              edit={openValuesBoxEditor}
              content={valuesLines}
            />
          </Col>
        </Row>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <EventBox />
          </Col>
        </Row>
        <PopupBox
          title="Select Datapoint to monitor"
          visible={openPopupBox}
          content={popupBoxContent}
          onConfirm={this.chartDPSelect}
          onExit={() => this.setState({ openPopupBox: false })}
        />
        <DataPointListEditor
          visible={openEditor}
          close={closeDataPointEditor}
          group={groupEdited}
          select={this.selectDatapoint}
          unselect={this.unselectDatapoint}
          dpctl={dpctl}
        />
      </>
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
  datapoints: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  statusGroup: getGroupByName(state)(STATUS_GROUPNAME),
  valuesGroup: getGroupByName(state)(VALUES_GROUPNAME),
  groups: getGroupByName(state),
  datapoints: getDatapointByID(state),
});

const mapDispatchToProps = (dispatch) => ({
  addEndpoint: addEndpoint(dispatch),
  executeAction: executeAction(dispatch),
  removendpoint: removendpoint(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
