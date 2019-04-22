# transform-template-vue-regular [![npm](https://img.shields.io/npm/v/transform-template-vue-regular.svg?maxAge=2592000)](https://www.npmjs.com/package/transform-template-vue-regular)

Transform [Vue](https://github.com/vuejs/vue) template to [Regular](https://github.com/regularjs/regular) template.


## Install

```
$ npm install --save transform-template-vue-regular
```

## Quick Start

Currently supports the following conversions:`:data,@event,v-html,v-show,v-if,r-else,v-else-if,v-for`

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


### Example3: transform v-if/v-else



``` javascript
const trans = require('transform-template-vue-regular')
const source = 
`<div v-if="param">
    123
</div>
<div v-else>
    456
</div>`;
const expected = 
`{#if param}<div>
    123
</div>{#else}
 <div>
    456
</div>{/if}`;
const regularStr = trans.transform(source)
console.log(regularStr == expected)//true
```


### Example4: transform v-for



``` javascript
const trans = require('transform-template-vue-regular')
const source = 
`<ul v-for="item in getItems()">
    <li v-for="i in item">
        <div>{i.a}</div>
    </li>
</ul>`;
const expected = 
`{#list this.getItems() as item}<ul>
    {#list item as i}<li>
        <div>{i.a}</div>
    </li>{/list}
</ul>{/list}`;
const regularStr = trans.transform(source)
console.log(regularStr == expected)//true
```


### Example5: transform v-show



``` javascript
const trans = require('transform-template-vue-regular')
const source = 
`<div>
    <p v-show="ok"></p>
</div>`;
const expected = 
`<div>
    <p r-hide="{!(ok)}"></p>
</div>`;
const regularStr = trans.transform(source)
console.log(regularStr == expected)//true
```


## TODO

Support for more grammar rules

