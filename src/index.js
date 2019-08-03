const parseResult = [{"type":"element","tagName":"import","attributes":[{"key":"src","value":"./modal/tripModal.wxml"}],"children":[]},{"type":"element","tagName":"import","attributes":[{"key":"src","value":"./tripcontent.wxml"}],"children":[]},{"type":"element","tagName":"view","attributes":[{"key":"class","value":"trip-container"},{"key":"catchtap","value":"mcu"}],"children":[{"type":"element","tagName":"block","attributes":[{"key":"wx:if","value":"{{isloading}}"}],"children":[{"type":"element","tagName":"trip-loading","attributes":[],"children":[]}]},{"type":"element","tagName":"block","attributes":[{"key":"wx:else","value":null}],"children":[{"type":"element","tagName":"view","attributes":[{"key":"class","value":"server-error"},{"key":"wx:if","value":"{{exceptionTip}}"}],"children":[{"type":"element","tagName":"view","attributes":[{"key":"class","value":"server-icon"}],"children":[]},{"type":"element","tagName":"view","attributes":[{"key":"class","value":"server-con"}],"children":[{"type":"text","content":"{{exceptionTip}}"}]}]},{"type":"element","tagName":"template","attributes":[{"key":"is","value":"trip-content"},{"key":"wx:if","value":"{{!showNoresultPage}}"},{"key":"data","value":"{{orderList, showPassenger:true}}"}],"children":[]}]},{"type":"element","tagName":"view","attributes":[{"key":"class","value":"travel-noresult"},{"key":"wx:if","value":"{{showNoresultPage}}"}],"children":[{"type":"element","tagName":"no-result","attributes":[{"key":"id","value":"noResult"}],"children":[]}]},{"type":"element","tagName":"view","attributes":[{"key":"class","value":"footer-line_btn fac"},{"key":"wx:elif","value":"{{footerList}}"}],"children":[{"type":"element","tagName":"block","attributes":[{"key":"wx:for","value":"{{footerList}}"},{"key":"wx:key","value":"floor_{{index}}"}],"children":[{"type":"element","tagName":"view","attributes":[{"key":"catchtap","value":"checkFooterEntrance"},{"key":"data-item","value":"{{item}}"},{"key":"class","value":"foot-map-wrap fac {{footerEnterList.length > 1?'item-flex':'item-flex1'}}"}],"children":[{"type":"element","tagName":"view","attributes":[{"key":"class","value":"fac item-padding"}],"children":[{"type":"element","tagName":"image","attributes":[{"key":"class","value":"icon"},{"key":"src","value":"{{item.Icon}}"},{"key":"wx:if","value":"{{item.Icon}}"}],"children":[]},{"type":"element","tagName":"view","attributes":[{"key":"style","value":"color:{{item.Color}};font-weight : normal"},{"key":"class","value":"single-ellipsis text"}],"children":[{"type":"text","content":"{{item.EntranceText}}"}]},{"type":"element","tagName":"view","attributes":[{"key":"class","value":"arrow"},{"key":"style","value":"background-image:url({{item.Arrow}})"},{"key":"wx:if","value":"{{item.Arrow}}"}],"children":[]}]}]}]}]}]},{"type":"element","tagName":"template","attributes":[{"key":"is","value":"modalCar"},{"key":"wx:if","value":"{{showCarModal}}"},{"key":"data","value":"{{modalData}}"}],"children":[]},{"type":"element","tagName":"template","attributes":[{"key":"is","value":"flight-transfer"},{"key":"wx:if","value":"{{showFlightModal}}"},{"key":"data","value":"{{...modalData}}"}],"children":[]},{"type":"element","tagName":"template","attributes":[{"key":"is","value":"flight-noworry"},{"key":"data","value":"{{...modalData, showFlightNoWorry}}"}],"children":[]},{"type":"element","tagName":"template","attributes":[{"key":"is","value":"share-panel"},{"key":"wx:if","value":"{{sharePanels}}"},{"key":"data","value":"{{showSharePsgBar, showPassenger}}"}],"children":[]},{"type":"element","tagName":"view","attributes":[{"key":"class","value":"mock-plane"},{"key":"wx:if","value":"{{mockPanel}}"}],"children":[{"type":"element","tagName":"input","attributes":[{"key":"placeholder","value":"输入要模拟的Unionid"},{"key":"focus","value":"{{true}}"},{"key":"bindinput","value":"setMockValue"}],"children":[]},{"type":"element","tagName":"view","attributes":[{"key":"class","value":"rq fic"}],"children":[{"type":"element","tagName":"view","attributes":[{"key":"class","value":"fill-grow fc3"},{"key":"style","value":"margin-top:10px"}],"children":[{"type":"text","content":"请求预发环境"}]},{"type":"element","tagName":"switch","attributes":[{"key":"bindchange","value":"changeStage"},{"key":"checked","value":"{{stateApi}}"}],"children":[]}]},{"type":"element","tagName":"button","attributes":[{"key":"bindtap","value":"ensureMockUser"}],"children":[{"type":"text","content":"确认"}]}]}]

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
    return c ? `cloudStyle["${c}"];` : ' '
  })

  oStyle = oStyle || ''

  const styleValue = value.join('').trim()


  return {
    "key":"style",
    "value": styleValue.length ? `{{${styleValue}}} ${oStyle}` : ''
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
      const res = pAttribute(node.attributes)
      const {style, index} = res

      if (index != null) {
        node.attributes[index] = style
      } else {
        node.attributes.push(style)
      }
    }

    if (node.children && node.children.length) {
      node.children = progress(node.children)
    }

    return node
  })
}

// const hotupdate = progress(parseResult);

// console.log(JSON.stringify(hotupdate));
