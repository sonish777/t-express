import { Class } from 'core/interfaces';

export interface ApiBodyProps {
    contentType: 'application/json' | 'multipart/form-data';
    schema?: Class;
    required?: boolean;
}
