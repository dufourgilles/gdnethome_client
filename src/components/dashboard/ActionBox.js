import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {getGroupByName} from "../../reducers/groupReducer";
import {getDatapointByID} from "../../reducers/datapointReducer";

const ACTION_GROUP_NAME = "dashboard_actions";

class ActionBox extends Component {
    render() {
        return (
            <div className="action-box">

            </div>
        );
    }
}

ActionBox.proptypes = {
    actionGroup: PropTypes.object.isRequired,
    groups: PropTypes.func.isRequired,
    datapoints: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    actionGroup: getGroupByName(state)(ACTION_GROUP_NAME),
    groups: getGroupByName(state),
    datapoints: getDatapointByID(state)
});

export default connect(mapStateToProps, null)(ActionBox);