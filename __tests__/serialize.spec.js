//validate Grammatical correctness based on this: https://astexplorer.net/
const parse5 = require('template-parse')
const unpad = require('../lib/unpad')

describe("test serialize", () => {
  test("test parser5 serialize itself @click", () => {
    const source = unpad(`
        <div>
            <div>
                hehe
            </div>
            <div>
                <p>
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
    const documentFragment = parse5.parseFragment(source)
    documentFragment.childNodes[0].childNodes[3].childNodes[1].attrs.push({
        name:'on-click',
        value:'{this.doSomething()}'
    })
    const str = parse5.serialize(documentFragment)
    expect(str).toBe(expected);
  });

  test("test parser5 serialize itself :item", () => {
    const source = unpad(`
        <div>
            <div>
                hehe
            </div>
            <div>
                <p>
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
    const documentFragment = parse5.parseFragment(source)
    documentFragment.childNodes[0].childNodes[3].childNodes[1].attrs.push({
        name:'item',
        value:'{itemValue}'
    })
    const str = parse5.serialize(documentFragment)
    expect(str).toBe(expected);
  });
});
