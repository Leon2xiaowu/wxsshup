const fs = require('fs')

exports.getFileName = function(path) {
  return path.replace(/^.*[\\\/]/, '')
}

exports.isWxmlFile = (path) =>  /.wxml$/.test(path||'')

exports.getDescriptorPath = (path) => path.replace(/[\\\/][\w\.]+[^\\\/]$/, '')

/**
 * Determine if it is a directory
 *
 * @param {*} curPath
 * @returns
 */
exports.isDirectory = function isDirectory(curPath) {
  return fs.lstatSync(curPath).isDirectory()
}
