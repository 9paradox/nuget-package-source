export interface PackageSource {
  title: string;
  path: string;
  checked: boolean;
}

export interface Result<T> {
  data: T;
  error?: string;
}

export interface PostMessage {
  type: "onInfo" | "onError";
  value: string;
}

export interface PostCommand<T> {
  type: "command";
  command: "list" | "add" | "remove" | "update" | "enable" | "disable";
  value: T;
}
