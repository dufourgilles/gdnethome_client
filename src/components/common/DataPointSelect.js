import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DatapointParameter from "../datapoint/DatapointParameter";

class DataPointSelect extends Component {
    state = {
        selection: this.props.selection
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

        const handleValueChange = (name, value) => {
            if (this.props.onChange) {
                this.props.onChange(value);
            }
            this.setState({selection: {datapoint: value}});
        }

        return (
            <DatapointParameter
                key="leftID"
                onChange={handleValueChange}
                label="Select DataPoint"
                name="datapoint"
                data={this.state.selection}
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
