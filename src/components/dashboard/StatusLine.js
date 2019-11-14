import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './StatusLine.css';

class StatusLine extends Component {
    
    render() {
        const status = this.props.formatStatus == null ? 
        this.props.status :
        this.props.formatStatus(this.props.status);
        return (
            <div className="statusline" onClick={this.props.onClick}>
                <div className="statusline-name">{this.props.name}</div>
                <div className="statusline-status">{status}</div>
            </div>
        );
    }
}

StatusLine.propTypes = {
    name: PropTypes.string.isRequired,
    status: PropTypes.any.isRequired,
    onClick: PropTypes.func,
    formatStatus: PropTypes.func
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(StatusLine);


