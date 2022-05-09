/**
 * utils
 */

import { IMenu, IRouteRecordRaw } from '@/antdvx/types';
import { isNullOrUndefined } from '@fatesigner/utils/type-check';

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
export function getOdataQuery(options: { pageNo?: number; pageSize?: number; filters?: (() => string)[] }): {
  skip: string;
  top: string;
  filter: string;
} {
  const filter = options?.filters.reduce((prev, cur) => {
    const r = cur();
    if (r) {
      prev.push(r);
    }
    return prev;
  }, []);
  return {
    skip: isNullOrUndefined(options?.pageNo) || isNullOrUndefined(options?.pageSize) ? undefined : (options.pageSize * options.pageNo).toString(),
    top: isNullOrUndefined(options?.pageNo) || isNullOrUndefined(options?.pageSize) ? undefined : options.pageSize.toString(),
    filter: filter.length ? filter.join(' and ') : undefined
  };
}

/**
 * 从当前 vue router 中获取 Menu 菜单
 * @param routes
 * @param filter
 */
export async function getMenusFromRoutes(routes: IRouteRecordRaw[], filter?: (router: any) => boolean) {
  // const strutreeRouters: StructureTree<IRouteConfig> = new StructureTree<IRouteConfig>();
  // 解析路由表
  return routes.reduce((prev, cur, index, parentNodes) => {
    if (cur.name) {
      const menu: IMenu = {
        id: index + cur.name.toString(),
        name: cur.name.toString(),
        label: cur?.meta?.label,
        url: cur.path
      };
      if (!filter || filter(cur)) {
        prev.push(menu);
      }
    }

    return prev;
  }, []);
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

export function getEventArgs(e: MouseEvent | TouchEvent) {
  if ((e as TouchEvent).touches) {
    return {
      // TouchEvent does not support offset position
      offsetX: 0,
      offsetY: 0,
      points: Array.from((e as TouchEvent).touches).map(({ clientX, clientY }) => [clientX, clientY])
    };
  } else {
    return {
      offsetX: (e as MouseEvent).offsetX,
      offsetY: (e as MouseEvent).offsetY,
      points: [[(e as MouseEvent).clientX, (e as MouseEvent).clientY]]
    };
  }
}

/**
 * 删除集合中的指定某个元素，并返回该元素在集合中的位置
 * @return index
 */
export function removeItem<T>(callback: (record: T) => boolean, arr: T[]): number {
  if (arr) {
    const index = arr.findIndex((x) => callback(x));
    if (index > -1) {
      arr.splice(index, 1);
    }
    return index;
  }
  return -1;
}

/**
 * 移动指定集合中的元素位置
 * @param arr
 * @param index
 * @param index2
 */
export function exchangeItem(arr: any[], index: number, index2: number) {
  if (index !== index2) {
    if (index > index2) {
      const temp = index2;
      index2 = index;
      index = temp;
    }
    const item = arr?.[index];
    if (item && arr.length >= index2 - 1) {
      arr.splice(index2 + 1, 0, item);
      arr.splice(index, 1);
    }
  }
}

/**
 * 过滤树形结构数据
 * @param nodes
 * @param callback
 */
export function filterTreeData<T>(nodes: T[], callback: (node: T, index: number, parentNodes: T[]) => boolean) {
  const newNodes = [];

  // 采用递归深度遍历
  const forEach = (nodes, newNodes, parentNodes) => {
    let matched = false;
    for (const [index, childNode] of nodes.entries()) {
      const childrenNodes = childNode.Children;
      const childNodeNew = { ...childNode, Children: [] };
      if (callback(childNode, index, parentNodes)) {
        matched = true;
        newNodes.push(childNodeNew);
        if (childrenNodes && childrenNodes.length) {
          forEach(childrenNodes, childNodeNew.Children, [...parentNodes, childNode]);
        }
      } else {
        // 未匹配，继续过滤子节点
        if (childrenNodes && childrenNodes.length) {
          if (forEach(childrenNodes, childNodeNew.Children, [...parentNodes, childNode])) {
            matched = true;
            newNodes.push(childNodeNew);
          }
        }
      }
    }
    return matched;
  };

  forEach(nodes, newNodes, []);

  return newNodes;
}

/**
 * 将 base64 编码转换为 file 对象
 * @param dataurl
 * @param filename
 * @param options
 */
export function dataURLtoFile(dataurl: string, filename: string, options): File {
  // 获取到 base64 编码
  const arr = dataurl.split(',');
  // 将 base64 编码转为字符串
  const bstr = window.atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n); // 创建初始化为0的，包含length个元素的无符号整型数组
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, options);
}

/**
 * 调用打印
 * @param htmlStr 待打印的模板字符串
 * @constructor
 */
export function print(htmlStr: string): Promise<void> {
  return new Promise((resolve) => {
    const $iframe = document.createElement('iframe');
    $iframe.style.display = 'none';
    document.body.appendChild($iframe);
    $iframe.contentDocument.write(htmlStr);
    $iframe.contentDocument.close();
    $iframe.contentWindow.print();
    window.setTimeout(() => {
      resolve();
    }, 500);
  });
}
