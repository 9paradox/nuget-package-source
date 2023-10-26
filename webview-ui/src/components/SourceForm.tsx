import { VSCodeTextField, VSCodeCheckbox, VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { PackageSource } from "../types";

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

export default SourceForm;
