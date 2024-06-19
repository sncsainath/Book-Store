// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Security } from '@okta/okta-react';
import { oktaAuth } from './models/Auth';
import { toRelativeUrl } from '@okta/okta-auth-js';


const stripePromise = loadStripe('pk_test_51PQ1ptIYT8xhsYpLToA0hwQHF198iYteAhLPqvboFoiJbHIi5PixBwuDaPVyzkz9w12Ztjc21BH3d0xRGCI8wdiX00rpISB5W9');

const restoreOriginalUri = async (_oktaAuth: any, originalUri: string) => {
  window.location.replace(toRelativeUrl(originalUri || '/', window.location.origin));
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </Security>
  </BrowserRouter>
);
