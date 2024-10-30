"use client";

import { RESOURCE_LIST_ENDPOINT } from "@/constants";
import { Resource } from "@/interfaces";
import axiosInstance from "@/utils/axiosInstance";
import EnvironmentManager from "@/utils/EnvironmentManager";
import { useEffect, useState } from "react";
import DirectoryIcon from "@/components/directoryIcon";
import FileIcon from "@/components/fileIcon";
import { normalizeName } from "@/utils/utils";

export default function FileExplorer() {
  const environmentManager = EnvironmentManager.getInstance();
  const apiBaseUrl = environmentManager.GetEnvironmentVariable(
    "NEXT_PUBLIC_API_BASE_URL"
  );
  const resourceListEndpoint = `${apiBaseUrl}${RESOURCE_LIST_ENDPOINT}`;
  const [resourceList, setResourceList] = useState<Array<Resource>>([]);
  const [selectedResourceName, setSelectedResourceName] = useState<string>("");
  // TODO: Files with spaces in the name are not retrieved correctly by the api
  useEffect(() => {
    axiosInstance
      .get(resourceListEndpoint)
      .then((response) => {
        const resources: Array<Resource> = response.data.data.map(
          (resource: Resource) => {
            return { ...resource, name: normalizeName(resource.name) };
          }
        );

        setResourceList(resources);
      })
      .catch((err) => {
        // TODO: Add error handling
        console.log("Not working.");
        console.log(err);
      });
  }, []);

  return (
    <div className="bg-[#052529] w-full min-h-screen flex flex-wrap content-start items-start">
      {resourceList.map((resource, index) => {
        if (resource.isDirectory) {
          return (
            <DirectoryIcon
              name={resource.name}
              key={`resource_${index}`}
              isSelected={selectedResourceName === resource.name}
              setSelectedResourceName={setSelectedResourceName}
            />
          );
        } else {
          return (
            <FileIcon
              name={resource.name}
              key={`resource_${index}`}
              isSelected={selectedResourceName === resource.name}
              setSelectedResourceName={setSelectedResourceName}
            />
          );
        }
      })}
    </div>
  );
}
