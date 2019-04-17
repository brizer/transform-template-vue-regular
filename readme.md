# transform-template-vue-regular [![npm](https://img.shields.io/npm/v/transform-template-vue-regular.svg?maxAge=2592000)](https://www.npmjs.com/package/transform-template-vue-regular)

Transform [Vue](https://github.com/vuejs/vue) template to [Regular](https://github.com/regularjs/regular) template.


## Install

```
$ npm install --save transform-template-vue-regular
```

## Quick Start

### Example 1: transform data params
``` javascript
const trans = require('transform-template-vue-regular')
const source = 
`<div>
    <div>
        hehe
    </div>
    <div>
        <p :item="itemValue">
            this is me
        </p>
    </div>
</div>`;
const expected = 
`<div>
    <div>
        hehe
    </div>
    <div>
        <p item="{itemValue}">
            this is me
        </p>
    </div>
</div>`;
const regularStr = trans.transform(source)
console.log(regularStr == expected)//true

```

### Example2: transform events

``` javascript
const trans = require('transform-template-vue-regular')
const source = 
`<div>
    <div>
        hehe
    </div>
    <div>
        <p @click="doSomething()">
            this is me
        </p>
    </div>
</div>`;
const expected = 
`<div>
    <div>
        hehe
    </div>
    <div>
        <p on-click="{this.doSomething()}">
            this is me
        </p>
    </div>
</div>`;
const regularStr = trans.transform(source)
console.log(regularStr == expected)//true
```

## TODO

Support for more grammar rules

