import React, { Component } from 'react';
import { connect } from 'react-redux';
import ActionParameter from "./ActionParameter";
import PropTypes from "prop-types";

class ActionParameters extends Component {
    render() {
        const parameterTypes = this.props.parameterTypes;
        const parameterTypeKeys = Object.keys(parameterTypes);
        const parameters = this.props.parameters
        const renderedParameters = [];
        
        const handleChange = (paramName, value) => {
            const pathName = paramName.split(".");
            const newParameters = Object.assign({}, parameters);;
            let param = newParameters;
            let i = 0;
            for(; i < pathName.length - 1; i++) {
                if (param[pathName[i]] == null) {
                    param[pathName[i]] = {};
                }
                param = param[pathName[i]];
            }
            param[pathName[i]] = value;
            this.props.onChange(newParameters);
        };

        parameterTypeKeys.map(name => {
            if (name == null || name.length === 0 || name[0] === "_") {
                return null;
            }
            const _handleChange = (fullParamName, value) => {
                handleChange(fullParamName, value);
            };
            renderedParameters.push(
                 <ActionParameter key={name} name={name} parameterInfo={parameterTypes[name]} data={parameters} onChange={_handleChange} />
            );
            return null;
        });
        return (
            <div className="action-parameters">
                {renderedParameters}
            </div>
        )
    }
}

ActionParameters.propTypes = {
    name: PropTypes.string,
    parameterTypes: PropTypes.object.isRequired,
    parameters: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export default connect(undefined, undefined)(ActionParameters);
