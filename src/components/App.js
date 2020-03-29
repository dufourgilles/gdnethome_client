import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ReduxToastr from "react-redux-toastr";
import { Redirect, Route, Switch } from "react-router";
import { Link, withRouter } from "react-router-dom";
import { pollSystem } from "../actions/systemActions";
import { subscribeToEvents, eventProcessor } from "../socket/clientSocket";
// import AppHeader from "./appheader/AppHeader";
import ActionView from "./action/ActionView";
import ConditionView from "./condition/ConditionView";
import Dashboard from "./dashboard/Dashboard";
import DatapointView from "./datapoint/DatapointView";
import DataPointCtlView from "./dataPointCtl/DataPointCtlView";
import ReplayView from "./replay/ReplayView";
import SettingsView from "./settings/SettingsView";
import { Layout, Menu } from "antd";
import {
  AppstoreAddOutlined,
  AppstoreOutlined,
  CopyrightCircleOutlined,
  DashboardOutlined,
  ThunderboltOutlined,
  PlaySquareOutlined,
  PullRequestOutlined,
  SettingOutlined
} from "@ant-design/icons";
import "react-redux-toastr/lib/css/react-redux-toastr.min.css";
import "./App.scss";
const { Header, Content, Sider, Footer } = Layout;

class App extends Component {
  componentDidMount() {
    this.props.pollSystem();
    subscribeToEvents(this.props.eventProcessor);
  }

  render() {
    if (!this.props.app.isReady) return <div>...waiting for server...</div>;
    return (
      <Layout>
        <Header>
          <div className="logo">GDNET Home</div>
        </Header>
        <Layout>
          <Sider theme="light" collapsible>
            <Menu
              mode="inline"
              selectedKeys={this.props.location.pathname.split("/")}
              theme="light"
            >
              <Menu.Item key="dashboard">
                <Link to="/dashboard">
                  <DashboardOutlined />
                  <span>Dashboard</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="action">
                <Link to="/action">
                  <ThunderboltOutlined />
                  <span>Actions</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="condition">
                <Link to="/condition">
                  <PullRequestOutlined />
                  <span>Conditions</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="datapointlist">
                <Link to="/datapointlist">
                  <AppstoreAddOutlined />
                  <span>Datapoints</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="datapointctl">
                <Link to="/datapointctl">
                  <AppstoreOutlined />
                  <span>Datapoints Control</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="replay">
                <Link to="/replay">
                  <PlaySquareOutlined />
                  <span>Replay</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="settings">
                <Link to="/settings">
                  <SettingOutlined />
                  <span>Settings</span>
                </Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Content style={{ padding: 10 }}>
              <Switch>
                <Route path="/action" component={ActionView} />
                <Route path="/condition" component={ConditionView} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/datapointlist" component={DatapointView} />
                <Route path="/datapointctl" component={DataPointCtlView} />
                <Route path="/replay" component={ReplayView} />
                <Route path="/settings" component={SettingsView} />
                <Redirect from="/" to="/dashboard" />
              </Switch>
              <ReduxToastr
                timeOut={2000}
                newestOnTop={true}
                preventDuplicates
                position="top-right"
                transitionIn="fadeIn"
                transitionOut="fadeOut"
                progressBar={true}
              />
            </Content>
            <Footer>
              <CopyrightCircleOutlined />
              <span>
                &nbsp;2019-{new Date().getFullYear()} Gdnet SPRL All rights reserved.
              </span>
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

App.propTypes = {
  pollSystem: PropTypes.func.isRequired,
  eventProcessor: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  app: state.app
});

const mapDispatchToProps = dispatch => ({
  eventProcessor: () => eventProcessor()(dispatch),
  pollSystem: () => pollSystem()(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
