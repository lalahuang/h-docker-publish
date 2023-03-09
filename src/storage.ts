import { existsSync, promises as fs } from 'fs'
import { resolve } from 'path'
import { tmpdir } from 'os'

export interface SettingInfo {
  publishKey: string,
  mirrorImage: string,
  buildCommand: string,
  projectPath: string,
}


export interface Storage {
  lastRunCommand?: string,
  settingInfos?: SettingInfo[]
}

let storage: Storage | undefined

const storageDir = resolve(tmpdir(), 'lalahuang')
const storagePath = resolve(storageDir, 'publish_storage.json')

export async function load(fn?: (storage: Storage) => Promise<boolean> | boolean) {
  // console.log('storagePath: ', storagePath);

  if (!storage) {
    storage = existsSync(storagePath)
      ? JSON.parse(await fs.readFile(storagePath, 'utf-8') || '{}') || {}
      : {}
  }

  if (fn) {
    if (await fn(storage!))
      await dump()
  }

  return storage!
}

export async function dump() {
  // console.log('storage: ', storage);
  // console.log('storageDir: ', storageDir);

  if (storage) {
    if (!existsSync(storageDir))
      await fs.mkdir(storageDir, { recursive: true })
    await fs.writeFile(storagePath, JSON.stringify(storage), 'utf-8')
  }
}
