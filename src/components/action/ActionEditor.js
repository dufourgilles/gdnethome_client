import React, { Component } from 'react';
import { connect } from 'react-redux';
import {deleteAction} from "../../actions/actionActions";
import { toastr } from "react-redux-toastr";
import PropTypes from "prop-types";
import FontAwesome from 'react-fontawesome';
import { Button } from 'react-bootstrap';
import ActionCreator from "./ActionCreator";

class ActionEditor extends Component {
    state = {
        action: null
    };

    render() {
        const actions = this.props.actions;
        const renderedActions = actions.map(action => {
            const handleDelete = () => {
                this.props.deleteAction(action)
                    .then(() => {
                        if (this.state.action === action) {
                            this.setState({action: null});
                        }
                        toastr.success('Success', "Save OK");
                    })
                    .catch(e => toastr.error('Error', e.message));
            };
            const handleSelect = () => {
                this.setState({action});
            };
            return (
                <div className="action-list-item" key={action.id}>
                    <div className="action-item-name">{action.name}</div>
                    <Button id="btnDeleteAction" className="action-item-delete" onClick={handleDelete}>
                        <FontAwesome name="trash"/>
                    </Button>
                    <Button id="btnEditAction" className="action-item-edit" onClick={handleSelect}>
                        <FontAwesome name="edit"/>
                    </Button>
                </div>         
                );
        });
        const renderedEditableAction = this.state.action == null ?
            null :
            (<ActionCreator action={this.state.action} />);

        return (
            <div className="action-editor">
                <div className="action-list">
                    {renderedActions}
                </div>
                {renderedEditableAction}
            </div>
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
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionEditor);


