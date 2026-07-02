// @ts-nocheck
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Api from "../utils/api";
import { queryKeys } from "./queryKeys";

const DATAPOINT_BASE_URI = "/datapoint";

export const fixDatapoints = datapoints =>
  (datapoints || []).map(datapoint => ({
    ...datapoint,
    protocol: datapoint.protocol || "knx"
  }));

const fetchDatapoints = () => Api.get(DATAPOINT_BASE_URI).then(fixDatapoints);

const fetchDatapointTypes = () =>
  Api.get(`${DATAPOINT_BASE_URI}/types`).then(response => {
    const dptypes = [];
    for (let name in response.names) {
      dptypes.push({ name, id: response.names[name] });
    }
    return dptypes.sort((a, b) => a.name.localeCompare(b.name));
  });

export const useDatapointQuery = () => useQuery({ queryKey: queryKeys.datapoints, queryFn: fetchDatapoints });
export const useDatapointTypesQuery = () => useQuery({ queryKey: queryKeys.datapointTypes, queryFn: fetchDatapointTypes });

export const useDatapoint = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.datapoints });

  return {
    datapoints: useDatapointQuery(),
    types: useDatapointTypesQuery(),
    create: useMutation(datapoint => Api.post(DATAPOINT_BASE_URI, datapoint), { onSuccess: invalidate }),
    update: useMutation(datapoint => Api.put(`${DATAPOINT_BASE_URI}/{id}`, { id: datapoint.id }, datapoint), { onSuccess: invalidate }),
    delete: useMutation(datapoint => Api.delete(`${DATAPOINT_BASE_URI}/{id}`, { id: datapoint.id }), { onSuccess: invalidate }),
    deleteAll: useMutation(() => Api.delete(`${DATAPOINT_BASE_URI}/all`), { onSuccess: invalidate }),
    upload: useMutation(data => Api.post(`${DATAPOINT_BASE_URI}/upload`, data, { headers: { "Content-Type": "text/plain" } }), { onSuccess: invalidate }),
    importSomfy: useMutation(() => Api.post(`${DATAPOINT_BASE_URI}/import/somfy`), { onSuccess: invalidate }),
    updateSomfyKNXLink: useMutation(({ id, link }) => Api.put(`${DATAPOINT_BASE_URI}/{id}/knxlink`, { id }, link), { onSuccess: invalidate }),
    deleteSomfyKNXLink: useMutation(id => Api.delete(`${DATAPOINT_BASE_URI}/{id}/knxlink`, { id }), { onSuccess: invalidate }),
    updateKNXSomfyLink: useMutation(({ id, link }) => Api.put(`${DATAPOINT_BASE_URI}/{id}/somfylink`, { id }, link), { onSuccess: invalidate }),
    deleteKNXSomfyLink: useMutation(id => Api.delete(`${DATAPOINT_BASE_URI}/{id}/somfylink`, { id }), { onSuccess: invalidate })
  };
};
