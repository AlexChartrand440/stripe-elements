```js script
import '@power-elements/codesandbox-button';

import { html } from '@open-wc/demoing-storybook';

export default {
  title: 'Framework Examples/Preact',
  parameters: {
    options: {
      selectedPanel: 'storybookjs/docs/panel'
    }
  }
}
```

# `<stripe-elements>`

```js story
export const PreactStripeElements = () => html`
  <codesandbox-button sandbox-id="mqskb"> </codesandbox-button>
`
```

```jsx
import { loadScripts } from "./loadScripts";
import { render } from "preact";
import { useState, useRef } from "preact/hooks";
import { getPropOr, compose } from "crocks";
import { PUBLISHABLE_KEY } from './config';
import "./style";

const isDisabled = ({ complete, empty }) => !complete || empty;
const getTarget = getPropOr({}, "target");
const getDetail = getPropOr(null, "detail");
const getToken = getPropOr(null, "token");

export default function App() {
  const stripeRef = useRef(null);
  const [disabled, setDisabled] = useState(true);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  const onChange = compose(setDisabled, isDisabled, getTarget);
  const onError = compose(setError, getDetail);
  const onToken = compose(setToken, getToken);

  const onClick = async () =>
    stripeRef.current.createToken()
      .then(getToken)
      .then(setToken);

  return (
    <article className="App">
      <stripe-elements
        ref={stripeRef}
        onchange={onChange}
        onerror={onError}
        ontoken={onToken}
        publishable-key={publishableKey}
      />
      <mwc-button onClick={onClick} disabled={disabled}>Submit</mwc-button>
      {(error || token) && <json-viewer object={error || token} />}
    </article>
  );
}

if (typeof window !== "undefined") {
  render(<App />, document.getElementById("root"));
}
```

# `<stripe-payment-request>`

```js story
export const PreactStripePaymentRequest = () => html`
  <codesandbox-button sandbox-id="6og3s"> </codesandbox-button>
`
```

```jsx
import { loadScripts } from "./loadScripts";
import { render } from "preact";
import { useState, useRef } from "preact/hooks";
import { getPropOr, compose } from "crocks";
import { PUBLISHABLE_KEY } from './config';
import "./style";

const getDetail = getPropOr(null, "detail");
const getPaymentMethod = getPropOr(null, "paymentMethod");

export default function App() {
  const stripeRef = useRef(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [error, setError] = useState(null);

  const onError = compose(setError, getDetail);
  const onPaymentMethod = compose(setPaymentMethod, getPaymentMethod);

  return (
    <article className="App">
      <stripe-payment-request
        ref={stripeRef}
        onerror={onError}
        onpayment-method={onPaymentMethod}
        publishable-key={publishableKey}
        generate="payment-method"
        request-payer-name
        request-payer-email
        request-payer-phone
        amount="326"
        label="Double Double"
        country="CA"
        currency="cad"
      />
      {(error || paymentMethod) && <json-viewer object={error || paymentMethod} />}
    </article>
  );
}

if (typeof window !== "undefined") {
  render(<App />, document.getElementById("root"));
}
```
