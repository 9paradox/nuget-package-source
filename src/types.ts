export interface PackageSource {
  title: string;
  path: string;
  checked: boolean;
}

export interface Result<T> {
  data: T;
  error?: string;
}
