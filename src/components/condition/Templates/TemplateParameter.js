import React from 'react';
import TemplateNumber from './TemplateNumber';
import TemplateRange from './TemplateRange';
import TemplateHours from './TemplateHours';
import TemplateString from './TemplateString';

class TemplateParameter extends React.Component{
    render() {
        const parameter = this.props.parameter;
        if (parameter == null ) { return ""; }
        const type = parameter.type.toLowerCase();
        if (type === "number") {
            return (
                <TemplateNumber {...this.props} />
            );
        }
        else if (type === "string") {
            return (
                <TemplateString {...this.props} />
            );
        }
        else if (type === "range") {
            return (
                <TemplateRange {...this.props} />
            );
        }
        else if (type === "hours") {
            return (
                <TemplateHours {...this.props} />
            );
        }
    }
}


export default TemplateParameter;