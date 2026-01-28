import fs from 'fs-extra';
import path from 'path';

export const ensureDir = (dir: string): void => {
  fs.ensureDirSync(dir);
};

export const readJson = <T>(filePath: string): T => fs.readJSONSync(filePath);

export const writeJson = (filePath: string, data: unknown): void => {
  fs.ensureDirSync(path.dirname(filePath));
  fs.writeJSONSync(filePath, data, { spaces: 2 });
};
