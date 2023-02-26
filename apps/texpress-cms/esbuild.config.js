const esbuild = require('esbuild');

const watchMode = process.argv?.[2] === '--watch';

const options = {
    entryPoints: [
        { in: './resources/js/index', out: 'bundle' },
        { in: './resources/css/index.css', out: 'bundle' },
    ],
    bundle: true,
    outdir: './public/assets',
    minify: true,
    platform: 'browser',
};

async function build() {
    if (watchMode) {
        const ctx = await esbuild.context({ ...options, logLevel: 'info' });
        await ctx.watch();
        console.log('watching...');
    } else {
        esbuild
            .build(options)
            .then(() => console.log('⚡ JS Bundled'))
            .catch(() => process.exit(1));
    }
}

build();
