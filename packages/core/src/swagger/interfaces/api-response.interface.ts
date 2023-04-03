import { Class } from 'core/interfaces';

export interface ApiResponseProps {
    code?: string;
    description?: string;
    contentType?:
        | 'application/json'
        | 'text/plain'
        | 'application/pdf'
        | string;
    schema?:
        | Class
        | {
              type: string;
              properties?: Record<string, any>;
              format?: string;
              example?: any;
              [props: string]: any;
          };
}
