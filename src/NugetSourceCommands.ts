import { PackageSource, Result } from "./types";
import execShell from "./utilities/execShell";

export async function list(): Promise<Result<PackageSource[]>> {
  try {
    const result = await execShell("dotnet nuget list source");
    if (result.error || result.stderr) {
      return {
        error: result.error || result.stderr,
        data: [],
      };
    }

    return {
      data: parseNugetSourceListOutput(result.stdout),
    };
  } catch (ex: any) {
    return {
      error: errorMessage(ex),
      data: [],
    };
  }
}

export async function add(newPackage: PackageSource): Promise<Result<boolean>> {
  try {
    const addResult = await execShell(
      `dotnet nuget add source "${newPackage.path}" -n "${newPackage.title}"`
    );
    if (addResult.error || addResult.stderr) {
      return {
        error: addResult.error || addResult.stderr,
        data: false,
      };
    }

    return {
      data: true,
    };
  } catch (ex: any) {
    return {
      error: errorMessage(ex),
      data: false,
    };
  }
}

export async function remove(newPackage: PackageSource): Promise<Result<boolean>> {
  try {
    const addResult = await execShell(`dotnet nuget remove source "${newPackage.title}"`);
    if (addResult.error || addResult.stderr) {
      return {
        error: addResult.error || addResult.stderr,
        data: false,
      };
    }

    return {
      data: true,
    };
  } catch (ex: any) {
    return {
      error: errorMessage(ex),
      data: false,
    };
  }
}

export async function update(
  oldSource: PackageSource,
  newSource: PackageSource
): Promise<Result<boolean>> {
  try {
    if (oldSource.title !== newSource.title) {
      const removeResult = await remove(oldSource);
      if (removeResult.error) {
        return removeResult;
      }

      const addResult = await add(newSource);
      if (removeResult.error) {
        return removeResult;
      }

      return {
        data: true,
      };
    }

    if (oldSource.checked !== newSource.checked) {
      if (newSource.checked) {
        const enableResult = await enable(newSource);
        if (enableResult.error) {
          return enableResult;
        }

        return {
          data: true,
        };
      }

      if (!newSource.checked) {
        const disableResult = await disable(newSource);
        if (disableResult.error) {
          return disableResult;
        }

        return {
          data: true,
        };
      }
    }

    const updateResult = await execShell(
      `dotnet nuget update source "${oldSource.title}" --source "${newSource.path}"`
    );
    if (updateResult.error || updateResult.stderr) {
      return {
        error: updateResult.error || updateResult.stderr,
        data: false,
      };
    }

    return {
      data: true,
    };
  } catch (ex: any) {
    return {
      error: errorMessage(ex),
      data: false,
    };
  }
}

export async function enable(packageSource: PackageSource): Promise<Result<boolean>> {
  try {
    const addResult = await execShell(`dotnet nuget enable source "${packageSource.title}"`);
    if (addResult.error || addResult.stderr) {
      return {
        error: addResult.error || addResult.stderr,
        data: false,
      };
    }

    return {
      data: true,
    };
  } catch (ex: any) {
    return {
      error: errorMessage(ex),
      data: false,
    };
  }
}

export async function disable(packageSource: PackageSource): Promise<Result<boolean>> {
  try {
    const addResult = await execShell(`dotnet nuget disable source "${packageSource.title}"`);
    if (addResult.error || addResult.stderr) {
      return {
        error: addResult.error || addResult.stderr,
        data: false,
      };
    }

    return {
      data: true,
    };
  } catch (ex: any) {
    return {
      error: errorMessage(ex),
      data: false,
    };
  }
}

const enabledRegex = /\[Enabled\](?![^\r\n]*[\S])/g;
const disabledRegex = /\[Disabled\](?![^\r\n]*[\S])/g;

function parseNugetSourceListOutput(output: string): PackageSource[] {
  const allLines = output.trim().replaceAll("\r\n", "\n").split("\n");

  if (allLines.length < 3) {
    return [];
  }
  const lines = allLines.splice(1, allLines.length);
  const nugetSources: PackageSource[] = [];

  for (let i = 0; i < lines.length - 1; i++) {
    if (i > 0 && i % 2 !== 0) {
      continue;
    }

    const srNo = nugetSources.length + 1;

    const firstLine = lines[i]
      .replaceAll("\r\n", "\n")
      .replaceAll("\n", "")
      .trim()
      .replace(srNo + ".", "");

    const enableMatches = [...firstLine.matchAll(enabledRegex)];

    var name = "";
    var enabled = false;

    if (enableMatches.length > 0) {
      name = firstLine.replace(enabledRegex, "").trim();
      enabled = true;
    } else {
      const disableMatches = [...firstLine.matchAll(disabledRegex)];
      if (!disableMatches) {
        continue;
      }

      name = firstLine.replace(disabledRegex, "").trim();
    }

    if (!name) {
      continue;
    }

    const secondLine = lines[i + 1];

    if (!secondLine) {
      continue;
    }

    const path = secondLine.replaceAll("\r\n", "\n").replaceAll("\n", "").trim();

    nugetSources.push({
      title: name,
      path: path,
      checked: enabled,
    });
  }

  return nugetSources;
}

function errorMessage(e: any) {
  if (typeof e === "string") {
    return e;
  } else if (e instanceof Error) {
    return e.message;
  } else {
    return "Some error ocurred";
  }
}
