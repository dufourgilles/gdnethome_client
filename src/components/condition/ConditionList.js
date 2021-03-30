import React from 'react';
import { toastr } from "react-redux-toastr";
import FontAwesome from 'react-fontawesome';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import { deleteCondition } from "../../actions/conditionActions";

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


const mapStateToProps = state => ({
    conditions: state.conditions.items
});

const mapDispatchToProps = dispatch => {
    return {
        deleteCondition: deleteCondition(dispatch)
    }
  };

export default connect(mapStateToProps, mapDispatchToProps)(ConditionList);
