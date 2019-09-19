import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import {getDataPointCtlByID} from "../../reducers/dataPointCtlReducer";
import DatapointParameter from "../datapoint/DatapointParameter";

class ActionParameter extends Component {
    getValue(paramName, data) {
        const pathName = paramName.split(".");
        let param = data;
        let i = 0;
        for(; i < pathName.length; i++) {
            if (param == null) {
                return "";
            }
            param = param[pathName[i]];
        }
        return param;
    }

    render() {
        const {name, parameterInfo, data, dataPointCtls} = this.props;
        
        if (typeof(parameterInfo) === "string") {            
            if (parameterInfo === "DataPointCtlID") {
                const option = dpctl => {
                    return (
                        <option key={dpctl.id} value={dpctl.id}>
                            {dpctl.name}
                        </option>
                    );
                };
                const handleChange = (key,value) => {
                    this.props.onChange(key, value.id);
                }
                return (
                    <div className="action-parameter-info">
                        <DatapointParameter 
                            key="triggerID"
                            onChange={handleChange}
                            label={name}
                            name={name}
                            data={data}
                            list={dataPointCtls}
                            match="id"
                            display="name"                         
                            filterKeys={["id", "name"]}
                        />
                    </div>
                )
            }
            else {
                const handleChange = (key,value) => {
                    let _value = value;
                    if (parameterInfo === "number") {
                        _value = Number(value);
                    }
                    this.props.onChange(key, _value);
                }
                return (
                    <div className="action-parameter-info">
                        <div className="action-parameter-info-name">{name}</div>
                        <div className="action-parameter-info-value">
                            <input name={name} value={this.getValue(name, data)} onChange={handleChange}/>
                        </div>
                    </div>
                );
            }
        } 
        else if (parameterInfo.value === "enum") {
            const fullParamName = `${name}.value`;
            const value = this.getValue(fullParamName, data);
            const _handleChange = (ev) => {
                this.props.onChange(fullParamName, ev.target.value);
            };
            const option = item => {
                return (
                    <option key={item} value={item}>
                        {item}
                    </option>
                );
            };
            return (
                <div className="action-parameter-info">
                    <div className="action-parameter-info-name">{fullParamName}</div>
                    <div className="action-parameter-info-value">
                        <select name={name} value={value} onChange={_handleChange}>
                            {parameterInfo["_enum"].map(option)}
                        </select>
                    </div>
                </div>
            );
        }
        else {
            const parameterInfoKeys = Object.keys(parameterInfo);
            const renderedParameters = [];
            parameterInfoKeys.map(paramName => {
                if (paramName == null || paramName.length === 0 || paramName[0] === "_") {
                    return null;
                }
                const fullParamName = `${name}.${paramName}`;
                renderedParameters.push(
                     <ActionParameter key={fullParamName} name={fullParamName} parameterInfo={parameterInfo[paramName]} data={data} onChange={this.props.onChange} />
                );
                return null;
            });
            return (
                <div className="action-parameter-info">
                    {renderedParameters}
                </div>
            );
        }
    }
}

ActionParameter.propTypes = {
    name: PropTypes.string.isRequired,
    parameterInfo: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]).isRequired,
    data: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    dataPointCtls: state.datapointctls.items,
    getDataPointCtlByID: getDataPointCtlByID(state)

});

export default connect(mapStateToProps, undefined)(ActionParameter);
