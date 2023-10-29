import { PackageSource, Result } from "./types";

interface IPackageSourceRepository {
  list: () => Promise<Result<PackageSource[]>>;
  add: (source: PackageSource) => Promise<Result<boolean>>;
  update: (oldSource: PackageSource, newSource: PackageSource) => Promise<Result<boolean>>;
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

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fakeRepo: IPackageSourceRepository = {
  list: async () => {
    await delay(2000);
    return { data: fakePackageSources };
  },
  add: async (source: PackageSource) => {
    fakePackageSources.push(source);
    await delay(2000);
    return { data: true };
  },
  update: async (oldSource: PackageSource, newSource: PackageSource) => {
    const index = fakePackageSources.findIndex((s) => s.title === oldSource.title);
    fakePackageSources[index] = newSource;
    await delay(2000);
    return { data: true };
  },
  remove: async (source: PackageSource) => {
    const index = fakePackageSources.findIndex((s) => s.title === source.title);
    fakePackageSources.splice(index, 1);
    await delay(2000);
    return { data: true };
  },
  enable: async (source: PackageSource) => {
    const index = fakePackageSources.findIndex((s) => s.title === source.title);
    fakePackageSources[index].checked = true;
    await delay(2000);
    return { data: true };
  },
  disable: async (source: PackageSource) => {
    const index = fakePackageSources.findIndex((s) => s.title === source.title);
    fakePackageSources[index].checked = false;
    await delay(2000);
    return { data: true };
  },
};

const packageSourceRepository: IPackageSourceRepository = fakeRepo;

export default packageSourceRepository;
