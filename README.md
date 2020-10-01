# stenciljs-e2e-setcontent
An implementation of puppeteer `setContent()` to replace stencil's override and implement some missing functionality, specifically `addScriptTag()` and `addStyleTag()`

## Prove it

A demo stencil app was add under /demo, this demo app has an e2e test where we include a simple remote script that sets a variable. The tests prove that the script executed correctly with the custom implementation and not with addscipttag()
`cd demo`
`npm run test`

## Why?
Stencil has created their own implementations of some puppeteer pieces. This means that it is easy to reference puppeteer documentation expecting functions to work only to be frustrated before eventually digging through stencil source to find out they override things. 
This particular example is about `addScriptTag` and `addStyleTag`. These functions are very useful when dealing with a real enterprise application that requires 3rd party or even cdn distributed scripts or styles.
