/**
 * utils
 */

import { StructureTree } from '@fatesigner/utils/structure-tree';
import { isBoolean, isNullOrUndefined, isObject } from '@fatesigner/utils/type-check';

import { IMenu } from '@/types/menu';
import { IRouteConfig } from '@/types/route';

export function getColumns(res) {
  const obj = res[0];
  const columns = [];
  let template = '';
  Object.keys(obj)
    .filter(
      (x) =>
        !['isUpdated', 'apiToken', 'errorMessage', 'updateTime', 'updateBy', 'infoJasonValues', 'returnInfoType', 'inputInfoType'].includes(x) &&
        !isObject(obj[x])
    )
    .forEach((x) => {
      if (x === 'title') {
        columns.push({
          title: 'title_',
          dataIndex: 'title_',
          width: 150
        });
        template += `
         <template #title_="{ record, handleRecordChange }">
            <AInput v-model:value="record.title_" style="width: 150px" @change="handleRecordChange(record)" />
          </template>
        `;
      } else {
        columns.push({
          title: x.replace(/_/g, ' '),
          dataIndex: x,
          width: 150
        });
        if (isBoolean(obj[x])) {
          template += `
         <template #${x}="{ record, handleRecordChange }">
            <a-checkbox v-model:checked="record.${x}" @change="handleRecordChange(record)" />
          </template>
        `;
        } else {
          template += `
         <template #${x}="{ record, handleRecordChange }">
            <AInput v-model:value="record.${x}" style="width: 150px" @change="handleRecordChange(record)" />
          </template>
        `;
        }
      }
    });

  console.log('columns', JSON.stringify(columns));
  console.log('columns slot', JSON.stringify(columns.map((x) => ({ ...x, slots: { customRender: x.dataIndex } }))));
  console.log('template', template);
}

/**
 * 高亮搜索关键字
 * @param keywords
 * @param text
 * @param className
 */
export function highlightHtml(keywords: string, text: string, className: string) {
  if (!text) {
    return '';
  }
  if (!keywords) {
    return text;
  }
  return text.replace(new RegExp(keywords, 'g'), `<span class="${className}">${keywords}</span>`);
}

/**
 * 获取 Odata 参数
 * @param options
 */
export function getOdataQueryStr(options: { pageNo?: number; pageSize?: number; filters?: (() => string)[] }) {
  const filter = options?.filters.reduce((prev, cur) => {
    const r = cur();
    if (r) {
      prev.push(r);
    }
    return prev;
  }, []);
  return {
    skip: isNullOrUndefined(options?.pageNo) || isNullOrUndefined(options?.pageSize) ? undefined : options.pageSize * options.pageNo,
    top: isNullOrUndefined(options?.pageNo) || isNullOrUndefined(options?.pageSize) ? undefined : options.pageSize,
    filter: filter.length ? filter.join(' and ') : undefined
  };
}

/**
 * 从当前 vue router 中获取 Menu 菜单
 * @param routes
 * @param filter
 */
export function getMenusFromRoutes(routes: IRouteConfig[], filter?: (router: any) => boolean) {
  const strutreeRouters: StructureTree<IRouteConfig> = new StructureTree<IRouteConfig>();
  // 解析路由表
  return strutreeRouters.reduce(
    routes,
    (prev, cur, index, parentNodes) => {
      if (cur.name) {
        const menu: IMenu = {
          id: cur.name.toString(),
          name: cur.name.toString(),
          label: cur?.meta?.label,
          url: parentNodes.map((x: any) => x.path).join('/') + cur.path,
          level: parentNodes.length
        };
        if (!filter || filter(cur)) {
          prev.push(menu);
        }
      }

      return prev;
    },
    []
  );
}

// 将冗余数据转换为多维结构数据
export function convertRedundancy<T extends Record<string, any>, T2 extends Record<string, any>>(
  data: T[],
  rootMap: (node: T) => boolean,
  itemMap: (node: T) => T2,
  prop: keyof T,
  parentProp: keyof T
) {
  // 先找出 root 节点
  const nodes = data.filter((x) => rootMap(x));
  const props = nodes.map((x) => x[prop]);
  const res = nodes.map((x) => itemMap(x));

  const redundancy = function (res: T2[], props: any[], remaining: T[]) {
    res.forEach(function (item: any, index) {
      const children = remaining.filter((x) => x[parentProp] === props[index]);
      item.children = children.map((x) => itemMap(x));
      if (children.length) {
        redundancy(
          item.children,
          children.map((x) => x[prop]),
          remaining
        );
      }
    });
  };

  redundancy(res, props, data);

  return res;
}

export function getBytesFromFile(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function () {
      const arrayBuffer: any = this.result;
      const array = new Uint8Array(arrayBuffer);
      const binaryString = String.fromCharCode.apply(null, array);
      resolve(binaryString);
    };
    reader.readAsArrayBuffer(file);
  });
}

