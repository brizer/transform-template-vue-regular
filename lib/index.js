const parse5 = require('template-parse')

const transform = (htmlStr) =>{
    let documentFragment = parse5.parseFragment(htmlStr)
    let regularFragment = doTransform(documentFragment)
    return parse5.serialize(regularFragment)
}

const doTransform = (node)=>{
    if(node.childNodes && node.childNodes.length>0){
        node.childNodes.forEach((v)=>{
            doTransform(v)
        })
    }
    if(node.attrs && node.attrs.length>0){
        node.attrs.forEach(v=>{
            if(v.name.includes('@')){
                v.name = v.name.replace('@','on-')
                v.value = `{this.${v.value}}`
            }
            if(v.name.includes(':')){
                v.name = v.name.replace(':','')
                v.value = `{${v.value}}`
            }
        })
    }
    return node
}

module.exports = {
    transform
}