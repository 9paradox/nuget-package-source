import { atom, useAtom } from "jotai";
import { PackageSource, Result } from "./types";
import { useEffect, useState } from "react";
import { vscode } from "./utilities/vscode";

const packageSourcesAtom = atom<PackageSource[]>([]);

export const usePackageSources = () => {
  const [packageSources, setPackageSources] = useAtom(packageSourcesAtom);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch();

    window.addEventListener("message", (event) => {
      console.log(event);
      if (event?.data?.command?.type == "command") {
        handleEvent(event);
      }
    });
  }, []);

  function fetch() {
    setIsLoading(true);
    vscode.postMessage({
      type: "command",
      value: "list",
    });
  }

  function handleList(result: Result<PackageSource[]>) {
    if (!result || !result.data) {
      vscode.postMessage({
        type: "onError",
        value: result.error ?? "Error while listing package sources",
      });
      setIsLoading(false);
      return;
    }

    setPackageSources(result.data);

    setIsLoading(false);
  }

  function handleEvent(event: MessageEvent<any>) {
    try {
      switch (event.data.command.value) {
        case "list":
          handleList(event.data.value);
          break;
      }
    } catch (e: unknown) {
      vscode.postMessage({
        type: "onError",
        value: "Some error occurred",
      });
      console.error("asd", e);
    }
  }

  return {
    packageSources,
    fetch,
    isLoading,
  };
};
