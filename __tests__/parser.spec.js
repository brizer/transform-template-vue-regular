//validate Grammatical correctness based on this: https://astexplorer.net/
const parse5 = require('template-parse')
const unpad = require('../lib/unpad')

describe("test parser", () => {
  test("test parser5 itself @click", () => {
    const source = unpad(`
        <div>
            <div>
                hehe
            </div>
            <div>
                <p @click="doSomethind()">
                    this is me
                </p>
            </div>
        </div>`);
    const documentFragment = parse5.parseFragment(source)
    const eventname = documentFragment.childNodes[0].childNodes[3].childNodes[1].attrs[0].name
    expect(eventname).toBe('@click');
  });

  test("test parser5 itself :item", () => {
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
    const documentFragment = parse5.parseFragment(source)
    const name = documentFragment.childNodes[0].childNodes[3].childNodes[1].attrs[0].name
    const value = documentFragment.childNodes[0].childNodes[3].childNodes[1].attrs[0].value
    expect(name).toBe(':item');
    expect(value).toBe('itemValue');
  });
});
