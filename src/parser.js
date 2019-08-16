const fs = require('fs')
const {
  parse,
  stringify
} = require('himalaya')
const mkdirp = require('mkdirp');

const {
  voidTags,
  closingTags,
  childlessTags,
  closingTagAncestorBreakers
} = require('./tags')

const himalayaConfig = {
  voidTags,
  closingTags,
  childlessTags,
  closingTagAncestorBreakers,
  includePositions: false
}

const {getDescriptorPath} = require('../tools/helper')

// var minify = require('html-minifier').minify;


/**
 * 递归处理APS抽象树
 * 转化对应标签
 * 删除空节点
 *
 * @param {*} tree
 * @returns
 */
function toProcessAST(tree) {
  return tree.reduce((previous, node) => {
    if (node.type === 'element') {
      node.tagName = convertTag(node.tagName) // 映射tag标签
      node.children = toProcessAST(node.children) // 递归处理子元素
    } else {
      // 移除文本节点的空格
      node.content = node.content.trim()
      // TODO: template 要特殊处理，手动插入children
    }

    return node.content != null ?
      node.content.length ?
      previous.concat(node) // 底层文本节点不为空
      :
      previous // 底层文本节点为空
      :
      previous.concat(node) // 非对底层文本节点
  }, [])
}

/**
 * 转换 WXML => template
 *
 * @export
 * @param {*} path
 * @returns
 */
function convert(path) {
  return new Promise((resolve, reject) => {
    if (!path) reject(new Error('path be necessary when convert wxml to vue template'))

    let html = fs.readFileSync(path, {
      encoding: 'utf8'
    })

    // var result = minify(html,{
    //   collapseInlineTagWhitespace: true,
    //   collapseWhitespace: true
    // })

    resolve(parse(html, himalayaConfig))
  })
}

/**
 * 写入内容到WXML文件
 *
 * @export
 * @param {*} atsTree
 * @param {*} path
 * @returns
 */
function writeWxml(atsTree, path) {
  return new Promise(async (resolve, reject) => {

    if (!atsTree) reject(new Error('ast object is required'))
    if (!path) reject(new Error('path is required'))
    // fixed 在还原input时，会缺省闭合标签，小程序下解析会异常
    const wxml = stringify(atsTree, himalayaConfig)

    await ensureDescriptor(getDescriptorPath(path))

    await writeHandle(path, wxml)

    resolve()
  });
}

/**
 * 保证输出路径的有效性
 *
 * @param {*} path
 * @returns
 */
function ensureDescriptor(path) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(path)) {
      resolve()
    } else {
      mkdirp(path, function (err) {
        if (err) reject(err)
        resolve()
      });
    }
  });
}

/**
 * 向目标输出路径写入数据
 *
 * @param {*} path
 * @param {*} wxml
 * @returns
 */
function writeHandle(path, wxml) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, wxml, (err) => {
      if (err) reject(err);
      resolve()
    });
  });
}


exports.toProcessAST = toProcessAST
exports.convert = convert
exports.writeWxml = writeWxml
