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
                'Error Handling in Controllers',
                'Authentication and Authorization',
                'Services',
                'Database Connections and Repositories',
                'Base Controllers',
                'Base Services',
                'Resource Controllers',
                'Validators',
                'Reusing Validators',
                'Events',
                'Event Emitter Decorator',
                'Queues',
                'Queue Publisher',
                'Queue Consumer',
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
                'Texpress CMS and Built-In Modules',
                'Texpress API and Built-In APIs',
                'Bundling Javascript Files for CMS',
            ],
        },
    ],
    title: 'Texpress',
    base: '/t-express',
};