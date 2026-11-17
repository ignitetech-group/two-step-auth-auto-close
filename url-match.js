function isPrivateOrLoopbackIPv4(hostname) {
	var match = String(hostname || '').match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
	if (!match) {
		return false;
	}

	var a = Number(match[1]);
	var b = Number(match[2]);
	var c = Number(match[3]);
	var d = Number(match[4]);

	if (a > 255 || b > 255 || c > 255 || d > 255) {
		return false;
	}

	if (a === 10 || a === 127) {
		return true;
	}

	if (a === 192 && b === 168) {
		return true;
	}

	return a === 172 && b >= 16 && b <= 31;
}

function isWatchedAuthUrl(urlText) {
	if (!urlText) {
		return false;
	}

	var url;
	try {
		url = new URL(urlText);
	} catch (error) {
		return false;
	}

	if (url.protocol !== 'http:' && url.protocol !== 'https:') {
		return false;
	}

	var hostname = url.hostname.toLowerCase();
	var pathname = url.pathname.toLowerCase();

	if (hostname.indexOf('vpn') !== -1 || hostname.indexOf('local') !== -1) {
		return true;
	}

	var pathMarkers = ['nonauth', 'saml', 'sso', 'login', 'logout', 'oauth', 'callback', 'auth_success'];
	for (var i = 0; i < pathMarkers.length; i++) {
		if (pathname.indexOf(pathMarkers[i]) !== -1) {
			return true;
		}
	}

	return isPrivateOrLoopbackIPv4(hostname);
}
