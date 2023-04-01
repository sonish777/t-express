export enum ControllerMetadataKeys {
    BASE_PATH = 'base_path',
    ROUTERS = 'routers',
    IS_API = 'is_api',
    IS_FALLBACK = 'is_fallback',
    CHECK_PERMISSIONS = 'check_permissions',
}

export enum DTOMetadataKey {
    DTO_PARAMETER_INDICES = 'dto_parameter_indices',
}

export enum ConsumersMetadataKeys {
    CONSUMERS = 'consumers',
}

export enum MultipartMetadataKeys {
    MULTIPART_FIELDS = 'multipart_fields',
    MULTIPART_CONFIGS = 'multipart_configs',
}

export enum TwoFAMetadataKeys {
    SKIP_TWO_FA = 'skip_two_fa',
}

export enum SwaggerMetadataKeys {
    SCHEMA_DEFINITION = 'schema_definition',
    SCHEMA_PROPERTIES = 'schema_properties',
    API_METADATA = 'api_metadata',
    API_TAG = 'api_tag',
}
