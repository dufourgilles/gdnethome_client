import React from "react";
import { toastr } from "react-redux-toastr";
import FontAwesome from "react-fontawesome";
import { Button, List } from "antd";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { deleteCondition } from "../../actions/conditionActions";

class ConditionList extends React.Component {
    renderCondition = condition => {
      if (condition == null) {
        console.log(
          new Error("null condition"),
          "\n",
          this.props.conditions,
          "\n",
        );
        debugger;
        return null;
      }
      const handleDelete = () => {
        this.props
          .deleteCondition(condition.id)
          .then(() => {
            this.props.deleteCondition();
            toastr.success("Success", "Save OK");
          })
          .catch(e => toastr.error("Error", e.message));
      };
      const handleSelect = event => {
        event.preventDefault();
        this.props.onSelect(condition);
      };
      return (
        <List.Item
        actions={[
          <Button
            onClick={handleDelete}
          >
            <FontAwesome name="trash" />
          </Button>,
          <Button
            onClick={handleSelect}
          >
            <FontAwesome name="edit" />
          </Button>
        ]}
        >
          <List.Item.Meta title={condition.id} />
        </List.Item>
      );
    // });
  };

  render() {
    return <List 
      itemLayout="horizontal"
      dataSource={this.props.conditions.slice(1)}
      renderItem={this.renderCondition}
    />;
  }
}

ConditionList.propTypes = {
  conditions: PropTypes.array.isRequired,
  deleteCondition: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  conditions: state.conditions.items
});

const mapDispatchToProps = {
  deleteCondition
};

export default connect(mapStateToProps, mapDispatchToProps)(ConditionList);
