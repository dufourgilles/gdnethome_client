import React from 'react';
import { connect } from 'react-redux';
import FreezeView from "../common/FreezeView";
import ConditionCreator from "./ConditionCreator";
import PropTypes from "prop-types";
import { deleteCondition } from "../../actions/conditionActions";
import { toastr } from "react-redux-toastr";
import FontAwesome from 'react-fontawesome';
import { Button } from 'antd';
import "./ConditionView.css";


class ConditionView extends FreezeView {
    state = {
        condition: null
    };

    componentDidMount() {
        this.setFreezeOff();
    }

    renderContent() {
        let conditions = this.props.conditions || [];
        if (conditions.length > 0) {
            // remove "none"
            conditions = conditions.slice(1);
        }
        const renderedConditions = conditions.map(condition => {
            if (condition == null) {
                console.log(new Error("null condition"), "\n",conditions,"\n",this.state, this.props);
                debugger;
                return null;
            }
            const handleDelete = () => {
                this.props.deleteCondition(condition)
                    .then(() => {
                        if (this.state.condition === condition) {
                            this.setState({condition: null});
                        }
                        toastr.success('Success', "Save OK");
                    })
                    .catch(e => toastr.error('Error', e.message));
            };
            const handleSelect = () => {
                this.setState({condition});
            };
            return (
                <div className="action-list-item" key={condition.id}>
                    <div className="action-item-name">{condition.id}</div>
                    <Button id="btnDeleteCondition" className="condition-item-delete" onClick={handleDelete}>
                        <FontAwesome name="trash"/>
                    </Button>
                    <Button id="btnEditCondition" className="condition-item-edit" onClick={handleSelect}>
                        <FontAwesome name="edit"/>
                    </Button>
                </div>         
                );
        })
        return (
            <div className="gdnet-view">
                <div className="gdnet-title">Conditions</div>
                <div key={this.state.condition == null ? "new" : this.state.condition.id} className="condition-view-container">
                    <div className="condition-list">
                        {renderedConditions}
                    </div>
                    <ConditionCreator 
                        id={this.state.condition == null ? null : this.state.condition.id} 
                        condition={this.state.condition}
                        reset={() => {this.setState({condition: null})}}
                    />
                </div>
            </div>
        );
    }
}

ConditionView.propTypes = {
    conditions: PropTypes.array.isRequired,
    deleteCondition: PropTypes.func.isRequired
};


const mapStateToProps = state => ({
    conditions: state.conditions.items
});

const mapDispatchToProps = dispatch => {
    return {
        deleteCondition: deleteCondition(dispatch)
    }
  };

export default connect(mapStateToProps, mapDispatchToProps)(ConditionView);


