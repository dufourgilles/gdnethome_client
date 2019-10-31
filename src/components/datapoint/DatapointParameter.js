import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextSelect from "../common/TextSelect";

class DatapointParameter extends Component {
    state = {
        disableFilter: false
    };

    handleFilterSelect = e => {
        this.setState({disableFilter: !this.state.disableFilter});
    }

    valueChanged = (e) => {
        if (this.props.onChange != null) {
            this.props.onChange(this.props.name, e.target.value);
        }
    };

    getValue() {
        if (this.props.index != null) {
            const table = this.props.data[this.props.name];
            const index = Number(this.props.index);
            if ((isNaN(index)) ||
                (table == null) ||
                (index < 0) ||
                (index > table.length)) {
                return "";
            }
            return table[index];
        }
        else {
            return this.props.data[this.props.name];
        }
    }

    renderEditable = (valid) => {
        let invalid;
        const value = this.getValue();
        if (!valid || value == null) {
            invalid = (<div className="datapoint-parameter-invalid"></div>);
        }
        else {
            invalid = (<div className="datapoint-parameter-valid"></div>);
        }
        return (
            <div className="datapoint-editor-value">
                <input name={this.props.name} onChange={this.valueChanged} value={value} size="40" />
                {invalid}
            </div>
        );
    };

    renderList = () => {
        const option = item => {
            if (item == null) {
                console.log(new Error("Error null item"), "\n", this.props, this.state);
                return "";
            }
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
        let checkBox;
        const className = this.props.className == null ? "datapoint-editor-value" : "";
        if (this.props.filterKeys) {
            checkBox = (
                <input 
                    type="checkbox" 
                    name="disableFilter" 
                    style={{marginTop: "7px", marginLeft: "7px"}}
                    onChange={this.handleFilterSelect}
                    checked
                />
            );
        }
        const value = this.getValue() != null ? this.getValue() : "";        
        return (
            <div className={className}>
                <select name={this.props.name} value={value} onChange={this.valueChanged} >
                    {
                        this.props.list.map(option)
                    }
                </select>
                {checkBox}
            </div>
        );
    };

    renderTextList = () => {
        return (
            <React.Fragment>
                <TextSelect
                    data={this.props.data}
                    name={this.props.name}
                    list={this.props.list}
                    onChange={this.valueChanged}
                    display={this.props.display}
                    match={this.props.match}
                    index={this.props.index}
                    filterKeys={this.props.filterKeys}
                />
                <input 
                    type="checkbox" 
                    name="disableFilter" 
                    style={{marginTop: "7px", marginLeft: "7px"}}
                    onChange={this.handleFilterSelect}
                />
            </React.Fragment>
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
            else if (this.props.filterKeys && this.state.disableFilter === false) {
                return this.renderTextList();
            }
            else if (this.props.list) {
                return this.renderList();
            }
            else {
                return (<div className="datapoint-editor-value">{this.props.data[this.props.name]}</div>);
            }
        };

        const entryClass = this.props.className == null ? "datapoint-editor-entry" : this.props.className;
        const keyClass = this.props.className == null ? "datapoint-editor-key" : "";
        return (
            <div key={this.props.key} className={entryClass}>
                <div className={keyClass}>{this.props.label}</div>
                {valueLine()}
            </div>
        );
    }
}

DatapointParameter.propTypes = {
    key: PropTypes.string,
    className: PropTypes.string,
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




