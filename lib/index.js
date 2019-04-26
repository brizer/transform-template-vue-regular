const parse5 = require('template-parse')
const directive = require('./directive')
const binding = require('./binding')

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
    const childNodes =  (node.content||{}).childNodes || node.childNodes 
    if(childNodes && childNodes.length>0){
        childNodes.forEach((v)=>{
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
              const {name,value} = binding.binding(v)
              v.name = name;
              v.value = value;
            }
            //if it is a directive
            if(v.name.includes('v-')){
                const isTemplate = (node.tagName == 'template')
                const {name,value,hide,convertToTxt,preTxt,afterTxt} = directive.directive(v,isTemplate)
                v.name = name;
                v.value = value;
                v.hide = hide;
                node.convertToTxt = convertToTxt||false
                node.preTxt = preTxt||''
                node.afterTxt = afterTxt||''
            }
        })
    }
    return node
}

module.exports = {
    transform
}