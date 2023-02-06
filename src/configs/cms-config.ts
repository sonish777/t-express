import { HTTPMethods } from '@core/utils';

interface Permission {
  name: string;
  value: string;
  route: string;
  method: HTTPMethods;
}

interface Module {
  name: string;
  route?: string;
  hasSubmodules?: boolean;
  icon?: string;
  default?: string;
  subModules?: Omit<
    Required<Module>,
    'hasSubmodules' | 'subModules' | 'icon' | 'default'
  >[];
  permissions?: Permission[];
}

interface CMSModuleConfig {
  [moduleName: string]: Module;
}

export const CMSModulesConfig: CMSModuleConfig = {
  home: {
    name: 'Dashboard',
    route: '/home',
    default: 'dashboard:view',
    icon: `<i class="icofont-home"></i>`,
    permissions: [
      {
        name: 'View dashboard',
        value: 'dashboard:view',
        route: '/home',
        method: HTTPMethods.Get,
      },
    ],
  },
  users: {
    name: 'Users',
    route: '/users',
    default: 'users:view',
    icon: `<i class="icofont-ui-user"></i>`,
    permissions: [
      {
        name: 'View all users',
        value: 'users:view',
        route: '/users',
        method: HTTPMethods.Get,
      },
      {
        name: 'Create new user',
        value: 'users:create',
        route: '/users',
        method: HTTPMethods.Post,
      },
    ],
  },
  roles: {
    name: 'Roles',
    route: '/roles',
    default: 'roles:view',
    icon: `<i class="icofont-users-social"></i>`,
  },
  tables: {
    name: 'Tables',
    hasSubmodules: true,
    subModules: [
      {
        name: 'Bootstrap Tables',
        route: '/tables',
        permissions: [],
      },
    ],
  },
};
