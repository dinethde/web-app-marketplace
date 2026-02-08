// Copyright (c) 2025 WSO2 LLC. (https://www.wso2.com).
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
import { Alert, Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { useFormik } from "formik";

import { useState } from "react";

import { CreateAppPayload, useCreateAppMutation } from "@root/src/services/app.api";
import { useGetUserGroupsQuery } from "@root/src/services/groups.api";
import { useGetTagsQuery } from "@root/src/services/tag.api";
import { useGetUserInfoQuery } from "@root/src/services/user.api";

import { validationSchema } from "../../utils/CreateAppSchema";
import AppStatusToggle from "./components/AppStatusToggle";
import FileUploadArea from "./components/FileUploadArea";
import TagSelector from "./components/TagSelector";
import UserGroupSelector from "./components/UserGroupSelector";

interface FileWithPreview {
  file: File;
  preview: string;
  uploading: boolean;
  progress: number;
  error: string | null;
}

export default function CreateApp() {
  // RTK Query hooks
  const { data: userInfo } = useGetUserInfoQuery();
  const { data: tags = [] } = useGetTagsQuery();
  const { data: groups = [] } = useGetUserGroupsQuery();
  const [createAppMutation, { isLoading: isCreating, isError, error }] = useCreateAppMutation();
  const theme = useTheme();

  const [filePreview, setFilePreview] = useState<FileWithPreview | null>(null);
  const userEmail = userInfo?.workEmail ?? "";

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      link: "",
      versionName: "",
      tags: [] as number[],
      groupIds: [] as string[],
      icon: null as File | null,
      isActive: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!values.icon) return;

      // Convert icon file to base64 string
      const reader = new FileReader();
      reader.readAsDataURL(values.icon);
      reader.onload = async () => {
        const base64Icon = reader.result as string;

        const payload: CreateAppPayload = {
          name: values.title.trim(),
          url: values.link.trim(),
          description: values.description.trim(),
          versionName: values.versionName.trim(),
          tags: values.tags,
          icon: base64Icon,
          userGroups: values.groupIds,
          isActive: values.isActive,
          addedBy: userEmail,
        };

        try {
          await createAppMutation(payload).unwrap();
          formik.resetForm();
          setFilePreview(null);
        } catch (error) {
          formik.resetForm();
          console.error("Failed to create app:", error);
        }
      };

      reader.onerror = () => {
        formik.setFieldError("icon", "Failed to read icon file");
      };
    },
  });

  const handleCancel = () => {
    formik.resetForm();
    setFilePreview(null);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        p: 3,
      }}
    >
      <Box sx={{ overflowY: "auto", width: "100%" }}>
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
            {/* Left Column - Basic Info, Tags, Groups */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: 3,
              }}
            >
              {/* App Name */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography
                  variant="body1"
                  sx={{ ml: 0.5, color: theme.palette.customText.primary.p2.active }}
                >
                  App Name
                </Typography>
                <TextField
                  fullWidth
                  name="title"
                  placeholder="Web App Marketplace"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && (formik.errors.title as string)}
                  disabled={isCreating}
                />
              </Box>

              {/* App URL and Version Name in Row */}
              <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%" }}>
                  <Typography
                    variant="body1"
                    sx={{ ml: 0.5, color: theme.palette.customText.primary.p2.active }}
                  >
                    App Url
                  </Typography>
                  <TextField
                    fullWidth
                    name="link"
                    placeholder="www.wso2.com"
                    value={formik.values.link}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.link && Boolean(formik.errors.link)}
                    helperText={formik.touched.link && (formik.errors.link as string)}
                    disabled={isCreating}
                  />
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%" }}>
                  <Typography
                    variant="body1"
                    sx={{ ml: 0.5, color: theme.palette.customText.primary.p2.active }}
                  >
                    App Version Name
                  </Typography>
                  <TextField
                    fullWidth
                    name="versionName"
                    placeholder="Beta"
                    value={formik.values.versionName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.versionName && Boolean(formik.errors.versionName)}
                    helperText={formik.touched.versionName && (formik.errors.versionName as string)}
                    disabled={isCreating}
                  />
                </Box>
              </Box>

              {/* App Description */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography
                  variant="body1"
                  sx={{ ml: 0.5, color: theme.palette.customText.primary.p2.active }}
                >
                  App Description
                </Typography>
                <TextField
                  fullWidth
                  name="description"
                  placeholder="Web App Marketplace"
                  multiline
                  rows={3}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && (formik.errors.description as string)}
                  disabled={isCreating}
                />
              </Box>

              <TagSelector formik={formik} tags={tags} isDisabled={isCreating} />

              <UserGroupSelector formik={formik} groups={groups} isDisabled={isCreating} />
            </Box>

            {/* Right Column - File Upload, Status, Error */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <FileUploadArea
                formik={formik}
                filePreview={filePreview}
                setFilePreview={setFilePreview}
              />

              {isError && error && (
                <Alert severity="error">
                  {"data" in error &&
                  typeof error.data === "object" &&
                  error.data &&
                  "message" in error.data
                    ? String(error.data.message)
                    : "Failed to create application. Please try again."}
                </Alert>
              )}

              <AppStatusToggle formik={formik} isDisabled={isCreating} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  gap: 2,
                  height: "100%",
                }}
              >
                <Button disabled={isCreating} onClick={handleCancel} variant="outlined">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={isCreating || !formik.isValid}>
                  {isCreating ? "Creating..." : "Create App"}
                </Button>
              </Box>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
