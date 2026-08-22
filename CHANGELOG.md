# Changelog

## 0.6

- Added Cisco Secure Client VPN success/disconnect pages: close tabs that show `You have successfully authenticated. You may now close this browser tab.` or `You are disconnected. You may close this browser tab.`, including `.log-success` markup injected by JavaScript after the page has already loaded.
- Watch HTTP and HTTPS tabs when the hostname contains `vpn` or `local`, the host is a private/loopback IPv4 address (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.0/8`), or the path contains `nonauth`, `saml`, `sso`, `login`, `logout`, `oauth`, or `callback`.
- Keep a MutationObserver on matching tabs so late-rendered success copy is still detected after the short polling window ends.

## 0.5

- Migrated close handling into the background worker queue so simultaneous auth tabs close sequentially.
- Changed the last-tab safety check to count tabs across the whole browser session, leaving one tab only if closing all matching tabs would exit the browser.
- Added startup and periodic scans for already-open matching tabs, helping clean up auth tabs opened while the laptop or browser was suspended.

## 0.4

- Rebuilt the tool as a Chrome/Edge Manifest V3 browser extension. Prior versions were Tampermonkey userscripts.
- Added browser-extension tab closing via `chrome.tabs.remove`, making tab cleanup more reliable than `window.close()`.
- Added protection against closing the last browser tab.
- Added extension icons.

## 0.3

- Added support for AWS and local OAuth callback pages, including `10.212.255.245:4080`, `localhost`, and `127.0.0.1` callback URLs.
- Added success-page detection for pages that say `You can close` or `You may close` with success markers such as `successful`, `Request approved`, or `has been given requested permissions`.
- Prior versions were Kerio VPN only.

## 0.2

- Tampermonkey userscript for auto-closing successful Kerio VPN two-step auth windows.
