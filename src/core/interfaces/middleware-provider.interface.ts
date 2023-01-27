import { ProviderClass } from "./provider-class.interface";

export interface ProviderWithOptions<ProviderOptions> {
    class: ProviderClass;
    options: ProviderOptions;
}
