import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { StructureTree } from '@fatesigner/utils/structure-tree';
import { message, notification } from 'ant-design-vue';
import to from 'await-to-js';
import { of, timer } from 'rxjs';

import { authService, sessionService } from '@/app/core/services';
import { i18nMessages } from '@/app/i18n';
import { AvatarImage, MenusJson } from '@/assets';

import Passport from './passport';

/**
 * 授权配置
 */
export default defineComponent({
  setup() {
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();

    // 登录表单 提交
    const loginSubmit = async (values) => {
      const [err, res] = await to(
        timer(2000)
          .pipe(() =>
            of({
              data: {
                Code: 200,
                Succeeded: true,
                Message: 'Success',
                Description: null,
                Extras: null,
                Timestamp: 1676313174818,
                Result: {
                  User: {
                    Account: 'sys',
                    Code: 'sys',
                    FirstName: 'sys',
                    LastName: 'sys',
                    Name: 'sys',
                    Sex: 3,
                    Email: '23456765432345676545671123@gmail.com',
                    Phone: '18110960203',
                    AdminType: 0,
                    OrgID: 0,
                    OrgName: '',
                    RoleNames: null,
                    Status: 0,
                    ID: 270478983172165,
                    Reserved1: null,
                    UpdatedTime: '2022-10-28 14:26',
                    UpdatorCode: 'sys',
                    UpdatorName: 'sys',
                    CreatedTime: '2022-03-25 17:21',
                    CreatorCode: 'wei',
                    CreatorName: 'string'
                  },
                  Roles: [
                    {
                      Name: 'SuperAdmin',
                      Code: 'SuperAdmin',
                      Sort: 1,
                      Remark: 'SuperAdmin',
                      MenuJson: null,
                      Permissions: [],
                      Status: 0,
                      ID: 289645822718021,
                      Reserved1: null,
                      UpdatedTime: '2022-11-02 22:30',
                      UpdatorCode: 'sys',
                      UpdatorName: 'sys',
                      CreatedTime: '2022-05-18 21:11',
                      CreatorCode: 'jenny',
                      CreatorName: 'jenny'
                    },
                    {
                      Name: 'Master Admin',
                      Code: 'MAdmin',
                      Sort: 10,
                      Remark: 'Master Admin',
                      MenuJson: null,
                      Permissions: [],
                      Status: 0,
                      ID: 270146497667141,
                      Reserved1: null,
                      UpdatedTime: '2022-10-26 11:00',
                      UpdatorCode: 'sys',
                      UpdatorName: 'sys',
                      CreatedTime: '2022-03-24 18:48',
                      CreatorCode: 'sys',
                      CreatorName: '测试'
                    },
                    {
                      Name: 'Project Admin',
                      Code: 'PAdmin',
                      Sort: 20,
                      Remark: 'Project Admin',
                      MenuJson: null,
                      Permissions: [],
                      Status: 0,
                      ID: 270146609152069,
                      Reserved1: null,
                      UpdatedTime: '2022-10-26 11:01',
                      UpdatorCode: 'sys',
                      UpdatorName: 'sys',
                      CreatedTime: '2022-03-24 18:49',
                      CreatorCode: 'sys',
                      CreatorName: '测试'
                    },
                    {
                      Name: 'External_reader',
                      Code: 'ExternalReader',
                      Sort: 60,
                      Remark: ' Project Reader w/o cost',
                      MenuJson: null,
                      Permissions: [],
                      Status: 0,
                      ID: 347228455657541,
                      Reserved1: null,
                      UpdatedTime: '2022-10-28 14:27',
                      UpdatorCode: 'sys',
                      UpdatorName: 'sys',
                      CreatedTime: '2022-10-28 14:16',
                      CreatorCode: 'sys',
                      CreatorName: 'sys'
                    }
                  ]
                }
              }
            })
          )
          .toPromise()
      );

      if (err) {
        notification.error({ message: '', description: err.message, duration: 1 });
      } else {
        const roles: typeof sessionService.user.roles =
          res?.data?.Result?.Roles?.map((x) => {
            let menus;
            if (x.MenuJson) {
              try {
                const str = x.MenuJson.replace(/[\d.]{18,}/g, (val) => `"${val}"`);
                const data = JSON.parse(str);
                if (data) {
                  menus = data ?? [];
                }
              } catch (e) {
                menus = [];
              }
            }

            const strutree = new StructureTree<any>({
              idKey: 'id',
              labelKey: 'path',
              childrenKey: 'children'
            });

            menus = strutree.filter(MenusJson as any[], (node: any) => {
              return !node?.auth || node?.auth;
            }) as any[];

            return {
              id: x.ID,
              name: x.Code as any,
              label: x.Name,
              menus,
              permissions: x?.Permissions?.map((y) => y.Name) ?? []
            };
          }) ?? [];

        // 默认第一个角色
        const role = roles?.[0] as any;

        sessionService.login({
          userid: res.data.Result.User?.ID,
          username: res.data.Result.User?.Account,
          // 用户头像
          avatar: AvatarImage,
          // accessToken 有效时间 24 天
          tokenExpirationTime: new Date().getTime() + 24 * 60 * 60 * 1000,
          accessToken: 'zzzz',
          role,
          roles
        });

        // 跳转至 redirect 或者 主页
        if (authService.config.redirectEnable && route.query.redirect) {
          await router.replace({ path: route.query.redirect as string });
        } else {
          await router.replace({ name: authService.config.homePage });
        }

        message.success(t(i18nMessages.app.passport.login.message));
      }
    };

    // 找回密码表单 提交
    const updatePasswordSubmit = async (values) => {
      const [err] = await to<any>(
        timer(2000)
          .pipe(() =>
            of({
              data: {
                Code: 200,
                Succeeded: true,
                Message: 'Success',
                Description: null,
                Extras: null,
                Timestamp: 1676313174818
              }
            })
          )
          .toPromise()
      );

      if (err) {
        throw err;
      } else {
        message.success(t(i18nMessages.app.passport.updatePassword.message.submitSuccess));
      }
    };

    return {
      loginSubmit,
      updatePasswordSubmit
    };
  },
  render(ctx) {
    return (
      <Passport
        showCaptcha={true}
        rememberMe={true}
        notify={true}
        account={{
          username: 'sys',
          password: 'App@123!@#'
        }}
        loginSubmit={ctx.loginSubmit}
        updatePasswordSubmit={ctx.updatePasswordSubmit}
      />
    );
  }
});
