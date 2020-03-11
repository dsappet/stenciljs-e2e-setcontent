# stenciljs-e2e-setcontent
An implementation of puppeteer `setContent()` to replace stencil's override and implement some missing functionality, specifically `addScriptTag()` and `addStyleTag()`

## Prove it

A demo stencil app was add under /demo, this demo app has an e2e test where we include a simple remote script that sets a variable. The tests prove that the script executed correctly with the custom implementation and not with addscipttag()
`cd demo`
`npm run test`