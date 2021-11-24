/**
 * build icons
 */

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const globby = require('globby');

const { convertBridgeStrToHump } = require('../utils');

gulp.task('build-icons', async function () {
  const { ROOT_PATH, SRC_PATH } = require('../constants');

  // 转换 remix icons
  const remixIconsArr = globby.sync(path.join(ROOT_PATH, 'node_modules/remixicon/icons/**/*.svg').replace(/\\/g, '/')).reduce(function (prev, file) {
    const dirname = path.basename(file).split('.')[0];
    if (dirname !== 'index') {
      prev.push({
        name: `Icon${convertBridgeStrToHump(dirname, true)}`,
        path: dirname
      });
    }

    const svgStr = fs.readFileSync(file).toString();

    const svgObj = {
      viewBox: svgStr.match(/viewBox="(.*?)"/)[1],
      paths: svgStr.match(/<path(.*?)\/>/g).map((x) => {
        let fill = x.match(/fill="(.*?)"/);
        if (fill && fill.length) {
          fill = fill[1];
        }
        let d = x.match(/d="(.*?)"/);
        if (d && d.length) {
          d = d[1];
        }
        const _r = { d };
        if (fill !== null) {
          _r.fill = fill;
        }
        return _r;
      })
    };

    // 写入 remixicons/${dirname}.ts
    fs.writeFileSync(
      path.join(SRC_PATH, `antdvx/components/iconfont/remixicons/${dirname}.ts`),
      `import { createIcon } from '../core';

/**
 * remixicon ${dirname}
 */
export default createIcon('${dirname}', ${JSON.stringify(svgObj, null, 2)});
      `,
      {
        encoding: 'utf-8'
      }
    );
    return prev;
  }, []);

  const arr = globby.sync(path.join(SRC_PATH, 'antdvx/components/iconfont/icons/*.ts').replace(/\\/g, '/')).reduce(function (prev, file) {
    const dirname = path.basename(file).split('.')[0];
    if (dirname !== 'index') {
      prev.push({
        name: `Icon${convertBridgeStrToHump(dirname, true)}`,
        path: dirname
      });
    }
    return prev;
  }, []);

  // 写入 iconfont/remixicons/index.ts
  fs.writeFileSync(
    path.join(SRC_PATH, 'antdvx/components/iconfont/remixicons/index.ts'),
    remixIconsArr.map((x) => `export { default as ${x.name} } from './${x.path}';`).join('\n') + '\n',
    {
      encoding: 'utf-8'
    }
  );

  // 写入 iconfont/icons/index.ts
  /* fs.writeFileSync(
    path.join(SRC_PATH, 'antdvx/components/iconfont/icons/index.ts'),
    arr.map((x) => `import ${x.name} from './${x.path}';`).join('\n') + '\n\r' + arr.map((x) => `export { ${x.name} };`).join('\n') + '\n',
    {
      encoding: 'utf-8'
    }
  ); */

  // 写入 iconfont/config.ts
  fs.writeFileSync(
    path.join(SRC_PATH, 'antdvx/components/iconfont/config.ts'),
    `import { Component } from '@vue/runtime-core';

/**
 * Antdvx 图标库名称
 */\n` +
      'export const ANTDVX_ICON_NAMES = [\n' +
      remixIconsArr.map((x) => `  '${x.path}'`).join(',\n') +
      '\n];\n\r' +
      `/**
 * Antdvx 图标库名称类型
 */\n` +
      'export type IAntdvxIconNames = typeof ANTDVX_ICON_NAMES[number];\n\r' +
      `/**
 * Antdvx 已注册的 icons
 */\n` +
      'export const ANTDVX_ICONS_REGISTERED: { name: string; comp: Component }[] = [];\n',
    {
      encoding: 'utf-8'
    }
  );

  // console.log(JSON.stringify(arr, null, 2));
});
