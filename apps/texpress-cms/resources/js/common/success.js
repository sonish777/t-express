import { toastSuccess } from './toast';

const message =
    document.getElementById('success_toast_message')?.innerText || '';

if (message) {
    toastSuccess(message);
}
