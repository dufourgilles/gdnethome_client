// @ts-nocheck
import React, { createContext, useContext, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useActionQuery, useActionTypesQuery } from "./useAction";
import { useConditionQuery, useConditionTypesQuery } from "./useCondition";
import { useDatapointQuery, useDatapointTypesQuery } from "./useDatapoint";
import { useDatapointCtlQuery, useDatapointCtlTypesQuery } from "./useDatapointCtl";
import { useGroupQuery } from "./useGroup";
import { useReplayFilesQuery, useReplayInfoQuery } from "./useReplay";
import { useTemplateQuery, useTriggerQuery } from "./useSystem";

const QueryStateContext = createContext(null);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchInterval: () => {
        const polling = window.Config?.polling || {};
        return polling.system || polling.default || false;
      },
      retry: 1
    }
  }
});

const QueryStateProvider = ({ children }) => {
  const actionsQuery = useActionQuery();
  const actionTypesQuery = useActionTypesQuery();
  const conditionsQuery = useConditionQuery();
  const conditionTypesQuery = useConditionTypesQuery();
  const datapointsQuery = useDatapointQuery();
  const datapointTypesQuery = useDatapointTypesQuery();
  const datapointCtlsQuery = useDatapointCtlQuery();
  const datapointCtlTypesQuery = useDatapointCtlTypesQuery();
  const groupsQuery = useGroupQuery();
  const replayInfoQuery = useReplayInfoQuery();
  const replayFilesQuery = useReplayFilesQuery();
  const templatesQuery = useTemplateQuery();
  const triggersQuery = useTriggerQuery();

  const state = useMemo(() => {
    const queries = [
      actionsQuery,
      actionTypesQuery,
      conditionsQuery,
      conditionTypesQuery,
      datapointsQuery,
      datapointTypesQuery,
      datapointCtlsQuery,
      datapointCtlTypesQuery,
      groupsQuery,
      replayInfoQuery,
      replayFilesQuery,
      templatesQuery,
      triggersQuery
    ];
    const isFetching = queries.some(query => query.isLoading || query.isFetching);
    const error = queries.find(query => query.error)?.error?.message || null;
    const isReady = queries.every(query => query.isSuccess || query.data !== undefined);

    return {
      app: { isFetching, isReady, error }
    };
  }, [
    actionsQuery.data,
    actionsQuery.isFetching,
    actionTypesQuery.data,
    conditionsQuery.data,
    conditionsQuery.isFetching,
    conditionTypesQuery.data,
    datapointsQuery.data,
    datapointsQuery.isFetching,
    datapointTypesQuery.data,
    datapointCtlsQuery.data,
    datapointCtlsQuery.isFetching,
    datapointCtlTypesQuery.data,
    groupsQuery.data,
    groupsQuery.isFetching,
    replayInfoQuery.data,
    replayInfoQuery.isFetching,
    replayFilesQuery.data,
    replayFilesQuery.isFetching,
    templatesQuery.data,
    triggersQuery.data,
    triggersQuery.isFetching
  ]);

  return (
    <QueryStateContext.Provider value={state}>
      {children}
    </QueryStateContext.Provider>
  );
};

export const AppQueryProvider = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <QueryStateProvider>{children}</QueryStateProvider>
  </QueryClientProvider>
);

export const useAppQueryStatus = () => useContext(QueryStateContext);
