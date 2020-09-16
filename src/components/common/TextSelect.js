import React, { Component } from 'react';
import PropTypes from 'prop-types';

import "./TextSelect.scss";
import { Input } from 'antd';

class TextSelect extends Component {
    state = {
        value: this.getDisplayValue(this.props.index == null ? this.props.data[this.props.name] : this.props.data[this.props.name][this.props.index]),
        options: [],
        hidden: true,
        maxOptions: this.props.maxOptions == null ? 5 : this.props.maxOptions
    };

    getDisplayValue(value) {
        for(let option of this.props.list) {
            if (option[this.props.match] === value) {
                if (typeof(this.props.display) === "function") {
                    return this.props.display(option);
                }
                else {
                    return option[this.props.display];
                }
            }
        }
        return "";
    }

    filterList = filter => {
        return this.props.list.slice().filter(element => {
            for(let key of this.props.filterKeys) {
                if ((element[key] != null) && (element[key].indexOf(filter) >= 0)) {
                    return true;
                }
            }
            return false;
        }).slice(0,this.state.maxOptions);
    };

    handleValueChange = e => {
        const value = e.target.value;
        const options = value === ""  ? [] : this.filterList(value);
        this.setState({value, options});
    };

    handleFocusIn = e => {
        this.setState({hidden: false});
    };

    handleFocusOut = e => {
        if (this.props.onFocusOut) {
            this.props.onFocusOut(e);
        }
        this.setState({hidden: true});
    }

    renderOption = option => {
        let displayName;
        if (typeof(this.props.display) === "function") {
            displayName = this.props.display(option);
        }
        else {
            displayName = option[this.props.display];
        }
        const handleOptionSelect = e => {
            e.target.value = option;
            this.setState({value: displayName, options: []});
            this.props.onChange(e);
        };
        return (
            <div key={displayName} className="text-select-option" onMouseDown={handleOptionSelect}>
                {displayName}
            </div>
        );
    };

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.setState({value: this.getDisplayValue(
                this.props.index == null ? this.props.data[this.props.name] : this.props.data[this.props.name][this.props.index]
                ), options: []});
        }
    }

    render() {
        return (
            <div className="text-select">
                <div className="text-select-selection">
                    <Input 
                        name = {this.props.name} 
                        value={this.state.value} 
                        onChange={this.handleValueChange}
                        onFocus={this.handleFocusIn}
                        onBlur={this.handleFocusOut}
                        autoComplete="off"
                        size="40"
                    />
                </div>
                <div className={`text-select-options ${this.state.hidden ? "hidden" : ""}`}>
                    {this.state.options.map(this.renderOption)}
                </div>
            </div>
        );
    }
}

TextSelect.prototypes = {
    data: PropTypes.object.isRequired,
    list: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    filterKeys: PropTypes.array.isRequired,
    display: PropTypes.string.isRequired,
    match: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocusOut: PropTypes.func,
    maxOptions: PropTypes.number
};

export default TextSelect;
