const templateUtil = require('./util/template')

/**
 * Transform vue directive to regular
 * @param {object} vNode - Parsed html AST node
 * @param {boolean} isTemplate - Is it a template tag
 * @return {object} return   
 * @return {string} return.name - The Regular directive name
 * @return {string} return.value - The Regular directive value
 */
const binding = (vNode)=>{

    let {name,value} = Object.assign({},vNode)
    let newV = templateUtil.changeMethod(value)
    newV = templateUtil.curly(newV)
    name = name.replace(':','')
    return {
        name:name,
        value:newV,
    }
}

const transExpression = (value)=>{

  if(value.includes("(")){
    return `{this.${value}}`;
  }
  return `{${value}}`
}


module.exports = {
  binding,
  transExpression
}