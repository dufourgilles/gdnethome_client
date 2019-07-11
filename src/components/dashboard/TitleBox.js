import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './TitleBox.css';
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
            <div className="titlebox">
                <div>
                    <div className="titlebox-title">{this.props.title}</div>
                    <Button id="btnEditDataPointList" className="titlebox-edit" onClick={handleContentEditor}>
                        <FontAwesome name="plus"/> Edit List
                    </Button>
                </div>
                <div className="titlebox-content">
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

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TitleBox);


