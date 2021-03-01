import React from 'react';
import TemplateTriggerEvent from './TemplateTriggerEvent';
import TemplateDatapointCtl from './TemplateDatapointCtl';

class TemplateObject extends React.Component{
    render() {
        const object = this.props.object;
        if (object == null ) { return ""; }
        const type = object.type.toLowerCase();
        if (type === "triggerevent") {
            return (
                <TemplateTriggerEvent {...this.props} />
            );
        }
        else if (type === "datapointctl") {
            return (
                <TemplateDatapointCtl {...this.props} />
            );
        }
    }
}


export default TemplateObject;