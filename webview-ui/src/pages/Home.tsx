import { VSCodeButton, VSCodeDivider } from "@vscode/webview-ui-toolkit/react";
import { useState } from "react";
import ListItem from "../components/ListItem";
import SourceForm from "../components/SourceForm";
import { PackageSource } from "../types";
import { usePackageSources } from "../Store";

function Home() {
  const { packageSources, isLoading, add, remove, update } = usePackageSources();
  const [selectedPackageSource, setSelectedPackageSource] = useState<PackageSource | null>(null);
  const [isAdd, setIsAdd] = useState(false);

  function onAddClick() {
    setIsAdd(true);
    setSelectedPackageSource({
      title: "",
      path: "",
      checked: true,
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

  function removePackage() {
    if (!selectedPackageSource) return;
    //TODO: confirm before remove
    remove(selectedPackageSource);
    setIsAdd(false);
    setSelectedPackageSource(null);
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
            disabled={!selectedPackageSource}
            onClick={removePackage}>
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
            <p className="text-center">No package selected</p>
          )}
        </div>
      </footer>
      {isLoading && (
        <div
          className="overlay-loading"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}>
          <p>Loading...</p>
        </div>
      )}
    </>
  );
}

export default Home;
