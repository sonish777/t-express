export interface ParameterSpec {
    in: string;
    name: string;
    required?: boolean;
    schema?: {
        type: string;
        example?: string;
    };
}

export interface RequestBodySpec {
    required?: boolean;
    content: {
        [contentType: string]: {
            schema: {
                $ref: string;
                [props: string]: any;
            };
        };
    };
    [props: string]: any;
}

export interface ResponseSpec {
    [code: string]: {
        description: string;
        content: {
            [contentType: string]: {
                schema?: {
                    type?: string;
                    format?: string;
                    properties?: Record<string, any>;
                    $ref?: string;
                    [props: string]: any;
                };
            };
        };
        [props: string]: any;
    };
}

export interface OpenAPISpec {
    description?: string;
    summary?: string;
    consumes?: string[];
    parameters?: ParameterSpec[];
    requestBody?: RequestBodySpec;
    responses?: {
        [code: string]: {
            description: string;
            content: { [contentType: string]: {} };
        };
    };
    tags?: string[];
}

export interface SwaggerSpec {
    [handler: string]: OpenAPISpec;
}

export interface SwaggerPathSpec {
    [path: string]: {
        [method: string]: OpenAPISpec & {
            security: { [scheme: string]: string[] } | {};
        };
    };
}
