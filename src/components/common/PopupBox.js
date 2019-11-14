import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {Modal, Button} from 'react-bootstrap';

class PopupBox extends Component {
    state = {
        visible: this.props.visible,
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
                <Modal show={this.state.visible} onHide={this.handleClose}>
                    <Modal.Header>
                        <Modal.Title>{this.props.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="popupbox-body">
                            {this.props.content}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleClose}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

PopupBox.propTypes = {
    visible: PropTypes.bool,
    title: PropTypes.string.isRequired,
    content: PropTypes.object.isRequired
};




export default connect(undefined, undefined)(PopupBox);


