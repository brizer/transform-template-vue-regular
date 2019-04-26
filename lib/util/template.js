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



module.exports = util;