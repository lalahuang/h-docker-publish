import { defineBuildConfig } from 'unbuild'
import fg from 'fast-glob'

export default defineBuildConfig({
  entries: [
    ...fg.sync('src/hPublish/*.ts').map(i => i.slice(0, -3)),
    {
      input: './src/defaultConfigFile/',
      outDir: 'dist/defaultConfigFile/'
    },
  ],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
})
