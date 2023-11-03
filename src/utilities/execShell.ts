import * as cp from "child_process";

const execShell = (cmd: string) =>
  new Promise<{ stdout: string; stderr: string; error: string }>((resolve, reject) => {
    cp.exec(cmd, (err, stdout, stderr) => {
      console.log(err, stdout, stderr);
      return resolve({
        stdout,
        stderr,
        error: err?.message ?? "",
      });
    });
  });

export default execShell;
