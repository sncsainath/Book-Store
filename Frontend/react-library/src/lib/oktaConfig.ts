// oktaConfig.ts
import { OktaAuthOptions } from '@okta/okta-auth-js';

export const oktaConfig: OktaAuthOptions = {
  issuer: 'https://dev-67183897.okta.com/oauth2/default',
  clientId: '0oahc8pmmoMI16dux5d7',
  redirectUri: 'http://snccreations.s3-website.eu-north-1.amazonaws.com/login/callback',
};
