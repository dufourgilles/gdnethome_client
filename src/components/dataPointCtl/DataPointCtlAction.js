import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from 'react-redux';

import {executeAction} from "../../actions/dataPointCtlAction";

/**
 * @typedef {{
 *     name: string,
 *     parameterType: null|ParameterType
 * }} Action
 */

/**
 * @typedef {{
 *     type: string,
 *     min: number,
 *     max: number,
 *     default: number
 * }} ParameterType
 */

class DataPointCtlAction extends Component {
    state = {
        value: this.props.action.parameterType == null ? null : this.props.action.parameterType.default
    };

    renderNoParamAction = (action) => {
        const actionClick = () => {
            this.props.executeAction(this.props.dataPointCtl, action.name);
        };

        return (
            <div key={action} className="datapoint-action-btn" onClick={actionClick}>
                {action.name}
            </div>
        );
    };

    renderIntegerAction = (action) => {
        const actionClick = () => {
            this.props.executeAction(this.props.dataPointCtl, action.name, {value: this.state.value});
        };

        const handleValueChange = e => {
            const value = e.target.value;
            if ((value < action.parameterType.min) || (value > action.parameterType.max)) {
                return;
            }
            this.setState({value});
        };

        return (
            <div className="datapoint-action-parameter">
                <input
                    name={`${this.props.dataPointCtl.id}-${action}`}
                    value={this.state.value}
                    onChange={handleValueChange}
                />
                <div key={action} className="datapoint-action-btn" onClick={actionClick}>
                    {action.name}
                </div>
            </div>
        );
    };


    render() {
        const action = this.props.action;

        const renderAction = () => {
            if (action.parameterType == null) {
                return this.renderNoParamAction(action);
            }
            else if (action.parameterType.type === "integer") {
                return this.renderIntegerAction(action);
            }
        };

        return (
            <div className="datapoint-action">
                {renderAction()}
            </div>
        );
    }
}

DataPointCtlAction.propTypes = {
    dataPointCtl: PropTypes.object.isRequired,
    executeAction: PropTypes.func.isRequired
};


const mapDispatchToProps = dispatch => {
    return {
        executeAction: executeAction(dispatch),
    }
};
export default connect(null, mapDispatchToProps)(DataPointCtlAction);
