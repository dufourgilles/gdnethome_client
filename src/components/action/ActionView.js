import React from "react";
import { connect } from "react-redux";
import { Typography } from "antd";
import FreezeView from "../common/FreezeView";
import { fetchActionTypes } from "../../actions/actionActions";
import ActionTabs from "./ActionTabs";
import "./ActionView.scss";
const {Title} = Typography;

class ActionView extends FreezeView {
  state = {
    types: [],
  };

  componentDidMount() {
    this.setFreezeOn();
    fetchActionTypes().then((types) => {
      this.setState({ types });
      this.setFreezeOff();
    });
  }

  renderContent() {
    return (
      <>
        <Typography>
            <Title level={3}>Actions</Title>
        </Typography>
        <div className="gdnet-title">Actions</div>
        <ActionTabs />
      </>
    );
  }
}

export default connect(undefined, undefined)(ActionView);
