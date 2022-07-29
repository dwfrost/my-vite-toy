const fs = require('fs')
const path = require('path')
const readFile = require('util').promisify(fs.readFile)

module.exports = async pkg => {
    if (pkg === 'vue') {
        const dir = path.dirname(require.resolve('vue'))
        const filepath = path.join(dir, 'vue.esm.browser.js')
        return readFile(filepath, 'utf-8')
    }
}
