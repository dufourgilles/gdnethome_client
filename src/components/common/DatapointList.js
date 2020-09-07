import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './DatapointList.css';

class DatapointList extends Component {
    state = {
        filter: ""
    };

    renderDatapoint = datapoint => {
        if (this.props.format != null) {
            return this.props.format(datapoint);
        }
        else {
            const handleClick = () => {
                if (this.props.select) {
                    this.props.select(datapoint);
                }
            };
            return (
                <div key={datapoint.id} className="datapoint-list-line" onClick={handleClick}>
                    <div className="datapoint-list-line-id">{datapoint.id}</div>
                    <div className="datapoint-list-line-name">{datapoint.name}</div>
                </div>
            );
        }
    };

    setFilterList = e => {
        this.setState({filter: e.target.value});
    };

    filterList = dp => {
        const filter = this.state.filter;
        if (filter.length === 0) return true;
        try {
            const res = (dp.name.indexOf(filter) >= 0) || (dp.id.indexOf(filter) >= 0) ||
            (dp.description !== undefined && dp.description.indexOf(filter) >= 0) ||
            (dp.statusReaderID !== undefined && dp.statusReaderID.indexOf(filter) >= 0) || 
            (dp.commandWriterID !== undefined && dp.commandWriterID.indexOf(filter) >= 0);
            return res;
        }
        catch(e) {
            console.log(dp, e);
        }
        return false;
    };

    render() {
        if (this.props.datapoints == null) {
            console.log("no datapoints");
            return;
        }
        const datapoints = this.props.datapoints;

        return (
            <div className="datapoint-list-block">
                <div className="datapoint-filter">
                    <input name="datapoint-filter" value={this.state.filter} onChange={this.setFilterList}/>
                </div>
                <div className="datapoint-list">
                    {datapoints.filter(this.filterList).map(dp => this.renderDatapoint(dp))}
                </div>
            </div>
        );
    }
}

DatapointList.propTypes = {
    datapoints: PropTypes.array.isRequired,
    select: PropTypes.func,
    format: PropTypes.func
};


export default DatapointList;


