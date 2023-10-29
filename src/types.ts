export interface PackageSource {
  title: string;
  path: string;
  checked: boolean;
}

export interface Result<T> {
  data: T;
  error?: string;
}

export interface PostCommandMessage {
  type: "command" | "onInfo" | "onError";
  command: "list" | "add" | "remove" | "update" | "enable" | "disable";
  value: any;
}
