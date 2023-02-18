/**
 * generate
 * generate page templates for menus.json
 */

const fs = require('fs');
const path = require('path');
const shortUuid = require('short-uuid');

const Utils = require('../utils');

const generate = async function () {
  const { SRC_PATH } = require('../constants');
  const menus = require(path.join(SRC_PATH, 'assets/json/menus.json'));

  const routePath = path.join(SRC_PATH, 'app/views');
  const routeRelativePath = '../views';

  const analysis = async function (_menus = [], _parentPath = '', prefixed = false, level = 0) {
    const __menus = [];
    const __routes = [];
    const __imports = [];

    for (const _menu of _menus) {
      if (_menu.name) {
        const bridgeName = Utils.convertHumpStrToBridge(_menu.name, true);
        const __path = [_parentPath, bridgeName].filter((x) => !!x).join('/');
        const __viewName = `${_menu.name}View`;

        const __menu = {
          id: _menu.id || shortUuid.generate(),
          name: _menu.name,
          label: Utils.convertHumpStrToSpace(_menu.name),
          url: _menu.url ? '/' + __path : null,
          icon: _menu.icon,
          target: _menu.target,
          children: []
        };

        console.log(`${'  '.repeat(level)}${bridgeName}`);

        // 创建页面目录
        const dirPath = path.join(routePath, _parentPath, bridgeName);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath);
        }

        if (_menu.url) {
          // 创建页面文件
          const filePath = path.join(dirPath, bridgeName + '.tsx');
          if (!fs.existsSync(filePath)) {
            const variables = {
              name: __menu.name,
              label: __menu.label,
              viewName: __viewName
            };
            await Utils.compileTemplate(variables, path.join(__dirname, './templates/page.ejs'), filePath);
          }
        }

        let resRoutes = [];
        let resImports = [];

        if (_menu.children?.length) {
          const res = await analysis(_menu.children, __path, !_menu.url, level + 1);
          __menu.children = res.menus;
          resRoutes = res.routes;
          resImports = res.imports;
        }

        __menus.push(__menu);
        if (_menu.url) {
          __imports.push(`const ${__viewName} = () => import('${routeRelativePath}/${__path}/${bridgeName}');`);
          __routes.push(`{
              name: '${__menu.name}',
              path: '${prefixed ? (_parentPath ? _parentPath + '/' : _parentPath) : ''}${bridgeName}',
              component: ${__viewName},
              meta: {
                label: '${__menu.label}',
                keepAlive: true
              },
              children: [${resRoutes.join(',')}]
          }`);
        } else {
          __routes.push(...resRoutes);
        }
        __imports.push(...resImports);
      }
    }

    return {
      menus: __menus,
      routes: __routes,
      imports: __imports
    };
  };

  const res = await analysis(menus);

  await Utils.writeFileSafely(path.join(__dirname, 'output/menus.json'), JSON.stringify(res.menus, null, 2), {
    flag: 'w'
  }).catch((err) => {
    console.log(err.message);
  });

  await Utils.writeFileSafely(
    path.join(__dirname, 'output/config.ts'),
    `${res.imports.join('\n')}\nexport default [ ${res.routes.join(',')} ];
    `,
    { flag: 'w' }
  ).catch((err) => {
    console.log(err.message);
  });
};

generate();
