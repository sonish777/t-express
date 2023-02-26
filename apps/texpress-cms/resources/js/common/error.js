import { toastError } from './toast';

const errorMessage =
    document.getElementById('error_toast_message')?.innerText || '';

if (errorMessage) {
    toastError(errorMessage);
}
