// @ts-nocheck
import React, { Component } from 'react';
import { toastr } from "../../hooks/toastr";
import PropTypes from "prop-types";
import FontAwesome from 'react-fontawesome';
import { Button } from 'react-bootstrap';
import ActionCreator from "./ActionCreator";
import { useAction } from "../../hooks/useAction";

class ActionEditor extends Component {
    state = {
        action: null
    };

    render() {
        const actions = this.props.actions;
        const renderedActions = actions.map(action => {
            const handleFullDelete = () => {
                this.props.deleteFullAction(action)
                .then(() => {
                    if (this.state.action === action) {
                        this.setState({action: null});
                    }
                    toastr.success('Success', "Delete OK");
                })
                .catch(e => toastr.error('Error', e.message));
            }
            const handleDelete = () => {
                this.props.deleteAction(action)
                    .then(() => {
                        if (this.state.action === action) {
                            this.setState({action: null});
                        }
                        toastr.success('Success', "Delete OK");
                    })
                    .catch(e => toastr.error('Error', e.message));
            };
            const handleSelect = () => {
                this.setState({action});
            };
            return (
                <div className="action-list-item" key={action.id}>
                    <div className="action-item-name">{action.name}</div>
                    <div>
                        <Button id="btnDeleteAction" className="action-item-delete" onClick={handleDelete}>
                            <FontAwesome name="trash"/>
                        </Button>
                        <Button id="btnEditAction" className="action-item-edit" onClick={handleFullDelete}>
                            <FontAwesome name="trash-restore"/>
                        </Button>
                        <Button id="btnEditAction" className="action-item-edit" onClick={handleSelect}>
                            <FontAwesome name="edit"/>
                        </Button>
                    </div>
                </div>         
                );
        });
        const renderedEditableAction = this.state.action == null ?
            null :
            (<ActionCreator action={this.state.action} />);

        return (
            <div className="gdnet-container">
                <div className="gdnet-list">
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
    deleteAction: PropTypes.func.isRequired,
    deleteFullAction: PropTypes.func.isRequired
};

export default function ActionEditorQuery() {
    const action = useAction();
    return (
        <ActionEditor
            actions={action.actions.data || []}
            deleteAction={value => action.delete.mutateAsync(value)}
            deleteFullAction={value => action.deleteFull.mutateAsync(value)}
        />
    );
}

