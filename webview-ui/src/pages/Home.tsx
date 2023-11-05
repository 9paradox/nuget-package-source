import { VSCodeButton, VSCodeDivider } from "@vscode/webview-ui-toolkit/react";
import { useState } from "react";
import ListItem from "../components/ListItem";
import SourceForm from "../components/SourceForm";
import { PackageSource } from "../types";
import { usePackageSources } from "../Store";
import LoadingOverlay from "../components/LoadingOverlay";
import ConfirmDeleteOverlay from "../components/ConfirmOverlay";

function Home() {
  const { packageSources, isLoading, add, remove, update } = usePackageSources();
  const [selectedPackageSource, setSelectedPackageSource] = useState<PackageSource | null>(null);
  const [isAdd, setIsAdd] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  function onAddClick() {
    setIsAdd(true);
    setSelectedPackageSource({
      title: "",
      path: "",
      checked: false,
    });
  }

  function addPackage(source: PackageSource) {
    add(source);
    setIsAdd(false);
    setSelectedPackageSource(null);
  }

  function updatePackage(source: PackageSource) {
    if (!selectedPackageSource) return;
    update(selectedPackageSource, source);
    setIsAdd(false);
    setSelectedPackageSource(null);
  }

  function onDeleteClick() {
    if (!selectedPackageSource) return;
    setIsDelete(true);
    setIsAdd(false);
  }

  function removePackage() {
    if (!selectedPackageSource) return;
    if (!isDelete) return;
    setIsAdd(false);
    setIsDelete(false);
    remove(selectedPackageSource);
    setSelectedPackageSource(null);
  }

  function onCancelDeleteClick() {
    setIsDelete(false);
  }

  function formSubmit(source: PackageSource) {
    if (isAdd) {
      addPackage(source);
    } else {
      updatePackage(source);
    }
  }

  return (
    <>
      <header className="page-header">
        <div className="header-content">
          <VSCodeButton appearance="secondary" className="mr-10" onClick={onAddClick}>
            Add
          </VSCodeButton>
          <VSCodeButton
            appearance="secondary"
            disabled={!selectedPackageSource || isAdd}
            onClick={onDeleteClick}>
            Delete
          </VSCodeButton>
        </div>
      </header>
      <VSCodeDivider role="presentation"></VSCodeDivider>
      <div className="page-content">
        <div className="list-box">
          {packageSources.map((source) => (
            <ListItem
              title={source.title}
              checked={source.checked}
              selected={selectedPackageSource?.title == source.title}
              path={source.path}
              onClick={() => {
                setIsAdd(false);
                setSelectedPackageSource(source);
              }}
            />
          ))}
        </div>
      </div>
      <VSCodeDivider role="presentation"></VSCodeDivider>
      <footer className="page-footer">
        <p className="mb-16 text-center">{isAdd && "Add"} Source</p>
        <div className="footer-content">
          {selectedPackageSource ? (
            <SourceForm packageSource={selectedPackageSource} onSubmit={formSubmit} />
          ) : (
            <p className="text-center"> {isLoading ? "..." : "No package selected"}</p>
          )}
        </div>
      </footer>
      {isDelete && selectedPackageSource && (
        <ConfirmDeleteOverlay onDelete={removePackage} onCancel={onCancelDeleteClick} />
      )}
      {isLoading && <LoadingOverlay />}
    </>
  );
}

export default Home;
