import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getDataPointCtlByID } from "../../reducers/dataPointCtlReducer";
import DatapointParameter from "../datapoint/DatapointParameter";
import { Form, Input, Select } from "antd";

class ActionParameter extends Component {
  getValue(paramName, data) {
    const pathName = paramName.split(".");
    let param = data;
    let i = 0;
    for (; i < pathName.length; i++) {
      if (param == null) {
        return "";
      }
      param = param[pathName[i]];
    }
    return param;
  }

  render() {
    const { name, parameterInfo, data, dataPointCtls } = this.props;

    if (typeof parameterInfo === "string") {
      if (parameterInfo === "DataPointCtlID") {
        const option = dpctl => {
          return (
            <option key={dpctl.id} value={dpctl.id}>
              {dpctl.name}
            </option>
          );
        };
        const handleChange = (key, value) => {
          this.props.onChange(key, value.id);
        };
        return (
            <DatapointParameter
              key="triggerID"
              onChange={handleChange}
              label={name}
              name={name}
              data={data}
              list={dataPointCtls}
              match="id"
              display="name"
              filterKeys={["id", "name"]}
            />
        );
      } else {
        const handleChange = value => {
          if (parameterInfo === "number") {
            value = Number(value);
          } else if (parameterInfo === "array") {
            try {
              value = value.split(",");
            } catch (e) {
              console.log(e);
              return;
            }
          }
          this.props.onChange(name, value);
        };
        let value = this.getValue(name, data);
        if (parameterInfo === "array") {
          value = value.join(",");
        }
        return (
          <Form.Item label={name}>
            <Input name={name} value={value} onChange={handleChange} />
          </Form.Item>
        );
      }
    } else if (parameterInfo.value === "enum") {
      const fullParamName = `${name}.value`;
      const value = this.getValue(fullParamName, data);
      const _handleChange = value => {
        this.props.onChange(fullParamName, value);
      };
      const option = item => ({ value: item, label: item });
      return (
        <Form.Item label={fullParamName} name={name}>
          <Select
            name={name}
            value={value}
            onChange={_handleChange}
            options={parameterInfo["_enum"].map(option)}
          />
        </Form.Item>
      );
    } else {
      const parameterInfoKeys = Object.keys(parameterInfo);
      const renderedParameters = [];
      parameterInfoKeys.map(paramName => {
        if (
          paramName == null ||
          paramName.length === 0 ||
          paramName[0] === "_"
        ) {
          return null;
        }
        const fullParamName = `${name}.${paramName}`;
        renderedParameters.push(
          <ActionParameter
            key={fullParamName}
            name={fullParamName}
            parameterInfo={parameterInfo[paramName]}
            data={data}
            onChange={this.props.onChange}
          />
        );
        return null;
      });
      return <div className="action-parameter-info">{renderedParameters}</div>;
    }
  }
}

ActionParameter.propTypes = {
  name: PropTypes.string.isRequired,
  parameterInfo: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  dataPointCtls: state.datapointctls.items,
  getDataPointCtlByID: getDataPointCtlByID(state)
});

export default connect(mapStateToProps, undefined)(ActionParameter);
