export type SecuritySchemeTypes = 'BearerAuth' | 'ApiKeyAuth' | 'BasicAuth';

export function SecuritySchemes(
    type: 'ApiKeyAuth',
    options: {
        in: string;
        name: string;
    }
): any;
export function SecuritySchemes(
    type: 'BearerAuth' | 'BasicAuth',
    options?: undefined
): any;
export function SecuritySchemes(
    type: SecuritySchemeTypes,
    options?: {
        in: string;
        name: string;
    }
): any {
    switch (type) {
        case 'BearerAuth':
            return {
                type: 'http',
                scheme: 'bearer',
            };
        case 'ApiKeyAuth':
            return {
                type: 'apiKey',
                in: options?.in,
                name: options?.name,
            };
        case 'BasicAuth':
            return {
                type: 'http',
                scheme: 'basic',
            };
    }
}
