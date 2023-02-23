export interface AuthEventsTypes {
    'send-otp': [{ user_name: string; otp_code: string; to_email: string }];
}
