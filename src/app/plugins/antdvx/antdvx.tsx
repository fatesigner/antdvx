/**
 * Antdvx
 */

import { Empty, message, notification } from 'ant-design-vue';
import {
  configureEcharts,
  configureVEcharts,
  configureXTable,
  setRequestAdapter,
  setStorageService,
  XButtonExport,
  XButtonFullscreen,
  XButtonFullscreenExit,
  XButtonRefresh,
  XTableSettingsPanelButton
} from 'antdvx';
import { setAntdvxPipesConfig } from 'antdvx/pipes';
import { merge } from 'lodash-es';

import { httpService, localStorageService } from '@/app/core/services';
import { i18n } from '@/app/i18n';

export const Antdvx = {
  install() {
    // 设置 Http 适配器
    setRequestAdapter((options) => {
      return httpService.request(options);
    });

    setStorageService(localStorageService);

    // 配置 pipes
    setAntdvxPipesConfig({
      dateFormat: 'YYYY-MM-DD',
      fixed: {
        digits: 2,
        mode: 'round'
      },
      currencyFormat: new Intl.NumberFormat('en-US', {
        style: 'decimal',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      })
    });

    notification.config({
      duration: 1,
      placement: 'topRight',
      bottom: '50px'
    });

    message.config({
      duration: 1,
      top: '26px',
      maxCount: 5
    });

    // 导入 antdvx 主题
    const classes = document.body.className.split(' ');
    classes.push('antdvx-theme-classic');
    document.body.className = classes.filter((x: any) => !!x).join(' ');

    // echarts
    configureEcharts({
      color: ['#91cc75', '#fac858', '#5470c6', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
      textStyle: {
        fontFamily: `-apple-system, BlinkMacSystemFont, Roboto, 'Noto Sans', 'Liberation Sans', 'PingFang SC', 'Hiragino Sans GB', 'Heiti SC', 'Microsoft Jhenghei', 'WenQuanYi Micro Hei', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`
      }
    });
    configureVEcharts({
      header(chartRef) {
        return (
          <div class='tw-mb-2 tw-flex tw-items-center tw-justify-end'>
            <div class='tw-flex-initial'>
              <img width='40' height='20' src={require('@/assets/img/logo.png')} alt='' title='' />
            </div>
            {chartRef.title ? (
              <div class='tw-flex-1 tw-pl-2 tw-pr-2'>
                <div class='tw-text-center tw-text-base'>{chartRef.title}</div>
              </div>
            ) : (
              ''
            )}
            {chartRef.error ? (
              ''
            ) : (
              <div class='tw-flex-initial tw-space-x-2'>
                {chartRef.refreshable ? (
                  <XButtonRefresh
                    disabled={chartRef.loading}
                    color='primary'
                    size='small'
                    type='link'
                    handler={chartRef.refresh}
                  />
                ) : undefined}
                {chartRef.exportable ? (
                  <XButtonExport
                    disabled={chartRef.loading}
                    size='small'
                    placement='bottomRight'
                    options={chartRef.exportOptions}
                  />
                ) : undefined}
              </div>
            )}
          </div>
        );
      }
    });

    configureXTable({
      pagination: {
        size: 'small',
        showLessItems: true,
        showQuickJumper: false,
        pageSizeOptions: ['10', '20', '50', '100', '200', '500', '10000']
      },
      dataSource: {
        pageSize: 50
      },
      locale: {
        emptyText: (
          <div class='tw-mt-4 tw-mb-4 tw-space-y-2'>
            <Empty
              image={require('./assets/nodata.png')}
              image-style={{
                height: '66px'
              }}
              description=''
            />
            <div class='tw-text-xs tw-text-gray-400'>No Data Found</div>
          </div>
        )
      } as any,
      columnMap(column) {
        if (!column.filterMode && column.dataIndex !== 'actions') {
          // column.filterMode = 'keywords';
        }
        return column;
      },
      // 标题栏，添加全屏放大按钮
      /* titlePrefix(tbRef) {
        return <XButtonFullscreen only-icon color='primary' size='mini' type='link' handler={tbRef.handler.fullscreen} />;
      }, */
      // 标题栏，尾部添加刷新按钮
      titleSuffix(tbRef) {
        return [
          // <XButtonRefresh only-icon color='primary' size='mini' type='link' handler={tbRef.handler.refresh} />,
          <XTableSettingsPanelButton
            only-icon
            color='primary'
            size='mini'
            type='link'
            handler={() => {
              return tbRef.handler.presentSettingsPanel();
            }}
          >
            Setting
          </XTableSettingsPanelButton>,
          tbRef.options.isFullscreen ? (
            <XButtonFullscreenExit
              only-icon
              color='primary'
              size='mini'
              type='link'
              onClick={tbRef.handler.fullscreenExit}
            >
              Exit Fullscreen
            </XButtonFullscreenExit>
          ) : (
            <XButtonFullscreen color='primary' size='mini' type='link' onClick={tbRef.handler.fullscreen}>
              Fullscreen
            </XButtonFullscreen>
          )
        ];
      }
    });

    const loadLang = async (lang) => {
      // 导入 language，非中文环境统一使用英文
      if (lang === 'zh-CN') {
        return import('antdvx/i18n/locales/zh-CN').then((res) => {
          return res.default;
        });
      } else {
        return import('antdvx/i18n/locales/en-US').then((res) => {
          return res.default;
        });
      }
    };

    // 加载初始语言
    loadLang(i18n._.global.locale).then((res) => {
      merge(i18n._.global.messages[i18n._.global.locale], res);
    });

    // 注册 i18n 勾子，每当切换语言之前，将会执行
    i18n.hooks.beforeSet.tapAsync((lang, locale) => {
      return loadLang(lang).then((res) => {
        return merge(locale, res);
      });
    });
  }
};
