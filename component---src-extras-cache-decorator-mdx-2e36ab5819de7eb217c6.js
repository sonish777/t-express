(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{VcYt:function(e,t,a){"use strict";a.r(t),a.d(t,"_frontmatter",(function(){return i})),a.d(t,"default",(function(){return l}));var n=a("IKa1"),r=a("Yh9w"),c=(a("r0ML"),a("V0Ug")),o=a("sN0p");a("xH0s");const s=["components"],i={};void 0!==i&&i&&i===Object(i)&&Object.isExtensible(i)&&!Object.prototype.hasOwnProperty.call(i,"__filemeta")&&Object.defineProperty(i,"__filemeta",{configurable:!0,value:{name:"_frontmatter",filename:"src/extras/cache-decorator.mdx"}});const d={_frontmatter:i},h=o.a;function l(e){let{components:t}=e,a=Object(r.a)(e,s);return Object(c.b)(h,Object(n.a)({},d,a,{components:t,mdxType:"MDXLayout"}),Object(c.b)("h1",{id:"caching-with-decorators"},"Caching with Decorators"),Object(c.b)("p",null,"Texpress also provides a ",Object(c.b)("inlineCode",{parentName:"p"},"@Cache")," decorator for caching results of a method. While the ",Object(c.b)("inlineCode",{parentName:"p"},"CacheService")," provides a more general-purpose caching solution, the ",Object(c.b)("inlineCode",{parentName:"p"},"@Cache")," decorator is specifically designed for caching the results of method calls. It abstracts away the caching logic and makes it easier to cache the results of a method call with just a simple decorator.",Object(c.b)("br",{parentName:"p"}),"\n","The ",Object(c.b)("inlineCode",{parentName:"p"},"Cache")," decorator takes two arguments: the key and an optional TTL (in seconds)."),Object(c.b)("blockquote",null,Object(c.b)("p",{parentName:"blockquote"},"Note that the ",Object(c.b)("inlineCode",{parentName:"p"},"Cache")," decorator can only be used if the method returns the value that needs to be cached.")),Object(c.b)("h2",{id:"using-the-cache-decorator"},"Using the Cache Decorator"),Object(c.b)("p",null,"The ",Object(c.b)("inlineCode",{parentName:"p"},"Cache")," decorator does two things:"),Object(c.b)("ul",null,Object(c.b)("li",{parentName:"ul"},"Caches the result of the method call"),Object(c.b)("li",{parentName:"ul"},"Returns the cached result for every subsequent method calls.")),Object(c.b)("pre",null,Object(c.b)("code",{parentName:"pre",className:"language-javascript"},"class SomeService {\n    @Cache('my_heavy_data') // Caches the returned value of fetchSomeHeavyProcessedData.\n    async fetchSomeHeavyProcessedData() {\n        return this.getMyHeavyDat();\n    }\n}\n")),Object(c.b)("p",null,"Above example caches the result of ",Object(c.b)("inlineCode",{parentName:"p"},"fetchSomeHeavyProcessedData()")," method call when the method is called for the very first time. For every subsequent method calls, the cached result will be returned until the cached data is not expired."),Object(c.b)("h2",{id:"generating-dynamic-cache-keys"},"Generating Dynamic Cache Keys"),Object(c.b)("p",null,"In some cases, you might need to cache the result on dynamically generated keys. Keys can be generated dynamically using the arguments passed to the method, and applying your key generation logic with those data.",Object(c.b)("br",{parentName:"p"}),"\n",Object(c.b)("strong",{parentName:"p"},"To do this, pass a callback method as the first argument that takes the same argument list as the method.")),Object(c.b)("h3",{id:"example"},"Example"),Object(c.b)("p",null,"Consider a scenario where you need to cache the data of users based on their user ids."),Object(c.b)("pre",null,Object(c.b)("code",{parentName:"pre",className:"language-typescript"},"class AuthService {\n    @Cache<AuthService, 'getUserById'>(\n        (id) => `user:${id}`, // the key generation callback method with same argumet as the method itself\n        600 // optional TTL in secods\n    )\n    getUserById(id: number) {\n        return user; // fetch the user with matching ID from database and return\n    }\n}\n")),Object(c.b)("p",null,"In above example, calling the ",Object(c.b)("inlineCode",{parentName:"p"},"getUserById")," method with ",Object(c.b)("inlineCode",{parentName:"p"},"id")," argument passed as ",Object(c.b)("inlineCode",{parentName:"p"},"28"),", the results will be cached under the key ",Object(c.b)("strong",{parentName:"p"},Object(c.b)("inlineCode",{parentName:"strong"},"'user:28'")),". For every subsequent call to the ",Object(c.b)("inlineCode",{parentName:"p"},"getUserById")," method with the same ",Object(c.b)("inlineCode",{parentName:"p"},"id")," (",Object(c.b)("inlineCode",{parentName:"p"},"28"),"), the cached data will be returned."),Object(c.b)("h3",{id:"understanding-the-type-arguments-authservice-getuserbyid"},"Understanding the ",Object(c.b)("inlineCode",{parentName:"h3"},"Type")," arguments: ",Object(c.b)("strong",{parentName:"h3"},Object(c.b)("inlineCode",{parentName:"strong"},"<AuthService, 'getUserById'>"))),Object(c.b)("p",null,"In above example, two type arguments are also passed, the current service ",Object(c.b)("inlineCode",{parentName:"p"},"'AuthService'"),", and the name of the method the decorator is being applied to ",Object(c.b)("inlineCode",{parentName:"p"},"'getUserById'"),". They are needed to take advantage of the type support of TypeScript when passing the key generation logic as the first argument."),Object(c.b)("pre",null,Object(c.b)("code",{parentName:"pre",className:"language-typescript"},"class AuthService {\n    @Cache<AuthService, 'getUserById'>(\n        (id) => `user:${id}`, // here `id` is automatically type annotated as `number` since the id is of\n        // type `number` in the method the decorator is applied to i.e. `getUserById'\n        600\n    )\n    getUserById(\n        id: number // the id's type data is used to enforce the type of id as `number` in above decorator.\n    ) {}\n}\n")))}void 0!==l&&l&&l===Object(l)&&Object.isExtensible(l)&&!Object.prototype.hasOwnProperty.call(l,"__filemeta")&&Object.defineProperty(l,"__filemeta",{configurable:!0,value:{name:"MDXContent",filename:"src/extras/cache-decorator.mdx"}}),l.isMDXComponent=!0}}]);
//# sourceMappingURL=component---src-extras-cache-decorator-mdx-2e36ab5819de7eb217c6.js.map