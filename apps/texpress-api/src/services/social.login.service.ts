import { Service } from 'typedi';
import axios from 'axios';
import { SocialLoginDto } from '@api/dtos';
import { SocialLoginConfig } from '@api/configs';
import { SocialLoginEnum, SocialLoginInterface } from '@api/types';
import { BadRequestException } from 'shared/exceptions';
import JwksClient from 'jwks-rsa';
import jwt from 'jsonwebtoken';
@Service()
export class SocialLoginService {
    async socialLogin(SocialLoginDto: SocialLoginDto) {
        switch (SocialLoginDto.socialType.toLowerCase()) {
            case SocialLoginEnum['Facebook'].toLowerCase():
                return this.fetchUserFacebookData(SocialLoginDto);
            case SocialLoginEnum['Google'].toLowerCase():
                return this.fetchUserGoogleData(SocialLoginDto);
            case SocialLoginEnum['Apple'].toLowerCase():
                return this.fetchUserAppleData(SocialLoginDto);
            default:
                throw new BadRequestException(
                    'Please select valid social login.'
                );
        }
    }

    async fetchUserFacebookData(
        socialLoginDto: SocialLoginDto
    ): Promise<Partial<SocialLoginInterface>> {
        try {
            const response = await axios({
                url: SocialLoginConfig.FACEBOOK_FETCH_PROFILE_URL,
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + socialLoginDto.accessToken,
                },
            });
            return {
                socialType: socialLoginDto.socialType,
                socialToken: response?.data?.id,
                email: response?.data?.email || '',
                firstName: response?.data?.first_name,
                lastName: response?.data?.last_name,
            };
        } catch (error: any) {
            throw new BadRequestException(
                error?.response?.data?.error_description
                    ? 'Invalid Token.'
                    : error.message
            );
        }
    }

    async fetchUserGoogleData(
        socialLoginDto: SocialLoginDto
    ): Promise<Partial<SocialLoginInterface>> {
        try {
            const response = await axios({
                url:
                    SocialLoginConfig.GOOGLE_FETCH_PROFILE_URL +
                    socialLoginDto.accessToken,
                method: 'get',
            });
            return {
                socialType: socialLoginDto.socialType,
                socialToken: response?.data?.sub,
                email: response?.data?.email,
                firstName: response?.data?.given_name,
                lastName: response?.data?.family_name,
            };
        } catch (error: any) {
            throw new BadRequestException(
                error?.response?.data?.error_description
                    ? 'Invalid Token.'
                    : error.message
            );
        }
    }

    async fetchUserAppleData(
        socialLoginDto: SocialLoginDto
    ): Promise<Partial<SocialLoginInterface>> {
        try {
            const jwtHeader = JSON.parse(
                new Buffer(
                    socialLoginDto.accessToken.split('.')[0],
                    'base64'
                ).toString()
            );
            const jwksClients = JwksClient({
                cache: true,
                rateLimit: true,
                jwksUri: SocialLoginConfig.APPLE_FETCH_PROFILE_URL,
            });
            const signingKey = (
                await jwksClients.getSigningKey(jwtHeader?.kid || '')
            ).getPublicKey();
            return new Promise((resolve, reject) => {
                jwt.verify(
                    socialLoginDto.accessToken,
                    signingKey,
                    function (_error, userInfo) {
                        if (!userInfo) {
                            return reject(
                                new BadRequestException('Invalid Token.')
                            );
                        }
                        return resolve({
                            socialType: socialLoginDto.socialType,
                            socialToken:
                                typeof userInfo.sub === 'function'
                                    ? userInfo.sub()
                                    : userInfo.sub || '',
                            email:
                                typeof userInfo !== 'string'
                                    ? userInfo.email
                                    : '',
                        });
                    }
                );
            });
        } catch (error: any) {
            throw new BadRequestException(
                error?.response?.data?.error_description
                    ? 'Invalid Token.'
                    : error.message
            );
        }
    }
}
