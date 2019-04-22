const _ = require('lodash')
const Reg = {
    method:/(\w+\(\'*\w*\'*\))/g,
    as:/(\w+)\sin\s((this\.\w+\(\'*\w*\'*\))|(\w+))/,
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
    },
    listAs(value){
        if(Reg.as.test(value)){
            value = value.replace(Reg.as,`$2 as $1`)
            return value
        }
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
        return {newV:value}
    },
    curly(value){
        value = util.changeMethod(value)
        value = util.curly(value)
        return {newV:value}
    },
    if(value){
        value = util.changeMethod(value)
        const preTxt = `{#if ${value}}`
        const afterTxt = `{/if}`
        return {
            newV:null,
            hide:true,
            preTxt:preTxt,
            afterTxt:afterTxt
        }
    },
    else(value){
        value = `{#else}`
        const preTxt = value;
        return {
            newV:null,
            hide:true,
            preTxt:preTxt,
            afterTxt:preTxt
        }
    },
    elseif(value){
        value = util.changeMethod(value)
        value = `{#elseif ${value}}`
        const preTxt = value;
        return {
            newV:null,
            hide:true,
            preTxt:preTxt,
            afterTxt:preTxt
        }
    },
    for(value){
        value = util.changeMethod(value)
        value = util.listAs(value)
        const preTxt = `{#list ${value}}`
        const afterTxt = `{/list}`
        return {
            newV:null,
            hide:true,
            preTxt:preTxt,
            afterTxt:afterTxt
        }
    },

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
    },
    'v-if':{
        rName:undefined,
        rHandle:Handles.if
    },
    'v-else':{
        rName:undefined,
        rHandle:Handles.else
    },
    'v-else-if':{
        rName:undefined,
        rHandle:Handles.elseif
    },
    'v-for':{
        rName:undefined,
        rHandle:Handles.for
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
const directive = (vNode,isTemplate)=>{

    let {name,value} = Object.assign({},vNode)
    if(!directiveStaregy.hasOwnProperty(name)){
        throw new Error(`directive ${name} is not supported yet`)
    }
    let{newV,hide,preTxt,afterTxt} = directiveStaregy[name].rHandle(value)
    name = directiveStaregy[name].rName
    return {
        name:name,
        value:newV,
        hide:hide,
        convertToTxt:isTemplate,
        preTxt:preTxt,
        afterTxt:afterTxt
    }
}


module.exports = {
    directive:directive
}