/*
 * @Author: hzm
 * @Date: 2023-03-08 12:58:41
 * @Description: 设备基本参数
 */

import type { Choice } from 'prompts'
import prompts from 'prompts'
import { getPackageJSON, moveFile } from '../fs';
import { runner } from '../runner';
import { dump, load, SettingInfo } from '../storage'
import c from 'kleur'
import { Fzf } from 'fzf';
//保存 
let setting: SettingInfo = {
  publishKey: "",
  buildCommand: "",
  mirrorImage: "",
  projectPath: ""
};
let isEdit = false

// 设置唯一key
const setKey = async () => {
  try {
    const storage = await load()
    const { publishKey } = await prompts({
      name: 'publishKey',
      message: '设置发布key（唯一标识符：项目名-版本环境）',
      type: 'text',
    })

    // 检测是否重复
    const isExistedSetting = storage.settingInfos?.find(item => item.publishKey == publishKey);
    // if (storage.settingInfos?.filter(item => item.publishKey == publishKey)?.length) {

    // }
    if (isExistedSetting) {
      const { res } = await prompts({
        name: 'res',
        message: 'key已存在!，是否继续配置？（覆盖原来的配置信息）',
        type: 'confirm',
      })
      if (!res)
        throw new Error();
      isEdit = true
      setting = isExistedSetting
    }

    if (!publishKey)
      throw new Error("标识符必填！！！");

    setting.publishKey = publishKey;
    // storage.settingInfos = [...storage?.settingInfos ?? [], setting]
    // dump()
  } catch (e: any) {
    console.warn(c.yellow(e.message))
    process.exit(1)
  }
}
//设置命令
const setBuildCommand = async () => {
  try {
    const pkg = getPackageJSON()
    const scripts = pkg.scripts || {}
    const scriptsInfo = pkg['scripts-info'] || {}

    const names = Object.entries(scripts) as [string, string][]

    if (!names.length)
      return

    const raw = names
      .filter(i => !i[0].startsWith('?'))
      .map(([key, cmd]) => ({
        key,
        cmd,
        description: scriptsInfo[key] || scripts[`?${key}`] || cmd,
      }))

    const terminalColumns = process.stdout?.columns || 80

    function limitText(text: string, maxWidth: number) {
      if (text.length <= maxWidth)
        return text
      return `${text.slice(0, maxWidth)}${c.dim('…')}`
    }
    const choices: Choice[] = raw
      .map(({ key, description }) => ({
        title: key,
        value: key,
        description: limitText(description, terminalColumns - 15),
      }))
    // console.log('choices: ', choices);


    const fzf = new Fzf(raw, {
      selector: item => `${item.key} ${item.description}`,
      casing: 'case-insensitive',
    })
    // console.log('fzf: ', fzf);
    const { fn } = await prompts({
      name: 'fn',
      message: '选择打包脚本',
      type: 'autocomplete',
      choices,
      async suggest(input: string, choices: Choice[]) {
        const results = fzf.find(input)
        return results.map(r => choices.find(c => c.value === r.item.key))
      },
    })
    if (!fn) {
      throw new Error("打包脚本必填！！！");
    }

    setting.buildCommand = fn;
    setting.projectPath = process.cwd();


  } catch (e: any) {
    console.warn(c.yellow(e.message))
    process.exit(1)
  }
}

// 设置镜像
const setMirrorImage = async () => {
  try {
    const storage = await load()
    const { mirrorImage } = await prompts({
      name: 'mirrorImage',
      message: '设置docker镜像完整地址（如：harbor.test.com/testNameSpace/testMirrorName:latest）',
      type: 'text',
    })
    if (!mirrorImage)
      throw new Error("镜像地址必填！！！");

    setting.mirrorImage = mirrorImage;

  } catch (e: any) {
    console.warn(c.yellow(e.message))
    process.exit(1)
  }
}

// 是否使用默认doker配置


const setDefaultConfig = async () => {
  try {
    const storage = await load()
    const { res } = await prompts({
      name: 'res',
      message: '是否使用默认dockerFile,nginx配置（如存在不替换）',
      type: 'confirm',
    })
    if (!res)
      return;
    moveFile("default.conf")
    moveFile("Dockerfile")
    moveFile(".dockerignore")

    // setting.mirrorImage = mirrorImage;

  } catch (e) {
    console.warn(e)
    process.exit(1)
  }
}


const runBuild = async () => {
  // 获取
  const { res } = await prompts({
    name: 'res',
    message: '是否立即发布?',
    type: 'confirm',
  })
  if (!res)
    return;
  runner(setting.publishKey);
}





// 询问
async function init() {
  try {
    const storage = await load()
    // // 设置key
    await setKey();
    // 设置打包命令
    await setBuildCommand();
    // 设置镜像地址
    await setMirrorImage();
    if (!isEdit)
      storage.settingInfos = [...storage?.settingInfos ?? [], setting]
    await dump();
    // 复制文件
    await setDefaultConfig();
    await runBuild();
  } catch (e) {
    console.warn(e)
    process.exit(1)
  }


}

init();
