System.register(["./lit-html-d4bb504d.js","./storybook-deb9934b.js","./lit-element-ba2ebbe8.js","./codesandbox-button-b2b98b59.js"],(function(e){"use strict";var t,n,o,s,r,a,i,p;return{setters:[function(e){t=e.l,n=e.p,o=e.k,s=e.s},function(e){r=e.f,a=e.u,i=e.t,p=e.Y},function(){},function(){}],execute:function(){function c(){var e=o(['<codesandbox-button sandbox-id="5h7uy"> </codesandbox-button>']);return c=function(){return e},e}function u(){var e=o(['<codesandbox-button sandbox-id="y4h9n"> </codesandbox-button>']);return u=function(){return e},e}function d(){var e=o(['<codesandbox-button sandbox-id="5h7uy"> </codesandbox-button>']);return d=function(){return e},e}function m(){var e=o(['<codesandbox-button sandbox-id="y4h9n"> </codesandbox-button>']);return m=function(){return e},e}function l(){return(l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e}).apply(this,arguments)}var b={};function y(e){var n=e.components,o=s(e,["components"]);return r("wrapper",l({},b,o,{components:n,mdxType:"MDXLayout"}),r(p,{title:"Framework Examples/Vanilla",parameters:{options:{selectedPanel:"storybookjs/docs/panel"}},mdxType:"Meta"}),r("h1",null,r("inlineCode",{parentName:"h1"},"<stripe-elements>")),r(i,{name:"stripe-elements",mdxType:"Story"},t(m())),r("pre",null,r("code",l({parentName:"pre"},{className:"language-html"}),'<script type="module" src="https://unpkg.com/@power-elements/stripe-elements?module"><\/script>\n<script type="module" src="https://unpkg.com/@power-elements/json-viewer?module"><\/script>\n<script type="module" src="https://unpkg.com/@material/mwc-button?module"><\/script>\n\n<stripe-elements publishable-key="pk_test_XXXXXXXXXXXXXXXXXXXXXXXX"></stripe-elements>\n\n<mwc-button disabled>Submit</mwc-button>\n\n<json-viewer></json-viewer>\n\n<script>\n  const viewer = document.querySelector("json-viewer");\n  const stripe = document.querySelector("stripe-elements");\n  const submit = document.querySelector("mwc-button");\n\n  submit.addEventListener("click", onClickSubmit);\n  stripe.addEventListener("source", onSource);\n  stripe.addEventListener("change", onChange);\n\n  function onClickSubmit() {\n    stripe.createSource();\n  }\n\n  function onChange({ target }) {\n    submit.disabled = !target.validate();\n  }\n\n  function onSource({ target: { source } }) {\n    const handleAsJson = response => response.json();\n    const viewJson = object => (viewer.object = object);\n\n    const method = "POST";\n    const body = JSON.stringify(source);\n    const headers = { "Content-Type": "application/json" };\n\n    fetch("/payments", { method, body, headers })\n      .then(handleAsJson)\n      .then(viewJson)\n      .catch(viewJson);\n  }\n<\/script>\n')),r("h1",null,r("inlineCode",{parentName:"h1"},"<stripe-payment-request>")),r(i,{name:"stripe-payment-request",mdxType:"Story"},t(d())),r("pre",null,r("code",l({parentName:"pre"},{className:"language-html"}),'<stripe-payment-request\n    publishable-key="pk_test_XXXXXXXXXXXXXXXXXXXXXXXX"\n    generate="payment-method"\n    request-payer-name\n    request-payer-email\n    request-payer-phone\n    amount="326"\n    label="Double Double"\n    country="CA"\n    currency="cad">\n  <stripe-display-item data-amount="125" data-label="Double Double"> </stripe-display-item>\n  <stripe-display-item data-amount="199" data-label="Box of 10 Timbits"> </stripe-display-item>\n  <stripe-shipping-option data-id="pick-up" data-label="Pick Up" data-detail="Pick Up at Your Local Timmy\'s" data-amount="0"> </stripe-shipping-option>\n  <stripe-shipping-option data-id="delivery" data-label="Delivery" data-detail="Timbits to Your Door" data-amount="200"> </stripe-shipping-option>\n</stripe-payment-request>\n\n<json-viewer></json-viewer>\n\n<script>\n  const viewer = document.querySelector("json-viewer");\n  const stripe = document.querySelector("stripe-payment-request");\n\n  stripe.addEventListener("payment-method", onPaymentMethod);\n\n  function onPaymentMethod({ target: { paymentMethod } }) {\n    const handleAsJson = response => response.json();\n    const viewJson = object => (viewer.object = object);\n\n    const method = "POST";\n    const body = JSON.stringify(paymentMethod);\n    const headers = { "Content-Type": "application/json" };\n\n    fetch("/payments", { method, body, headers })\n      .then(handleAsJson)\n      .then(viewJson)\n      .catch(viewJson);\n  }\n<\/script>\n')))}y.isMDXComponent=!0;var h=e("stripeElements",(function(){return t(u())}));h.story={},h.story.name="stripe-elements",h.story.parameters={mdxSource:'html`<codesandbox-button sandbox-id="y4h9n"> </codesandbox-button>`'};var X=e("stripePaymentRequest",(function(){return t(c())}));X.story={},X.story.name="stripe-payment-request",X.story.parameters={mdxSource:'html`<codesandbox-button sandbox-id="5h7uy"> </codesandbox-button>`'};var v={title:"Framework Examples/Vanilla",parameters:{options:{selectedPanel:"storybookjs/docs/panel"}},includeStories:["stripeElements","stripePaymentRequest"]},f={"stripe-elements":"stripeElements","stripe-payment-request":"stripePaymentRequest"};v.parameters=v.parameters||{},v.parameters.docs=n({},v.parameters.docs||{},{page:function(){return r(a,{mdxStoryNameToKey:f,mdxComponentMeta:v},r(y,null))}}),e("default",v);e("__namedExportsOrder",["stripeElements","stripePaymentRequest"])}}}));
//# sourceMappingURL=vanilla.stories-68a2df12.js.map