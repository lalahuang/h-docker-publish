import { resolve } from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const filenamePath = fileURLToPath(import.meta.url);
const fileDirName = dirname(filenamePath);

export function getPackageJSON(cwd = process.cwd()): any {
  const path = resolve(cwd, 'package.json')

  if (fs.existsSync(path)) {
    try {
      const raw = fs.readFileSync(path, 'utf-8')
      const data = JSON.parse(raw)
      return data
    }
    catch (e) {
      console.warn('Failed to parse package.json')
      process.exit(0)
    }
  }
}

export function moveFile(fileName: string) {

  const sourcePath = resolve(fileDirName, './defaultConfigFile', fileName == ".dockerignore" ? "dockerignore" : fileName);
  console.log('sourcePath: ', sourcePath, fileDirName);
  const targetPath = resolve(process.cwd(), fileName);

  if (!fs.existsSync(sourcePath)) {
    console.log("Source file doesn't exist");
    return;
  }

  try {
    fs.copyFileSync(sourcePath, targetPath, fs.constants.COPYFILE_EXCL);
    console.log('文件移动成功');
  } catch (err) {
    if (err.code === 'EEXIST') {
      console.log('文件已存在');
    } else {
      console.log(err);
    }
  }
}


