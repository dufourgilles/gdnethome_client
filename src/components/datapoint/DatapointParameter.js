import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextSelect from "../common/TextSelect";

class DatapointParameter extends Component {
    valueChanged = (e) => {
        if (this.props.onChange != null) {
            this.props.onChange(this.props.name, e.target.value);
        }
    };

    renderEditable = (valid) => {
        let invalid;
        if (!valid) {
            invalid = (<div className="datapoint-parameter-invalid"></div>);
        }
        else {
            invalid = (<div className="datapoint-parameter-valid"></div>);
        }
        return (
            <div className="datapoint-editor-value">
                <input name={this.props.name} onChange={this.valueChanged} value={this.props.data[this.props.name]} size="40" />
                {invalid}
            </div>
        );
    };

    renderArrayItem = () => {
        let invalid,valid,value;
        const table = this.props.data[this.props.name];
        const index = Number(this.props.index);
        if ((isNaN(index)) ||
            (table == null) ||
            (index < 0) ||
            (index > table.length)) {
            valid = false;
        }
        else {
            valid = true;
        }
        if (!valid) {
            invalid = (<div className="datapoint-parameter-invalid"></div>);
        }
        else {
            invalid = (<div className="datapoint-parameter-valid"></div>);
        }
        return (
            <div className="datapoint-editor-value">
                <input name={`${this.props.name}:${index}`} onChange={this.valueChanged} value={table[index]} size="40" />
                {invalid}
            </div>
        );
    }

    renderList = () => {
        const option = item => {
            let displayName;
            if (typeof(this.props.display) === "function") {
                displayName = this.props.display(item);
            }
            else {
                displayName = item[this.props.display];
            }
            return (
                <option key={item[this.props.match]} value={item[this.props.match]} size="40">
                    {displayName}
                </option>
            );
        };
        return (
            <div className="datapoint-editor-value">
                <select name={this.props.name} value={this.props.data[this.props.name]} onChange={this.valueChanged} >
                    {
                        this.props.list.map(option)
                    }
                </select>
            </div>
        );
    };

    renderTextList = () => {
        return (
            <TextSelect
                data={this.props.data}
                name={this.props.name}
                list={this.props.list}
                onChange={this.valueChanged}
                display={this.props.display}
                match={this.props.match}
                filterKeys={this.props.filterKeys}
            />
        )
    };

    render() {
        const valueLine = () => {
            let valid = true;
            if (this.props.validator) {
                valid = this.props.validator(this.props.data[this.props.name]);
            }
            if (this.props.editable) {
                return this.renderEditable(valid);
            }
            else if (this.props.filterKeys) {
                return this.renderTextList();
            }
            else if (this.props.list) {
                return this.renderList();
            }
            else if (this.props.index) {
                return this.renderArrayItem();
            }
            else {
                return (<div className="datapoint-editor-value">{this.props.data[this.props.name]}</div>);
            }
        };


        return (
            <div className="datapoint-editor-entry">
                <div className="datapoint-editor-key">{this.props.name}</div>
                {valueLine()}
            </div>
        );
    }
}

DatapointParameter.propTypes = {
    data: PropTypes.object.isRequired,
    editable: PropTypes.bool,
    index: PropTypes.number,
    label: PropTypes.string.isRequired,
    name: PropTypes.string,
    filterKeys: PropTypes.array,
    match: PropTypes.string,
    display: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
    ]),
    list: PropTypes.array,
    validator: PropTypes.func,
    onChange: PropTypes.func
};

export default connect(undefined, undefined)(DatapointParameter);




