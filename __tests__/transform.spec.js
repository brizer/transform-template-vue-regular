//validate Grammatical correctness based on this: https://astexplorer.net/
const transform = require('../lib/index')
const unpad = require('../lib/unpad')

describe("test transform", () => {
  test("test transform @click", () => {
    const source = unpad(`
        <div>
            <div>
                hehe
            </div>
            <div>
                <p @click="doSomething()">
                    this is me
                </p>
            </div>
        </div>`);
    const expected = unpad(`
    <div>
        <div>
            hehe
        </div>
        <div>
            <p on-click="{this.doSomething()}">
                this is me
            </p>
        </div>
    </div>`);
    const regularStr = transform.transform(source)
    expect(regularStr).toBe(expected);
  });
  test("test transform :item", () => {
    const source = unpad(`
        <div>
            <div>
                hehe
            </div>
            <div>
                <p :item="itemValue">
                    this is me
                </p>
            </div>
        </div>`);
    const expected = unpad(`
    <div>
        <div>
            hehe
        </div>
        <div>
            <p item="{itemValue}">
                this is me
            </p>
        </div>
    </div>`);
    const regularStr = transform.transform(source)
    expect(regularStr).toBe(expected);
  });


  test("test transform a complex demo", () => {
    const source = unpad(`
<div class="u-search-user f-cb">
    <ux-search class="f-fl u-search" :placeholder="txtMap['placeholder']" @search="search()" :value="key"></ux-search>
</div>

<div class="u-search-user-content">
    {#if !account || (account && account.status == -1) || (account && account.status == 2)}
    <div class="f-fl tips">
        {txtMap['searchEmpty']}
    </div>
    {/if}
    {#if account && account.status != -1 && account.status != 2}
    <div class="account-item f-cb">
        <div class="f-fl avatar">
            <img :src="account.largeFaceUrl || defaultAvatar">
        </div>
        
        {#if !isCom}
        <div class="f-fl desc">
            <div class="title">昵称：{account.nickName}</div>
            <div class="email">{txtMap['name']}：{account.realName}</div>
        </div>
        {#else}
        <div class="f-fl desc">
            <div class="title">{txtMap['name']}：{account.realName}</div>
            <div class="email">员工编号：{account.idNum}</div>
        </div>
        {/if}

        <div class="f-fl oper">
            <span class="u-btn u-btn-sm u-btn-gh" r-class="{ {'u-btn-disabled': !!account.alreadyIn} }"  @click="add(account)">{#if !account.alreadyIn}确认添加{#else}已添加{/if}</span>
        </div>
    </div>
    {/if}
    {#if errorMsg}
    <div class="u-tip u-tip-error">{errorMsg}</div>
    {/if}
</div>
        `);
    const expected = unpad(`
<div class="u-search-user f-cb">
    <ux-search class="f-fl u-search" placeholder="{txtMap['placeholder']}" on-search="{this.search()}" value="{key}"></ux-search>
</div>

<div class="u-search-user-content">
    {#if !account || (account && account.status == -1) || (account && account.status == 2)}
    <div class="f-fl tips">
        {txtMap['searchEmpty']}
    </div>
    {/if}
    {#if account && account.status != -1 && account.status != 2}
    <div class="account-item f-cb">
        <div class="f-fl avatar">
            <img src="{account.largeFaceUrl || defaultAvatar}">
        </div>
        
        {#if !isCom}
        <div class="f-fl desc">
            <div class="title">昵称：{account.nickName}</div>
            <div class="email">{txtMap['name']}：{account.realName}</div>
        </div>
        {#else}
        <div class="f-fl desc">
            <div class="title">{txtMap['name']}：{account.realName}</div>
            <div class="email">员工编号：{account.idNum}</div>
        </div>
        {/if}

        <div class="f-fl oper">
            <span class="u-btn u-btn-sm u-btn-gh" r-class="{ {'u-btn-disabled': !!account.alreadyIn} }" on-click="{this.add(account)}">{#if !account.alreadyIn}确认添加{#else}已添加{/if}</span>
        </div>
    </div>
    {/if}
    {#if errorMsg}
    <div class="u-tip u-tip-error">{errorMsg}</div>
    {/if}
</div>
        `);
    const regularStr = transform.transform(source)
    expect(regularStr).toEqual(expected);
  });


  test("test no closure custom tag", () => {
    const source = unpad(
`
<ux-button :value="item" @click="agree()" />
`);
    const expected = unpad(
`
<ux-button value="{item}" on-click="{this.agree()}">
</ux-button>`);
    const regularStr = transform.transform(source)
    expect(regularStr).toBe(expected);
  })

});



