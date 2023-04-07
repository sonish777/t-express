const notyf = new Notyf({
    position: {
        x: 'right',
        y: 'top',
    },
    types: [
        {
            type: 'error',
            dismissible: true,
            duration: 5000,
        },
        {
            type: 'success',
            dismissible: true,
            duration: 5000,
        },
    ],
});

export function toastError(message) {
    notyf.open({
        type: 'error',
        message: message,
    });
}

export function toastSuccess(message) {
    notyf.open({
        type: 'success',
        message: message,
    });
}
