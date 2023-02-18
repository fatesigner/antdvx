import { defineComponent, ref } from 'vue';
import { IconNotificationLine } from 'antdvx';
import { Avatar, Badge, Dropdown, List, ListItem, ListItemMeta, TabPane, Tabs, Tag } from 'ant-design-vue';

import $styles from './notify-bar.module.less';

/**
 * 消息通知栏
 */
export const NotifyBar = defineComponent({
  name: 'NotifyBar',
  setup() {
    const visible = ref(false);
    const tabActivated = ref('notification');

    // 通知
    const notifications = ref(Array.from(new Array(10)).map((x) => ({ title: '' })));

    // 消息
    const messages = ref(Array.from(new Array(10)).map((x) => ({ title: '' })));

    // 任务
    const tasks = ref(Array.from(new Array(10)).map((x) => ({ title: '' })));

    return {
      visible,
      tabActivated,
      notifications,
      messages,
      tasks
    };
  },
  render(ctx) {
    return (
      <div class='tw-flex tw-h-full tw-items-center'>
        <Dropdown
          trigger='click'
          v-model={[ctx.visible, 'visible']}
          v-slots={{
            overlay() {
              return (
                <div class={$styles.tabs}>
                  <div class='tw-p-1' />
                  <div class={$styles.content}>
                    <List
                      item-layout='horizontal'
                      data-source={ctx.notifications}
                      v-slots={{
                        renderItem(item) {
                          return (
                            <ListItem class={$styles.item}>
                              <ListItemMeta
                                description='Ten minutes ago'
                                v-slots={{
                                  title() {
                                    return (
                                      <div>
                                        Changes made by KennethChen, on 2022-01-13, in <span>[Manual input/Sync fr. PETS].</span>
                                      </div>
                                    );
                                  },
                                  avatar() {
                                    return <Avatar src='https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png' />;
                                  }
                                }}
                              />
                            </ListItem>
                          );
                        }
                      }}
                    />
                  </div>
                  {ctx.notifications.length ? (
                    <div class={$styles.footer}>
                      <div
                        title='Clear'
                        onClick={() => {
                          ctx.notifications = [];
                        }}>
                        Clear
                      </div>
                      <div class='tw-text-primary' title='More'>
                        More
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              );
            }
          }}>
          <div class={$styles.dropdown}>
            <IconNotificationLine scale={1.2} />
            <Badge count='25' />
          </div>
        </Dropdown>
      </div>
    );
  }
});
