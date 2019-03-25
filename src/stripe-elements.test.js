import './stripe-elements';

import { expect, fixture, oneEvent, chai, nextFrame } from '@open-wc/testing';
import { stub } from 'sinon';
import sinonChai from 'sinon-chai';

import {
  INCOMPLETE_CARD_KEY,
  MockedStripeAPI,
  PUBLISHABLE_KEY,
  SHOULD_ERROR_KEY,
  TOKEN_ERROR_KEY,
} from '../test/mock-stripe';

chai.use(sinonChai);

customElements.define('x-host', class XHost extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<stripe-elements></stripe-elements>`;
    this.stripeElements = this.shadowRoot.firstElementChild;
  }
});

const NO_STRIPE_JS = `<stripe-elements> requires Stripe.js to be loaded first.`;
const INCOMPLETE_CC_INFO = 'Credit card information is incomplete.';
const EMPTY_CC_INFO = 'Credit Card information is empty.';

afterEach(() => {
  const globalStyles = document.getElementById('stripe-elements-custom-css-properties');
  if (globalStyles) globalStyles.remove();
});

describe('stripe-elements', function() {
  it('instantiates without error', async function noInitialError() {
    const element = await fixture(`<stripe-elements></stripe-elements>`);
    expect(element.constructor.is).to.equal('stripe-elements');
  });

  describe('default properties', function defaults() {
    [
      { name: 'action', default: '' },
      { name: 'brand', default: null },
      { name: 'card', default: null },
      { name: 'elements', default: null },
      { name: 'error', default: null },
      { name: 'hasError', default: false },
      { name: 'hideIcon', default: false },
      { name: 'hidePostalCode', default: false },
      { name: 'iconStyle', default: 'default' },
      { name: 'isComplete', default: false },
      { name: 'isEmpty', default: true },
      { name: 'stripe', default: null },
      { name: 'token', default: null },
      { name: 'value', default: {} },
    ].forEach(prop => {
      it(prop.name, async function() {
        const element = await fixture(`<stripe-elements></stripe-elements>`);
        expect(element[prop.name]).to.eql(prop.default);
      });
    });
  });

  describe('read-only properties', function readOnly() {
    [
      'brand',
      'card',
      'elements',
      'hasError',
      'isComplete',
      'isEmpty',
      'stripe',
      'stripeReady',
      'token',
    ].forEach(prop => {
      it(prop, async function() {
        const element = await fixture(`<stripe-elements></stripe-elements>`);
        const init = element[prop];
        element[prop] = Math.random();
        expect(element[prop]).to.eql(init);
      });
    });
  });

  describe('notifying public properties', function notifying() {
    function camelCaseToDash( myStr ) {
      return myStr.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
    }

    [
      'publishableKey',
    ].forEach(prop => {
      it(prop, async function() {
        window.Stripe = {};
        const element = await fixture(`<stripe-elements></stripe-elements>`);
        const synth = Math.random();
        setTimeout(() => {
          element[prop] = synth;
        });
        const eventName = `${camelCaseToDash(prop)}-changed`;
        const { detail: { value } } = await oneEvent(element, eventName);
        expect(value).to.eql(synth);
        delete window.Stripe;
      });
    });
  });

  describe('document styles', function() {
    it('appends a stylesheet to the document when absent', async function globalStylesWhen() {
      await fixture(`<stripe-elements></stripe-elements>`);
      const globalStyles = document.getElementById('stripe-elements-custom-css-properties');
      expect(globalStyles).to.not.be.null;
    });

    it('doesnt append a stylesheet to the document when present', async function globalStylesWhen() {
      const style = document.createElement('style');
      style.id = 'stripe-elements-custom-css-properties';
      document.head.appendChild(style);
      await fixture(`<stripe-elements></stripe-elements>`);
      const globalStyles = document.getElementById('stripe-elements-custom-css-properties');
      expect(globalStyles).to.equal(style);
    });
  });

  describe('ShadyDOM support', function shadyDOM() {
    it('appends a shady-dom mount point', async function shadyMount() {
      window.ShadyDOM = {};
      const element = await fixture(`<stripe-elements></stripe-elements>`);
      expect(element.querySelector('form')).to.be.ok;
      expect(element.querySelector('[aria-label="Credit or Debit Card"]')).to.be.ok;
      expect(element.querySelector('input[name="stripeToken"]')).to.be.ok;
      expect(element.querySelectorAll('form').length).to.equal(1);
    });

    it('only appends once', async function shadyMount() {
      window.ShadyDOM = {};
      const element = await fixture(`<stripe-elements></stripe-elements>`);
      element.firstUpdated();
      expect(element.querySelectorAll('form').length).to.equal(1);
      delete window.ShadyDOM;
    });
  });

  describe('Shadow DOM support', function shadowDOM() {
    it('leaves breadcrumbs on its way up to the document', async function breadcrumbs() {
      const host = await fixture(`<x-host></x-host>`);
      const element = host.stripeElements;
      const target = document.querySelector('[aria-label="Credit or Debit Card"]');
      const [slottedChild] = element.querySelector('slot').assignedNodes();

      expect(slottedChild).to.contain(target);
    });
  });

  describe('with a publishable key', function apiKey() {
    describe('without Stripe.js', function withoutStripe() {
      beforeEach(function stubConsole() {
        stub(console, 'warn');
      });

      afterEach(function restoreConsole() {
        console.warn.restore();
      });

      it('logs a warning', async function logsWarning() {
        const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
        expect(console.warn).to.have.been.calledWith(NO_STRIPE_JS);
        expect(element.stripe).to.not.be.ok;
      });

      it('does not initialize stripe instance', async function noStripeInit() {
        const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
        expect(element.stripe).to.not.be.ok;
      });

      it('does not mount card', async function noCard() {
        const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
        expect(element.card).to.not.be.ok;
      });

      it('sets the error', async function setsError() {
        const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
        expect(element.error).to.eql({ message: NO_STRIPE_JS });
      });

      it('throws an error when submitting', async function submit() {
        const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
        expect(() => element.submit()).to.throw('Cannot submit before initializing Stripe');
      });
    });

    describe('with mocked Stripe.js', function withMockedStripeJs() {
      beforeEach(function mockStripe() {
        window.Stripe = (key, opts) => new MockedStripeAPI(key, opts);
      });

      afterEach(function restoreMock() {
        delete window.Stripe;
      });

      it('initializes stripe instance', async function stripeInit() {
        const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
        expect(element.stripe).to.be.ok;
      });

      it('initializes elements instance', async function elementsInit() {
        const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
        expect(element.elements).to.be.ok;
      });

      it('mounts a card into the target', async function cardInit() {
        const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
        expect(element.card).to.be.ok;
      });

      describe('when pk is reset', function pkReset() {
        it('reinitializes stripe', async function() {
          const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
          const initial = element.stripe;
          element.publishableKey = 'foo';
          await element.updateComplete;
          expect(element.stripe).to.not.equal(initial);
        });
      });

      describe('when pk is unset', function pkReset() {
        it('unsets stripe instance', async function() {
          const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
          element.publishableKey = '';
          await element.updateComplete;
          expect(element.stripe).to.be.null;
        });

        it('unsets element instance', async function() {
          const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
          element.publishableKey = '';
          await element.updateComplete;
          expect(element.elements).to.be.null;
        });

        it('unsets card', async function() {
          const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
          element.publishableKey = '';
          await element.updateComplete;
          expect(element.card).to.be.null;
        });
      });

      describe('when card is ready', function cardReady() {
        it('fires stripe-ready event', async function() {
          const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
          setTimeout(() => {
            // synthetic event
            element.card.__card.dispatchEvent(new CustomEvent('ready', {
              empty: true,
              complete: false,
            }));
          });
          const ev = await oneEvent(element, 'stripe-ready');
          expect(ev).to.be.ok;
        });

        it('fires stripe-ready-changed event', async function() {
          const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
          setTimeout(() => {
            // synthetic event
            element.card.__card.dispatchEvent(new CustomEvent('ready'));
          });
          const ev = await oneEvent(element, 'stripe-ready-changed');
          expect(ev.detail.value).to.be.true;
        });

        it('sets stripeReady', async function() {
          const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
          element.card.__card.dispatchEvent(new CustomEvent('ready'));
          expect(element.stripeReady).to.be.true;
        });
      });

      describe('when card changes', function cardChange() {
        describe('when empty changes', function emptyChange() {
          it('fires is-empty-changed event', async function isEmptyChanged() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            const synth = Math.random() + 1;
            setTimeout(() => {
              // synthetic event
              const event = new CustomEvent('change');
              event.empty = synth;
              element.card.__card.dispatchEvent(event);
            });
            const ev = await oneEvent(element, 'is-empty-changed');
            expect(ev.detail.value).to.equal(synth);
          });

          it('sets isEmpty', async function setsIsEmpty() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            const event = new CustomEvent('change');
            event.empty = true;
            element.card.__card.dispatchEvent(event);
            expect(element.isEmpty).to.be.true;
          });

          describe('validating empty card', function() {
            it('is false', async function validating() {
              const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
              const event = new CustomEvent('change');
              event.brand = 'visa';
              event.complete = false;
              event.empty = true;
              element.card.__card.dispatchEvent(event);
              await element.updateComplete;
              expect(element.validate()).to.be.false;
            });

            it('sets error', async function validating() {
              const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
              const event = new CustomEvent('change');
              event.brand = 'visa';
              event.complete = false;
              event.empty = true;
              element.card.__card.dispatchEvent(event);
              element.validate();
              await nextFrame();
              await element.updateComplete;
              expect(element.error).to.equal(EMPTY_CC_INFO);
            });
          });
        });

        describe('when complete changes', function emptyChange() {
          it('fires is-complete-changed event', async function isEmptyChanged() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            const synth = Math.random() + 1;
            setTimeout(() => {
              // synthetic event
              const event = new CustomEvent('change');
              event.complete = synth;
              element.card.__card.dispatchEvent(event);
            });
            const ev = await oneEvent(element, 'is-complete-changed');
            expect(ev.detail.value).to.equal(synth);
          });

          it('sets isComplete', async function setsIsEmpty() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            const event = new CustomEvent('change');
            event.complete = true;
            element.card.__card.dispatchEvent(event);
            expect(element.isComplete).to.be.true;
          });

          describe('validating incomplete card', function() {
            it('is false', async function validating() {
              const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
              const event = new CustomEvent('change');
              event.brand = 'visa';
              event.complete = false;
              event.empty = false;
              element.card.__card.dispatchEvent(event);
              await element.updateComplete;
              expect(element.validate()).to.be.false;
            });

            it('sets error', async function validating() {
              const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
              const event = new CustomEvent('change');
              event.brand = 'visa';
              event.complete = false;
              event.empty = false;
              element.card.__card.dispatchEvent(event);
              await element.updateComplete;
              element.validate();
              await element.updateComplete;
              expect(element.error).to.equal(INCOMPLETE_CC_INFO);
            });
          });
        });

        describe('when brand changes', function brandChange() {
          it('fires brand-changed event', async function brandChanged() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            const synth = Math.random() + 1;
            setTimeout(() => {
              // synthetic event
              const event = new CustomEvent('change');
              event.brand = synth;
              element.card.__card.dispatchEvent(event);
            });
            const ev = await oneEvent(element, 'brand-changed');
            expect(ev.detail.value).to.equal(synth);
          });

          it('sets brand', async function setsBrand() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            const event = new CustomEvent('change');
            event.brand = 'visa';
            element.card.__card.dispatchEvent(event);
            expect(element.brand).to.equal('visa');
          });
        });

        describe('when error changes', function errorChange() {
          it('fires error-changed event', async function errorChanged() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            const synth = Math.random() + 1;
            setTimeout(() => {
              // synthetic event
              const event = new CustomEvent('change');
              event.error = synth;
              element.card.__card.dispatchEvent(event);
            });
            const ev = await oneEvent(element, 'error-changed');
            expect(ev.detail.value).to.equal(synth);
          });

          it('sets error', async function setsError() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            const event = new CustomEvent('change');
            event.error = { message: 'foo' };
            element.card.__card.dispatchEvent(event);
            expect(element.error).to.eql({ message: 'foo' });
          });

          it('sets hasError', async function setsError() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            const event = new CustomEvent('change');
            event.error = { message: 'foo' };
            element.card.__card.dispatchEvent(event);
            expect(element.hasError).to.be.true;
          });
        });

        describe('potentially valid', function() {
          it('is true when neither incomplete, empty nor with error', async function validating() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            const event = new CustomEvent('change');
            event.brand = 'visa';
            event.complete = false;
            event.empty = false;
            element.card.__card.dispatchEvent(event);
            await element.updateComplete;
            expect(element.isPotentiallyValid()).to.be.true;
          });
        });

        describe('reset', function() {
          it('unsets error', async function() {
            const element = await fixture(`<stripe-elements publishable-key="${SHOULD_ERROR_KEY}"></stripe-elements>`);
            const event = new CustomEvent('change');
            element.card.__card.dispatchEvent(event);
            await nextFrame();
            expect(element.error).to.not.be.null;
            element.reset();
            await element.updateComplete;
            expect(element.error).to.be.null;
          });

          it('clears the card', async function() {
            const element = await fixture(`<stripe-elements publishable-key="${SHOULD_ERROR_KEY}"></stripe-elements>`);
            const event = new CustomEvent('change');
            event.brand = 'visa';
            event.complete = true;
            event.empty = false;
            element.card.__card.dispatchEvent(event);
            stub(element.card, 'clear');
            element.reset();
            await nextFrame();
            await element.updateComplete;
            expect(element.card.clear).to.have.been.called;
            element.card.clear.restore();
          });
        });
      });

      describe('when submit called', function submitting() {
        describe('when card is incomplete', function() {
          it('does nothing', async function submit() {
            const element = await fixture(`<stripe-elements publishable-key="${INCOMPLETE_CARD_KEY}"></stripe-elements>`);
            element.submit();
            expect(element.token).to.be.null;
            expect(element.error).to.be.null;
          });
        });

        describe('when createToken throws', function throws() {
          it('sets error', async function() {
            const element = await fixture(`<stripe-elements publishable-key="${SHOULD_ERROR_KEY}"></stripe-elements>`);
            const event = new CustomEvent('change');
            event.brand = 'visa';
            event.complete = true;
            event.empty = false;
            element.card.__card.dispatchEvent(event);
            element.submit();
            await nextFrame();
            await element.updateComplete;
            expect(element.error).to.eql(SHOULD_ERROR_KEY);
          });

          describe('validating existing error', function() {
            it('is false', async function validating() {
              const element = await fixture(`<stripe-elements publishable-key="${SHOULD_ERROR_KEY}"></stripe-elements>`);
              const event = new CustomEvent('change');
              event.brand = 'visa';
              event.complete = false;
              event.empty = false;
              element.card.__card.dispatchEvent(event);
              await element.updateComplete;
              expect(element.validate()).to.be.false;
            });

            it('retains error', async function validating() {
              const element = await fixture(`<stripe-elements publishable-key="${TOKEN_ERROR_KEY}"></stripe-elements>`);
              const event = new CustomEvent('change');
              event.brand = 'visa';
              event.complete = true;
              event.empty = false;
              element.card.__card.dispatchEvent(event);
              element.submit();
              await nextFrame();
              await element.updateComplete;
              element.validate();
              expect(element.error).to.equal(TOKEN_ERROR_KEY);
            });
          });
        });

        describe('when createToken returns error', function throws() {
          it('sets error', async function() {
            const element = await fixture(`<stripe-elements publishable-key="${TOKEN_ERROR_KEY}"></stripe-elements>`);
            const event = new CustomEvent('change');
            event.brand = 'visa';
            event.complete = true;
            event.empty = false;
            element.card.__card.dispatchEvent(event);
            element.submit();
            await nextFrame();
            await element.updateComplete;
            expect(element.error).to.eql(TOKEN_ERROR_KEY);
          });
        });

        describe('when token is returned', function() {
          it('sets token', async function submit() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            const event = new CustomEvent('change');
            event.brand = 'visa';
            event.complete = true;
            event.empty = false;
            element.card.__card.dispatchEvent(event);
            element.submit();
            await element.updateComplete;
            expect(element.token).to.equal('howdy!');
          });

          it('fires token-changed', async function submit() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            const event = new CustomEvent('change');
            event.brand = 'visa';
            event.complete = true;
            event.empty = false;
            element.card.__card.dispatchEvent(event);
            setTimeout(() => element.submit());
            const ev = await oneEvent(element, 'token-changed');
            expect(ev.detail.value).to.equal('howdy!');
          });

          it('fires stripe-token', async function submit() {
            const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
            const event = new CustomEvent('change');
            event.brand = 'visa';
            event.complete = true;
            event.empty = false;
            element.card.__card.dispatchEvent(event);
            setTimeout(() => element.submit());
            const ev = await oneEvent(element, 'stripe-token');
            await element.updateComplete;
            expect(ev.detail).to.equal('howdy!');
          });

          describe('when there is an action', function() {
            it('submits the form', async function submit() {
              const element = await fixture(`<stripe-elements action="here" publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
              await element.updateComplete;
              const form = element.querySelector('form');
              const subStub = stub(form, 'submit');
              const event = new CustomEvent('change');
              event.brand = 'visa';
              event.complete = true;
              event.empty = false;
              element.card.__card.dispatchEvent(event);
              element.submit();
              await element.updateComplete;
              expect(subStub).to.have.been.called;
              subStub.restore();
            });
          });

          describe('validating good token', function() {
            it('is true', async function validating() {
              const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
              const event = new CustomEvent('change');
              event.brand = 'visa';
              event.complete = true;
              event.empty = false;
              element.card.__card.dispatchEvent(event);
              await element.updateComplete;
              expect(element.validate()).to.be.true;
              expect(element.error).to.not.be.ok;
            });

            it('is is also "potentially" valid', async function validating() {
              const element = await fixture(`<stripe-elements publishable-key="${PUBLISHABLE_KEY}"></stripe-elements>`);
              const event = new CustomEvent('change');
              event.brand = 'visa';
              event.complete = true;
              event.empty = false;
              element.card.__card.dispatchEvent(event);
              await element.updateComplete;
              expect(element.isPotentiallyValid()).to.be.true;
              expect(element.error).to.not.be.ok;
            });
          });
        });
      });
    });
  });
});