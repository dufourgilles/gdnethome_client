export default class TemplateConverter {
    constructor(objects, parameters, getConditionByID, template) {
        this.objects = objects;
        this.parameters = parameters;
        this.conditions = {};
        this.getConditionByID = getConditionByID;
        this.template = template;

    }

    addCondition(template, condition) {
        this.conditions[template.id] = condition;
    }

    getCondition(id) {
        let condition = this.conditions[id] || this.getConditionByID(id);
        if (condition) { return condition; }
        throw new Error(`Condition ${id} not found`);
    }

    convert(text) {
        let convertedText = text;
        while(true) {
            const variables = convertedText.match(/\$\{([^${}]+)\}/);
            if (variables == null) {
                break;
            }
            let value;
            const obj = variables[1].match(/objects\[(\w+)\]\.?(\w*)/);
            if (obj) {
                if (obj[2] !== "") {
                    value = this.objects[obj[1]][obj[2]];
                }
                else {
                    value = this.objects[obj[1]];
                }
            }
            else {
                const param = variables[1].match(/parameters\[(\w+)\]\.?(\w*)/);
                if (param) {
                    if (this.parameters[param[1]] == null) {
                        throw new Error(`Unknown parameters ${param[1]}`);
                    }
                    if (param[2] !== "") {
                        value = this.parameters[param[1]][param[2]];
                    }
                    else {
                        value = this.parameters[param[1]].value;
                    }
                }
                else {
                    const condition = variables[1].match(/conditions\[(\w+)\]\.?(\w*)/);
                    if (condition) {
                        if (condition[2] !== "") {
                            value = this.getCondition(condition[1])[condition[2]];
                        }
                        else {
                            value = this.getCondition(condition[1]).id;
                        }
                    }
                    else {
                        value = this.template[variables[1]];
                    }
                }
            }
            convertedText = convertedText.replace(/\$\{([^${}]+)\}/, value);
        }
        return convertedText;
    }


    /*
    "parameters":{"_type":"SwitchParameters","switchType":{"_type":"SwitchTypeParameters","value":"off"},"dataPointCtlID":"BanneSolaire"}
    "parameters":{"_type":"PercentParameters","value":100,"dataPointCtlID":"BSOHall"}
    */
   convertActionParameters(textParameters) {
       const convertedText = this.convert(textParameters).replace(/'/mg, "\"");
       return JSON.parse(convertedText);
   }
}