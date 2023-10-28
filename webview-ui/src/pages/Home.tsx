import { VSCodeButton, VSCodeDivider } from "@vscode/webview-ui-toolkit/react";
import { useState } from "react";
import ListItem from "../components/ListItem";
import SourceForm from "../components/SourceForm";
import { PackageSource } from "../types";
import { usePackageSources } from "../Store";

function Home() {
  const { packageSources } = usePackageSources();
  const [selectedPackageSource, setSelectedPackageSource] = useState<PackageSource | null>(null);

  return (
    <>
      <header className="page-header">
        <div className="header-content">
          <VSCodeButton appearance="secondary" className="mr-10">
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
              selected={selectedPackageSource?.title == source.title}
              path={source.path}
              onClick={() => setSelectedPackageSource(source)}
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
}

export default Home;
