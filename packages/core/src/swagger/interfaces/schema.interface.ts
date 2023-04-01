export interface SchemaPropertyProps {
    type: string;
    required?: boolean;
    format?: string;
    example?: string;
}

export interface SchemaSpec {
    type: 'object';
    required: string[];
    properties: {
        [propertyName: string]: SchemaPropertyProps;
    };
}

export interface SchemaDefinitionSpec {
    [propertyName: string]: SchemaSpec;
}
