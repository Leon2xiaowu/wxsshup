exports.getFileName = function(path) {
  return path.replace(/^.*[\\\/]/, '')
}

exports.isWxmlFile = (path) =>  /.wxml$/.test(path||'')
