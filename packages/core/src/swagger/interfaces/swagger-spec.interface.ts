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
            };
        };
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
        [method: string]: OpenAPISpec;
    };
}
