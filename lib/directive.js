const _ = require('lodash')
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
    },
    if(vNode,rName,childNodes){
        const contentList = (vNode.content||{}).childNodes;
        const name = vNode.attrs[0].name
        let value = vNode.attrs[0].value
        value = util.changeMethod(value)
        let returnList = []
        returnList.push({
            nodeName : '#text',
            value:`{#${rName} ${value}}`
        })
        returnList = returnList.concat(contentList)
        returnList.push({
            nodeName : "#text",
            value:`{/${rName}}`,
            tag:`${rName}-end`
        })
        return childNodes.concat(returnList)
    },
    else(vNode,rName,childNodes){
        const contentList = (vNode.content||{}).childNodes;
        const name = vNode.attrs[0].name
        let returnList = []
        returnList.push({
            nodeName:'#text',
            value:`{#${rName}}`
        })
        returnList = returnList.concat(contentList)
        
        let lastEndIfIndex= _.findLastIndex(childNodes,function(o){
            return o.tag =='if-end'
        })
        if(lastEndIfIndex === -1){
            throw new Error(`there must be a if before else`)
        }
        const tailArr = childNodes.splice(lastEndIfIndex)
        childNodes = childNodes.concat(returnList)
        childNodes = childNodes.concat(tailArr)
        return childNodes
    },
    elseif(vNode,rName,childNodes){
        const contentList = (vNode.content||{}).childNodes;
        const name = vNode.attrs[0].name
        let value = vNode.attrs[0].value
        value = util.changeMethod(value)
        let returnList = []
        returnList.push({
            nodeName:'#text',
            value:`{#${rName} ${value}}`
        })
        returnList = returnList.concat(contentList)
        
        let lastEndIfIndex= _.findLastIndex(childNodes,function(o){
            return o.tag =='if-end'
        })
        if(lastEndIfIndex === -1){
            throw new Error(`there must be a if before else`)
        }
        const tailArr = childNodes.splice(lastEndIfIndex)
        childNodes = childNodes.concat(returnList)
        childNodes = childNodes.concat(tailArr)
        return childNodes
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
        rName:'if',
        rHandle:Handles.if
    },
    'v-else':{
        rName:'else',
        rHandle:Handles.else
    },
    'v-else-if':{
        rName:'elseif',
        rHandle:Handles.elseif
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


const changeTemplate = (vNode = {attrs:[{}]},childNodes)=>{
    const name = vNode.attrs[0].name
    let value = vNode.attrs[0].value
    if(!directiveStaregy.hasOwnProperty(name)){
        throw new Error(`directive ${name} is not supported yet`)
    }
    let nodeList = []
    const rname = directiveStaregy[name].rName
    nodeList = directiveStaregy[name].rHandle(vNode,rname,childNodes)
    return nodeList
}


module.exports = {
    directive:directive,
    changeTemplate:changeTemplate
}