import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {Modal, Button} from 'react-bootstrap';

class PopupBox extends Component {
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
        this.setState({data});
    }

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
            }
            else {
                this.hide();
            }
        }
    }

    render() {

        return (
            <div className="modal-popupbox">
                <Modal show={this.state.visible} onHide={this.handleExit}>
                    <Modal.Header>
                        <Modal.Title>{this.props.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="popupbox-body">
                            {this.props.content == null ? "" :this.props.content(this.handleChange)}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleConfirm}>Confirm</Button>
                        <Button onClick={this.handleExit}>Exit</Button>
                    </Modal.Footer>
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




export default connect(undefined, undefined)(PopupBox);


