export default {
    menu: [
        'Introduction',
        'Getting Started',
        {
            name: 'Docs',
            menu: [
                'Server',
                'Middlewares',
                'Exceptions and Handlers',
                'Controllers and Route Handlers',
                'Services',
                'Database Connections and Repositories',
                'Base Controllers',
                'Base Services',
                'Resource Controllers',
                'Validators',
                'Reusing Validators',
                'Events',
                'Event Emitter Decorator',
            ],
        },
        {
            name: 'Extras',
            menu: [
                'Mail',
                'Caching',
                'Caching with Decorators',
                'Rate Limiting',
                'Rate Limiting with Decorators',
                'Two Factor Authentication',
            ],
        },
    ],
    title: 'Texpress',
    base: '/t-express',
};
