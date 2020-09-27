import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Input } from "antd";

import { executeAction } from "../../actions/dataPointCtlAction";

/**
 * @typedef {{
 *     name: string,
 *     parameterType: null|ParameterType
 * }} Action
 */

/**
 * @typedef {{
 *     type: string,
 *     min: number,
 *     max: number,
 *     default: number
 * }} ParameterType
 */

class DataPointCtlAction extends Component {
  state = {
    value:
      this.props.action.parameterType == null
        ? null
        : this.props.action.parameterType.default
  };

  renderNoParamAction = action => {
    const actionClick = () => {
      this.props.executeAction(this.props.dataPointCtl, action.name);
    };

    return <Button onClick={actionClick}>{action.name}</Button>;
  };

  renderIntegerAction = action => {
    const actionClick = () => {
      this.props.executeAction(this.props.dataPointCtl, action.name, {
        value: this.state.value
      });
    };

    const handleValueChange = e => {
      const value = e.target.value;
      if (
        value < action.parameterType.min ||
        value > action.parameterType.max
      ) {
        return;
      }
      this.setState({ value });
    };

    return (
      <>
        <Input
          name={`${this.props.dataPointCtl.id}-${action}`}
          value={this.state.value}
          onChange={handleValueChange}
        />
        <Button key={action} onClick={actionClick}>
          {action.name}
        </Button>
      </>
    );
  };

  render() {
    const action = this.props.action;

    if (action.parameterType == null) {
      return this.renderNoParamAction(action);
    } else if (action.parameterType.type === "integer") {
      return this.renderIntegerAction(action);
    }
  }
}

DataPointCtlAction.propTypes = {
  dataPointCtl: PropTypes.object.isRequired,
  executeAction: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => {
  return {
    executeAction: executeAction(dispatch)
  };
};
export default connect(null, mapDispatchToProps)(DataPointCtlAction);
