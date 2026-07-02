// @ts-nocheck
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Api from "../utils/api";
import { queryKeys } from "./queryKeys";

const ACTION_BASE_URI = "/action";

export const fetchActionData = names => Api.get(`${ACTION_BASE_URI}/data?info=${names.join(",")}`);
export const fetchActionFiles = name => Api.get(`${ACTION_BASE_URI}/files/${name}`);
export const useActionQuery = () => useQuery({ queryKey: queryKeys.actions, queryFn: () => Api.get(ACTION_BASE_URI) });
export const useActionTypesQuery = () => useQuery({ queryKey: queryKeys.actionTypes, queryFn: () => Api.get(`${ACTION_BASE_URI}/types`) });

export const useAction = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.actions });

  return {
    actions: useActionQuery(),
    types: useActionTypesQuery(),
    create: useMutation(action => Api.post(ACTION_BASE_URI, action), { onSuccess: invalidate }),
    update: useMutation(action => Api.put(`${ACTION_BASE_URI}/{id}`, { id: action.id }, action), { onSuccess: invalidate }),
    delete: useMutation(action => Api.delete(`${ACTION_BASE_URI}/{id}`, { id: action.id }), { onSuccess: invalidate }),
    deleteFull: useMutation(action => Api.delete(`${ACTION_BASE_URI}/{id}/full`, { id: action.id }), { onSuccess: invalidate })
  };
};
