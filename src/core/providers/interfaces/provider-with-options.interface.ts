import { Provider } from './provider.interface';

export type ProviderWithOptions<ProviderOptions> = {
  class: Provider;
  options: ProviderOptions;
};
