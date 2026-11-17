(function() {
	'use strict';

	if (window.__twoStepAuthAutoCloseLoaded) {
		return;
	}

	if (!isWatchedAuthUrl(window.location.href)) {
		return;
	}

	window.__twoStepAuthAutoCloseLoaded = true;

	var closeMessage = { type: 'close-auth-success-tab' };
	var closeRequested = false;
	var maxChecks = 20;
	var observer = null;
	var intervalId = null;
	var debounceId = null;

	function closeWindow() {
		if (closeRequested) {
			return;
		}

		closeRequested = true;
		stopWatching();
		window.setTimeout(function() {
			chrome.runtime.sendMessage(closeMessage);
		}, 250);
	}

	function isKerioSuccessPage() {
		var el = document.getElementById('customMessage');
		var inp = document.getElementsByTagName('input');
		var frm = document.getElementsByTagName('form');

		return (el !== null) && (inp.length == 0) && (frm.length == 0);
	}

	function normalizeText(value) {
		return (value || '')
			.replace(/\s+/g, ' ')
			.trim()
			.toLowerCase();
	}

	function getPageText() {
		return normalizeText(document.body && document.body.innerText ? document.body.innerText : '');
	}

	function hasCloseTabPhrase(text) {
		return (
			text.indexOf('you can close') !== -1 ||
			text.indexOf('you may close') !== -1 ||
			text.indexOf('you can now close') !== -1 ||
			text.indexOf('you may now close') !== -1 ||
			text.indexOf('you can return to the cli') !== -1
		);
	}

	function hasAuthCompleteMarker(text) {
		return (
			text.indexOf('successful') !== -1 ||
			text.indexOf('request approved') !== -1 ||
			text.indexOf('has been given requested permissions') !== -1 ||
			text.indexOf('you are disconnected') !== -1 ||
			text.indexOf('you have logged into') !== -1
		);
	}

	function textLooksLikeAuthComplete(text) {
		return hasCloseTabPhrase(text) && hasAuthCompleteMarker(text);
	}

	function isSuccessfulClosePage() {
		if (new URLSearchParams(window.location.search).has('error')) {
			return false;
		}

		if (textLooksLikeAuthComplete(getPageText())) {
			return true;
		}

		var els = document.getElementsByClassName('log-success');
		for (var i = 0; i < els.length; i++) {
			if (textLooksLikeAuthComplete(normalizeText(els[i].innerText))) {
				return true;
			}
		}

		return false;
	}

	function isGitHubDeviceSuccessPage() {
		return (
			window.location.pathname === '/login/device/success' &&
			getPageText().indexOf('your device is now connected') !== -1
		);
	}

	function shouldCloseWindow() {
		return isKerioSuccessPage() || isGitHubDeviceSuccessPage() || isSuccessfulClosePage();
	}

	function stopWatching() {
		if (observer) {
			observer.disconnect();
			observer = null;
		}

		if (intervalId !== null) {
			window.clearInterval(intervalId);
			intervalId = null;
		}

		if (debounceId !== null) {
			window.clearTimeout(debounceId);
			debounceId = null;
		}
	}

	function tryClose() {
		if (!shouldCloseWindow()) {
			return false;
		}

		closeWindow();
		return true;
	}

	function scheduleCheck() {
		if (closeRequested || debounceId !== null) {
			return;
		}

		debounceId = window.setTimeout(function() {
			debounceId = null;
			tryClose();
		}, 100);
	}

	function startWatching() {
		if (tryClose()) {
			return;
		}

		if (document.documentElement) {
			observer = new MutationObserver(scheduleCheck);
			observer.observe(document.documentElement, {
				childList: true,
				subtree: true,
				characterData: true,
			});
		}

		var checkCount = 0;
		intervalId = window.setInterval(function() {
			checkCount += 1;

			if (tryClose() || checkCount >= maxChecks) {
				if (intervalId !== null) {
					window.clearInterval(intervalId);
					intervalId = null;
				}
			}
		}, 500);
	}

	startWatching();
})();
