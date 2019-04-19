const Reg = {
    method:/(\w+\(\'*\w*\'*\))/g
}

const util = {
    changeMethod(method){
        if(Reg.method.test(method)){
            method = method.replace(Reg.method,'this.$1')
        }
        return method
    },
    negate(value){
        return `!(${value})`
    },
    curly(value){
        return `{${value}}`
    }
}


/**
 * The Methods to handle different directives
 */
const Handles = {
    negate(value){
        //if it is a method, then add this to it
        value = util.changeMethod(value)
        value = util.negate(value)
        value = util.curly(value)
        return value
    },
    curly(value){
        value = util.changeMethod(value)
        value = util.curly(value)
        return value
    }
}
/**
 * Directive Stargety Object
 */
const directiveStaregy = {
    'v-show':{
        rName:'r-hide',
        rHandle:Handles.negate
    },
    'v-html':{
        rName:'r-html',
        rHandle:Handles.curly
    }
}

/**
 * Transform vue directive to regular
 * @param {object} vNode - Parsed html AST node
 * @return {object} return   
 * @return {string} return.name - The Regular directive name
 * @return {string} return.value - The Regular directive value
 */
const directive = (vNode)=>{

    let {name,value} = Object.assign({},vNode)
    if(!directiveStaregy.hasOwnProperty(name)){
        throw new Error(`directive ${name} is not supported yet`)
    }
    value = directiveStaregy[name].rHandle(value)
    name = directiveStaregy[name].rName
    return {
        name:name,
        value:value
    }
}


module.exports = directive