import React from 'react';
import { connect } from 'react-redux';
import FreezeView from "../common/FreezeView";
import {fetchActionTypes} from "../../actions/actionActions";
import ActionTabs from "./ActionTabs"
import "./ActionView.scss";

class ActionView extends FreezeView {
    state = {
        types: []
    };

    componentDidMount() {
        this.setFreezeOn();
        fetchActionTypes().then(types => {
            this.setState({types});
            this.setFreezeOff();
        });
    }

    renderContent() {
        return (
            <div className="gdnet-view">
                <div className="gdnet-title">Actions</div>
                <div className="action-view-container">
                    <ActionTabs />
                </div>
            </div>
        );
    }
}


export default connect(undefined, undefined)(ActionView);


