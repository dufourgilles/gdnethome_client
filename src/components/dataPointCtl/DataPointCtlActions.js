import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import DataPointCtlAction from "./DataPointCtlAction";
import "./DataPointCtlActions.scss";
import {executeAction} from "../../actions/dataPointCtlAction";

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
    executeAction: PropTypes.func.isRequired,
    dataPointCtl: PropTypes.object.isRequired
};


const mapDispatchToProps = dispatch => {
    return {
        executeAction: executeAction(dispatch),
    }
};
export default connect(null, mapDispatchToProps)(DataPointCtlActions);
