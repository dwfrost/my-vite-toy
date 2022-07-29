const parseUrl = require('parseurl')

const vueCompiler = require('@vue/component-compiler')
const transformModuleImports = require('./transformModuleImports')
const readSource = require('./readSource')
const loadPkg = require('./loadPkg')

const defaultOptions = {
    cache: true
}
const vueMiddleware = (options = defaultOptions) => {
    const compiler = vueCompiler.createDefaultCompiler()

    function send(res, source, mime) {
        res.setHeader('Content-Type', mime)
        res.end(source)
    }
    return async (req, res, next) => {
        // console.log(req.path)
        if (req.path.endsWith('.js')) {
            const key = parseUrl(req).pathname
            // console.log('key', key)
            // 根据请求处理资源文件
            const result = await readSource(req)
            // console.log('result', result)
            // 处理模块引入
            const out = transformModuleImports(result.source)
            send(res, out, 'application/javascript')
        } else if (req.path.startsWith('/_modules/')) {
            const key = parseUrl(req).pathname
            console.log('key', key)
            const pkg = key.replace(/^\/_modules\//, '')
            console.log(pkg)
            // let out = await tryCache()
            let out = (await loadPkg(pkg)).toString()
            send(res, out, 'application/javascript')
        } else if (req.path.endsWith('vue')) {
        } else {
            next()
        }
    }
}
exports.vueMiddleware = vueMiddleware
