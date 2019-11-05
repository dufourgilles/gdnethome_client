import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './StatusLine.css';

class StatusLine extends Component {
    render() {
        return (
            <div className="statusline" onClick={this.props.onClick}>
                <div className="statusline-name">{this.props.name}</div>
                <div className="statusline-status">{this.props.status}</div>
            </div>
        );
    }
}

StatusLine.propTypes = {
    name: PropTypes.string.isRequired,
    status: PropTypes.any.isRequired,
    onClick: PropTypes.func
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(StatusLine);


