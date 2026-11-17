# Two-step Auth Auto-Close

Browser extension version `0.6.1` for Chrome/Edge.

Available on the [Chrome Web Store](https://chromewebstore.google.com/detail/two-step-auth-auto-close/kkeghgkmjniokodcklbhbmdnemlnnfeo).

It automatically closes successful HTTP and HTTPS auth tabs when any of these match:

- Hostname contains `vpn` or `local` (for example `keriovpn.companyname.local` or `localhost`)
- Host is a private/loopback IPv4 address (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.0/8`)
- Path contains `nonauth`, `saml`, `sso`, `login`, `logout`, `oauth`, `callback`, or `auth_success` (for example `/nonauth/totpVerify.cs`, `/+CSCOE+/saml_ac_login.html`, or gcloud's `/sdk/auth_success`)

Matching pages close when they show Kerio's `#customMessage` success state, GitHub's device activation success page (`/login/device/success` with `Your device is now connected`, including GitHub Enterprise hosts), or when the visible page text includes `You can close`, `You may close`, `You may now close`, or `You can return to the CLI` (mcporter), and a completion marker such as `successful`, `successfully authenticated`, `You are disconnected`, `You have logged into` (Azure CLI), `Request approved`, or `has been given requested permissions`. Detection also watches `.log-success` nodes and keeps a MutationObserver running so messages injected by JavaScript several seconds after load still close the tab.

The extension will not close the auth tab if it is the last remaining tab across the browser session. If multiple auth tabs are opened at once, it closes them sequentially and leaves one tab open only when closing all of them would exit the browser.

The background worker also scans existing matching tabs after startup and periodically, which helps clean up auth tabs that were opened while the laptop or browser was suspended.

## Install From the Chrome Web Store

Install from the [Chrome Web Store listing](https://chromewebstore.google.com/detail/two-step-auth-auto-close/kkeghgkmjniokodcklbhbmdnemlnnfeo). This is the recommended path — Chrome and Edge will keep the extension up to date automatically.

## Install Unpacked (for development)

1. Clone this repository:
   ```sh
   git clone https://github.com/ignitetech-group/two-step-auth-auto-close.git
   ```
2. Open `chrome://extensions` or `edge://extensions`.
3. Enable developer mode.
4. Click **Load unpacked**.
5. Select the cloned `two-step-auth-auto-close` folder.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

[MIT](LICENSE) © Ignite Enterprise Software Solutions, LLC
