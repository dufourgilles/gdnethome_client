// @ts-nocheck
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Api from "../utils/api";
import { queryKeys } from "./queryKeys";

const CONDITION_BASE_URI = "/condition";
const withNone = conditions => [{ id: "none" }].concat(conditions || []);

export const getConditionEvents = conditionID => Api.get(`${CONDITION_BASE_URI}/${conditionID}/stats`);
export const useConditionQuery = () => useQuery({ queryKey: queryKeys.conditions, queryFn: () => Api.get(CONDITION_BASE_URI).then(withNone) });
export const useConditionTypesQuery = () => useQuery({ queryKey: queryKeys.conditionTypes, queryFn: () => Api.get(`${CONDITION_BASE_URI}/types`) });

export const useCondition = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.conditions });

  return {
    conditions: useConditionQuery(),
    types: useConditionTypesQuery(),
    create: useMutation(condition => Api.post(CONDITION_BASE_URI, condition), { onSuccess: invalidate }),
    createFromString: useMutation(({ name, stringCondition }) => Api.post(`${CONDITION_BASE_URI}/string/${name}`, stringCondition, { headers: { "Content-Type": "text/plain" } }), { onSuccess: invalidate }),
    update: useMutation(condition => Api.put(`${CONDITION_BASE_URI}/{id}`, { id: condition.id }, condition), { onSuccess: invalidate }),
    delete: useMutation(condition => Api.delete(`${CONDITION_BASE_URI}/{id}`, { id: condition.id }), { onSuccess: invalidate })
  };
};
