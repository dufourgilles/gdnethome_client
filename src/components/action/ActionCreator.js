import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useQuery } from "react-query";
import {
  fetchActionTypes,
  createNewAction,
  updateAction
} from "../../actions/actionActions";
import ActionParameters from "./ActionParameters";
import DatapointParameter from "../datapoint/DatapointParameter";
import { getEmptyAction } from "../../reducers/actionReducer";
import { getActionTypeIndex, getActionTypeDefaultParameters } from "./common";
import PropTypes from "prop-types";
import { toastr } from "react-redux-toastr";
import { Button, Form, Switch } from "antd";

const ActionCreator = props => {
  const [actionTypes, setActionTypes] = useState([]);
  const [advanced, setAdvanced] = useState(false);
  const [action, setAction] = useState(
    props.action == null ? getEmptyAction() : props.action
  );
  const { isLoading, error, data } = useQuery("actionTypes", () => {
    return fetchActionTypes().then(actionTypes => {
      if (props.action == null) {
        action.parameters = getActionTypeDefaultParameters(
          actionTypes,
          action.type
        );
      }
      setAction(action);
      setActionTypes(actionTypes);
    });
  });

  const handleValueChange = (key, value) => {
    if (key === "type" && action.type !== value) {
      action.parameters = getActionTypeDefaultParameters(actionTypes, value);
    } else if (key === "triggerEventID" && value === "none") {
      value = "";
    } else if (key === "enable") {
      value = String(value).toLowerCase() === "true";
    }
    action[key] = value.id == null ? value : value.id;
    setAction(action);
  };

  const handleParameterChange = parameters => {
    action.parameters = parameters;
    setAction(action);
  };

  const validateID = () => true; // FIXME: check if ID already exists

  const toggleAdvancedParams = () => {
    setAdvanced(!advanced);
  };

  const cancelFunc = () => {
    setAction(props.action == null ? getEmptyAction() : { ...props.action });
  };

  const saveFunc = () => {
    // this.setFreezeOn();
    let createOrUpdate;
    if (props.action == null) {
      createOrUpdate = props.createNewAction(action);
    } else {
      createOrUpdate = props.updateAction(action);
    }
    createOrUpdate
      .then(() => toastr.success("Success", "Save OK"))
      .catch(e => toastr.error("Error", e.message));
    // .then(() => this.setFreezeOff());
  };

  const displayTriggerName = item => {
    return `${item.name}(${item.id})`;
  };
  const renderAdvancedParams = () => {
    if (advanced) {
      return (
        <>
          <DatapointParameter
            onChange={handleValueChange}
            label="Max Execution"
            name="maxExecute"
            editable={true}
            data={action}
          />
          <DatapointParameter
            onChange={handleValueChange}
            label="enabled"
            name="enable"
            data={action}
            list={[
              { id: "true", value: true },
              { id: "false", value: false }
            ]}
            display="id"
            match="value"
          />
          <DatapointParameter
            onChange={handleValueChange}
            label="Delay"
            name="delaySeconds"
            data={action}
            editable={true}
          />
          <DatapointParameter
            onChange={handleValueChange}
            label="Min Interval"
            name="minIntervalSeconds"
            data={action}
            editable={true}
          />
          <DatapointParameter
            onChange={handleValueChange}
            label="Execute Interval"
            name="executeIntervalSeconds"
            data={action}
            editable={true}
          />
          <DatapointParameter
            onChange={handleValueChange}
            label="Disabled Interval"
            name="disabledInterval"
            data={action}
            editable={true}
          />
          <DatapointParameter
            onChange={handleValueChange}
            label="Total Executed"
            name="totalExecuted"
            data={action}
            editable={false}
          />
          <DatapointParameter
            onChange={handleValueChange}
            label="Interval Executed"
            name="executedCounter"
            data={action}
            editable={false}
          />
        </>
      );
    }
  };

  const actionTypeIndex = getActionTypeIndex(actionTypes, action.type);
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 }
  };
  return (
    <Form {...layout} name="CreateAction">
      <Form.Item wrapperCol={{ offset: 8 }}>
        <Button type="primary" onClick={saveFunc}>
          Save
        </Button>
        <Button onClick={cancelFunc}>Cancel</Button>
      </Form.Item>
      <DatapointParameter
        validator={validateID}
        onChange={handleValueChange}
        editable={props.action == null}
        label="id"
        name="id"
        data={action}
        required
      />
      <DatapointParameter
        onChange={handleValueChange}
        label="type"
        name="type"
        data={action}
        list={actionTypes}
        display="id"
        match="id"
      />
      <DatapointParameter
        onChange={handleValueChange}
        label="trigger"
        name="triggerEventID"
        data={action}
        list={props.triggers}
        match="id"
        display={displayTriggerName}
        filterKeys={["id", "name"]}
      />
      <DatapointParameter
        onChange={handleValueChange}
        label="condition"
        name="conditionID"
        data={action}
        list={props.conditions}
        display="id"
        match="id"
        filterKeys={["id", "name"]}
      />
      <Form.Item label="advanced params">
          <Switch onMouseUp={toggleAdvancedParams} />
        </Form.Item>
      {renderAdvancedParams()}
      {actionTypeIndex >= 0 && (
        <ActionParameters
          name={action.type}
          parameterTypes={actionTypes[actionTypeIndex].parameters}
          parameters={action.parameters}
          onChange={handleParameterChange}
        />
      )}
    </Form>
  );
};

ActionCreator.propTypes = {
  triggers: PropTypes.array.isRequired,
  conditions: PropTypes.array.isRequired,
  createNewAction: PropTypes.func.isRequired,
  action: PropTypes.object
};

const mapStateToProps = state => ({
  triggers: state.triggers.items,
  conditions: state.conditions.items
});

const mapDispatchToProps = dispatch => {
  return {
    createNewAction: createNewAction(dispatch),
    updateAction: updateAction(dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionCreator);
