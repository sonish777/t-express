import { Provider } from './provider.interface';

export interface ProviderWithOptions<ProviderOptions> {
    class: Provider;
    options: ProviderOptions;
}
