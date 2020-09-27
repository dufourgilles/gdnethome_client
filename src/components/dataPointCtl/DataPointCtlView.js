import React from "react";
import { connect } from "react-redux";
import DatapointList from "../common/DatapointList";
import DataPointCtlEditor from "./DataPointCtlEditor";
import { getEmptyDatapointCtl } from "../../reducers/dataPointCtlReducer";
import { deleteAllDataPointCtls } from "../../actions/dataPointCtlAction";
import PropTypes from "prop-types";
import { toastr } from "react-redux-toastr";
import { Button, Col, Row, Typography } from "antd";

class DataPointCtlView extends React.Component {
  state = {
    selectedDataPointCtl: getEmptyDatapointCtl()
  };

  selectDataPointCtl = dataPointCtl => {
    this.setState({ selectedDataPointCtl: dataPointCtl });
  };

  newDataPointCtl = () => {
    this.setState({ selectedDataPointCtl: getEmptyDatapointCtl() });
  };

  handleDeleteAll = () => {
    this.props
      .deleteAllDataPointCtls()
      .catch(e => {
        toastr.error("Error", e.message);
      })
      .then(() => {
        toastr.success("Success", "Delete All");
      });
  };

  render() {
    return (
      <>
        <Typography>
          <Typography.Title level={3}>DataPointCtl</Typography.Title>
        </Typography>
        <Row>
          <Button onClick={this.handleDeleteAll}>Delete DP Controllers</Button>
        </Row>
        <Row>
          <Col span={8}>
            <DatapointList
              datapoints={this.props.dataPointCtls}
              select={this.selectDataPointCtl}
            />
          </Col>
          <Col span={16}>
            <DataPointCtlEditor
              dataPointCtl={this.state.selectedDataPointCtl}
              newDataPointCtl={this.newDataPointCtl}
            />
          </Col>
        </Row>
      </>
    );
  }
}

DataPointCtlView.propTypes = {
  deleteAllDataPointCtls: PropTypes.func.isRequired,
  dataPointCtls: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  dataPointCtls: state.datapointctls.items
});

const mapDispatchToProps = dispatch => {
  return {
    deleteAllDataPointCtls: deleteAllDataPointCtls(dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataPointCtlView);
