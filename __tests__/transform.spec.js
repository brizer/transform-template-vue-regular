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
});
