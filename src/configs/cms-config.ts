interface IModule {
  name: string;
  route?: string;
  hasSubmodules?: boolean;
  icon?: string;
  subModules?: Omit<
    Required<IModule>,
    'hasSubmodules' | 'subModules' | 'icon'
  >[];
}

interface ICMSModuleConfig {
  [moduleName: string]: IModule;
}

export const CMSModulesConfig: ICMSModuleConfig = {
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