export function getBase64FromFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function () {
      resolve(this.result as string);
    };
    reader.readAsDataURL(file);
  });
}

// 动态添加角色选择控件，用于 develop 模式
export function appendRadios<T extends { name: string; text: string }>(
  name: string,
  title: string,
  value: string,
  arr: T[],
  container: HTMLElement,
  targetEl: HTMLElement,
  callback: (arg0: T) => any
) {
  let htmlStr = '';
  let cur = -1;
  if (value) {
    const i = arr.findIndex((x) => x.name === value);
    if (i > -1) {
      cur = i;
    }
  }
  arr.forEach((role, index) => {
    htmlStr += `<label class="roles-radios" style="margin-right: 5px; white-space: nowrap; cursor: pointer;"><input name="${name}" type="radio" value="${index}" ${
      index === cur ? 'checked' : ''
    }/>&nbsp;${role.text}</label>&nbsp;`;
  });
  htmlStr = `<div style="display: flex;margin-bottom: 10px;"><strong style="white-space: nowrap;">${title}：</strong><div>${htmlStr}</div></div>`;
  const element = document.createElement('div');
  element.innerHTML = htmlStr;
  container.insertBefore(element.children[0], targetEl || container.firstChild);
  // 绑定 radio change 事件
  container.querySelectorAll(`.roles-radios input[name='${name}']`).forEach(($radio: HTMLElement) => {
    $radio.onclick = (e: any) => {
      callback(arr[e.target.value]);
    };
  });
  if (cur > -1) {
    callback(arr[cur]);
  }
}

export function getOffset(element: any, target: HTMLElement = null) {
  const offset = {
    left: 0,
    top: 0
  };
  while (element !== target) {
    offset.left += element.offsetLeft;
    offset.top += element.offsetTop;
    element = element.offsetParent;
  }
  return offset;
}

export function registerStoreModule({ module, moduleName, store }: any) {
  const moduleIsRegistered = store._modules.root._children[moduleName] !== undefined;
  const stateExists = store.state[moduleName];
  if (!moduleIsRegistered) {
    store.registerModule(moduleName, module, { preserveState: stateExists });
  }
}

// 导入流文件
export function importStreamFile(accept = '') {
  return new Promise((resolve, reject) => {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.onchange = (e: any) => {
      const files = e.target.files;
      if (!files || !files.length) {
        input = null;
        reject(new Error('file not exist.'));
      }
      const reader = new FileReader();
      reader.onload = (e2: any) => {
        try {
          resolve(JSON.parse(e2.target.result));
        } catch (e) {
          reject(e);
        }
        input = null;
      };
      reader.readAsText(files[0]);
    };
    input.click();
  });
}

// 导出文件
export function exportStreamFile(data: any, filename: string, contentType = 'application/octet-stream'): Promise<void> {
  return new Promise((resolve, reject) => {
    if (data) {
      if (typeof window.navigator.msSaveBlob !== 'undefined') {
        window.navigator.msSaveBlob(new Blob([data]), filename);
        resolve();
      } else {
        const url = window.URL.createObjectURL(new Blob([data], { type: contentType }));
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        resolve();
      }
    } else {
      reject(new Error('文件不存在'));
    }
  });
}

export function downloadFile(file: Blob | File, filename: string) {
  const url = window.URL.createObjectURL(file);
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * 获取指定的时间戳对应的时分秒的值
 * @timestamp number
 * @constructor
 */
export function getTimestamp(timestamp: number) {
  const res = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  if (timestamp >= 86400000) {
    res.days = Math.floor(timestamp / 86400000);
    timestamp = timestamp % 86400000;
  }

  if (timestamp >= 3600000) {
    res.hours = Math.floor(timestamp / 3600000);
    timestamp = timestamp % 3600000;
  }

  if (timestamp >= 60000) {
    res.minutes = Math.floor(timestamp / 60000);
    timestamp = timestamp % 60000;
  }

  res.seconds = Math.floor(timestamp / 1000);

  return res;
}

/**
 * 获取指定的时间戳对应的时分秒的字符串
 * @param timestamp
 * @param format
 */
export function getTimestampStr(
  timestamp: number,
  format?: {
    day?: string;
    hour?: string;
    minute?: string;
    second?: string;
  }
) {
  const res = this.getTimestamp(timestamp);
  let str = '';
  if (format?.day && res.days) {
    str += res.days.toString() + format?.day;
  }
  if (format?.hour && res.hours) {
    str += res.hours.toString() + format?.hour;
  }
  if (format?.minute && res.minutes) {
    str += res.minutes.toString() + format?.minute;
  }
  if (format?.second && res.seconds) {
    str += res.seconds.toString() + format?.second;
  }
  return str;
}
