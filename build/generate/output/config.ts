const PortalView = () => import('../views/portal/portal');
const IconfontView = () => import('../views/components/iconfont/iconfont');
const ScrollviewView = () => import('../views/components/scrollview/scrollview');
const GridDragableView = () => import('../views/components/grid-dragable/grid-dragable');
const AsyncSectionView = () => import('../views/components/async-section/async-section');
const LazyView = () => import('../views/components/lazy/lazy');
const ButtonView = () => import('../views/components/button/button');
const InputView = () => import('../views/components/input/input');
const ComboboxView = () => import('../views/components/combobox/combobox');
const PopupView = () => import('../views/components/popup/popup');
const StickySectionView = () => import('../views/components/sticky-section/sticky-section');
const TransitionsView = () => import('../views/components/transitions/transitions');
const PipesView = () => import('../views/components/pipes/pipes');
const EchartsView = () => import('../views/components/echarts/echarts');
const TableView = () => import('../views/components/table/table');
const PermissionsView = () => import('../views/system-settings/permissions/permissions');
const RolesView = () => import('../views/system-settings/roles/roles');
const UsersView = () => import('../views/system-settings/users/users');
export default [ {
              name: 'Portal',
              path: 'portal',
              component: PortalView,
              meta: {
                label: 'Portal',
                keepAlive: true
              },
              children: []
          },{
              name: 'Iconfont',
              path: 'components/iconfont',
              component: IconfontView,
              meta: {
                label: 'Iconfont',
                keepAlive: true
              },
              children: []
          },{
              name: 'Scrollview',
              path: 'components/scrollview',
              component: ScrollviewView,
              meta: {
                label: 'Scrollview',
                keepAlive: true
              },
              children: []
          },{
              name: 'GridDragable',
              path: 'components/grid-dragable',
              component: GridDragableView,
              meta: {
                label: 'Grid Dragable',
                keepAlive: true
              },
              children: []
          },{
              name: 'AsyncSection',
              path: 'components/async-section',
              component: AsyncSectionView,
              meta: {
                label: 'Async Section',
                keepAlive: true
              },
              children: []
          },{
              name: 'Lazy',
              path: 'components/lazy',
              component: LazyView,
              meta: {
                label: 'Lazy',
                keepAlive: true
              },
              children: []
          },{
              name: 'Button',
              path: 'components/button',
              component: ButtonView,
              meta: {
                label: 'Button',
                keepAlive: true
              },
              children: []
          },{
              name: 'Input',
              path: 'components/input',
              component: InputView,
              meta: {
                label: 'Input',
                keepAlive: true
              },
              children: []
          },{
              name: 'Combobox',
              path: 'components/combobox',
              component: ComboboxView,
              meta: {
                label: 'Combobox',
                keepAlive: true
              },
              children: []
          },{
              name: 'Popup',
              path: 'components/popup',
              component: PopupView,
              meta: {
                label: 'Popup',
                keepAlive: true
              },
              children: []
          },{
              name: 'StickySection',
              path: 'components/sticky-section',
              component: StickySectionView,
              meta: {
                label: 'Sticky Section',
                keepAlive: true
              },
              children: []
          },{
              name: 'Transitions',
              path: 'components/transitions',
              component: TransitionsView,
              meta: {
                label: 'Transitions',
                keepAlive: true
              },
              children: []
          },{
              name: 'Pipes',
              path: 'components/pipes',
              component: PipesView,
              meta: {
                label: 'Pipes',
                keepAlive: true
              },
              children: []
          },{
              name: 'Echarts',
              path: 'components/echarts',
              component: EchartsView,
              meta: {
                label: 'Echarts',
                keepAlive: true
              },
              children: []
          },{
              name: 'Table',
              path: 'components/table',
              component: TableView,
              meta: {
                label: 'Table',
                keepAlive: true
              },
              children: []
          },{
              name: 'Permissions',
              path: 'system-settings/permissions',
              component: PermissionsView,
              meta: {
                label: 'Permissions',
                keepAlive: true
              },
              children: []
          },{
              name: 'Roles',
              path: 'system-settings/roles',
              component: RolesView,
              meta: {
                label: 'Roles',
                keepAlive: true
              },
              children: []
          },{
              name: 'Users',
              path: 'system-settings/users',
              component: UsersView,
              meta: {
                label: 'Users',
                keepAlive: true
              },
              children: []
          } ];
    