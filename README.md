# h-docker-publish

智电云前端项目自动构建工具。通过配置将前端打包好的文件夹自动打包成镜像后，发布到harbor镜像仓库。
支持多项目同时发布。一次配置，无需打开项目目录，随时发布！

## 安装


<pre>
npm i -g <b>h-docker-publish</b>
pnpm i -g <b>h-docker-publish</b>
</pre>

## 前置要求

请确保本地安装docker。并且确保已经链接harbor等容器镜像仓库。


## 命令


### `dps` - 设置

通过命令行问询的方式，设置项目发布信息。
1. 进入项目目录，执行dps
2. 唯一key，必填！可以按照项目名+发布环境的格式来填写。如：zdadminui-prodution。重名的key会覆盖配置
3. 设置构建命令。自动读取packages.json 命令。
4. 设置docker镜像完整地址。发布到harbor的完整镜像名称。当然也支持其他的dockerhub。如：harbor.test.com/testNameSpace/testMirrorName:latest
5. 使用默认dockerFile,nginx配置（如存在不替换）。会将默认的dockerfile、nginx配置文件复制到当前项目地址。
6. 是否立即发布

### `dpr` - 执行发布命令

支持多个命令同时选择！！！ 空格选择！！！！ 回车确认！！！！空格选择！！！！ 回车确认！！！！空格选择！！！！ 回车确认！！！！重要的事说三遍。

本插件只负责发布到镜像仓库。镜像是否启用请自行配置！





