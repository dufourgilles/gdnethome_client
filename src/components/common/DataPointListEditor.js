import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Modal, Transfer } from "antd";

class DataPointListEditor extends Component {
  state = {
    visible: this.props.visible,
    group: this.props.group
  };

  show = () => {
    this.setState({ visible: true });
  };

  hide = () => {
    this.setState({ visible: false });
  };

  handleClose = () => {
    if (this.props.close != null) {
      this.props.close();
    }
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.visible === prevProps.visible &&
      this.props.group === prevProps.group
    ) {
      return;
    }

    if (this.props.group !== prevProps.group) {
      this.setState({ group: this.props.group });
    }

    if (this.state.visible !== this.props.visible) {
      this.props.visible ? this.show() : this.hide();
    }
  }

  render() {
    const elements = this.props.dpctl
      ? this.props.datapointctls
      : this.props.datapoints;
    const groupElements = this.state.group.elements || [];

    return (
      <div className="modal-datapointlist-editor">
        <Modal
          title="Show / Hide Elements"
          visible={this.state.visible}
          onCancel={this.handleClose}
          footer={null}
          width={700}
        >
          <Transfer 
            dataSource={elements.map(({id, name, description, statusReaderID}) => ({key: id, title: name, description: description ? description : statusReaderID}))}
            targetKeys={groupElements.map(({id}) => id).sort()}
            render={item => `${item.key} - ${item.title} - ${item.description}`}
            showSearch={true}
            showSelectAll={false}
            listStyle={{ width: 300, height: 700}}
            onChange={(targetKeys, direction, moveKeys) => {
              console.log({targetKeys, direction, moveKeys});
              const action = direction === "right" ? this.props.select : this.props.unselect;
              moveKeys.forEach(k => action({id: k}));
            }}
          />
        </Modal>
      </div>
    );
  }
}

DataPointListEditor.propTypes = {
  visible: PropTypes.bool,
  datapoints: PropTypes.array.isRequired,
  datapointctls: PropTypes.array.isRequired,
  group: PropTypes.object.isRequired,
  select: PropTypes.func.isRequired,
  unselect: PropTypes.func.isRequired,
  dpctl: PropTypes.bool
};

const mapStateToProps = state => ({
  datapoints: state.datapoints.items,
  datapointctls: state.datapointctls.items
});

export default connect(mapStateToProps, undefined)(DataPointListEditor);
