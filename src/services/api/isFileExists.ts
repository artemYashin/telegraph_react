import * as Fs from 'fs/promises';

const isFileExists = async (path: string) => {
  try {
    await Fs.access(path);
    return true;
  } catch {
    return false;
  }
};

export default isFileExists;
