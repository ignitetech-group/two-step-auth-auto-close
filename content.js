(function() {
	'use strict';

	var closeMessage = { type: 'close-auth-success-tab' };
	var checkCount = 0;
	var closeRequested = false;
	var maxChecks = 20;

	function closeWindow() {
		if (closeRequested) {
			return;
		}

		closeRequested = true;
		window.setTimeout(function() {
			chrome.runtime.sendMessage(closeMessage);
		}, 250);
	}

	function isKerioSuccessPage() {
		if (window.location.hostname !== 'keriovpn.devfactory.local') {
			return false;
		}

		var el = document.getElementById('customMessage');
		var inp = document.getElementsByTagName('input');
		var frm = document.getElementsByTagName('form');

		return (el !== null) && (inp.length == 0) && (frm.length == 0);
	}

	function isAllowedAuthCallbackUrl() {
		var hostname = window.location.hostname;
		var pathname = window.location.pathname.toLowerCase();

		if (hostname === '10.212.255.245') {
			return window.location.port === '4080';
		}

		return (
			(hostname === 'localhost' || hostname === '127.0.0.1') &&
			pathname.indexOf('callback') !== -1
		);
	}

	function getPageText() {
		return (document.body && document.body.innerText ? document.body.innerText : '')
			.replace(/\s+/g, ' ')
			.trim()
			.toLowerCase();
	}

	function isSuccessfulClosePage() {
		if (new URLSearchParams(window.location.search).has('error')) {
			return false;
		}

		var text = getPageText();

		if (text.indexOf('you can close') === -1 && text.indexOf('you may close') === -1) {
			return false;
		}

		return (
			text.indexOf('successful') !== -1 ||
			text.indexOf('request approved') !== -1 ||
			text.indexOf('has been given requested permissions') !== -1
		);
	}

	function shouldCloseWindow() {
		return isKerioSuccessPage() || (isAllowedAuthCallbackUrl() && isSuccessfulClosePage());
	}

	function checkAndClose() {
		checkCount += 1;

		if (shouldCloseWindow()) {
			closeWindow();
			return true;
		}

		return checkCount >= maxChecks;
	}

	if (!checkAndClose()) {
		var intervalId = window.setInterval(function() {
			if (checkAndClose()) {
				window.clearInterval(intervalId);
			}
		}, 500);
	}
})();
