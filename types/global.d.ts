declare global {
  interface Window {
    recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  }
}
export {};
declare global {
  interface Window {
    [key: string]: any;
  }
}
