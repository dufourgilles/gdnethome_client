// @ts-nocheck
import { useQuery } from "@tanstack/react-query";
import Api from "../utils/api";
import { queryKeys } from "./queryKeys";

export const useTriggerQuery = () => useQuery({ queryKey: queryKeys.triggers, queryFn: () => Api.get("/trigger").then(triggers => [{ id: "none" }].concat(triggers || [])) });
export const useTemplateQuery = () => useQuery({ queryKey: queryKeys.templates, queryFn: () => Api.get("/template") });
export const useConfigQuery = () => useQuery({ queryKey: queryKeys.config, queryFn: () => Api.get("/config/"), enabled: false });
export const useStatusQuery = () => useQuery({ queryKey: queryKeys.status, queryFn: () => Api.get("/status/"), enabled: false });

export const updateConfig = config => Api.put("/config/", {}, config);
export const updateInterface = (name, interfaceConfig) => Api.put("/config/files/{name}", { name }, interfaceConfig);
export const getLogFilePath = () => `${window.Config.serverURL}/status/logs`;
export const getLogTail = len => Api.get(`/status/tail/${len}`);
