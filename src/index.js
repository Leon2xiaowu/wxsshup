const ignoreList  = ['import'] // , 'block'

const syncObj = 'cloudStyle'

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

  oStyle = oStyle || ''

  const styleValue = value.join('').trim()


  return {
    "key":"style",
    "value": styleValue.length ? `${styleValue} ${oStyle}` : ''
  }
}


function pAttribute(attrs) {
  const attr = attrs || [] // 属性里拿tg
  // debugger
  let className
  let style

  for (let index = 0; index < attr.length; index++) {
    const element = attr[index]
    const  key = element.key
    const value = element.value

    key === 'class' && (className = {value, index})
    key === 'style' && (style = {value, index})

    // if (className != null  && style != null) break
  }
  className = className || {}
  style = style || {}
  return {
    style: setAttribute(className.value, style.value),
    index: style.index
  }
}

/**
 * 处理抽象语法树
 *
 * @param {*} list
 * @returns
 */
export function progress(list) {
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


function progressAtrs(node) {
  const res = pAttribute(node.attributes);
  const { style = {}, index } = res;

  if (style.value.trim() === '') return

  if (index != null) {
    node.attributes[index] = style;
  }
  else {
    node.attributes.push(style);
  }
}
// const hotupdate = progress(parseResult);

// console.log(JSON.stringify(hotupdate));
