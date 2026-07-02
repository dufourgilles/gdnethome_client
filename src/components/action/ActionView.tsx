// @ts-nocheck
import React from 'react';
import PropTypes from "prop-types";
import FreezeView from "../common/FreezeView";
import ActionTabs from "./ActionTabs"
import { useActionQuery } from "../../hooks/useAction";

class ActionView extends FreezeView {
    state = {
        types: []
    };

    renderContent() {
        return (
            <div className="gdnet-view">
                <div className="gdnet-container-header">
                    <div>
                        <div className="gdnet-title">Actions</div>
                        <div className="gdnet-subtitle">{this.props.actions.length} actions configured</div>
                    </div>
                </div>
                <div className={`gdnet-container ${this.isFreezed() === true ? "blurred" : ""}`}>
                    <ActionTabs />
                </div>
            </div>
        );
    }
}

ActionView.propTypes = {
    actions: PropTypes.array.isRequired
};

export default function ActionViewQuery() {
    const actions = useActionQuery();
    return <ActionView actions={actions.data || []} />;
}
