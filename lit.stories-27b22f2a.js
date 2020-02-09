import{h as e}from"./lit-html-ad749610.js";import{f as t,u as n,t as o,Y as r}from"./storybook-672964cf.js";import"./lit-element-785ef095.js";import"./codesandbox-button-84b117ac.js";function s(){return(s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e}).apply(this,arguments)}const a={};function i({components:n,...i}){return t("wrapper",s({},a,i,{components:n,mdxType:"MDXLayout"}),t(r,{title:"Framework Examples/LitElement",parameters:{options:{selectedPanel:"storybookjs/docs/panel"}},mdxType:"Meta"}),t("h1",null,t("inlineCode",{parentName:"h1"},"<stripe-elements>")),t(o,{name:"stripe-elements",mdxType:"Story"},e`<codesandbox-button sandbox-id="8m7uk"></codesandbox-button>`),t("pre",null,t("code",s({parentName:"pre"},{className:"language-js"}),'import \'@power-elements/stripe-elements\';\nimport \'@power-elements/json-viewer\';\nimport { LitElement, html } from \'lit-element\';\nimport { PUBLISHABLE_KEY } from \'./config.js\';\n\nclass PaymentForm extends LitElement {\n  static get properties() {\n    return {\n      error: { type: Object },\n      source: { type: Object },\n    }\n  }\n\n  render() {\n    return html`\n      <mwc-button ?disabled="${this.submitDisabled}" @click="${this.onClick}">\n        Submit\n      </mwc-button>\n\n      <stripe-elements\n          publishable-key="${PUBLISHABLE_KEY}"\n          @change="${this.onChange}"\n          @source="${this.onSource}"\n          @error="${this.onError}"\n      ></stripe-elements>\n\n      <json-viewer .object="${ifDefined(this.error || this.source)}"></json-viewer>\n    `;\n  }\n\n  onChange({ target: { complete, hasError } }) {\n    this.submitDisabled = !(complete && !hasError);\n  }\n\n  onClick() {\n    this.shadowRoot.querySelector("stripe-elements").createSource();\n  }\n\n  onSource({ detail: source }) {\n    this.source = source;\n  }\n\n  onError({ target: { error } }) {\n    this.error = error;\n  }\n}\n')),t("h1",null,t("inlineCode",{parentName:"h1"},"<stripe-payment-request>")),t(o,{name:"stripe-payment-request",mdxType:"Story"},e`<codesandbox-button sandbox-id="8m7uk"></codesandbox-button>`),t("pre",null,t("code",s({parentName:"pre"},{className:"language-js"}),'import { LitElement, html } from \'lit-element\';\nimport { PUBLISHABLE_KEY } from \'./config.js\';\n\nconst displayItems = [\n  { amount: \'125\', label: \'Double Double\' },\n  { amount: \'199\', label: \'Box of 10 Timbits\' },\n]\n\nconst shippingOptions = [\n  { id: \'pick-up\',  amount: 0,   label: \'Pick Up\',  detail: "Pick Up at Your Local Timmy\'s" },\n  { id: \'delivery\', amount: 200, label: \'Delivery\', detail: \'Timbits to Your Door\' }\n]\n\nclass PaymentForm extends LitElement {\n  static get properties() {\n    return {\n      paymentMethod: { type: Object },\n    };\n  }\n\n  render() {\n    return html`\n      <stripe-payment-request\n          publishable-key="pk_test_XXXXXXXXXXXXXXXXXXXXXXXX"\n          .shippingOptions="${shippingOptions}"\n          .displayItems="${displayItems}"\n          @payment-method="${this.onPaymentMethod}"\n          @error="${this.onError}"\n          generate="payment-method"\n          request-payer-name\n          request-payer-email\n          request-payer-phone\n          amount="326"\n          label="Double Double"\n          country="CA"\n          currency="cad">\n      </stripe-payment-request>\n\n      <json-viewer .object="${ifDefined(this.error || this.paymentMethod)}"></json-viewer>\n    `;\n  }\n\n  onPaymentMethod({ detail: paymentMethod }) {\n    this.paymentMethod = paymentMethod;\n  }\n\n  onError({ target: { error } }) {\n    this.error = error;\n  }\n}\n')))}i.isMDXComponent=!0;const m=()=>e`<codesandbox-button sandbox-id="8m7uk"></codesandbox-button>`;(m.story={}).name="stripe-elements",m.story.parameters={mdxSource:'html`<codesandbox-button sandbox-id="8m7uk"></codesandbox-button>`'};const p=()=>e`<codesandbox-button sandbox-id="8m7uk"></codesandbox-button>`;(p.story={}).name="stripe-payment-request",p.story.parameters={mdxSource:'html`<codesandbox-button sandbox-id="8m7uk"></codesandbox-button>`'};const l={title:"Framework Examples/LitElement",parameters:{options:{selectedPanel:"storybookjs/docs/panel"}},includeStories:["stripeElements","stripePaymentRequest"]},d={"stripe-elements":"stripeElements","stripe-payment-request":"stripePaymentRequest"};l.parameters=l.parameters||{},l.parameters.docs={...l.parameters.docs||{},page:()=>t(n,{mdxStoryNameToKey:d,mdxComponentMeta:l},t(i,null))};const u=["stripeElements","stripePaymentRequest"];export default l;export{u as __namedExportsOrder,m as stripeElements,p as stripePaymentRequest};
//# sourceMappingURL=lit.stories-27b22f2a.js.map