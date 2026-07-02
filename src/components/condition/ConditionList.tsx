// @ts-nocheck
import React from 'react';
import { toastr } from "../../hooks/toastr";
import FontAwesome from 'react-fontawesome';
import { Button } from 'react-bootstrap';
import PropTypes from "prop-types";
import { useCondition } from "../../hooks/useCondition";

class ConditionList extends React.Component {
    renderCondition = () => {
        let conditions = this.props.conditions || [];
        if (conditions.length > 0) {
            // remove "none"
            conditions = conditions.slice(1);            
        }
        return conditions.map(condition => {
            if (condition == null) {
                console.log(new Error("null condition"), "\n",conditions,"\n",this.props);
                debugger;
                return null;
            }
            const handleDelete = () => {
                this.props.deleteCondition(condition)
                    .then(() => {
                        toastr.success('Success', "Delete OK");
                    })
                    .catch(e => toastr.error('Error', e.message));
            };
            const handleSelect = event => {
                event.preventDefault();
                this.props.onSelect(condition);
            };
            let btnEditClass = this.props.selected.id === condition.id ? "btn-selected" : "condition-item-edit";
            if (condition.status === false) {
                btnEditClass += " status-false";
            }
            return (
                <div className="action-list-item" key={condition.id}>
                    <div className="action-item-name">{condition.name}</div>
                    <div>
                        <Button id="btnDeleteCondition" className="condition-item-delete" onClick={handleDelete}>
                            <FontAwesome name="trash"/>
                        </Button>
                        <Button id="btnEditCondition" className={btnEditClass} onClick={handleSelect}>
                            <FontAwesome name="edit"/>
                        </Button>
                    </div>
                </div>         
                );
        });
    }

    render() {
        return (
            <div className="action-list">
                {this.renderCondition()}
            </div>
        )
    }
}

ConditionList.propTypes = {
    conditions: PropTypes.array.isRequired,
    deleteCondition: PropTypes.func.isRequired,
    selected: PropTypes.object.isRequired
};


export default function ConditionListQuery(props) {
    const condition = useCondition();
    return (
        <ConditionList
            {...props}
            conditions={condition.conditions.data || []}
            deleteCondition={value => condition.delete.mutateAsync(value)}
        />
    );
}
