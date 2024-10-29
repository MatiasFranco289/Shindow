"use client";

import { RESOURCE_LIST_ENDPOINT } from "@/constants";
import axiosInstance from "@/utils/axiosInstance";
import EnvironmentManager from "@/utils/EnvironmentManager";
import { useEffect } from "react";

export default function FileExplorer() {
  const environmentManager = EnvironmentManager.getInstance();
  const apiBaseUrl = environmentManager.GetEnvironmentVariable(
    "NEXT_PUBLIC_API_BASE_URL"
  );
  const resourceListEndpoint = `${apiBaseUrl}${RESOURCE_LIST_ENDPOINT}`;

  useEffect(() => {
    axiosInstance
      .get(resourceListEndpoint)
      .then((response) => {
        console.log("It works!");
        console.log(response);
      })
      .catch((err) => {
        console.log("Not working.");
        console.log(err);
      });
  }, []);

  return (
    <div>
      <h1>File explorer</h1>
    </div>
  );
}
