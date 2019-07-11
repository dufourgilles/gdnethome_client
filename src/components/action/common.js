export const getActionTypeIndex = (actionTypes, type) => {
    for(let i = 0; i < actionTypes.length; i++) {
        if (actionTypes[i].id === type) {
            return i;
        }
    }
    return -1;
}

export const getActionTypeDefaultParameters = (actionTypes, type) => {
    const actionTypeIndex = getActionTypeIndex(actionTypes, type);
    if (actionTypeIndex < 0 || actionTypes[actionTypeIndex].defaultValue == null) {
        return {};
    }
    return actionTypes[actionTypeIndex].defaultValue;
}