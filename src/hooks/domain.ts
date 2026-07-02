// @ts-nocheck
import { keyBy } from "lodash";

export const getById = items => id => keyBy(items || [], "id")[id];
export const getByName = items => name => keyBy(items || [], "name")[name];

export const getEmptyDatapoint = () => ({
  protocol: "knx",
  name: "",
  id: "",
  description: "",
  knxName: "",
  knxID: "",
  knxAddress: "",
  knxGroupName: "",
  somfyDeviceURL: "",
  somfyStateName: "",
  somfyCommandName: "",
  somfyCommandParameters: [],
  type: "",
  actions: [],
  statusReaderID: null
});

export const getEmptyDatapointCtl = () => ({
  name: "",
  id: "",
  type: "SwitchCtl",
  actions: [],
  statusReaderID: null,
  commandWriterID: null
});

export const getEmptyCondition = () => ({
  id: "",
  name: "",
  operator: "EQUAL",
  conditionIDs: [],
  triggerValue: 0,
  emitChangesOnly: true,
  triggerEventID: ""
});

export const getEmptyAction = () => ({
  id: "",
  type: "SaveEventAction",
  parameters: {},
  triggerEventID: "",
  conditionID: "",
  enable: true,
  maxExecute: 0,
  minIntervalSeconds: 0,
  executeIntervalSeconds: 0,
  delaySeconds: 0
});

export const EMPTY_TRIGGER = {
  id: "",
  value: ""
};
