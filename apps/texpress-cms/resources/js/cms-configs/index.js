$('.toggle-config-input').click(function (e) {
    const configName = $(this).data('config');
    $(`input#${configName}`)?.prop('disabled', false);
    $(this).addClass('d-none');
    $(`#toggle-done_${configName}`).removeClass('d-none');
    $(`#toggle-cancel_${configName}`).removeClass('d-none');
});

$('.cancel').click(function (e) {
    const configName = $(this).data('config');
    $(`input#${configName}`)?.prop('disabled', true);
    $(this).addClass('d-none');
    $(`#toggle-done_${configName}`).addClass('d-none');
    $(`#toggle-edit_${configName}`).removeClass('d-none');
});
