// @ts-nocheck
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Api from "../utils/api";
import { queryKeys } from "./queryKeys";

const REPLAY_BASE_URI = "/replay";

export const getReplayFile = filename => Api.get(`${REPLAY_BASE_URI}/file/${filename}`);
export const useReplayInfoQuery = () => useQuery({ queryKey: queryKeys.replayInfo, queryFn: () => Api.get(`${REPLAY_BASE_URI}/`) });
export const useReplayFilesQuery = () => useQuery({ queryKey: queryKeys.replayFiles, queryFn: () => Api.get(`${REPLAY_BASE_URI}/files`).then(files => files.map(f => ({ id: f }))) });

export const useReplay = () => {
  const queryClient = useQueryClient();
  return {
    info: useReplayInfoQuery(),
    files: useReplayFilesQuery(),
    update: useMutation(replayInfo => Api.put(`${REPLAY_BASE_URI}/`, null, replayInfo), {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.replayInfo })
    })
  };
};
