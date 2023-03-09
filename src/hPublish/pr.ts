/*
 * @Author: hzm
 * @Date: 2023-03-08 14:51:33
 * @Description: 
 * 
 */

import { detect } from '../detect'
import { getDefaultAgent, getGlobalAgent } from '../config'
import prompts from 'prompts'
import { agents } from '../agents'
import { execaCommand } from 'execa'
import { load } from '../storage'
import { runner } from '../runner';
import c from 'kleur'




// runner()

async function init() {
  const storage = await load()
  const choices = storage?.settingInfos?.map(item => ({
    title: item.publishKey,
    value: item.publishKey,
    description: item.projectPath,

  })) ?? [];

  console.log('choices: ', choices);
  if (!choices.length) {
    console.log("请先使用ps命令设置项目发布信息");
    return;
  }
  const { publicKeys } = (await prompts({
    name: 'publicKeys',
    type: 'multiselect',
    message: '选择需要运行的发布信息',
    hint: '- 支持多选空格选择，回车确认',
    choices: choices.filter(item => item.title)
  }))

  if (!publicKeys.length) {
    console.log(c.yellow('\n 请选择需要运行的项目！空格选择，回车确认！！，支持多选！！！'))
    return;

  }
  for (let index = 0; index < publicKeys.length; index++) {
    await runner(publicKeys[index], choices.find(item => item.title == publicKeys[index])?.description)
  }

}

init()
