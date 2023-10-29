import * as vscode from "vscode";
import { getUri } from "./utilities/getUri";
import { getNonce } from "./utilities/getNonce";
import packageSourceRepository from "./Repository";
import { PostCommandMessage } from "./types";

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [
        vscode.Uri.joinPath(this._extensionUri, "out"),
        vscode.Uri.joinPath(this._extensionUri, "webview-ui/build"),
      ],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // Listen for messages from the Sidebar component and execute action
    webviewView.webview.onDidReceiveMessage(async (data: PostCommandMessage) => {
      switch (data.type) {
        case "command": {
          await this.handleCommand(data, webviewView.webview);
          break;
        }
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
      }
    });
  }

  private async handleCommand(data: PostCommandMessage, webview: vscode.Webview) {
    if (!data.command) {
      return;
    }
    var value = null;
    try {
      switch (data.command) {
        case "list":
          value = await packageSourceRepository.list();
          break;

        case "add":
          value = await packageSourceRepository.add({
            title: data.value.title,
            path: data.value.path,
            checked: data.value.checked,
          });
          break;

        case "remove":
          value = await packageSourceRepository.remove({
            title: data.value.title,
            path: data.value.path,
            checked: data.value.checked,
          });
          break;

        case "update":
          value = await packageSourceRepository.update(
            {
              title: data.value.old.title,
              path: data.value.old.path,
              checked: data.value.old.checked,
            },
            {
              title: data.value.new.title,
              path: data.value.new.path,
              checked: data.value.new.checked,
            }
          );
          break;

        case "enable":
          value = await packageSourceRepository.enable({
            title: data.value.title,
            path: data.value.path,
            checked: data.value.checked,
          });
          break;

        case "disable":
          value = await packageSourceRepository.disable({
            title: data.value.title,
            path: data.value.path,
            checked: data.value.checked,
          });
          break;
      }
      webview.postMessage({
        type: data.type,
        command: data.command,
        value: value,
      });
    } catch (e) {
      console.error("SidebarProvider.handleCommand", e);
    }
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // The CSS file from the React build output
    const stylesUri = getUri(webview, this._extensionUri, [
      "webview-ui",
      "build",
      "assets",
      "index.css",
    ]);
    // The JS file from the React build output
    const scriptUri = getUri(webview, this._extensionUri, [
      "webview-ui",
      "build",
      "assets",
      "index.js",
    ]);

    const nonce = getNonce();

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
          <title>Nuget Package Source</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>
    `;
  }
}
