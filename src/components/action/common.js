export const getActionTypeIndex = (actionTypes, type) =>
  actionTypes.findIndex(({ id }) => id === type);

export const getActionTypeDefaultParameters = (actionTypes, type) => {
  const actionTypeIndex = getActionTypeIndex(actionTypes, type);
  return actionTypeIndex < 0 ||
    actionTypes[actionTypeIndex].defaultValue == null
    ? {}
    : actionTypes[actionTypeIndex].defaultValue;
};
