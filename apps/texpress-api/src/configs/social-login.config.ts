import config from 'config';

export const SocialLoginConfig = {
    FACEBOOK_FETCH_PROFILE_URL:
        process.env.FACEBOOK_FETCH_URL ||
        config.get<string>('socialLogin.facebook'),
    GOOGLE_FETCH_PROFILE_URL:
        process.env.GOOGLE_FETCH_URL ||
        config.get<string>('socialLogin.google'),
    APPLE_FETCH_PROFILE_URL:
        process.env.APPLE_FETCH_URL || config.get<string>('socialLogin.apple'),
};
