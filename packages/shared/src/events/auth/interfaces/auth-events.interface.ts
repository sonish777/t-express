export interface AuthEventsTypes {
    'send-otp': [{ user_name: string; otp_code: string; to_email: string }];
    'cms-forgot-password': [
        { user_name: string; reset_password_link: string; to_email: string }
    ];
}
