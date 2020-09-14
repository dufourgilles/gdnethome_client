import React, { Component } from "react";
import PropTypes from "prop-types";
import TextSelect from "../common/TextSelect";
import { Form, Input, Select } from "antd";

export default class DatapointParameter extends Component {
  state = {
    disableFilter: false
  };

  handleFilterSelect = e => {
    this.setState({ disableFilter: !this.state.disableFilter });
  };

  valueChanged = (value) => {
    if (this.props.onChange != null) {
      this.props.onChange(this.props.name, value, this.props.index);
    }
  };

  getValue() {
    if (this.props.index != null) {
      const table = this.props.data[this.props.name];
      const index = Number(this.props.index);
      if (isNaN(index) || table == null || index < 0 || index > table.length) {
        return "";
      }
      return table[index];
    } else {
      return this.props.data[this.props.name];
    }
  }

  renderEditable = valid => {
    let invalid;
    const value = this.getValue();
    if (!valid || value == null) {
      invalid = <div className="datapoint-parameter-invalid"></div>;
    } else {
      invalid = <div className="datapoint-parameter-valid"></div>;
    }
    return (
      <>
        <Input
          name={this.props.name}
          onChange={this.valueChanged}
          value={value}
          onBlur={this.props.onFocusOut}
        />
        {invalid}
      </>
    );
  };

  renderList = () => {
    const option = item => {
      if (item == null) {
        console.log(new Error("Error null item"), "\n", this.props, this.state);
        return "";
      }
      let displayName;
      if (typeof this.props.display === "function") {
        displayName = this.props.display(item);
      } else {
        displayName = item[this.props.display];
      }
      return {label: displayName, value: item[this.props.match]}
    };
    let checkBox;
    if (this.props.filterKeys) {
      checkBox = (
        <input
          type="checkbox"
          name="disableFilter"
          style={{ marginTop: "7px", marginLeft: "7px" }}
          onChange={this.handleFilterSelect}
          onBlur={this.props.onFocusOut}
          checked
        />
      );
    }
    const value = this.getValue() != null ? this.getValue() : "";
    return (
      <>
        <Select
          name={this.props.name}
          value={value}
          onChange={this.valueChanged}
          onBlur={this.props.onFocusOut}
          options={this.props.list.map(option)}
        />
        {checkBox}
      </>
    );
  };

  renderTextList = () => {
    return (
      <>
        <TextSelect
          data={this.props.data}
          name={this.props.name}
          list={this.props.list}
          onChange={this.valueChanged}
          onFocusOut={this.props.onFocusOut}
          display={this.props.display}
          match={this.props.match}
          index={this.props.index}
          filterKeys={this.props.filterKeys}
        />
        <input
          type="checkbox"
          name="disableFilter"
          style={{ marginTop: "7px", marginLeft: "7px" }}
          onChange={this.handleFilterSelect}
        />
      </>
    );
  };

  render() {
    const valueLine = () => {
      let valid = true;
      if (this.props.validator) {
        valid = this.props.validator(this.props.data[this.props.name]);
      }
      if (this.props.editable) {
        return this.renderEditable(valid);
      } else if (this.props.filterKeys && this.state.disableFilter === false) {
        return this.renderTextList();
      } else if (this.props.list) {
        return this.renderList();
      } else {
        return (
          <Input disabled={false} value={this.props.data[this.props.name]} />
        );
      }
    };
    return (
      <Form.Item label={this.props.label} name={this.props.name}>
        {valueLine()}
      </Form.Item>
    );
  }
}

DatapointParameter.defaultProps = {
  required: false
};

DatapointParameter.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object.isRequired,
  editable: PropTypes.bool,
  index: PropTypes.number,
  label: PropTypes.string.isRequired,
  name: PropTypes.string,
  filterKeys: PropTypes.array,
  match: PropTypes.string,
  display: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  list: PropTypes.array,
  validator: PropTypes.func,
  onChange: PropTypes.func,
  onFocusOut: PropTypes.func,
  required: PropTypes.bool
};
