/**
 * build icons
 */

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const globby = require('globby');

const { convertBridgeStrToHump } = require('../utils');

gulp.task('build-icons', async function () {
  const env = require('../env')();

  // 读取 pages 目录
  const files = globby.sync(path.join(env.srcPath, 'antdvx/components/iconfont/icons/*.ts').replace(/\\/g, '/'));

  const arr = files.reduce(function (prev, file) {
    const dirname = path.basename(file).split('.')[0];
    if (dirname !== 'index') {
      prev.push({
        name: `Icon${convertBridgeStrToHump(dirname, true)}`,
        path: dirname
      });
    }
    return prev;
  }, []);

  // 写入 iconfont/icons/index.ts
  fs.writeFileSync(
    path.join(env.srcPath, 'antdvx/components/iconfont/icons/index.ts'),
    arr.map((x) => `import ${x.name} from './${x.path}';`).join('\n') + '\n\r' + arr.map((x) => `export { ${x.name} };`).join('\n') + '\n',
    {
      encoding: 'utf-8'
    }
  );

  // 写入 iconfont/config.ts
  fs.writeFileSync(
    path.join(env.srcPath, 'antdvx/components/iconfont/config.ts'),
    `import { Component } from '@vue/runtime-core';

/**
 * Antdvx 图标库名称
 */\n` +
      'export const AntdvxIconNames = [\n' +
      arr.map((x) => `  '${x.path}'`).join(',\n') +
      '\n];\n\r' +
      `/**
 * Antdvx 图标库名称类型
 */\n` +
      'export type IAntdvxIconNames = typeof AntdvxIconNames[number];\n\r' +
      `/**
 * Antdvx 已注册的 icons
 */\n` +
      'export const ANTDVX_ICONS_REGISTERED: { name: string; comp: Component }[] = [];\n',
    {
      encoding: 'utf-8'
    }
  );

  console.log(JSON.stringify(arr, null, 2));
});
