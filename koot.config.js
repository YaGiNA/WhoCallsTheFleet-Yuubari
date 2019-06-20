/** @module kootConfig */

/**
 * 路径名，可为相对路径或绝对路径。由于部分代码使用了 import/export 的写法，node.js 无法直接识别，需要 webpack/babel 进行编译，故在部分环境下使用该写法代替 require()。
 * @typedef {String} Pathname
 */

/**
 * @callback cacheGet
 * 缓存检查与吐出方法
 * @param {String} url
 * @return {Boolean|String} 对该 URL 不使用缓存时返回 false，使用时返回缓存结果 String
 */

/**
 * @callback cacheSet
 * 缓存存储方法
 * @param {String} url
 * @param {String} html
 */

const path = require('path');

/** @type {Boolean} 判断当前是否是生产环境 */
// const isEnvProd = Boolean(process.env.WEBPACK_BUILD_ENV === 'prod')
/** @type {Boolean} 判断当前是否是开发环境 */
// const isEnvDev = Boolean(process.env.WEBPACK_BUILD_ENV === 'dev')

/** @type {Boolean} 判断当前是否是客户端 */
// const isStageClient = Boolean(process.env.WEBPACK_BUILD_STAGE === 'client')
/** @type {Boolean} 判断当前是否是服务器端 */
// const isStageServer = Boolean(process.env.WEBPACK_BUILD_STAGE === 'server')

module.exports = {
    /**************************************************************************
     * 项目信息
     *************************************************************************/

    name: 'The Fleet (Yuubari)',
    dist: './dist-webapp/',

    template: './src/template.ejs',
    templateInject: './src/_server/inject.js',

    routes: './src/router',

    store: './src/redux/factory-store',

    // i18n: {
    //     // type: ENV === 'dev' ? 'redux' : 'default', // default | redux
    //     type: 'redux',
    //     // expr: '__',
    //     locales: require('./src/locales/index').map(l => [
    //         l,
    //         `./src/locales/${l}.json`
    //     ])
    //     // cookieKey: 'fleetLocaleId',
    //     // domain: '127.0.0.1',
    // },
    i18n: require('./src/locales').map(l => [l, `./src/locales/${l}.json`]),

    pwa: {
        auto: false,
        initialCacheIgonre: ['/bgimgs/**/*', '/pics/**/*', '/dev-*']
    },

    aliases: {
        '@src': path.resolve('./src'),
        '@docs': path.resolve('./docs'),
        '@locales': path.resolve('./src/locales'),
        '@assets': path.resolve('./src/assets'),

        '@app': path.resolve('./src'),
        '@utils': path.resolve('./src/utils'),
        '@ui': path.resolve('./src/ui'),
        '@api': path.resolve('./src/api'),
        '@const': path.resolve('./src/constants'),
        '@redux': path.resolve('./src/redux'),
        '@actions': path.resolve('./src/api/actions'),
        '@db': path.resolve('./src/database'),
        '@database': path.resolve('./src/database'),

        '~base.less': path.resolve('./src/ui/base.less'),
        '~Assets': path.resolve('./src/assets'),
        '~/': path.resolve('./src/ui')
    },

    defines: require('./src/defines'),

    /**************************************************************************
     * 客户端生命周期
     *************************************************************************/

    before: './src/_client/before',
    after: './src/_client/after',
    onHistoryUpdate: './src/_client/on-history-update',
    onRouterUpdate: './src/_client/on-router-update',

    /**************************************************************************
     * 服务器端设置 & 生命周期
     *************************************************************************/

    port: 8080,
    renderCache: {
        maxAge: 10 * 1000
    },
    proxyRequestOrigin: {
        protocol: process.env.WEBPACK_BUILD_ENV === 'prod' ? 'https' : undefined
    },
    koaStatic: {
        maxage: 0,
        hidden: true,
        index: 'index.html',
        defer: false,
        gzip: true,
        extensions: false
    },
    serverBefore: './src/_server/lifecycle/before',
    serverAfter: './src/_server/lifecycle/after',
    serverOnRender: './src/_server/lifecycle/on-render',

    /**************************************************************************
     * Webpack 相关
     *************************************************************************/

    webpackConfig: async () => {
        if (process.env.WEBPACK_BUILD_ENV === 'dev')
            return await require('./config/webpack/dev');
        if (process.env.WEBPACK_BUILD_ENV === 'prod')
            return await require('./config/webpack/prod');
        return {};
    },
    webpackBefore: async kootConfig => {
        if (process.env.WEBPACK_BUILD_STAGE === 'client') {
            console.log(' ');

            if (!kootConfig.analyze)
                await require('./src/build/webapp/before')(kootConfig).catch(
                    err => console.error(err)
                );
            // if (process.env.WEBPACK_BUILD_ENV === 'prod') {
            //     await require('./src/scripts/clean-dist')(kootConfig);
            // }
            await require('./src/scripts/validate-database-files')(kootConfig);
            await require('./src/scripts/validate-less-variables')(kootConfig);
            if (!kootConfig.analyze) {
                await require('./src/scripts/copyfiles')(kootConfig);
                await require('./src/scripts/copyfiles-web')(kootConfig);
            }
            console.log(' ');
        }
        return;
    },
    webpackAfter: async kootConfig => {
        if (
            process.env.WEBPACK_BUILD_STAGE === 'client' &&
            process.env.WEBPACK_BUILD_ENV === 'prod' &&
            !kootConfig.analyze
        ) {
            await require('./src/scripts/clean-web-sourcemap')(kootConfig);
        }
        await require('./src/build/webapp/after-server')();
        return;
    },
    moduleCssFilenameTest: /^((?!\.g\.).)*/,
    classNameHashLength: 8,

    /**************************************************************************
     * 开发环境
     *************************************************************************/

    devPort: 8703,
    devDll: [
        'react',
        'react-dom',
        'redux',
        'redux-thunk',
        'react-redux',
        'react-router',
        'react-router-redux',
        'react-transition-group',
        'react-markdown',
        'koot',
        'swiper',
        'metas',
        'lz-string',
        'bind-event',
        'check-css-prop',
        'classnames',
        'camelcase',
        'hotkeys-js',
        'nedb'
    ]
};
