import { VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react";

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

export default ListItem;
