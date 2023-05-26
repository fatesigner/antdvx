/**
 * generate
 * generate page templates for menus.json
 */

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const { isBoolean } = require('lodash');
const shortUuid = require('short-uuid');

const Utils = require('../utils');

const generate = async function () {
  const { SRC_PATH } = require('../constants');

  // 源 menus.json 路径
  const menusPath = path.join(SRC_PATH, 'assets/json/menus.config.json');
  // 源 router config 路径
  const routerConfigPath = path.join(SRC_PATH, 'app/router/config.ts');
  // 源 views 目录
  const viewsPath = path.join(SRC_PATH, 'app/views');
  // 是否重新生成 id
  const rebuildID = true;

  // 输出目录
  const outputDir = path.join(__dirname, 'output');
  // 输出 views 目录
  const outputViewsDir = path.join(outputDir, path.relative(SRC_PATH, viewsPath));

  const menus = require(menusPath);

  // 清理 output
  rimraf.sync(outputDir);

  const analysis = async function (_menus = [], _parentName = '', _parentPath = '', prefixed = false, level = 0) {
    const __menus = [];
    const __routes = [];
    const __routeStatements = [];
    const __importStatements = [];

    const routeRelativePath = '../views';

    /* if (!fs.existsSync(outputViewsDir)) {
      fs.mkdirSync(outputViewsDir, { recursive: true });
    } */

    for (const _menu of _menus) {
      if (_menu.name) {
        const bridgeName = Utils.convertHumpStrToBridge(_menu.name, true);
        const __name = _parentName + _menu.name;
        const __path = (_parentName ? '' : '/') + [_parentPath, bridgeName].filter((x) => !!x).join('/');
        const __viewName = `${__name}View`;

        const __menu = {
          id: rebuildID ? shortUuid.generate() : _menu.id || shortUuid.generate(),
          name: __name,
          label: _menu.label,
          // label: Utils.convertHumpStrToSpace(_menu.name),
          // url: _menu.url,
          url: _menu.url ? (isBoolean(_menu.url) ? __path : _menu.url) : null,
          icon: _menu.icon,
          target: _menu.target,
          group: _menu.group,
          children: []
        };

        const consoleBlank = `${'    '.repeat(level)}`;
        console.log(consoleBlank + bridgeName, _parentPath);

        // 创建页面目录
        const dirPath = path.join(outputViewsDir, _parentPath, bridgeName);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }

        if (_menu.url) {
          // 创建页面文件
          const viewPath = path.join(dirPath, bridgeName + '.tsx');
          const formPath = path.join(dirPath, bridgeName + '.form.tsx');
          const variables = {
            name: __menu.name,
            label: __menu.label,
            viewName: __viewName,
            bridgeName
          };
          await Utils.compileTemplate(variables, path.join(__dirname, './templates/common/form.ejs'), formPath, null, {
            encoding: 'utf8',
            flag: 'w'
          })
            .then((message) => {
              console.info('  ' + consoleBlank + message);
            })
            .catch((err) => {
              console.info('  ' + consoleBlank + err.message);
            });
          await Utils.compileTemplate(variables, path.join(__dirname, './templates/common/view.ejs'), viewPath, null, {
            encoding: 'utf8',
            flag: 'w'
          })
            .then((message) => {
              console.info('  ' + consoleBlank + message);
            })
            .catch((err) => {
              console.info('  ' + consoleBlank + err.message);
            });
        }

        let resRoutes = [];
        let resRouteStatements = [];
        let resImportStatements = [];

        if (_menu.children?.length) {
          const res = await analysis(_menu.children, __name, __path, !_menu.url, level + 1);
          __menu.children = res.menus;
          resRoutes = res.routes;
          resRouteStatements = res.routeStatements;
          resImportStatements = res.importStatements;
        }

        __menus.push(__menu);
        if (_menu.url) {
          const path__ = `${prefixed ? (_parentPath ? _parentPath + '/' : _parentPath) : ''}${bridgeName}`;
          __importStatements.push(`const ${__viewName} = () => import('${routeRelativePath}${__path}/${bridgeName}');`);
          __routes.push({
            name: __name,
            path: path__,
            children: resRoutes
          });
          console.log('__path', __path);
          const firstChildPath = resRoutes?.[0]?.path;
          __routeStatements.push(`{
              name: '${__name}',
              path: '${path__}',${firstChildPath ? '\nredirect: ' + `'${path__ + '/' + firstChildPath}',` : ''}
              component: ${__viewName},
              meta: {
                label: '${__menu.label}',
                keepAlive: false
              },
              children: [${resRouteStatements.join(',')}]
          }`);
        } else {
          __routeStatements.push(...resRouteStatements);
        }
        __importStatements.push(...resImportStatements);
      }
    }

    return {
      menus: __menus,
      routes: __routes,
      routeStatements: __routeStatements,
      importStatements: __importStatements
    };
  };

  const res = await analysis(menus);

  await Utils.writeFileSafely(path.join(outputDir, 'assets/json/menus.json'), JSON.stringify(res.menus, null, 2), {
    flag: 'w'
  }).catch((err) => {
    console.log(err.message);
  });

  await Utils.writeFileSafely(
    path.join(outputDir, path.relative(SRC_PATH, routerConfigPath)),
    `${res.importStatements.join('\n')}\nexport default [ ${res.routeStatements.join(',')} ];
    `,
    { flag: 'w' },
    true
  ).catch((err) => {
    console.log(err.message);
  });
};

generate();
