/**
 * build api file
 */

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const axios = require('axios');
const https = require('https');
const globby = require('globby');
const { exec } = require('child_process');

const { convertBridgeStrToHump } = require('../utils');

gulp.task('api', async function () {
  const { API_JSON_PATH, API_SCHEMA, SRC_PATH } = require('../constants');

  let tags = [];

  const outputPath = path.join(SRC_PATH, 'api');
  const schemaJsonPath = path.join(outputPath, 'api-schema.json');

  const instance = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  });

  function readJson(srcPath, outputPath) {
    return new Promise((resolve, reject) => {
      const child = exec(
        `openapi-generator-cli generate -g ruby -i ${srcPath} -o ${outputPath} -g typescript-axios --artifact-version 1.0.0-SNAPSHOT --additional-properties=withSeparateModelsAndApi=true,modelPackage=models,apiPackage=api,useSingleRequestParameter=true`,
        (error, stdout, stderr) => {
          if (error) {
            // console.log(`error: ${error.message}`);
            reject(error);
          }
          if (stderr) {
            // console.log(`stderr: ${stderr}`);
            // return;
          }
          // console.log(`stdout: ${stdout}`);
        }
      );

      child.on('exit', function () {
        fs.writeFileSync(
          path.join(outputPath, 'index.ts'),
          `import { httpService } from '@/app/services';\n\rimport {${tags.map((x) => ` ${x}Api`).join(',')} } from './api';\n\r` +
            tags.map((tag) => `export const ${tag.replace(tag[0], tag[0].toLowerCase())}Api = new ${tag}Api(null, '', httpService as any);`).join('\n\r') +
            '\n',
          {
            encoding: 'utf-8'
          }
        );

        // write URL shim
        // writeUrlShim();

        resolve();
      });
    });
  }

  function addOperationIdsToSchema(schema) {
    const data = schema;

    const tags_ = new Set();

    Object.keys(data.paths).forEach((endpointPath) => {
      const operations = Object.keys(data.paths[endpointPath]);

      operations.forEach((operation) => {
        // 收集 tags
        if (data.paths[endpointPath][operation].tags) {
          data.paths[endpointPath][operation].tags.forEach((tag) => {
            tag = convertBridgeStrToHump(tag);
            tags_.add(`${tag.charAt(0).toUpperCase() + tag.slice(1)}`);
          });
        }
        data.paths[endpointPath][operation].operationId = endpointPath.replace('/api/', '').replace(/\//g, '');
      });
    });

    tags = [...tags_].sort((a, b) => a.localeCompare(b));

    return data;
  }

  // write URL shim
  function writeUrlShim() {
    fs.writeFile(
      path.join(outputPath, 'url-shim.ts'),
      `const URL = function (url, base) {
  return {
    hash: '',
    host: 'example.com',
    hostname: 'example.com',
    href: 'https://example.com/api/Login/loginin',
    origin: 'https://example.com',
    password: '',
    pathname: url,
    port: '',
    protocol: 'https:',
    search: '',
    searchParams: {},
    username: ''
  } as any;
} as any;

const URLSearchParams: any = function (searchString) {};

URLSearchParams.prototype.toString = function () {
  return '';
};

export { URL, URLSearchParams };
`,
      {
        encoding: 'utf-8'
      },
      function () {}
    );

    globby.sync(path.join(outputPath, 'api/*.ts').replace(/\\/g, '/')).forEach((file) => {
      // Replace api.ts and common.ts, Add import url.shim.ts
      fs.readFile(
        file,
        {
          encoding: 'utf-8'
        },
        function (err, data) {
          if (err) {
            console.log(err.stack);
          }
          const txt = data.replace(
            /import/,
            `import { URL, URLSearchParams } from '../url-shim';
import`
          );
          fs.writeFile(
            file,
            txt,
            {
              encoding: 'utf-8'
            },
            function () {}
          );
        }
      );
    });
  }

  console.log(`==> Api Schema fetched ${API_SCHEMA}`);

  return instance
    .get(API_SCHEMA)
    .then((response) => {
      console.log('==> Api Schema fetched successfully');

      const updatedSchema = addOperationIdsToSchema(response.data);

      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
      }

      fs.writeFileSync(schemaJsonPath, JSON.stringify(updatedSchema, null, 2), {
        encoding: 'utf-8'
      });

      console.log(`==> Api Schema json file output： ${schemaJsonPath}`);

      return readJson(schemaJsonPath, outputPath);
    })
    .catch(() => {
      console.log(`==> Api Schema read local schema json：${API_JSON_PATH}`);

      // 请求远程 json 失败，则获取本地 json
      const data = require(API_JSON_PATH);
      const updatedSchema = addOperationIdsToSchema(data);

      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
      }

      fs.writeFileSync(schemaJsonPath, JSON.stringify(updatedSchema, null, 2), {
        encoding: 'utf-8'
      });

      return readJson(schemaJsonPath, outputPath);
    });
});
