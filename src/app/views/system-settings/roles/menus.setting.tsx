import { clone } from 'lodash-es';
import { useI18n } from 'vue-i18n';
import { getGUID } from '@fatesigner/utils/random';
import { DropEvent } from 'ant-design-vue/es/tree/Tree';
import { Alert, Modal, Spin, Tree, notification } from 'ant-design-vue';
import {
  IXButtonExportOptions,
  IconArrowDownSLine,
  IconFolderLine,
  Iconfont,
  XButton,
  XButtonAdd,
  XButtonDelete,
  XButtonEdit,
  XButtonExport,
  XButtonRefresh,
  XButtonSave,
  XButtonUpload,
  XModal,
  createXModal
} from 'antdvx';
import { IMenu } from 'antdvx/types';
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { StructureTree } from '@fatesigner/utils/structure-tree';

import { sysRoleApi } from '@/api';
import { SysRole } from '@/api/models';
import { i18nMessages } from '@/app/i18n';
import { ENV } from '@/app/core/constants';

import $styles from './menus.setting.module.less';

/**
 * 菜单设置
 */
export const MenusSetting = defineComponent({
  props: {
    roleId: [Number, String]
  },
  emits: ['close'],
  setup(props, { emit }) {
    const strutreeMenus: StructureTree<IMenu> = new StructureTree<IMenu>();

    const { t } = useI18n();

    // 当前角色对象
    let model: SysRole;

    const error = ref(false);
    const loading = ref(true);

    const query = reactive({
      category: undefined,
      keywords: undefined
    });

    const tree = reactive({
      replaceFields: { children: 'children', title: 'label', key: 'id' },
      loading: false,
      checkedKeys: [],
      expandedKeys: [],
      selectedKeys: [],
      nodes: []
    });

    // 表单 弹出层
    const formPopupRef = createXModal(
      {
        width: 620,
        footer: null,
        destroyOnClose: true
      },
      () => import('./menus.form').then(({ MenusForm }) => ({ default: MenusForm })),
      {
        parent: undefined,
        model: undefined,
        onClose: undefined
      }
    );

    const nodeMap = (node) => {
      return {
        ...node
        /* slots: {
          icon: 'prefixIcon'
        } */
      };
    };

    // 拖拽事件，转移节点
    const onDrop = (info: DropEvent) => {
      console.log('dragNode', info.dragNode.dataRef.label);
      console.log('node', info.node.dataRef.label);
      const dragNode = strutreeMenus.find(tree.nodes, (x) => x.id === info.dragNode.eventKey);
      const targetNode = strutreeMenus.find(tree.nodes, (x) => x.id === info.node.eventKey);
      if (dragNode && targetNode) {
        const dragParentNode = dragNode.parentNodes[dragNode.parentNodes.length - 1];
        if (info.dropToGap) {
          const targetParentNode = targetNode.parentNodes[targetNode.parentNodes.length - 1];
          let insertIn = info.dropPosition;
          if (dragParentNode.id === targetParentNode.id) {
            // 同层互换位置
            if (info.dropPosition < targetNode.index) {
              insertIn = targetNode.index;
            }
            if (dragNode.index > insertIn) {
              const item = dragParentNode.children?.[dragNode.index];
              dragParentNode.children.splice(dragNode.index, 1);
              dragParentNode.children.splice(insertIn, 0, item);
            } else {
              const item = dragParentNode.children?.[dragNode.index];
              dragParentNode.children.splice(insertIn, 0, item);
              dragParentNode.children.splice(dragNode.index, 1);
            }
            // exchangeItem(dragParentNode.children, dragNode.index, dragNode.index > insertIn ? insertIn : insertIn - 1);
          } else {
            // 跨层级
            if (info.dropPosition < targetNode.index) {
              insertIn = targetNode.index;
            }
            dragParentNode.children.splice(dragNode.index, 1);
            targetParentNode.children.splice(insertIn, 0, dragNode.node);
          }
        } else {
          // 添加至 targetNode 的 children
          if (!targetNode.node?.children) {
            targetNode.node.children = [];
          }
          targetNode.node.children.push(dragNode.node);
          dragParentNode.children.splice(dragNode.index, 1);
          // 自动展开
          tree.expandedKeys = [targetNode.node.id, ...tree.expandedKeys];
        }
      }
    };

    // 获取当前菜单对象
    const getCurrentMenus = () => {
      const nodes = clone(tree.nodes);
      return nodes?.[0]?.children;
    };

    // 删除指定节点
    const deleteNode = (model?: IMenu) => {
      const node = strutreeMenus.find(tree.nodes, (x) => x.id === model.id);
      if (node) {
        const parentNode = node.parentNodes[node.parentNodes.length - 1];
        parentNode.children.splice(node.index, 1);
      }
    };

    // 打开菜单表单姐界面
    const presentFormPopup = (parent: any, model?: IMenu) => {
      formPopupRef.options.title = model ? t(i18nMessages.app.systemSettings.menu.titleUpdate) : t(i18nMessages.app.systemSettings.menu.titleAdd);
      formPopupRef.compProps.parent = parent;
      formPopupRef.compProps.model = model ? clone(model) : null;
      formPopupRef.compProps.onClose = (values: IMenu) => {
        formPopupRef.handler.dismiss();
        if (values) {
          if (parent) {
            // 判断 children 内是否包含相同 name 的菜单
            if (parent?.children) {
              if (parent.children.find((x) => x.name === values.name)) {
                return Modal.warning({
                  title: 'This is a warning message',
                  content: t(i18nMessages.app.systemSettings.menu.duplicatedNameExist)
                });
              }
            } else {
              parent.children = [];
            }
            // 新增，生成 id
            values.id = getGUID(7);
            parent.children.push(nodeMap(values));
            // 自动展开
            tree.expandedKeys = [parent.id, ...tree.expandedKeys];
          } else {
            Object.assign(model, values);
          }
        }
      };
      formPopupRef.handler.present();
    };

    // 更新 nodes
    const updateNodes = (menus: IMenu[]) => {
      tree.nodes = [
        nodeMap({
          id: '_',
          label: t(i18nMessages.app.systemSettings.menu.root),
          readonly: true,
          url: null,
          children: menus
        })
      ];
      // 默认展开两层节点
      tree.expandedKeys = tree.nodes.flatMap((x) => [x.id, ...(x?.children?.map((x) => x.id) ?? [])]);
    };

    // 保存菜单
    const save = () => {
      const menu = getCurrentMenus();
      return sysRoleApi
        .systemManageRoleSave({
          sysRoleInput: {
            ...model,
            MenuJson: JSON.stringify(menu)
          }
        })
        .then(() => {
          notification.success({ message: 'Update menu success' });
          emit('close');
        })
        .catch((err) => {
          Modal.error({
            title: err.message
          });
        });
    };

    // 获取表单数据
    const loadData = async () => {
      if (props?.roleId) {
        loading.value = true;
        return sysRoleApi
          .systemManageRoleroleIdinfo({
            roleId: props.roleId.toString()
          })
          .then((res) => {
            model = res?.data?.Result;
            try {
              const menus = JSON.parse(res?.data?.Result?.MenuJson);
              updateNodes(menus);
            } catch (e) {
              updateNodes([]);
            }
          })
          .catch((err) => {
            error.value = err.message;
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        loading.value = false;
        updateNodes([]);
      }
    };

    onMounted(() => {
      loadData();
    });

    return {
      error,
      loading,
      query,
      tree,
      formPopupRef,
      save,
      onDrop,
      updateNodes,
      getCurrentMenus,
      presentFormPopup,
      deleteNode,
      loadData
    };
  },
  render(ctx) {
    return (
      <div class='tw-flex tw-flex-col tw-h-full tw-h-96'>
        {ctx.loading ? (
          <div class='tw-flex-1 tw-p-16 tw-text-center'>
            <Spin size='large' />
          </div>
        ) : ctx.error ? (
          <div class='tw-flex-1 tw-p-16'>
            <Alert message='Error' description={ctx.error} type='error' show-icon />
            <XButtonRefresh onlyIcon handler={ctx.loadData} />
          </div>
        ) : (
          [
            <div class='tw-flex tw-items-center tw-justify-between tw-gap-2 tw-px-4 tw-py-2 tw-border-b tw-border-gray-200 tw-shadow-sm'>
              <div class='tw-flex tw-items-center tw-gap-2'>
                <XButtonUpload
                  color='tertiary'
                  type='3d'
                  accept='application/json'
                  handler={async (file) => {
                    // 导入 json 文件
                    const reader = new FileReader();
                    reader.onload = (e2: any) => {
                      try {
                        const menus = JSON.parse(e2.target.result);
                        ctx.updateNodes(menus);
                      } catch (err) {
                        Modal.error({
                          title: err.message
                        });
                      }
                    };
                    reader.readAsText(file);
                  }}
                >
                  {ctx.$t(i18nMessages.app.systemSettings.menu.upload)}
                </XButtonUpload>
                <XButtonExport
                  type='3d'
                  options={
                    {
                      async json() {
                        const menus = ctx.getCurrentMenus();
                        return {
                          filename: ENV.APP_TITLE + '_menus',
                          content: JSON.stringify(menus, null, 2)
                        };
                      }
                    } as IXButtonExportOptions
                  }
                >
                  {ctx.$t(i18nMessages.app.systemSettings.menu.export)}
                </XButtonExport>
              </div>
              <div class='tw-flex tw-items-center tw-gap-2'>
                <XButtonSave color='secondary' size='large' type='3d' handler={ctx.save}>
                  {ctx.$t(i18nMessages.app.systemSettings.menu.save)}
                </XButtonSave>
                <XButton
                  size='large'
                  type='3d'
                  onClick={() => {
                    ctx.$emit('close');
                  }}
                >
                  {ctx.$t(i18nMessages.app.systemSettings.menu.cancel)}
                </XButton>
              </div>
            </div>,
            <div class='tw-flex-1 tw-p-2 tw-overflow-y-auto'>
              <Tree
                class={$styles['menus-tree']}
                draggable
                showLine={false}
                showIcon={false}
                checkable={false}
                selectable={false}
                defaultExpandAll={false}
                disabled={ctx.tree.loading}
                replaceFields={ctx.tree.replaceFields}
                treeData={ctx.tree.nodes}
                v-models={[
                  [ctx.tree.checkedKeys, 'checkedKeys'],
                  [ctx.tree.expandedKeys, 'expandedKeys'],
                  [ctx.tree.selectedKeys, 'selectedKeys']
                ]}
                {...{ onDrop: ctx.onDrop }}
                v-slots={{
                  switcherIcon() {
                    return <IconArrowDownSLine scale='1.4' />;
                  },
                  title(node) {
                    return (
                      <div class='tw-flex tw-items-center tw-gap-2 tw--mt-0.5'>
                        {node.icon ? (
                          <Iconfont color='primary' scale='1.4' name={node.icon} />
                        ) : (node.children && node.children.length) || !node.url ? (
                          <IconFolderLine color='secondary' scale='1.4' />
                        ) : undefined}
                        <div class='tw-flex-initial'>{node.label}</div>
                        <div class='tw-flex-1 tw-space-x-2'>
                          <XButtonAdd
                            onlyIcon
                            color='cyan'
                            size='small'
                            type='outline'
                            disabled={ctx.tree.loading}
                            onClick={(e) => {
                              e.stopPropagation();
                              ctx.presentFormPopup(node.dataRef, null);
                            }}
                          />
                          {!node.disabled && !node.readonly ? (
                            <XButtonEdit
                              onlyIcon
                              color='blue'
                              size='small'
                              type='outline'
                              disabled={ctx.tree.loading}
                              onClick={(e) => {
                                e.stopPropagation();
                                ctx.presentFormPopup(null, node.dataRef);
                              }}
                            />
                          ) : undefined}
                          {!node.disabled && !node.readonly ? (
                            <XButtonDelete
                              confirmed
                              onlyIcon
                              size='small'
                              type='outline'
                              disabled={ctx.tree.loading}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              handler={async () => {
                                ctx.deleteNode(node.dataRef);
                              }}
                            />
                          ) : undefined}
                        </div>
                        <div class='tw-text-xxs tw-text-gray-500'>{node.url}</div>
                      </div>
                    );
                  }
                }}
              />
            </div>
          ]
        )}
        <XModal {...ctx.formPopupRef} />
      </div>
    );
  }
});
