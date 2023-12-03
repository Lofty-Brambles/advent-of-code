import { cp, readFile, writeFile } from "fs/promises";

const write = async (path: string, content: string | {}) => {
  await writeFile(
    path,
    typeof content === "string" ? content : JSON.stringify(content, null, 2)
  );
};

const copy = async (fromDir: string, toDir: string) => {
  await cp(fromDir, toDir);
};

const read = async (file: string) => {
  return readFile(file, { encoding: "utf-8" });
};

export const Actions = { write, copy, read };
