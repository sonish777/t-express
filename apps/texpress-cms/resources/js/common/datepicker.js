const el = document.querySelector('.datepicker');
if (el) {
    new Datepicker(el, {
        format: 'yyyy/mm/dd',
    });
}
