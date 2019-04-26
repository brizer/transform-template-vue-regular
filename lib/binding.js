const _ = require('lodash')
const Reg = {
    method:/(\w+\(\'*\w*\.?\w*\'*\))/g,
    as:/(\w+)\sin\s((this\.\w+\(\'*\w*\'*\))|(\w+)(\.\w+)?)/,
}

const util = {
    changeMethod(method){
        if(Reg.method.test(method)){
            method = method.replace(Reg.method,'this.$1')
        }
        return method
    },
    curly(value){
        return `{${value}}`
    }
}

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
    let newV = util.changeMethod(value)
    newV = util.curly(newV)
    name = name.replace(':','')
    return {
        name:name,
        value:newV,
    }
}


module.exports = {
  binding
}