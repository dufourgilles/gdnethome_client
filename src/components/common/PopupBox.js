import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "antd";

export default class PopupBox extends Component {
  state = {
    visible: this.props.visible,
    data: null
  };

  show = () => {
    this.setState({ visible: true });
  };

  hide = () => {
    this.setState({ visible: false });
  };

  handleChange = data => {
    this.setState({ data });
  };

  handleExit = () => {
    if (this.props.onExit != null) {
      this.props.onExit();
    }
  };

  handleConfirm = () => {
    if (this.props.onConfirm != null) {
      this.props.onConfirm(this.state.data);
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.visible === prevProps.visible) {
      return;
    }

    if (this.state.visible !== this.props.visible) {
      if (this.props.visible) {
        this.show();
      } else {
        this.hide();
      }
    }
  }

  render() {
    return (
      <div className="modal-popupbox">
        <Modal
          title={this.props.title}
          visible={this.state.visible}
          onHide={this.handleExit}
          footer={[
            <Button key="confirm" onClick={this.handleConfirm}>Confirm</Button>,
            <Button key="exit" onClick={this.handleExit}>Exit</Button>
          ]}
        >
          <div className="popupbox-body">
            {this.props.content == null
              ? ""
              : this.props.content(this.handleChange)}
          </div>
        </Modal>
      </div>
    );
  }
}

PopupBox.propTypes = {
  visible: PropTypes.bool,
  title: PropTypes.string.isRequired,
  content: PropTypes.func,
  onExit: PropTypes.func,
  onConfirm: PropTypes.func
};
