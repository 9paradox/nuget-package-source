import { VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react";

function LoadingOverlay() {
  return (
    <div
      className="overlay-loading"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}>
      <VSCodeProgressRing />
    </div>
  );
}

export default LoadingOverlay;
