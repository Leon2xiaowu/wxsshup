import {parse, stringify} from 'himalaya'
import fs from 'fs'

var minify = require('html-minifier').minify;


/**
 * 递归处理APS抽象树
 * 转化对应标签
 * 删除空节点
 *
 * @param {*} tree
 * @returns
 */
export function toProcessAST (tree) {
  return tree.reduce((previous, node) => {
    if (node.type === 'element') {
      node.tagName = convertTag(node.tagName) // 映射tag标签
      node.children = toProcessAST(node.children) // 递归处理子元素
    } else {
      // 移除文本节点的空格
      node.content = node.content.trim()
      // TODO: template 要特殊处理，手动插入children
    }

    return node.content != null
      ? node.content.length
        ? previous.concat(node) // 底层文本节点不为空
        : previous // 底层文本节点为空
      : previous.concat(node) // 非对底层文本节点
  }, [])
}

/**
 * 转换 WXML => template
 *
 * @export
 * @param {*} path
 * @returns
 */
export function convert (path) {
  return new Promise((resolve, reject) => {
    if (!path) reject(new Error('path be necessary when convert wxml to vue template'))

    let html = fs.readFileSync(path, { encoding: 'utf8' })

    var result = minify(html,{
      collapseInlineTagWhitespace: true,
      collapseWhitespace: true
    })

    resolve(parse(result))
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
export function writeWxml(atsTree,path) {
  return new Promise((resolve, reject) => {

    if (!atsTree) reject(new Error('ast object is required'))
    if (!path) reject(new Error('path is required'))

    const wxml = stringify(atsTree)

    fs.writeFileSync(path,wxml)

  });
}
