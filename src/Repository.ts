import { PackageSource, Result } from "./types";

interface IPackageSourceRepository {
  list: () => Promise<Result<PackageSource[]>>;
  add: (source: PackageSource) => Promise<Result<boolean>>;
  update: (source: PackageSource) => Promise<Result<boolean>>;
  remove: (source: PackageSource) => Promise<Result<boolean>>;
  enable: (source: PackageSource) => Promise<Result<boolean>>;
  disable: (source: PackageSource) => Promise<Result<boolean>>;
}

const fakePackageSources: PackageSource[] = [
  {
    title: "NuGet.org",
    path: "https://api.nuget.org/v3/index.json",
    checked: true,
  },
];

const fakeRepo: IPackageSourceRepository = {
  list: async () => ({ data: fakePackageSources }),
  add: async (source: PackageSource) => {
    fakePackageSources.push(source);
    return { data: true };
  },
  update: async (source: PackageSource) => {
    const index = fakePackageSources.findIndex((s) => s.title === source.title);
    fakePackageSources[index] = source;
    return { data: true };
  },
  remove: async (source: PackageSource) => {
    const index = fakePackageSources.findIndex((s) => s.title === source.title);
    fakePackageSources.splice(index, 1);
    return { data: true };
  },
  enable: async (source: PackageSource) => {
    const index = fakePackageSources.findIndex((s) => s.title === source.title);
    fakePackageSources[index].checked = true;
    return { data: true };
  },
  disable: async (source: PackageSource) => {
    const index = fakePackageSources.findIndex((s) => s.title === source.title);
    fakePackageSources[index].checked = false;
    return { data: true };
  },
};

const packageSourceRepository: IPackageSourceRepository = fakeRepo;

export default packageSourceRepository;
