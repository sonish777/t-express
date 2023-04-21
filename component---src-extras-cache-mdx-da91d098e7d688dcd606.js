(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{"2zBy":function(e,t,a){"use strict";a.r(t),a.d(t,"_frontmatter",(function(){return s})),a.d(t,"default",(function(){return h}));var n=a("IKa1"),c=a("Yh9w"),i=(a("r0ML"),a("V0Ug")),r=a("sN0p");a("xH0s");const o=["components"],s={};void 0!==s&&s&&s===Object(s)&&Object.isExtensible(s)&&!Object.prototype.hasOwnProperty.call(s,"__filemeta")&&Object.defineProperty(s,"__filemeta",{configurable:!0,value:{name:"_frontmatter",filename:"src/extras/cache.mdx"}});const l={_frontmatter:s},d=r.a;function h(e){let{components:t}=e,a=Object(c.a)(e,o);return Object(i.b)(d,Object(n.a)({},l,a,{components:t,mdxType:"MDXLayout"}),Object(i.b)("h1",{id:"caching"},"Caching"),Object(i.b)("p",null,"Texpress provides a ",Object(i.b)("inlineCode",{parentName:"p"},"CacheService")," shared utility class for handling caching with redis. It provides methods to store, retrieve or delete data from a Redis cache."),Object(i.b)("h2",{id:"methods"},"Methods"),Object(i.b)("p",null,"The CacheService provides the following methods:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("inlineCode",{parentName:"li"},"set(key: string, value: any, ttl?: number)"),": sets a value for a given key, with an optional TTL (in seconds). If TTL is not specified, the default TTL value is used from the configuration file."),Object(i.b)("li",{parentName:"ul"},Object(i.b)("inlineCode",{parentName:"li"},"get<K>(key: string)"),": retrieves the value for a given key."),Object(i.b)("li",{parentName:"ul"},Object(i.b)("inlineCode",{parentName:"li"},"delete(key: string)"),": deletes the value for a given key.")),Object(i.b)("h2",{id:"usage"},"Usage"),Object(i.b)("p",null,"Simply, inject the ",Object(i.b)("inlineCode",{parentName:"p"},"CacheService")," instance where you need to use caching, and use the provided methods."),Object(i.b)("pre",null,Object(i.b)("code",{parentName:"pre",className:"language-javascript"},"\nclass SomeService {\n    constructor(\n        // Inject the cache service instance\n        private readonly cacheService: CacheService\n    ) {}\n\n    async fetchAndCacheSomeData() {\n        const data = this.fetchSomeHeavyProcessedData(); // Some data to be cached\n        // Set data to cache\n        await this.cacheService.set('my_heavy_data', data, 1000);\n        return data;\n    }\n\n    async getSomeDataFromCache() {\n        // Get the cached data using cached key.\n        const cachedData = await this.cacheService.get('my_heavy_data');\n        if (!cachedData) {\n            return this.fetchAndCacheSomeData();\n        }\n        return cachedData;\n    }\n\n    async clearDataFromCache() {\n        await this.cacheService.del('my_heavy_data');\n    }\n}\n\n")))}void 0!==h&&h&&h===Object(h)&&Object.isExtensible(h)&&!Object.prototype.hasOwnProperty.call(h,"__filemeta")&&Object.defineProperty(h,"__filemeta",{configurable:!0,value:{name:"MDXContent",filename:"src/extras/cache.mdx"}}),h.isMDXComponent=!0}}]);
//# sourceMappingURL=component---src-extras-cache-mdx-da91d098e7d688dcd606.js.map