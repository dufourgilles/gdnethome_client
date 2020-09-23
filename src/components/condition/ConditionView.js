import React from "react";
import ConditionCreator from "./ConditionCreator";
import ConditionList from "./ConditionList";
import {
  getEmptyCondition,
  getConditionByID
} from "../../reducers/conditionReducer";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "./ConditionView.scss";
import { Col, Row, Typography } from "antd";

class ConditionView extends React.Component {
  state = {
    condition: getEmptyCondition()
  };

  componentWillReceiveProps(newProps) {
    if (this.state.condition.id !== "") {
      const condition = this.props.getConditionByID(this.state.condition.id);
      if (condition) {
        this.setState({ condition });
      }
    }
  }

  handleDelete = () => {
    this.setState({ condition: getEmptyCondition() });
  };

  handleSelect = condition => {
    this.setState({ condition });
  };

  render() {
    return (
      <>
        <Typography>
          <Typography.Title level={3}>Conditions</Typography.Title>
        </Typography>
        <Row>
          <Col span={8}>
            <ConditionList
              onSelect={this.handleSelect}
              onDelete={this.handleDelete}
            />
          </Col>
          <Col span={16}>
            <ConditionCreator
              id={this.state.condition.id}
              condition={this.state.condition}
              reset={() => {
                this.setState({ condition: getEmptyCondition() });
              }}
            />
          </Col>
        </Row>
      </>
    );
  }
}

ConditionView.propTypes = {
  conditions: PropTypes.array.isRequired,
  getConditionByID: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  conditions: state.conditions.items,
  getConditionByID: getConditionByID(state)
});

export default connect(mapStateToProps, undefined)(ConditionView);
