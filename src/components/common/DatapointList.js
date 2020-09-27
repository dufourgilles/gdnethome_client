import React, { Component } from "react";
import PropTypes from "prop-types";
import { Input, List } from "antd";
import { SearchOutlined } from "@ant-design/icons";

class DatapointList extends Component {
  state = {
    filter: ""
  };

  setFilterList = e => {
    this.setState({ filter: e.target.value });
  };

  filterList = dp => {
    const filter = this.state.filter;
    if (filter.length === 0) return true;
    try {
      const res =
        dp.name.indexOf(filter) >= 0 ||
        dp.id.indexOf(filter) >= 0 ||
        (dp.description != null && dp.description.indexOf(filter) >= 0) ||
        (dp.statusReaderID != null && dp.statusReaderID.indexOf(filter) >= 0) ||
        (dp.commandWriterID != null && dp.commandWriterID.indexOf(filter) >= 0);
      return res;
    } catch (e) {
      console.log(dp, e);
    }
    return false;
  };

  render() {
    if (this.props.datapoints == null) {
      console.log("no datapoints");
      return;
    }
    const datapoints = this.props.datapoints;

    return (
      <List
        header={
          <Input
            name="datapoint-filter"
            prefix={<SearchOutlined />}
            value={this.state.filter}
            onChange={this.setFilterList}
          />
        }
        dataSource={datapoints.filter(this.filterList)}
        renderItem={datapoint => {
          if (this.props.format != null) {
            return this.props.format(datapoint);
          } else {
            const handleClick = () => {
              if (this.props.select) {
                this.props.select(datapoint);
              }
            };
            return (
              <List.Item onClick={handleClick}>
                <List.Item.Meta
                  title={datapoint.id}
                  description={datapoint.name}
                />
              </List.Item>
            );
          }
        }}
      />
    );
  }
}

DatapointList.propTypes = {
  datapoints: PropTypes.array.isRequired,
  select: PropTypes.func,
  format: PropTypes.func
};

export default DatapointList;
