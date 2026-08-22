importScripts('url-match.js');

var cleanupAlarmName = 'scan-auth-success-tabs';
var closeQueue = new Set();
var isProcessingCloseQueue = false;

function injectChecker(tabId) {
	chrome.scripting.executeScript(
		{
			target: { tabId: tabId },
			files: ['url-match.js', 'content.js'],
		},
		function() {
			chrome.runtime.lastError;
		},
	);
}

function scanOpenTabs() {
	chrome.tabs.query({}, function(tabs) {
		tabs.forEach(function(tab) {
			if (typeof tab.id === 'number' && isWatchedAuthUrl(tab.url)) {
				injectChecker(tab.id);
			}
		});
	});
}

function scheduleCleanupAlarm() {
	chrome.alarms.create(cleanupAlarmName, { periodInMinutes: 1 });
}

function requestTabClose(tabId) {
	closeQueue.add(tabId);
	processCloseQueue();
}

function processCloseQueue() {
	if (isProcessingCloseQueue) {
		return;
	}

	isProcessingCloseQueue = true;
	closeNextQueuedTab();
}

function closeNextQueuedTab() {
	var next = closeQueue.values().next();
	if (next.done) {
		isProcessingCloseQueue = false;
		return;
	}

	var tabId = next.value;
	closeQueue.delete(tabId);

	chrome.tabs.query({}, function(tabs) {
		var tabStillExists = tabs.some(function(tab) {
			return tab.id === tabId;
		});

		if (!tabStillExists) {
			closeNextQueuedTab();
			return;
		}

		if (tabs.length <= 1) {
			isProcessingCloseQueue = false;
			return;
		}

		chrome.tabs.remove(tabId, function() {
			chrome.runtime.lastError;
			closeNextQueuedTab();
		});
	});
}

chrome.runtime.onMessage.addListener((message, sender) => {
	if (
		!message ||
		message.type !== 'close-auth-success-tab' ||
		!sender.tab ||
		typeof sender.tab.id !== 'number'
	) {
		return;
	}

	requestTabClose(sender.tab.id);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (changeInfo.status === 'complete' && isWatchedAuthUrl(tab.url)) {
		injectChecker(tabId);
	}
});

chrome.runtime.onInstalled.addListener(function() {
	scheduleCleanupAlarm();
	scanOpenTabs();
});

chrome.runtime.onStartup.addListener(function() {
	scheduleCleanupAlarm();
	scanOpenTabs();
});

chrome.alarms.onAlarm.addListener(function(alarm) {
	if (alarm.name === cleanupAlarmName) {
		scanOpenTabs();
	}
});

scheduleCleanupAlarm();
scanOpenTabs();
