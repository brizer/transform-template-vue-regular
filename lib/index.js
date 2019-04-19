const parse5 = require('template-parse')
const directive = require('./directive')

/**
 * Transform vue template to regular template
 * @param {string} htmlStr - The vue template string
 * @return {string} The regular template string
 */
const transform = (htmlStr) =>{
    let documentFragment = parse5.parseFragment(htmlStr)
    let regularFragment = doTransform(documentFragment)
    return parse5.serialize(regularFragment)
}
/**
 * Layer analysis AST
 * @param {object} node - Each node parsed in Parse5 AST
 */
const doTransform = (node)=>{
    if(node.childNodes && node.childNodes.length>0){
        node.childNodes.forEach((v)=>{
            doTransform(v)
        })
    }
    if(node.attrs && node.attrs.length>0){
        node.attrs.forEach(v=>{
            //if it is a event
            if(v.name.includes('@')){
                v.name = v.name.replace('@','on-')
                v.value = `{this.${v.value}}`
            }
            if(v.name.includes(':')){
                v.name = v.name.replace(':','')
                v.value = `{${v.value}}`
            }
            //if it is a directive
            if(v.name.includes('v-')){
                const {name,value} = directive(v)
                v.name = name;
                v.value = value;
            }
        })
    }
    return node
}

module.exports = {
    transform
}