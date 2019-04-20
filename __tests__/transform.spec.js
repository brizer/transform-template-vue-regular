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



})