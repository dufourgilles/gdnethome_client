// @ts-nocheck
import React, { Component } from 'react';
import PropTypes from "prop-types";
import DataPointCtlAction from "./DataPointCtlAction";
import "./DataPointCtlActions.scss";

class DataPointCtlActions extends Component {
    render() {
        const actions = this.props.dataPointCtl.actions.map(action => {
            return (
                <DataPointCtlAction
                    key={action.name}
                    dataPointCtl={this.props.dataPointCtl}
                    action={action}
                />
            );
        });

        return (
            <div className="datapoint-actions">
                {actions}
            </div>
        );
    }
}

DataPointCtlActions.propTypes = {
    dataPointCtl: PropTypes.object.isRequired
};

export default DataPointCtlActions;
