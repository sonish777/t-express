interface Module {
  name: string;
  route?: string;
  hasSubmodules?: boolean;
  icon?: string;
  subModules?: Omit<
    Required<Module>,
    'hasSubmodules' | 'subModules' | 'icon'
  >[];
}

interface CMSModuleConfig {
  [moduleName: string]: Module;
}

export const CMSModulesConfig: CMSModuleConfig = {
  home: {
    name: 'Dashboard',
    route: '/home',
    icon: `<i class="icofont-home"></i>`,
  },
  users: {
    name: 'Users',
    route: '/users',
    icon: `<i class="icofont-ui-user"></i>`,
  },
  tables: {
    name: 'Tables',
    hasSubmodules: true,
    subModules: [
      {
        name: 'Bootstrap Tables',
        route: '/tables',
      },
    ],
  },
};
