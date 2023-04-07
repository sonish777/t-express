(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{"p5r/":function(e,t,n){"use strict";n.r(t),n.d(t,"_frontmatter",(function(){return c})),n.d(t,"default",(function(){return d}));var a=n("IKa1"),s=n("Yh9w"),o=(n("r0ML"),n("V0Ug")),i=n("sN0p");n("xH0s");const r=["components"],c={};void 0!==c&&c&&c===Object(c)&&Object.isExtensible(c)&&!Object.prototype.hasOwnProperty.call(c,"__filemeta")&&Object.defineProperty(c,"__filemeta",{configurable:!0,value:{name:"_frontmatter",filename:"src/docs/events.mdx"}});const l={_frontmatter:c},p=i.a;function d(e){let{components:t}=e,n=Object(s.a)(e,r);return Object(o.b)(p,Object(a.a)({},l,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("h1",{id:"events"},"Events"),Object(o.b)("p",null,"Texpress provides a BaseEvent class that extends the built-in EventEmitter class from the Node.js standard library. It provides a base implementation for creating custom event classes that can emit and handle events with strongly typed payloads."),Object(o.b)("h2",{id:"creating-event-types"},"Creating Event Types"),Object(o.b)("p",null,"Before creating events, you need to define a type for the events it can emit and handle. This type should be a TypeScript interface with keys for each event name and values for an array of payload type of each event. For example:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-javascript"},"export interface MyEventTypes {\n    'event-a': [string, number];\n    'event-b': [{ foo: string }, boolean];\n}\n")),Object(o.b)("p",null,"This interface defines two events: 'event-a' and 'event-b'. The payload type for 'event-a' is a tuple with a string and a number, while the payload type for 'event-b' is an object with a foo property of type string and a boolean value."),Object(o.b)("h2",{id:"creating-event"},"Creating Event"),Object(o.b)("p",null,"Next, you can create a class that extend the BaseEvent by passing your ",Object(o.b)("inlineCode",{parentName:"p"},"EventTypes")," as generic type. The BaseEvent class provides methods for emitting and handling these events. In the constructor, you only need to register the handlers for each of the event types."),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-javascript"},"class MyEvent extends BaseEvent<MyEventTypes> {\n    eventAHandler(...payload: MyEventTypes['event-a']) {\n        // logic with Event A's payload which is\n        // payload[0] string\n        // payload[1] number\n    }\n\n    eventBHandler(...payload: MyEventTypes['event-b']) {\n        // logic with Event B's payload which is\n        // payload[0] {foo: string}\n        // payload[1] boolean\n    }\n\n    constructor() {\n        super();\n        this.on('event-a', this.eventAHandler);\n        this.on('event-b', this.eventBHandler);\n    }\n}\n")),Object(o.b)("h2",{id:"emitting-events"},"Emitting Events"),Object(o.b)("p",null,"Once the custom event has been created, you can use this class to emit events. For example,"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-javascript"},"class MyService {\n    constructor(\n        myEvent: MyEvent // using typedi dependency injection to inject MyEvent instance\n    ) {}\n\n    doSomethingAndEmitEvent() {\n        // some logic goes here\n        this.myEvent.emit('event-a', 'some string', 15);\n        this.myEvent.emit('event-b', { foo: 'some val' }, false);\n    }\n}\n")))}void 0!==d&&d&&d===Object(d)&&Object.isExtensible(d)&&!Object.prototype.hasOwnProperty.call(d,"__filemeta")&&Object.defineProperty(d,"__filemeta",{configurable:!0,value:{name:"MDXContent",filename:"src/docs/events.mdx"}}),d.isMDXComponent=!0}}]);
//# sourceMappingURL=component---src-docs-events-mdx-64dece433f0567a9fcbe.js.map