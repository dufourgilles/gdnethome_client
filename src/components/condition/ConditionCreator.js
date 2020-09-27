import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { toastr } from "react-redux-toastr";
import { Button, Form } from "antd";
import DatapointParameter from "../datapoint/DatapointParameter";
import {
  fetchConditionTypes,
  createNewCondition,
  updateCondition
} from "../../actions/conditionActions";

class ConditionCreator extends React.Component {
  state = {
    conditionTypes: [],
    condition: this.props.condition,
    conditionLength: this.props.condition.conditionIDs
      ? this.props.condition.conditionIDs.length
      : 1
  };

  componentWillReceiveProps(newProps) {
    if (newProps.condition.id !== this.props.condition.id) {
      this.setState({
        condition: newProps.condition,
        conditionLength:
          newProps.condition.conditionIDs.length > 0
            ? newProps.condition.conditionIDs.length
            : 1
      });
    }
  }

  componentDidMount() {
    fetchConditionTypes().then(conditionTypes => {
      this.setState({ conditionTypes });
    });
  }

  handleValueChange = (key, value, index) => {
    const condition = Object.assign({}, this.state.condition);
    let conditionLength = this.state.conditionLength;
    if (key === "triggerEventID") {
      condition[key] = value.id == null ? value : value.id;
    } else if (key === "operator") {
      if (
        value === "AND" ||
        value === "OR" ||
        value === "NOT" ||
        value.indexOf("COUNT") > 0
      ) {
        condition.triggerEventID = "";
        if (value === "NOT" || value.indexOf("COUNT") > 0) {
          conditionLength = 1;
          if (condition.conditionIDs.length > 1) {
            condition.conditionIDs = condition.conditionIDs.slice(0, 1);
          }
        } else {
          conditionLength =
            condition.conditionIDs.length < 2
              ? 2
              : condition.conditionIDs.length;
        }
      } else {
        condition.conditionIDs = [];
        conditionLength = 0;
      }
      condition.operator = value;
    } else if (index == null) {
      condition[key] = value.id == null ? value : value.id;
    } else {
      condition[key][index] = value.id == null ? value : value.id;
    }
    this.setState({ condition, conditionLength });
  };

  renderConditionParameters() {
    const condition = this.state.condition;
    const conditions = this.props.conditions;

    if (condition.operator === "AND" || condition.operator === "OR") {
      const renderCondition = index => {
        const condChanged = (key, value) => {
          this.handleValueChange(key, value, index);
        };
        return (
          <DatapointParameter
            key={`cond${index}`}
            onChange={condChanged}
            label={`Condition ${index + 1}`}
            name="conditionIDs"
            data={condition}
            list={conditions}
            filterKeys={["id"]}
            display={"id"}
            match={"id"}
            index={index}
          />
        );
      };
      const renderedConditions = [];
      for (let i = 0; i < this.state.conditionLength; i++) {
        renderedConditions.push(renderCondition(i));
      }
      return <>{renderedConditions}</>;
    } else if (
      condition.operator === "NOT" ||
      condition.operator.indexOf("COUNT") > 0
    ) {
      let paramValue = "";
      if (condition.operator.indexOf("COUNT") > 0) {
        paramValue = (
          <DatapointParameter
            key="triggerValue"
            validator={this.validateID}
            onChange={this.handleValueChange}
            editable={true}
            label="Trigger Value"
            name="triggerValue"
            data={condition}
          />
        );
      }
      return (
        <>
          <DatapointParameter
            key="cond1"
            onChange={this.handleValueChange}
            label="Condition"
            name="conditionIDs"
            data={condition}
            list={conditions}
            filterKeys={["id"]}
            display={"id"}
            match={"id"}
            index={0}
          />
          {paramValue}
        </>
      );
    } else {
      const displayTriggerName = item => {
        return `${item.name}(${item.id})`;
      };
      return (
        <>
          <DatapointParameter
            key="triggerID"
            onChange={this.handleValueChange}
            label="trigger"
            name="triggerEventID"
            data={condition}
            list={this.props.triggers}
            display={displayTriggerName}
            match="id"
            filterKeys={["id", "name"]}
          />
          <DatapointParameter
            key="triggerValue"
            validator={this.validateID}
            onChange={this.handleValueChange}
            editable={true}
            label="Trigger Value"
            name="triggerValue"
            data={condition}
          />
        </>
      );
    }
  }

  render() {
    const condition = this.state.condition;
    const conditionParameters = this.renderConditionParameters();
    const saveFunc = () => {
      let createOrUpdate;
      if (this.props.condition.id === "") {
        createOrUpdate = this.props.createNewCondition(condition);
      } else {
        createOrUpdate = this.props.updateCondition(condition);
      }
      createOrUpdate
        .then(() => toastr.success("Success", "Save OK"))
        .catch(e => toastr.error("Error", e.message))
    };

    const cancelFunc = () => {
      this.setState({ condition: this.props.condition });
    };

    const newFunc = () => {
      if (this.props.reset) {
        this.props.reset();
      }
    };

    const addConditionFunc = () => {
      const conditionLength = this.state.conditionLength + 1;
      this.setState({ conditionLength });
    };

    const op = condition.operator;
    const addConditionBtn =
      op === "AND" ||
      op === "OR" ||
      (op === "NOT" && this.state.conditionLength < 1) ? (
        <Button onClick={addConditionFunc}>more</Button>
      ) : (
        ""
      );

    return (
      <Form labelCol={{ span: 8 }} wrapperCol={{ span: 8 }}>
        <Form.Item wrapperCol={{ offset: 8 }}>
          <Button type="primary" onClick={saveFunc}>
            Save
          </Button>
          <Button onClick={newFunc}>New</Button>
          <Button onClick={cancelFunc}>Cancel</Button>
          {addConditionBtn}
        </Form.Item>
        <DatapointParameter
          key="id"
          validator={this.validateID}
          onChange={this.handleValueChange}
          editable={this.props.condition.id === ""}
          label="id"
          name="id"
          data={condition}
        />
        <DatapointParameter
          key="operator"
          onChange={this.handleValueChange}
          label="operator"
          name="operator"
          data={condition}
          list={this.state.conditionTypes}
          display="id"
          match="id"
        />
        <DatapointParameter
          key="emitChangesOnly"
          onChange={this.handleValueChange}
          label="Emit Only Changes"
          name="emitChangesOnly"
          data={condition}
          list={[
            { id: "true", value: true },
            { id: "false", value: false }
          ]}
          display="id"
          match="value"
        />
        {conditionParameters}
      </Form>
    );
  }
}

ConditionCreator.propTypes = {
  triggers: PropTypes.array.isRequired,
  createNewCondition: PropTypes.func.isRequired,
  updateCondition: PropTypes.func.isRequired,
  condition: PropTypes.object.isRequired,
  conditions: PropTypes.array.isRequired,
  reset: PropTypes.func
};

const mapStateToProps = state => ({
  triggers: state.triggers.items,
  conditions: state.conditions.items
});

const mapDispatchToProps = dispatch => {
  return {
    createNewCondition: createNewCondition(dispatch),
    updateCondition: updateCondition(dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConditionCreator);
