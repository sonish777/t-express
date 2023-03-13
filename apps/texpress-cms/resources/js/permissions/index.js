const AUTO_TOGGLE_ON = {
    create: ['view', 'create:get', 'create:post'],
    edit: ['view', 'edit:get', 'edit:put'],
    delete: ['view'],
    toggle_status: ['view'],
    change_password: ['view'],
};

const AUTO_TOGGLE_OFF = {
    view: ['create', 'edit', 'delete', 'change_password', 'toggle_status'],
    create: ['create:get', 'create:post'],
    edit: ['edit:get', 'edit:put'],
};

function getSelector(moduleId, module, actionMethod) {
    let action, method;
    if (actionMethod.indexOf(':') >= 0) {
        [action, method] = actionMethod.split(':');
    } else {
        action = actionMethod;
    }
    let selector = `input[data-module="${moduleId}"][data-action="${module}:${action}"]`;
    if (method) {
        selector += `[data-method="${method}"]`;
    }
    return selector;
}

$('.auto-toggle').change(function (e) {
    const elAction = $(this).data('action');
    const elModuleId = $(this).data('module');
    const [module, action] = elAction.split(':');
    if (e.target.checked && AUTO_TOGGLE_ON[action]) {
        AUTO_TOGGLE_ON[action].forEach((ac) => {
            const selector = getSelector(elModuleId, module, ac);
            $(selector).prop('checked', true);
        });
    } else if (!e.target.checked && AUTO_TOGGLE_OFF[action]) {
        AUTO_TOGGLE_OFF[action].forEach((ac) => {
            const selector = getSelector(elModuleId, module, ac);
            $(selector).prop('checked', false);
        });
    }
});
