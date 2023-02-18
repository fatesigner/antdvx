/**
 * constants
 * 全局常量（大写和_连字符命名）
 */

const path = require('path');

// 项目根路径
const ROOT_PATH = path.resolve(__dirname, '..');
const BUILD_PATH = path.join(ROOT_PATH, 'build');
const SRC_PATH = path.join(ROOT_PATH, 'src');
const OUTPUT_PATH = path.join(ROOT_PATH, 'dist');
const NODE_MODULES_Path = path.resolve(ROOT_PATH, 'node_modules');

module.exports = {
  ROOT_PATH,
  BUILD_PATH,
  SRC_PATH,
  OUTPUT_PATH,
  NODE_MODULES_Path,
  // Api json 文档地址，用于生成 http 服务层
  API_SCHEMA: `/swagger/all/swagger.json`,
  API_JSON_PATH: path.join(BUILD_PATH, 'api.json')
};
