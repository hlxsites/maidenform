// eslint-disable-next-line import/no-cycle
import {
  fetchPlaceholders,
  sampleRUM,
}
  from './lib-franklin.js';

const placeholders = await fetchPlaceholders();
const isProd = window.location.hostname.endsWith(placeholders.host);

const loadScript = (url, attrs) => {
  const head = document.querySelector('head');
  const script = document.createElement('script');
  script.src = url;
  if (attrs) {
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const attr in attrs) {
      script.setAttribute(attr, attrs[attr]);
    }
  }
  head.append(script);
  return script;
};

// OneTrust Cookies Consent Notice start

const otId = placeholders.onetrustid;
if (otId) {
  const cookieScript = loadScript('https://cdn.cookielaw.org/scripttemplates/otSDKStub.js');
  cookieScript.setAttribute('data-domain-script', `${otId}${isProd ? '' : '-test'}`);
  window.OptanonWrapper = () => {};
}

// OneTrust Cookies Consent Notice end

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here
