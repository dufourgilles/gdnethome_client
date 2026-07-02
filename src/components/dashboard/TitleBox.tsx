// @ts-nocheck
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './TitleBox.scss';
import FontAwesome from 'react-fontawesome';
import { Button } from 'react-bootstrap';

class TitleBox extends Component {
    render() {
        const handleContentEditor = () => {
            if (this.props.edit != null) {
                return this.props.edit();
            }
        };

        return (
            <div className="gdnet-block">
                <div className="gdnet-panel-header">{this.props.title}
                    <Button id="btnEditDataPointList" className="titlebox-edit" onClick={handleContentEditor}>
                        <FontAwesome name="plus"/> Edit List
                    </Button>
                </div>
                <div className="gdnet-list">
                    {this.props.content != null ? this.props.content : ""}
                </div>
            </div>
        );
    }
}

TitleBox.propTypes = {
    title: PropTypes.string.isRequired,
    edit: PropTypes.func,
    content: PropTypes.array
};

export default TitleBox;
