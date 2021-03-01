import React from 'react';
import { connect } from 'react-redux';
import { createNewConditionFromString } from "../../actions/conditionActions";
import DatapointParameter from "../datapoint/DatapointParameter";
import PropTypes from "prop-types";
import { toastr } from "react-redux-toastr";
import FreezeView from "../common/FreezeView";
import TemplateObject from './Templates/TemplateObject';
import TemplateParameter from './Templates/TemplateParameter';
import TemplateConverter from './Templates/TemplateConverter';
import AsyncFileReader from '../../utils/AsyncFiledReader';
import {getTriggerByID} from '../../reducers/triggerEventReducer';
import {getConditionByID} from '../../reducers/conditionReducer';

import "./Template.css";

class ConditionTemplateViewer extends FreezeView {
    state = {
        templates: this.props.templates ? this.props.templates : [],
        template: {objects: [], parameters: []},
        parameters: {},
        objects: {}
    };

    createCondition = async () => {
        const template = this.state.template;
        if (template == null || template.objects == null || template.parameters == null) {
            return null;
        }
        this.setFreezeOn();
        // create all conditions
        try {
            const converter = new TemplateConverter(this.state.objects, this.state.parameters, this.props.getConditionByID, template);
            for(const conditionTemplate of template.conditions) {
                const name = converter.convert(conditionTemplate.name);
                const conditionString = converter.convert(conditionTemplate.value);
                const condition = await this.props.createNewConditionFromString(name, conditionString);
                converter.addCondition(condition);
            }
            toastr.success('Success', "Generation OK");
        }
        catch(e) {
            console.log(e);
            toastr.error('Error', e.message)
        }
        this.setFreezeOff();
    }

    hashArray = (a) => {
        const hashList = {};
        a.map(item => {
            hashList[item.id] = {id: item.id};
        });
        return hashList;
    }

    handleObjectChange = (template, value) =>  {
        const objects = {...this.state.objects};
        objects[template.id] = value;
        this.setState({objects});
    };

    handleParameterChange = (template, value) =>  {
        const parameters = {...this.state.parameters};
        parameters[template.id] = value;
        this.setState({parameters});
    };

    handleTemplateSelect(key, template) {
        this.setState({
            template, 
            parameters: this.hashArray(template.parameters), 
            objects: this.hashArray(template.objects)
        });
    }

    renderTemplateConstructor = () => {
        const template = this.state.template;
        const parameters = this.state.parameters;
        const objects = this.state.objects;
        return (
            <div className="template">
                <div className="template-name">{template.name}</div>
                {template.objects.map(o => (<TemplateObject key={o.id} object={o} data={objects[o.id]} {...this.props} handleValueChange={this.handleObjectChange}/>))}
                {template.parameters.map(p => (<TemplateParameter key={p.id} parameter={p} data={parameters[p.id]} {...this.props} handleValueChange={this.handleParameterChange} />))}
            </div>
        );
    }

    reader = new AsyncFileReader();

    loadTemplate = (e) => {
        console.log(e);
        console.log(e.target.files);
        this.setFreezeOn();
        const file = e.target.files[0];
        this.reader.read(file)
        .then(res => JSON.parse(res))
        .then(template => this.setState({template, objects: this.hashArray(template.objects), parameters: this.hashArray(template.parameters)}))
        .then(() => {
            toastr.success('success', `Loaded ${file.name}`);
        })
        .catch(e => {
            console.log(e);
            toastr.error('error', e.message);
        })
        .then(() => this.setFreezeOff());
    }

    renderContent() {
        const templateData = this.renderTemplateConstructor();

        return (
            <div className="condition-template">
                <label htmlFor="template-loader" className="datapoint-editor-button">Load Template</label>
                <input id="template-loader" type="file" onChange={this.loadTemplate}/>
                <DatapointParameter 
                    key="template"
                    onChange={this.handleTemplateSelect}
                    label="Select Template"
                    name="template"
                    data={this.state}
                    list={this.state.templates}
                    display="id"
                    match="id"
                />
                {templateData}
                <div className="action-actions">
                    <div className="datapoint-editor-button" onClick={this.createCondition}>Generate</div>
                </div>
            </div>
        );
    }
}

ConditionTemplateViewer.propTypes = {
    triggers: PropTypes.array.isRequired,
    getTriggerByID: PropTypes.func.isRequired,
    getConditionByID: PropTypes.func.isRequired,
    createNewConditionFromString: PropTypes.func.isRequired,
    conditions: PropTypes.array.isRequired,
    datapointctls: PropTypes.array.isRequired,
    templates: PropTypes.array,
    reset: PropTypes.func,
};


const mapStateToProps = state => ({
    triggers: state.triggers.items,
    conditions: state.conditions.items,
    datapointctls: state.datapointctls.items,
    templates: state.templates.items
});

const mapDispatchToProps = dispatch => {
    return {
        createNewConditionFromString: createNewConditionFromString(dispatch),
        getTriggerByID: getTriggerByID(dispatch),
        getConditionByID: getConditionByID(dispatch)
    }
  };

export default connect(mapStateToProps, mapDispatchToProps)(ConditionTemplateViewer);