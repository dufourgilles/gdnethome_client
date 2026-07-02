// @ts-nocheck
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Api from "../utils/api";
import { queryKeys } from "./queryKeys";

const DATAPOINT_BASE_URI = "/datapoint";

const fetchDataPointCtls = () => Api.get(`${DATAPOINT_BASE_URI}/controllers`);
const fetchDPCTLTypes = () => Api.get(`${DATAPOINT_BASE_URI}/ctltypes`);

export const useDatapointCtlQuery = () => useQuery({ queryKey: queryKeys.datapointCtls, queryFn: fetchDataPointCtls });
export const useDatapointCtlTypesQuery = () => useQuery({ queryKey: queryKeys.datapointCtlTypes, queryFn: fetchDPCTLTypes });

export const useDatapointCtl = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.datapointCtls });

  return {
    datapointCtls: useDatapointCtlQuery(),
    types: useDatapointCtlTypesQuery(),
    create: useMutation(dataPointCtl => Api.post(`${DATAPOINT_BASE_URI}/controller`, dataPointCtl), { onSuccess: invalidate }),
    update: useMutation(dataPointCtl => Api.put(`${DATAPOINT_BASE_URI}/controller/{id}`, { id: dataPointCtl.id }, dataPointCtl), { onSuccess: invalidate }),
    delete: useMutation(datapoint => Api.delete(`${DATAPOINT_BASE_URI}/controller/{id}`, { id: datapoint.id }), { onSuccess: invalidate }),
    deleteAll: useMutation(() => Api.delete(`${DATAPOINT_BASE_URI}/controller/all`), { onSuccess: invalidate }),
    executeAction: useMutation(({ dataPointCtl, action, parameter }) => Api.post(`${DATAPOINT_BASE_URI}/controller/${dataPointCtl.id}/action/${action}`, parameter), { onSuccess: invalidate })
  };
};
