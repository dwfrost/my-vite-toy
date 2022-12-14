const recast = require('recast')
const isPkg = require('validate-npm-package-name')

module.exports = code => {
    const ast = recast.parse(code)
    recast.types.visit(ast, {
        visitImportDeclaration(path) {
            const source = path.node.source.value
            if (!/^\.\/?/.test(source) && isPkg(source)) {
                path.node.source = recast.types.builders.literal(`/_modules/${source}`)
            }
            this.traverse(path)
        }
    })
    return recast.print(ast).code
}
