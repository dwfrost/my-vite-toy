const parseUrl = require('parseurl')
const path = require('path')
const fs = require('fs')
const readFile = require('util').promisify(fs.readFile)
const stat = require('util').promisify(fs.stat)

const root = process.cwd()

module.exports = async req => {
    const { pathname } = parseUrl(req)
    // console.log('pathname', pathname)
    const filepath = path.resolve(root, pathname.replace(/^\//, ''))
    // console.log('filepath', filepath)
    return {
        filepath,
        source: await readFile(filepath, 'utf-8'),
        updateTime: (await stat(filepath)).mtime.getTime()
    }
}
