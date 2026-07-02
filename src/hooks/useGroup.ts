// @ts-nocheck
import { keyBy } from "lodash";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Api from "../utils/api";
import { queryKeys } from "./queryKeys";

const GROUP_BASE_URI = "/group";

export const expandGroups = (groups, datapoints, datapointCtls) => {
  const datapointsById = keyBy(datapoints || [], "id");
  const datapointCtlsById = keyBy(datapointCtls || [], "id");

  return (groups || []).map(group => {
    const table = group.elementType === "DataPointCtl" ? datapointCtlsById : datapointsById;
    return {
      ...group,
      elements: (group.elements || []).map(elementID => table[elementID]).filter(Boolean)
    };
  });
};

export const useGroupQuery = () => useQuery({ queryKey: queryKeys.groups, queryFn: () => Api.get(GROUP_BASE_URI) });

export const useGroup = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.groups });

  return {
    groups: useGroupQuery(),
    create: useMutation(group => Api.post(GROUP_BASE_URI, group), { onSuccess: invalidate }),
    addEndpoint: useMutation(({ groupName, endpointID }) => Api.put(`${GROUP_BASE_URI}/{name}/{id}`, { name: groupName, id: endpointID }), { onSuccess: invalidate }),
    removeEndpoint: useMutation(({ groupName, endpointID }) => Api.delete(`${GROUP_BASE_URI}/{name}/{id}`, { name: groupName, id: endpointID }), { onSuccess: invalidate }),
    delete: useMutation(group => Api.delete(`${GROUP_BASE_URI}/{id}`, { id: group.id }), { onSuccess: invalidate })
  };
};
