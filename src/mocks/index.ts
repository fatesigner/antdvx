/**
 * Api
 */

import { timer } from 'rxjs';
import { Random, mock } from 'mockjs';

import { IUser } from '@/types/user';
import { IRole } from '@/types/role';
import { ROLES } from '@/app/constants';
import { httpService } from '@/app/services';
import { isFunction } from '@fatesigner/utils/type-check';

export const Api = new (class {
  get host() {
    return httpService.instance.defaults.baseURL;
  }

  constructor() {}

  async login(params: { username: string; password: string }): Promise<IUser<typeof ROLES.keys>> {
    await timer(1000).toPromise();
    return Promise.resolve({
      username: params.username,
      nickname: '',
      password: '',
      privileges: null,
      roles: ['admin'],
      avatar: '',
      usercode: '',
      realname: '',
      tokenType: '',
      accessToken: '',
      accessTokenFull: '',
      refreshToken: '',
      tokenExpirationTime: 0,
      menus: [],
      permissions: []
    });
  }

  logout(): Promise<any> {
    return Promise.resolve();
  }

  async addUser(user: IUser<any>) {}

  async deleteUser(userid: string, users: any[]) {
    const idx = users.findIndex((x) => x.userid === userid);
    if (idx > -1) {
      users.splice(idx, 1);
    } else {
      throw new Error('该用户不存在');
    }
  }

  async getRoles(): Promise<IRole[]> {
    await timer(1000).toPromise();
    return import('./roles.json').then(({ default: data }) => {
      return data;
    });
  }

  async saveRoles(params: any): Promise<any> {
    await timer(2000).toPromise();
    return Promise.resolve();
  }

  async getUsers(params?: { userid?: string; sex?: string; keywords?: string; pageNo?: number; pageSize?: number; filters?; sorter? }): Promise<{
    total: number;
    data: {
      userid: string;
      username: string;
      nickname: string;
      phone: string;
      age: number;
      address: string;
      email: string;
      sex: string;
      status: string;
      createTime: string;
      avatar: string;
    }[];
  }> {
    await timer(1000).toPromise();

    let data = await import('./users.json').then(({ default: res }) => {
      return res;
    });

    let total = 0;

    if (params?.userid) {
      data = data.filter((x) => x.userid === params?.userid);
    }

    if (params?.sex) {
      data = data.filter((x) => x.sex === params?.sex);
    }

    if (params?.keywords) {
      data = data.filter((x) => x.username.indexOf(params?.keywords) > -1);
    }

    // 过滤
    if (params?.filters) {
      const filterKeys = Object.keys(params.filters);
      if (filterKeys?.length) {
        data = data.filter((x) => filterKeys.every((y) => params.filters[y].includes(x[y])));
      }
    }
    // 排序
    if (params?.sorter?.columnKey) {
      if (params?.sorter?.order === 'ascend') {
        if (params.sorter.columnKey === 'createTime') {
          data = data.sort((a, b) => {
            return new Date(a['createTime']).getTime() - new Date(b['createTime']).getTime();
          });
        } else {
          data = data.sort((a, b) => {
            return a[params.sorter.columnKey] - b[params.sorter.columnKey];
          });
        }
      } else if (params.sorter.order === 'descend') {
        if (params.sorter.columnKey === 'createTime') {
          data = data.sort((a, b) => {
            return new Date(b['createTime']).getTime() - new Date(a['createTime']).getTime();
          });
        } else {
          data = data.sort((a, b) => {
            return b[params.sorter.columnKey] - a[params.sorter.columnKey];
          });
        }
      }
    }

    if (params?.pageNo) {
      total = data.length;
      const start = ((params?.pageNo ?? 1) - 1) * params?.pageSize ?? 10;
      data = data.slice(start, start + params?.pageSize ?? 10);
    }

    return {
      data,
      total
    };

    /*return {
      data: mock({
        'data|80-100': [
          {
            userid: '@id', //随机id
            username: '@name', //随机名称
            nickname: '@last', // 随机昵称
            phone: /^1[34578]\d{9}$/, //随机电话号码
            'age|11-99': 1, //年龄
            address: '@county(true)', //随机地址
            email: '@email', //随机邮箱
            'sex|1': ['male', 'female'], //随机性别
            'status|1': ['enabled', 'disabled'], //状态
            createTime: '@datetime', //创建时间
            avatar() {
              return Random.image('100×100', Random.color(), '#757575', 'png', this.nickName);
            }
          }
        ]
      }).data,
      total: 10
    };*/
  }

  async getChildren(params: { userid: string; pageNo?: number; pageSize?: number; id?: number; keywords?: string }) {
    const user = await this.getUsers({ userid: params?.userid });

    let data = mock({
      'data|80-100': [
        {
          userid: user.data?.[0]?.userid, //随机id
          username: user.data?.[0]?.username, //随机名称
          id: '@id', //随机id
          name: '@last', // 随机昵称
          phone: /^1[34578]\d{9}$/, //随机电话号码
          'age|11-99': 1, //年龄
          address: '@county(true)', //随机地址
          email: '@email', //随机邮箱
          'sex|1': ['male', 'female'], //随机性别
          createTime: '@datetime', //创建时间
          avatar() {
            return Random.image('100×100', Random.color(), '#757575', 'png', this.nickName);
          }
        }
      ]
    }).data;

    let total = 0;

    if (params?.id) {
      data = data.filter((x) => x.id === params?.id);
    }

    if (params?.keywords) {
      data = data.filter((x) => x.name.indexOf(params?.keywords) > -1);
    }

    if (params?.pageNo) {
      total = data.length;
      const start = ((params?.pageNo ?? 1) - 1) * params?.pageSize ?? 10;
      data = data.slice(start, start + params?.pageSize ?? 10);
    }

    return {
      data,
      total
    };
  }
})();
