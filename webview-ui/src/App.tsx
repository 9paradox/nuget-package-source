import {
  VSCodeButton,
  VSCodeCheckbox,
  VSCodeDivider,
  VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react";
import "./App.css";
import { useState } from "react";
import { vscode } from "./utilities/vscode";

//TODO: refactor into separate modules

interface PackageSource {
  title: string;
  path: string;
  checked: boolean;
  selected: boolean;
}

const PackageSources: PackageSource[] = [];

for (let i = 0; i < 20; i++) {
  PackageSources.push({
    title: `Package Source ${i + 1}`,
    path: `C:\\path\\to\\AppData\\Roaming ${i + 1}`,
    checked: false,
    selected: false,
  });
}

function App() {
  const [packageSources, setPackageSources] = useState<PackageSource[]>(PackageSources);
  const [selectedPackageSource, setSelectedPackageSource] = useState<PackageSource | null>(null);

  function updatePackageOnSelected(source: PackageSource) {
    setPackageSources(
      packageSources.map((s) => {
        s.selected = source.title === s.title;
        return s;
      })
    );
    setSelectedPackageSource(source);
  }
  return (
    <>
      <header className="page-header">
        <div className="header-content">
          <VSCodeButton
            appearance="secondary"
            className="mr-10"
            onClick={() => {
              vscode.postMessage({ type: "onInfo", value: "TODO: Add" });
            }}>
            Add
          </VSCodeButton>
          <VSCodeButton appearance="secondary">Delete</VSCodeButton>
        </div>
      </header>
      <VSCodeDivider role="presentation"></VSCodeDivider>
      <div className="page-content">
        <div className="list-box">
          {packageSources.map((source) => (
            <ListItem
              title={source.title}
              checked={source.checked}
              selected={source.selected}
              path={source.path}
              onClick={() => updatePackageOnSelected(source)}
            />
          ))}
        </div>
      </div>
      <VSCodeDivider role="presentation"></VSCodeDivider>
      <footer className="page-footer">
        <p className="mb-16 text-center">Source</p>
        <div className="footer-content">
          <SourceForm packageSource={selectedPackageSource} />
        </div>
      </footer>
    </>
  );

  interface SourceFormProps {
    packageSource: PackageSource | null;
  }

  function SourceForm(prop: SourceFormProps) {
    if (!prop.packageSource) {
      return <p className="text-center">No package selected</p>;
    }
    return (
      <>
        <VSCodeTextField
          type="text"
          placeholder="package name"
          className="mb-10"
          value={prop.packageSource.title}>
          Name
        </VSCodeTextField>
        <VSCodeTextField
          type="text"
          placeholder="package source"
          className="mb-10"
          value={prop.packageSource.path}>
          Path
        </VSCodeTextField>
        <VSCodeCheckbox className="mb-10" checked={prop.packageSource.checked}>
          Enable
        </VSCodeCheckbox>
        <VSCodeButton appearance="primary" className="mb-10">
          Save
        </VSCodeButton>
      </>
    );
  }
}

interface ListItemProps {
  title: string;
  path: string;
  checked: boolean;
  selected: boolean;
  onClick: () => void;
}

function ListItem(prop: ListItemProps) {
  return (
    <div className={prop.selected ? "list-item-active" : "list-item"} onClick={prop.onClick}>
      <VSCodeCheckbox className="list-item-checkbox" checked={prop.checked} />
      <div>
        <div>{prop.title}</div>
        <sub>{prop.path}</sub>
      </div>
    </div>
  );
}

export default App;
