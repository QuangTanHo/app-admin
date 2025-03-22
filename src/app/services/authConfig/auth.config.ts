import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  // issuer: 'https://accounts.google.com',
  // redirectUri: window.location.origin + '/login/callback',
  // clientId:'290820053859-i9tml9s6dnlt73hgv657lg7anmgtjtj1.apps.googleusercontent.com',
  // responseType: 'code',
  // scope: 'openid profile email',
  // strictDiscoveryDocumentValidation: false,
  // showDebugInformation: true,
  issuer: 'https://accounts.google.com',
  clientId: '290820053859-i9tml9s6dnlt73hgv657lg7anmgtjtj1.apps.googleusercontent.com',  // clientId từ Google Developer Console
  redirectUri: 'http://localhost:4200',  // Đảm bảo đây là chính xác URI
  responseType: 'token id_token',
  scope: 'openid profile email',
  strictDiscoveryDocumentValidation: false,
  showDebugInformation: true
};
