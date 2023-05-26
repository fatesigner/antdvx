const PortalView = () => import('../views/portal/portal');
const ButtonView = () => import('../views/components/button/button');
const TableView = () => import('../views/components/table/table');
/* const PermissionsView = () => import('../views/system-settings/permissions/permissions');
const RolesView = () => import('../views/system-settings/roles/roles');
const UsersView = () => import('../views/system-settings/users/users'); */
export default [
  {
    name: 'Portal',
    path: 'portal',
    component: PortalView,
    meta: {
      label: 'Portal',
      keepAlive: true
    },
    children: []
  },
  {
    name: 'Button',
    path: 'components/button',
    component: ButtonView,
    meta: {
      label: 'Button',
      keepAlive: true
    },
    children: []
  },
  {
    name: 'Table',
    path: 'components/table',
    component: TableView,
    meta: {
      label: 'Table',
      keepAlive: true
    },
    children: []
  }
];
