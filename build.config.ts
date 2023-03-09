import { defineBuildConfig } from 'unbuild'
import fg from 'fast-glob'
import strip from 'rollup-plugin-strip';

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
  // hooks: {
  //   'rollup:options': (ctx, options) => {
  //     if (!Array.isArray(options.plugins)) {
  //       options.plugins = options.plugins ? [options.plugins] : []
  //     }
  //     options.plugins.push(strip())
  //   },
  // },
})