describe("test transform of build-in directives", () => {
    test('v-show --> r-hide simple variable',()=>{
        const source = unpad(
`
<div>
    <p v-show="ok"></p>
</div>
`       )

        const expected = unpad(
`
<div>
    <p r-hide="{!(ok)}"></p>
</div>
`       )

        const regularStr = transform.transform(source)
        expect(regularStr).toBe(expected);
        
    })

    test('v-show --> r-hide expression',()=>{
        const source = unpad(
`
<div>
    <p v-show="getSomeValue(param)"></p>
</div>
`       )

        const expected = unpad(
`
<div>
    <p r-hide="{!(this.getSomeValue(param))}"></p>
</div>
`       )

        const regularStr = transform.transform(source)
        expect(regularStr).toBe(expected);
        
    })

    test('v-show --> r-hide many expression',()=>{
        const source = unpad(
`
<div>
    <p v-show="getSomeValue(param) && getAnother()"></p>
</div>
`       )

        const expected = unpad(
`
<div>
    <p r-hide="{!(this.getSomeValue(param) && this.getAnother())}"></p>
</div>
`       )

        const regularStr = transform.transform(source)
        expect(regularStr).toBe(expected);
        
    })

    test('v-show --> r-hide complet expression',()=>{
        const source = unpad(
`
<div>
    <p v-show="getSomeValue(param) && getAnother() === param"></p>
</div>
`       )

        const expected = unpad(
`
<div>
    <p r-hide="{!(this.getSomeValue(param) && this.getAnother() === param)}"></p>
</div>
`       )

        const regularStr = transform.transform(source)
        expect(regularStr).toBe(expected);
        
    })

    test('v-show --> r-hide expression param number',()=>{
        const source = unpad(
`
<div>
    <p v-show="getSomeValue(22)"></p>
</div>
`       )

        const expected = unpad(
`
<div>
    <p r-hide="{!(this.getSomeValue(22))}"></p>
</div>
`       )

        const regularStr = transform.transform(source)
        expect(regularStr).toBe(expected);
        
    })

    test('v-show --> r-hide expression param string',()=>{
        const source = unpad(
`
<div>
    <p v-show="getSomeValue('brizer')"></p>
</div>
`       )

        const expected = unpad(
`
<div>
    <p r-hide="{!(this.getSomeValue('brizer'))}"></p>
</div>
`       )

        const regularStr = transform.transform(source)
        expect(regularStr).toBe(expected);
        
    })

    test('some directive not support yet, just throw error',()=>{
        const source = unpad(
`
<div>
    <p v-xixi="ok"></p>
</div>
`       )

        const expected = unpad(
`
<div>
    <p v-xixi="ok"></p>
</div>
`       )

        expect(function(){
            transform.transform(source)
        }).toThrow("directive v-xixi is not supported yet");
        
    })



    test('v-html --> r-html param',()=>{
        const source = unpad(
`
<div>
    <p v-html="param"></p>
</div>
`       )

        const expected = unpad(
`
<div>
    <p r-html="{param}"></p>
</div>
`       )

        const regularStr = transform.transform(source)
        expect(regularStr).toBe(expected);
        
    })


    test('v-html --> r-html express',()=>{
        const source = unpad(
`
<div>
    <p v-html="getHtml('hehe')"></p>
</div>
`       )

        const expected = unpad(
`
<div>
    <p r-html="{this.getHtml('hehe')}"></p>
</div>
`       )

        const regularStr = transform.transform(source)
        expect(regularStr).toBe(expected);
        
    })




    test('template v-if --> {#if}{/if} param',()=>{
        const source = unpad(
`
<template v-if="param">
    123
</template>
`       )

        const expected = unpad(
`
{#if param}
    123
{/if}
`       )

        const regularStr = transform.transform(source)
        expect(regularStr).toBe(expected);
        
    })
    test('template v-if --> {#if}{/if} express',()=>{
        const source = unpad(
`
<template v-if="getShow() >=10">
    <div>
         <span>
         123
         </span>
    </div>
</template>
`       )

        const expected = unpad(
`
{#if this.getShow() >=10}
    <div>
         <span>
         123
         </span>
    </div>
{/if}
`       )

        const regularStr = transform.transform(source)
        expect(regularStr).toBe(expected);
        
    })
    test('template v-if --> {#if}{/if} param in express',()=>{
        const source = unpad(
`
<template v-if="getShow() >=10">
    <div>
         <span>
         <template v-if="hehe">123</template>
         </span>
    </div>
</template>
`       )

        const expected = unpad(
`
{#if this.getShow() >=10}
    <div>
         <span>
         {#if hehe}123{/if}
         </span>
    </div>
{/if}
`       )

        const regularStr = transform.transform(source)
        expect(regularStr).toBe(expected);
        
    })

    test('tag v-if --> {#if}{/if} param in express',()=>{
        const source = unpad(
`
<div v-if="getShow() >=10">
    <div>
         <span>
         <a v-if="hehe" href="http://www.baidu.com">123</a>
         </span>
    </div>
</div>
`       )

        const expected = unpad(
`
{#if this.getShow() >=10}<div>
    <div>
         <span>
         {#if hehe}<a href="http://www.baidu.com">123</a>{/if}
         </span>
    </div>
</div>{/if}
`       )

        const regularStr = transform.transform(source)
        expect(regularStr).toBe(expected);
        
    })
    test('tag v-if v-else --> {#if}{#else}{/if} param',()=>{
        const source = unpad(
`
<div v-if="param">
    123
</div>
<div v-else>
    456
</div>
`       )

        const expected = unpad(
`
{#if param}<div>
    123
</div>{#else}
 <div>
    456
</div>{/if}
`       )

        const regularStr = transform.transform(source)
        expect(regularStr).toBe(expected);
        
    })
    test('template v-if v-else --> {#if}{#else}{/if} param',()=>{
        const source = unpad(
`
<template v-if="param.a">
    123
</template>
<template v-else>
    456
</template>
`       )

        const expected = unpad(
`
{#if param.a}
    123
{#else}
 
    456
{/if}
`       )

        const regularStr = transform.transform(source)
        expect(regularStr).toBe(expected);
        
    })

    test('tag v-if v-else --> {#if}{#else}{/if} param more complex',()=>{
        const source = unpad(
`
<div v-if="param">
    123
</div>
<div v-else>
    456
    <span v-if="getMore(item.a)>10">
        9
    </span>
    <span v-else>
        12
    </span>
</div>
`       )

        const expected = unpad(
`
{#if param}<div>
    123
</div>{#else}
 <div>
    456
    {#if this.getMore(item.a)>10}<span>
        9
    </span>{#else}
     <span>
        12
    </span>{/if}
</div>{/if}
`       )

        const regularStr = transform.transform(source)
        expect(regularStr).toBe(expected);
        
    })

    test('template v-if v-else --> {#if}{#else}{/if} express in param',()=>{
        const source = unpad(
`
<template v-if="param">
    <div>
        <template v-if="getSome()">
            <p>hehe</p>
        </template>
        <template v-else>
            <p>xixi</p>
        </template>
    </div>
</template>
<template v-else>
    none
</template>
`       )

        const expected = unpad(
`
{#if param}
    <div>
        {#if this.getSome()}
            <p>hehe</p>
        {#else}
         
            <p>xixi</p>
        {/if}
    </div>
{#else}
 
    none
{/if}
`       )

        const regularStr = transform.transform(source)
        expect(regularStr).toBe(expected);
        
    })

    test('template v-if v-else-if v-else --> {#if}{#elseif}{#else}{/if} express in param',()=>{
        const source = unpad(
`
<template v-if="param>3">
    123
</template>
<template v-else-if="param>1">
    456
</template>
<template v-else>
    789
</template>
`       )

        const expected = unpad(
`
{#if param>3}
    123
{#elseif param>1}
 
    456
{#else}
 
    789
{/if}
`       )

        const regularStr = transform.transform(source)
        expect(regularStr).toBe(expected);
        
    })
    test('template v-for --> {#list}{/list} param',()=>{
        const source = unpad(
`
<template v-for="item in items">
{item}
</template>
`       )

        const expected = unpad(
`
{#list items as item}
{item}
{/list}
`       )

        const regularStr = transform.transform(source)
        expect(regularStr).toBe(expected);
        
    })

    test('template v-for --> {#list}{/list} param.param',()=>{
        const source = unpad(
`
<template v-for="item in items.list">
{item}
</template>
`       )

        const expected = unpad(
`
{#list items.list as item}
{item}
{/list}
`       )

        const regularStr = transform.transform(source)
        expect(regularStr).toBe(expected);
        
    })

    test('template v-for --> {#list}{/list} param.param',()=>{
        const source = unpad(
`
<template v-for="item2 in item.list">
    <div @click="doSom()">{item2.value}</div>
        <img v-for="img in item2.list" :src="img" alt="">
</template>
`       )

        const expected = unpad(
`
{#list item.list as item2}
    <div on-click="{this.doSom()}">{item2.value}</div>
        {#list item2.list as img}<img src="{img}" alt="">
{/list}
`       )

        const regularStr = transform.transform(source)
        expect(regularStr).toBe(expected);
        
    })
    test('template v-for --> {#list}{/list} express',()=>{
        const source = unpad(
`
<template v-for="item in getItems()">
{item}
</template>
`       )

        const expected = unpad(
`
{#list this.getItems() as item}
{item}
{/list}
`       )

        const regularStr = transform.transform(source)
        expect(regularStr).toBe(expected);
        
    })
    test('tag v-for --> {#list}{/list} param in express',()=>{
        const source = unpad(
`
<ul v-for="item in getItems()">
    <li v-for="i in item">
        <div>{i.a}</div>
    </li>
</ul>
`       )

        const expected = unpad(
`
{#list this.getItems() as item}<ul>
    {#list item as i}<li>
        <div>{i.a}</div>
    </li>{/list}
</ul>{/list}
`       )
        const regularStr = transform.transform(source)
        expect(regularStr).toBe(expected);
    })



    test('template v-for --> {#list}{/list} param in express',()=>{
        const source = unpad(
`
<template v-for="item in getItems()">
    <div>
    <template v-for="i in item">
        <span>{i.a}</span>
    </template>
    </div>
</template>
`       )

        const expected = unpad(
`
{#list this.getItems() as item}
    <div>
    {#list item as i}
        <span>{i.a}</span>
    {/list}
    </div>
{/list}
`       )

        const regularStr = transform.transform(source)
        expect(regularStr).toBe(expected);
        
    })


    test('complex comprehensive demo',()=>{
        const source = unpad(
`
<div @click='onClick($event)'>
    <div v-if="mynum < 20">
        <ul>
            <li v-for="item2 in list2">
                <span>{item2.a}</span>
            </li>
        </ul>
    </div>
    <div v-else-if="mynum < 10">
        <p v-html="getHtml()"></p>
    </div>
    <div v-else>
        <p v-show="isShow==true">
            <template v-if="ok">ok</template>
            <template v-else>cancel</template>
        </p>
    </div>
    <div>
        <span @mousemove="mouse(item)">123</span>
        <div>
            <template v-for="item in list">
                <div>{item.a}</div>
            </template>
        </div>
        <img :src="src" class="mss"/>
    </div>
</div>
`       )

        const expected = unpad(
`
<div on-click="{this.onClick($event)}">
    {#if mynum < 20}<div>
        <ul>
            {#list list2 as item2}<li>
                <span>{item2.a}</span>
            </li>{/list}
        </ul>
    </div>{#elseif mynum < 10}
     <div>
        <p r-html="{this.getHtml()}"></p>
    </div>{#else}
     <div>
        <p r-hide="{!(isShow==true)}">
            {#if ok}ok{#else}
             cancel{/if}
        </p>
    </div>{/if}
    <div>
        <span on-mousemove="{this.mouse(item)}">123</span>
        <div>
            {#list list as item}
                <div>{item.a}</div>
            {/list}
        </div>
        <img src="{src}" class="mss">
    </div>
</div>
`       )

        const regularStr = transform.transform(source)
        expect(regularStr).toBe(expected);
        
    })
})