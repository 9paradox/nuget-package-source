import { ExtensionContext, window } from "vscode";
import { SidebarProvider } from "./SidebarProvider";

export function activate(context: ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  var provider = window.registerWebviewViewProvider("nugetPackageSourceSidebarId", sidebarProvider);
  context.subscriptions.push(provider);
}
