import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DatapointParameter from "../datapoint/DatapointParameter";

class DataPointSelect extends Component {
    handleValueChange = (name, value) => {
        this.props.onChange(value);
    }
    componentDidUpdate(prevProps) {
        if ((this.props.selection == null || prevProps.selection == null) ||
            (this.props.selection.datapoint === prevProps.selection.datapoint)) {
                return;
        }
    }
    render() {
        const displayName = item => {
            return `${item.name}(${item.id})`;
        }
        return (
            <DatapointParameter
                key="leftID"
                onChange={this.handleValueChange}
                label="Select DataPoint"
                name="datapoint"
                data={this.props.selection}
                list={this.props.datapoints}
                display={displayName}
                match="id"
                filterKeys={["id", "name"]}
            />
        );
    }
}

DataPointSelect.propTypes = {
    datapoints: PropTypes.array.isRequired,
    selection: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    datapoints: state.datapoints.items
});

export default connect(mapStateToProps, undefined)(DataPointSelect);
