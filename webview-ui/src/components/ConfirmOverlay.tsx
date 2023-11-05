import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { PackageSource } from "../types";

interface ConfirmDeleteOverlayProps {
  onDelete: () => void;
  onCancel: () => void;
}

function ConfirmDeleteOverlay(prop: ConfirmDeleteOverlayProps) {
  return (
    <div
      className="overlay-confirm"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}>
      <div className="confirm-box">
        <p>Are you sure you want to delete?</p>
        <div className="confirm-actions">
          <VSCodeButton appearance="secondary" className="mr-10" onClick={prop.onCancel}>
            Cancel
          </VSCodeButton>
          <VSCodeButton appearance="primary" onClick={prop.onDelete}>
            Delete
          </VSCodeButton>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteOverlay;
