import { Input, Tree } from 'ant-design-vue';
import {
  IconArrowDownSLine,
  IconFolderLine,
  IconLink,
  Iconfont,
  XButton,
  XButtonAdd,
  XButtonDelete,
  XButtonEdit,
  XButtonSearch,
  XCombobox,
  XModal,
  createXModal
} from '@/antdvx';
import { IMenu } from '@/antdvx/types';
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { StructureTree } from '@fatesigner/utils/structure-tree';

import { PERMISSIONS_TYPE } from '@/app/core/constants';
import { sessionService } from '@/app/core/services';

import $styles from './menus.setting.module.less';

/**
 * 菜单设置
 */
export const MenusSetting = defineComponent({
  props: {
    roleid: [Number, String]
  },
  emits: ['close'],
  setup(props) {
    const strutreeMenus: StructureTree<IMenu> = new StructureTree<IMenu>();

    const wrapRef = ref();

    const query = reactive({
      category: undefined,
      keywords: undefined
    });

    const tree = reactive({
      replaceFields: { children: 'children', title: 'label', key: 'id' },
      loading: false,
      checkable: true,
      selectable: false,
      checkedKeys: [],
      expandedKeys: [],
      selectedKeys: [],
      nodes: [],
      onDrop(info) {
        const dropPos = info.node.pos.split('-');
        if (dropPos.length >= 3) {
          const node = strutreeMenus.find(this.nodes, (x) => x.id === info.node.eventKey);
          if (node) {
            const parentNode = node.parentNodes[node.parentNodes.length - 1];
            const spliceNode = strutreeMenus.find(this.nodes, (x) => x.id === info.dragNode.eventKey);
            if (spliceNode) {
              const parentSpliceNode = spliceNode.parentNodes[spliceNode.parentNodes.length - 1];
              parentSpliceNode.children.splice(spliceNode.index, 1);
            }
            parentNode.children.splice(info.dropPosition + 1, 0, spliceNode.node);
          }
        }
      }
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
        model: null,
        onClose: null
      }
    );

    const nodeMap = (node) => {
      return {
        ...node,
        slots: {
          icon: 'prefixIcon'
        }
      };
    };

    const expandRoot = () => {
      tree.expandedKeys = tree.nodes.map((x) => x.id);
    };

    const presentFormPopup = (parent: any, model?: IMenu) => {
      formPopupRef.options.title = model ? 'Update Menu' : 'Add Menu';
      formPopupRef.compProps.model = model
        ? ({
            id: model.id,
            name: model.name,
            label: model.label,
            url: model.url,
            icon: model.icon,
            target: model.target
          } as IMenu)
        : null;
      formPopupRef.compProps.onClose = (values: IMenu) => {
        formPopupRef.handler.dismiss();
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(nodeMap(values));
        } else {
          Object.assign(model, values);
        }
      };
      formPopupRef.handler.present();
    };

    onMounted(() => {
      tree.nodes = [
        nodeMap({
          id: '_',
          label: 'Root',
          readonly: true,
          url: null,
          children: sessionService.user?.role?.menus ?? [
            {
              id: '0projectSchedule',
              name: 'projectSchedule',
              url: '/project/schedule',
              target: '_blank'
            }
          ]
        })
      ];
      expandRoot();
    });

    return {
      wrapRef,
      query,
      tree,
      formPopupRef,
      presentFormPopup
    };
  },
  render(ctx) {
    return (
      <div class='tw-flex tw-flex-col tw-h-full tw-h-96' ref='wrapRef'>
        <div class='tw-flex tw-items-center tw-gap-2 tw-p-2'>
          <XCombobox
            class='tw-w-28'
            clearable
            dataValueField='value'
            dataTextField='text'
            v-model={[ctx.query.category, 'value']}
            placeholder='Select Category'
            options={PERMISSIONS_TYPE.arr as any}
            onChange={() => {
              ctx.tbRef.handler.reload();
            }}
          />
          <Input
            class='tw-w-full'
            allowClear
            v-model={[ctx.query.keywords, 'value']}
            onChange={(e) => {
              if (!e.target.value) {
                // 点击 clear，重新加载数据
                ctx.tbRef.handler.reload();
              }
            }}
            onKeydown={(e) => {
              if (e.key === 'Enter') {
                ctx.tbRef.handler.reload();
              }
            }}
            placeholder='Input perssion name or description...'
            v-slots={{
              suffix() {
                return (
                  <XButtonSearch
                    onlyIcon
                    size='mini'
                    type='link'
                    onClick={() => {
                      ctx.tbRef.handler.reload();
                    }}
                  />
                );
              }
            }}
          />
          <XButton
            color='cyan'
            type='primary'
            onClick={() => {
              ctx.tbRef.handler.reload();
            }}>
            Search
          </XButton>
        </div>
        <div class='tw-flex-1 tw-p-2 tw-overflow-y-auto'>
          <Tree
            class={$styles['menus-tree']}
            draggable
            showLine
            showIcon={true}
            defaultExpandAll={false}
            disabled={ctx.tree.loading}
            checkable={ctx.tree.checkable}
            selectable={ctx.tree.selectable}
            replaceFields={ctx.tree.replaceFields}
            treeData={ctx.tree.nodes}
            v-models={[
              [ctx.tree.checkedKeys, 'checkedKeys'],
              [ctx.tree.expandedKeys, 'expandedKeys'],
              [ctx.tree.selectedKeys, 'selectedKeys']
            ]}
            v-slots={{
              switcherIcon() {
                return <IconArrowDownSLine scale='1.4' />;
              },
              prefixIcon({ dataRef }) {
                return dataRef.icon ? (
                  <Iconfont color='secondary' scale='1.4' name='icon' />
                ) : (dataRef.children && dataRef.children.length) || !dataRef.url ? (
                  <IconFolderLine color='secondary' scale='1.4' />
                ) : (
                  <IconLink color='primary' scale='1.4' />
                );
              },
              title(node) {
                return (
                  <div class='tw-flex tw-items-center tw-gap-2 tw--mt-0.5'>
                    {/* <div class='tw-flex-initial'>
                      <div class='tw-flex tw-items-center tw-space-x-2'>
                        <div class='tw-flex tw-items-center'>
                          {node.icon ? (
                            <Iconfont color='secondary' scale='1.4' name='icon' />
                          ) : (node.children && node.children.length) || !node.url ? (
                            <IconFolderLine color='secondary' scale='1.4' />
                          ) : (
                            <IconLink color='primary' scale='1.4' />
                          )}
                        </div>
                        <div class='tw-flex-1'>{node.label}</div>
                      </div>
                    </div> */}
                    <div class='tw-flex-initial'>{node.label}</div>
                    <div class='tw-flex-1 tw-space-x-2'>
                      <XButtonAdd
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
                          size='small'
                          type='outline'
                          disabled={ctx.tree.loading}
                          handler={async (e) => {
                            e.stopPropagation();
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
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
        <div class='tw-flex tw-justify-center tw-gap-4 tw-p-4 tw-border-t tw-border-gray-200'>
          <XButton
            color='secondary'
            size='large'
            type='3d'
            onClick={() => {
              ctx.$emit('close', ctx.selectedRows);
            }}>
            Confirm
          </XButton>
          <XButton
            size='large'
            type='3d'
            onClick={() => {
              ctx.$emit('close');
            }}>
            Cancel
          </XButton>
        </div>
        <XModal {...ctx.formPopupRef} />
      </div>
    );
  }
});
