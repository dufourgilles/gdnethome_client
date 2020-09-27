import React from "react";
import { connect } from "react-redux";
import DatapointList from "../common/DatapointList";
import DatapointEditor from "./DatapointEditor";
import { getEmptyDatapoint } from "../../reducers/datapointReducer";
import {
  deleteAllDatapoints,
  uploadFile
} from "../../actions/datapointActions";
import PropTypes from "prop-types";
import { toastr } from "react-redux-toastr";
import PopupBox from "../common/PopupBox";
import { Button, Col, Row, Typography } from "antd";

class DatapointView extends React.Component {
  state = {
    selectedDatapoint: getEmptyDatapoint(),
    openPopupBox: false,
    fileName: "",
    file: null
  };

  selectDatapoint = datapoint => {
    this.setState({ selectedDatapoint: datapoint });
  };

  newDataPoint = () => {
    this.setState({
      selectedDatapoint: getEmptyDatapoint()
    });
  };

  openFileSelect = () => {
    this.setState({ openPopupBox: true });
  };

  handleDeleteAll = () => {
    this.props
      .deleteAllDatapoints()
      .catch(e => {
        toastr.error("Error", e.message);
      })
      .then(() => {
        toastr.success("Success", "Delete All");
      });
  };

  uploadFile = () => {
    // DO Something with the file
    this.setState({ openPopupBox: false });
    var reader = new FileReader();
    reader.onload = event => {
      return this.props.uploadFile(reader.result).catch(e => {
        console.log(e);
      });
    };
    reader.onerror = e => {
      console.log(e);
    };
    console.log(this.state.fileName);
    reader.readAsText(this.state.file, "UTF-8");
  };

  getPopupBoxContent = () => {
    const handleFileChange = event => {
      event.stopPropagation();
      event.preventDefault();
      if (event.target.files.length === 0) {
        return;
      }
      const f = event.target.files[0];
      this.setState({ fileName: event.target.value, file: f });
    };
    return (
      <input
        type="file"
        name="filename"
        value={this.state.fileName}
        onChange={handleFileChange}
      />
    );
  };

  render() {
    return (
      <>
        <Typography>
          <Typography.Title level={3}>DataPoints</Typography.Title>
        </Typography>
        <Row>
          <Button onClick={this.openFileSelect}>Upload ETS5 File</Button>
          <Button onClick={this.handleDeleteAll}>Delete ALL Datapoints</Button>
        </Row>
        <Row>
          <Col span={8}>
            <DatapointList
              datapoints={this.props.datapoints}
              select={this.selectDatapoint}
            />
          </Col>
          <Col span={16}>
            <DatapointEditor
              datapoint={this.state.selectedDatapoint}
              setFreeze={this.setFreeze}
              freeze={this.state.freeOn}
              newDataPoint={this.newDataPoint}
            />
          </Col>
        </Row>
        <PopupBox
          visible={this.state.openPopupBox}
          title="Seleft ETS5 file"
          content={this.getPopupBoxContent}
          onConfirm={this.uploadFile}
          onExit={() => this.setState({ openPopupBox: false })}
        />
      </>
    );
  }
}

DatapointView.propTypes = {
  deleteAllDatapoints: PropTypes.func.isRequired,
  datapoints: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  datapoints: state.datapoints.items
});

const mapDispatchToProps = dispatch => {
  return {
    deleteAllDatapoints: deleteAllDatapoints(dispatch),
    uploadFile: uploadFile(dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DatapointView);
