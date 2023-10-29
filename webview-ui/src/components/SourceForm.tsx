import { VSCodeTextField, VSCodeCheckbox, VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { PackageSource } from "../types";
import { useEffect, useState } from "react";

interface SourceFormProps {
  packageSource: PackageSource;
  onSubmit: (source: PackageSource) => void;
}

function SourceForm(prop: SourceFormProps) {
  const [name, setName] = useState(prop.packageSource.title);
  const [path, setPath] = useState(prop.packageSource.path);
  const [enabled, setEnabled] = useState(prop.packageSource.checked);

  useEffect(() => {
    setName(prop.packageSource.title);
    setPath(prop.packageSource.path);
    setEnabled(prop.packageSource.checked);
  }, [prop.packageSource.path]);

  function submit() {
    if (!name.length || !path.length) return;

    prop.onSubmit({
      title: name,
      path: path,
      checked: enabled,
    });

    setName("");
    setPath("");
    setEnabled(false);
  }

  return (
    <>
      <VSCodeTextField
        type="text"
        placeholder="package name"
        className="mb-10"
        value={name}
        onChange={(e) => {
          setName((e.target as HTMLInputElement).value);
        }}>
        Name
      </VSCodeTextField>
      <VSCodeTextField
        type="text"
        placeholder="package source"
        className="mb-10"
        value={path}
        onChange={(e) => {
          setPath((e.target as HTMLInputElement).value);
        }}>
        Path
      </VSCodeTextField>
      <VSCodeCheckbox
        className="mb-10"
        checked={enabled}
        onChange={(e) => {
          setEnabled((e.target as HTMLInputElement).checked);
        }}>
        Enable
      </VSCodeCheckbox>
      <VSCodeButton
        appearance="primary"
        className="mb-10"
        disabled={!name.length || !path.length}
        onClick={submit}>
        Save
      </VSCodeButton>
    </>
  );
}

export default SourceForm;
