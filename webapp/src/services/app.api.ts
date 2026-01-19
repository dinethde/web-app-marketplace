// Copyright (c) 2026 WSO2 LLC. (https://www.wso2.com).
//
// WSO2 LLC. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.
import { createApi } from "@reduxjs/toolkit/query/react";

import { AppConfig } from "@config/config";
import { UpdateAction } from "@root/src/types/types";

import { baseQueryWithRetry } from "./BaseQuery";

export type Tag = {
  id: number;
  name: string;
  color: string;
};

export type UserApp = {
  id: number;
  name: string;
  url: string;
  description: string;
  versionName: string;
  icon: string;
  tags: Tag[];
  addedBy: string;
  isFavourite: 0 | 1;
};

export type App = {
  id: number;
  name: string;
  url: string;
  description: string;
  versionName: string;
  icon: string;
  tags: Tag[];
  userGroups?: string[];
  addedBy: string;
  isActive: boolean;
};

export type UpdateAppPayload = {
  id?: number;
  name?: string;
  url?: string;
  description?: string;
  versionName?: string;
  icon?: string;
  tags?: Tag[];
  userGroups?: string[];
  isActive?: boolean;
  updatedBy: string;
};

export type CreateAppPayload = {
  name: string;
  url: string;
  description: string;
  versionName: string;
  tags: number[];
  icon: string;
  userGroups: string[];
  isActive: boolean;
  addedBy: string;
};

interface AppResponse {
  message: string;
}

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: baseQueryWithRetry,
  tagTypes: ["Apps", "UserApps"],
  endpoints: (builder) => ({
    getApps: builder.query<App[], void>({
      query: () => AppConfig.serviceUrls.apps,
      providesTags: ["Apps"],
    }),
    getUserApps: builder.query<UserApp[], string>({
      query: (userEmail) => `${AppConfig.serviceUrls.apps}/${userEmail}`,
      providesTags: ["UserApps"],
    }),
    createApp: builder.mutation<AppResponse, CreateAppPayload>({
      query: (payload) => ({
        url: AppConfig.serviceUrls.apps,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Apps", "UserApps"],
    }),
    updateApp: builder.mutation<AppResponse, { id: number; payload: UpdateAppPayload }>({
      query: ({ id, payload }) => ({
        url: `${AppConfig.serviceUrls.apps}/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Apps", "UserApps"],
    }),
    upsertAppFavourite: builder.mutation<void, { id: number; action: UpdateAction }>({
      query: ({ id, action }) => ({
        url: `${AppConfig.serviceUrls.apps}/${id}/${action}`,
        method: "POST",
      }),
      // Optimistic update for better UX
      async onQueryStarted({ id, action }, { dispatch, queryFulfilled, getState }) {
        // Get the current user email from state to update the right cache
        const state = getState() as any;
        const userEmail = state.user?.userInfo?.workEmail;

        if (userEmail) {
          const patchResult = dispatch(
            appApi.util.updateQueryData("getUserApps", userEmail, (draft) => {
              const app = draft.find((app) => app.id === id);
              if (app) {
                app.isFavourite = action === UpdateAction.Favorite ? 1 : 0;
              }
            }),
          );

          try {
            await queryFulfilled;
          } catch {
            patchResult.undo();
          }
        }
      },
      invalidatesTags: ["UserApps"],
    }),
  }),
});

export const {
  useGetAppsQuery,
  useLazyGetAppsQuery,
  useGetUserAppsQuery,
  useLazyGetUserAppsQuery,
  useCreateAppMutation,
  useUpdateAppMutation,
  useUpsertAppFavouriteMutation,
} = appApi;
