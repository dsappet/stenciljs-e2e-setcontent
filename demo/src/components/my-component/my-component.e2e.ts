import { newE2EPage, E2EPage } from '@stencil/core/testing';
import { e2eSetContent, AddTagOptions} from 'stenciljs-e2e-setcontent';

const includeScript = 'https://pastebin.com/raw/yr7PcnqD';

interface myE2EPage extends E2EPage {
  /**
   * Instead of testing a url directly, html content can be mocked using
   * `page.setContent(html)`. A shortcut to `page.setContent(html)` is to set
   * the `html` option when creating a new page, such as
   * `const page = await newE2EPage({ html })`.
   */
  //setContent(page:any, html: string, navigationOptions?: any, moreOptions?: any): Promise<void>;
  betterSetContent: any;
}

describe('my-component', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    //page.setContent = e2eSetContent.bind(null, page);

    await page.setContent('<my-component></my-component>');
    const element = await page.find('my-component');
    expect(element).toHaveClass('hydrated');
  });

  it('proves that addScriptTag() does not work', async () => {
    let page = await newE2EPage();

    await page.addScriptTag({url: includeScript});
    await page.setContent('<my-component></my-component>');
    // If you reverse the setContent and addScriptTag it will "work" but if the component requires the content of the script it is still not good enough

    let result = await page.evaluate(() => {
      return window["myDemoVar"]
    })

    expect(result).toBeUndefined();
  })

  it('loads the remote script', async () => {
    let page = await newE2EPage() as myE2EPage;

    page.betterSetContent = e2eSetContent; //.bind(null, page);

    const addTags: AddTagOptions = {
      script: [includeScript]
    }

    await page.betterSetContent(page,'<my-component></my-component>', {}, addTags);
    let result = await page.evaluate(() => {
      return window["myDemoVar"]
    })

    expect(result).toEqual('monkey tuna');
  });

});
