const {convert, writeWxml} = require('./parser')
const {cer, suc, out} = require('../tools/log')

const ignoreList  = ['import'] // , 'block'

let syncObj = 'cloudStyle'

const _wxDefinLabel = ["movable-view","cover-image","cover-view","movable-area","movable-view","scroll-view","swiper","swiper-item","swiper","view","icon","progress","rich-text","text","button","checkbox","checkbox-group","checkbox","editor","form","input","label","picker","picker-view","picker-view-column","radio","radio-group","radio","slider","switch","textarea","functional-page-navigator","navigator","audio","camera","image","live-player","live-pusher","video","map","canvas","web-view","ad","official-account","open-data","native-component","aria-component"]

/**
 * 解析逻辑运算和三目运算中的类
 *
 * @param {*} params
 * @returns
 */
function recExpression(params) {
  params = params || ''

  // [\w\s-]*(?:&&|\|\|)\s*'([\w-]+)'[;|] 匹配逻辑运算
  // [\w\s-\.]+ > [\w\s-\.]+\?'([\w-]+)':'([\w-]+)'[;|] 匹配三目运算

  const rec = /(?:[\w\s-]*(?:&&|\|\|)\s*'([\w-]+)';*)|(?:[\w\s-\.]+>[\w\s-\.]+\?'([\w-]+)':'([\w-]+)';*)/g

  return params.replace(rec,(_,g1='',g2='',g3='')=> (` ${g1} ${g2} ${g3} `))
}

// const result = "footerEnterList.length > 1?'item-flex':'item-flex1'".replace(/{{(.+)}}/,(r,g1)=>{
//   return recExpression(g1||'')
// })

// console.log(result);

/**
 * class 赋值 style
 *
 * @param {*} className
 * @param {*} oStyle
 * @returns
 */
function setAttribute(className, oStyle) {
  className = className || ''
  oStyle = oStyle || ''

  className = className.replace(/{{(.+)}}/,(_, rex)=>{
    return recExpression(rex||'')
  })

  // console.log(className);

  const names = className.split(' ')
  // ["single-ellipsis", "", "", "text"]
  const value = names.map((c) => {
    c = c.trim()
    // 分号不能放在style里面
    return c ? `{{${syncObj}["${c}"]}}` : ' '
  })
  // fixed single quote parser except
  oStyle = (oStyle || '').replace(/['"]/g, '"')

  const styleValue = value.join('').trim()

  return {
    "key":"style",
    "value": styleValue.length ? `${styleValue} ${oStyle}` : ''
  }
}

/**
 * 处理抽象语法树
 *
 * @param {*} list
 * @returns
 */
function progress(list) {
  return list.map(node => {
    if (ignoreList.indexOf(node.tagName) !== -1) return node

    if (node.attributes) {
      progressAtrs(node);
    }

    if (node.children && node.children.length) {
      node.children = progress(node.children)
    }

    return node
  })
}

/**
 * 查找满足条件的标签属性
 * 如果有同名属性出现N次
 * 只会取最后一次的值做处理
 *
 * @param {*} attrs
 * @returns
 */
function findTargetAttr(attrs) {
  attrs = attrs || []

  const targetAttr = ['class', 'style', 'data']
  const result = {}

  attrs.forEach((attribute, index) => {
    const key = attribute.key
    if (targetAttr.indexOf(key) !== -1) {
      result[key] = {
        index,
        value: attribute.value
      }
    }
  });

  return result
}

/**
 * 处理标签的属性
 *
 * @param {*} node
 */
function progressAtrs(node) {
  const targets = findTargetAttr(node.attributes)

  handleStyles(node, targets.class, targets.style)

  pTemplateLabel(node, targets.data)

  pComponent(node)

}

/**
 * 对有Class的标签元素进行行内Style赋值
 *
 * @param {*} node
 * @param {*} classNames
 * @param {*} [styles={}]
 */
function handleStyles(node, classNames, styles={}) {
  if (!classNames) return

  const styleIndex = styles.index
  const styleValue = setAttribute(classNames.value, styles.value)

  if (styleValue.value.trim() === '') return

  if (styleIndex != null) {
    node.attributes[styleIndex] = styleValue
  } else {
    node.attributes.push(styleValue)
  }
}

/**
 * 为小程序模板添加data
 * 便于更新数据
 * @param {*} node
 * @param {*} [data={}]
 */
function pTemplateLabel(node, data={}) {
  if (node.tagName !== 'template') return

  const indexByAttr = data.index

  const newData = (data.value||'').replace(/,*}}$/, `,${syncObj}}}`)

  if (indexByAttr != null) {
    node.attributes[indexByAttr].value = newData
  } else {
    node.attributes.push({
      key: "data",
      value: `{{${syncObj}}}`
    })
  }
}

/**
 * 对非小程序官方定义的组件
 * 增加props
 *
 * @param {*} node
 */
function pComponent(node) {
  const tagName = node.tagName

  if (_wxDefinLabel.indexOf(tagName) !== -1) return

  node.attributes.push({
    key: syncObj,
    value: `{{${syncObj}}}`
  })
}

// const hotupdate = progress(parseResult);

// console.log(JSON.stringify(hotupdate));

async function prase(option) {
  try {
    const {input, output, styleVar} = option

    syncObj = styleVar || syncObj

    const ats = await convert(input)
    const result = await progress(ats)

    await writeWxml(result, output)
    suc(`文件 [${input}]`)
    out(output)
    // console.log(JSON.stringify(result));
  } catch (error) {
    cer(error);
  }
}

exports.run = prase
