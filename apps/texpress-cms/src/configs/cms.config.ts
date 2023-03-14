import { HTTPMethods } from 'core/utils';

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
        icon: `<i class="icofont-user-suited"></i>`,
        permissions: [
            {
                name: 'View users',
                value: 'users:view',
                route: '/users',
                method: HTTPMethods.Get,
            },
            {
                name: 'Create new user view',
                value: 'users:create',
                route: '/users/create',
                method: HTTPMethods.Get,
            },
            {
                name: 'Create new user',
                value: 'users:create',
                route: '/users',
                method: HTTPMethods.Post,
            },
            {
                name: 'Edit user view',
                value: 'users:edit',
                route: '/users/:id',
                method: HTTPMethods.Get,
            },
            {
                name: 'Edit user',
                value: 'users:edit',
                route: '/users/:id',
                method: HTTPMethods.Put,
            },
            {
                name: 'Delete user',
                value: 'users:delete',
                route: '/users/:id',
                method: HTTPMethods.Delete,
            },
            {
                name: 'Change user status',
                value: 'users:toggle_status',
                route: '/users/:id/toggle-status',
                method: HTTPMethods.Put,
            },
            {
                name: 'Change own password',
                value: '',
                route: '/users/me/change-password',
                method: HTTPMethods.Get,
            },
            {
                name: 'Change password',
                value: 'users:change_password',
                route: '/users/:id/change-password',
                method: HTTPMethods.Get,
            },
        ],
    },
    roles: {
        name: 'Roles',
        route: '/roles',
        default: 'roles:view',
        icon: `<i class="icofont-users-social"></i>`,
        permissions: [
            {
                name: 'View roles',
                value: 'roles:view',
                method: HTTPMethods.Get,
                route: '/roles',
            },
            {
                name: 'Create new role view',
                value: 'roles:create',
                method: HTTPMethods.Get,
                route: '/roles/create',
            },
            {
                name: 'Create new role',
                value: 'roles:create',
                method: HTTPMethods.Post,
                route: '/roles',
            },
            {
                name: 'Edit role view',
                value: 'roles:edit',
                method: HTTPMethods.Get,
                route: '/roles/:id',
            },
            {
                name: 'Edit role',
                value: 'roles:edit',
                method: HTTPMethods.Put,
                route: '/roles/:id',
            },
            {
                name: 'Delete role',
                value: 'roles:delete',
                method: HTTPMethods.Delete,
                route: '/roles/:id',
            },
        ],
    },
    'api-users': {
        name: 'Frontend Users',
        default: 'api-users:view',
        icon: `<i class="icofont-users-alt-4"></i>`,
        route: '/api-users',
        hasSubmodules: false,
        permissions: [
            {
                name: 'View frontend users',
                route: '/api-users',
                method: HTTPMethods.Get,
                value: 'api-users:view',
            },
            {
                name: 'Toggle user status',
                route: '/api-users/:id/toggle-status',
                method: HTTPMethods.Put,
                value: 'api-users:toggle_status',
            },
        ],
    },
    'email-templates': {
        name: 'Email Templates',
        default: 'email-templates:view',
        icon: '<i class="icofont-ui-email"></i>',
        route: '/email-templates',
        hasSubmodules: false,
        permissions: [
            {
                name: 'View email templates',
                route: '/email-templates',
                method: HTTPMethods.Get,
                value: 'email-templates:view',
            },
            {
                name: 'Edit email template view',
                route: '/email-templates/:id',
                method: HTTPMethods.Get,
                value: 'email-templates:edit',
            },
            {
                name: 'Edit email template',
                route: '/email-templates/:id',
                method: HTTPMethods.Put,
                value: 'email-templates:edit',
            },
            {
                name: 'Delete email template',
                route: '/email-templates/:id',
                method: HTTPMethods.Delete,
                value: 'email-templates:delete',
            },
        ],
    },
    'cms-configs': {
        name: 'CMS Configurations',
        default: 'cms-configs:view',
        hasSubmodules: false,
        icon: '<i class="icofont-ui-settings"></i>',
        route: '/cms-configs',
        permissions: [
            {
                name: 'View CMS Configurations',
                method: HTTPMethods.Get,
                route: '/cms-configs',
                value: 'cms-configs:view',
            },
            {
                name: 'Edit CMS Configurations',
                method: HTTPMethods.Put,
                route: '/cms-configs/:id',
                value: 'cms-configs:edit',
            },
        ],
    },
};
