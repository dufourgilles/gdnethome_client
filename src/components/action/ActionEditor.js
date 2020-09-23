import React, { Component } from "react";
import { connect } from "react-redux";
import { deleteAction } from "../../actions/actionActions";
import { toastr } from "react-redux-toastr";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";
import { Button, Col, Empty, List, Row } from "antd";
import ActionCreator from "./ActionCreator";

class ActionEditor extends Component {
  state = {
    currentAction: null
  };

  render() {
    const { actions, deleteAction } = this.props;
    const { currentAction } = this.state;
    const actionList = (
      <List
        itemLayout="horizontal"
        dataSource={actions}
        renderItem={action => {
          const handleDelete = async () => {
            try {
              await deleteAction(action);
              if (currentAction === action) {
                this.setState({ currentAction: null });
              }
              toastr.success("Success", "Save OK");
            } catch (e) {
              toastr.error("Error", e.message);
            }
          };
          const handleSelect = () => this.setState({ currentAction: action });
          return (
            <List.Item
              actions={[
                <Button
                  id="btnDeleteAction"
                  className="action-item-delete"
                  onClick={handleDelete}
                >
                  <FontAwesome name="trash" />
                </Button>,
                <Button
                  id="btnEditAction"
                  className="action-item-edit"
                  onClick={handleSelect}
                >
                  <FontAwesome name="edit" />
                </Button>
              ]}
            >
              <List.Item.Meta title={action.id} description={action.type} />
            </List.Item>
          );
        }}
      />
    );

    return (
      <Row>
        <Col span={8}>{actionList}</Col>
        <Col span={16}>
          {currentAction ? (
            <ActionCreator action={currentAction} />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </Col>
      </Row>
    );
  }
}

ActionEditor.propTypes = {
  action: PropTypes.object,
  actions: PropTypes.array.isRequired,
  deleteAction: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  actions: state.actions.items || []
});

const mapDispatchToProps = dispatch => {
  return {
    deleteAction: deleteAction(dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionEditor);
