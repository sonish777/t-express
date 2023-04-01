import { Class } from 'core/interfaces';

export interface ApiParametersProps {
    in: 'path' | 'query';
    schema?:
        | {
              name: string;
              type: string;
              required?: boolean;
          }[]
        | Class;
    description?: string;
}
