# Two-step Auth Auto-Close

Browser extension version `0.5` for Chrome/Edge.

It automatically closes successful auth tabs for:

- `http://keriovpn.devfactory.local/*`
- `http://10.212.255.245:4080/*`
- `http://localhost:<any-port>/*callback*`
- `http://127.0.0.1:<any-port>/*callback*`

AWS/local callback pages close only when the visible page text includes `You can close` or `You may close`, and a success marker such as `successful`, `Request approved`, or `has been given requested permissions`.

The extension will not close the auth tab if it is the last remaining tab across the browser session. If multiple auth tabs are opened at once, it closes them sequentially and leaves one tab open only when closing all of them would exit the browser.

The background worker also scans existing matching tabs after startup and periodically, which helps clean up auth tabs that were opened while the laptop or browser was suspended.

## Install Unpacked

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
