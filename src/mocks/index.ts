/**
 * Api
 */

import { timer } from 'rxjs';

import { IUser } from '@/types/user';
import { IRole } from '@/types/role';
import { ROLES } from '@/app/constants';
import { httpService } from '@/app/services';

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

  async deleteUser(userid: string, users: IUser<any>[]) {
    const idx = users.findIndex((x) => x.userid === userid);
    if (idx > -1) {
      users.splice(idx, 1);
    } else {
      throw new Error('该用户不存在');
    }
  }

  async getRoles(): Promise<IRole[]> {
    await timer(1000).toPromise();
    return import('@/assets/auth/roles.json').then((res: any) => {
      return res.default;
    });
  }

  async saveRoles(params: any): Promise<any> {
    await timer(2000).toPromise();
    return Promise.resolve();
  }

  async getUsers(): Promise<IUser<any>[]> {
    await timer(1000).toPromise();
    return import('@/assets/auth/users.json').then((res: any) => {
      return res.default;
    });
    /*return Promise.resolve(
      mock({
        'data|80-100': [
          {
            userid: '@id', //随机id
            username: '@name', //随机名称
            nickname: '@last', // 随机昵称
            phone: /^1[34578]\d{9}$/, //随机电话号码
            'age|11-99': 1, //年龄
            address: '@county(true)', //随机地址
            email: '@email', //随机邮箱
            isMale: '@boolean', //随机性别
            createTime: '@datetime', //创建时间
            avatar() {
              return Random.image('100×100', Random.color(), '#757575', 'png', this.nickName);
            }
          }
        ]
      }).data+
    );*/
  }
})();
