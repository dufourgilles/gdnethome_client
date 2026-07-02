// @ts-nocheck
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {getById, getByName} from "../../hooks/domain";
import { expandGroups, useGroupQuery } from "../../hooks/useGroup";
import { useDatapointQuery } from "../../hooks/useDatapoint";
import { useDatapointCtlQuery } from "../../hooks/useDatapointCtl";

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

export default function ActionBoxQuery() {
    const groupsQuery = useGroupQuery();
    const datapointsQuery = useDatapointQuery();
    const datapointCtlsQuery = useDatapointCtlQuery();
    const groups = expandGroups(groupsQuery.data || [], datapointsQuery.data || [], datapointCtlsQuery.data || []);
    return (
        <ActionBox
            actionGroup={getByName(groups)(ACTION_GROUP_NAME)}
            groups={getByName(groups)}
            datapoints={getById(datapointsQuery.data || [])}
        />
    );
}
