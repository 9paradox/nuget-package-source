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
      if (event?.data?.type == "command") {
        handleEvent(event);
      }
    });
  }, []);

  function fetch() {
    setIsLoading(true);

    vscode.postCommand({
      type: "command",
      command: "list",
      value: "",
    });
  }

  function add(packageSource: PackageSource) {
    setIsLoading(true);

    if (
      packageSources.find(
        (s) => s.path.toLocaleLowerCase() == packageSource.path.toLocaleLowerCase()
      )
    ) {
      vscode.postMessage({
        type: "onError",
        value: "Package with same source already exists",
      });
      setIsLoading(false);
      return;
    }

    vscode.postCommand({
      type: "command",
      command: "add",
      value: packageSource,
    });
  }

  function remove(packageSource: PackageSource) {
    setIsLoading(true);

    vscode.postCommand({
      type: "command",
      command: "remove",
      value: packageSource,
    });
  }

  function update(oldPackageSource: PackageSource, packageSource: PackageSource) {
    setIsLoading(true);
    
    if (
      oldPackageSource.path.toLocaleLowerCase() != packageSource.path.toLocaleLowerCase() &&
      packageSources.find(
        (s) => s.path.toLocaleLowerCase() == packageSource.path.toLocaleLowerCase()
      )
    ) {
      vscode.postMessage({
        type: "onError",
        value: "Package with same source already exists",
      });
      setIsLoading(false);
      return;
    }

    vscode.postCommand({
      type: "command",
      command: "update",
      value: { old: oldPackageSource, new: packageSource },
    });
  }

  function enable(packageSource: PackageSource) {
    setIsLoading(true);

    vscode.postCommand({
      type: "command",
      command: "enable",
      value: packageSource,
    });
  }

  function disable(packageSource: PackageSource) {
    setIsLoading(true);

    vscode.postCommand({
      type: "command",
      command: "disable",
      value: packageSource,
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

  function handleAdd(result: Result<boolean>) {
    if (!result || !result.data) {
      vscode.postMessage({
        type: "onError",
        value: result.error ?? "Error while adding package sources",
      });
      setIsLoading(false);
      return;
    }

    vscode.postMessage({
      type: "onInfo",
      value: "New package source added successfully",
    });

    fetch();
  }

  function handleRemove(result: Result<boolean>) {
    if (!result || !result.data) {
      vscode.postMessage({
        type: "onError",
        value: result.error ?? "Error while removing package sources",
      });
      setIsLoading(false);
      return;
    }

    vscode.postMessage({
      type: "onInfo",
      value: "Package source removed successfully",
    });

    fetch();
  }

  function handleUpdate(result: Result<boolean>) {
    if (!result || !result.data) {
      vscode.postMessage({
        type: "onError",
        value: result.error ?? "Error while updating package sources",
      });
      setIsLoading(false);
      return;
    }

    vscode.postMessage({
      type: "onInfo",
      value: "Package source updated successfully",
    });

    fetch();
  }

  function handleEnable(result: Result<boolean>) {
    if (!result || !result.data) {
      vscode.postMessage({
        type: "onError",
        value: result.error ?? "Error while enabling package sources",
      });
      setIsLoading(false);
      return;
    }

    vscode.postMessage({
      type: "onInfo",
      value: "Package source enabled successfully",
    });

    fetch();
  }

  function handleDisable(result: Result<boolean>) {
    if (!result || !result.data) {
      vscode.postMessage({
        type: "onError",
        value: result.error ?? "Error while disabling package sources",
      });
      setIsLoading(false);
      return;
    }

    vscode.postMessage({
      type: "onInfo",
      value: "Package source disabled successfully",
    });

    fetch();
  }

  function handleEvent(event: MessageEvent<any>) {
    try {
      switch (event.data.command) {
        case "list":
          handleList(event.data.value);
          break;
        case "add":
          handleAdd(event.data.value);
          break;
        case "remove":
          handleRemove(event.data.value);
          break;
        case "update":
          handleUpdate(event.data.value);
          break;
        case "enable":
          handleEnable(event.data.value);
          break;
        case "disable":
          handleDisable(event.data.value);
          break;
      }
    } catch (e: unknown) {
      vscode.postMessage({
        type: "onError",
        value: "Some error occurred",
      });
      console.error("handleEvent.error", e);
    }
  }

  return {
    packageSources,
    fetch,
    add,
    remove,
    update,
    enable,
    disable,
    isLoading,
  };
};
