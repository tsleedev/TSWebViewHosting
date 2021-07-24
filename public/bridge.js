function isAndroid() {
    return !!window.tswebview;
}

function isIOS() {
    return !!window.webkit && !!window.webkit.messageHandlers;
}

function reload() {
    location.reload();
}

function alertTest() {
    alert('alert popup');
}

function confirmTest() {
    confirm('confirm popup');
}

function openNewWebViewWithPath() {
    var params = {
        path: "/next.html"
    }
    if (isAndroid() && !!window.tswebview.openNewWebView) {
        // Call Android interface
        window.tswebview.openNewWebView(JSON.stringify(params));
    } else if (isIOS() && !!window.webkit.messageHandlers.openNewWebView) {
        // Call iOS interface
        window.webkit.messageHandlers.openNewWebView.postMessage(params);
    } else {
        // No Android or iOS interface found
        alert("No openNewWebView APIs found.");
    }
}

function openNewWebViewWithUrl() {
    var params = {
        url: "https://tswebviewhosting.web.app/next.html"
    }
    if (isAndroid() && !!window.tswebview.openNewWebView) {
        // Call Android interface
        window.tswebview.openNewWebView(JSON.stringify(params));
    } else if (isIOS() && !!window.webkit.messageHandlers.openNewWebView) {
        // Call iOS interface
        window.webkit.messageHandlers.openNewWebView.postMessage(params);
    } else {
        // No Android or iOS interface found
        alert("No openNewWebView APIs found.");
    }
}

function closeWebView() {
    if (isAndroid() && !!window.tswebview.closeWebView) {
        // Call Android interface
        window.tswebview.closeWebView(JSON.stringify(''));
    } else if (isIOS() && !!window.webkit.messageHandlers.closeWebView) {
        // Call iOS interface
        window.webkit.messageHandlers.closeWebView.postMessage('');
    } else {
        // No Android or iOS interface found
        alert("No closeWebView APIs found.");
    }
}

function goBack() {
    if (isAndroid() && !!window.tswebview.goBack) {
        // Call Android interface
        window.tswebview.goBack(JSON.stringify(''));
    } else if (isIOS() && !!window.webkit.messageHandlers.goBack) {
        // Call iOS interface
        window.webkit.messageHandlers.goBack.postMessage('');
    } else {
        // No Android or iOS interface found
        alert("No goBack APIs found.");
    }
}

function openExternalWebView() {
    var params = {
        url: "https://www.instagram.com/dlwlrma/?hl=ko"
        // url: "https://tswebviewhosting.web.app"
    }
    if (isAndroid() && !!window.tswebview.openExternalWebView) {
        // Call Android interface
        window.tswebview.openExternalWebView(JSON.stringify(params));
    } else if (isIOS() && !!window.webkit.messageHandlers.openExternalWebView) {
        // Call iOS interface
        window.webkit.messageHandlers.openExternalWebView.postMessage(params);
    } else {
        // No Android or iOS interface found
        alert("No openExternalWebView APIs found.");
    }
}

function outlink() {
    var params = {
        url: "https://www.instagram.com/dlwlrma/?hl=ko"
        // url: "https://tswebviewhosting.web.app"
    }
    if (isAndroid() && !!window.tswebview.outlink) {
        // Call Android interface
        window.tswebview.outlink(JSON.stringify(params));
    } else if (isIOS() && !!window.webkit.messageHandlers.outlink) {
        // Call iOS interface
        window.webkit.messageHandlers.outlink.postMessage(params);
    } else {
        // No Android or iOS interface found
        alert("No outlink APIs found.");
    }
}

function screenEvent(name) {
    if (!name) { return; }
    var message = {
        name: name
    }
    if (isAndroid() && !!window.tswebview.screenEvent) {
        // Call Android interface
        window.tswebview.screenEvent(JSON.stringify(message));
    } else if (isIOS() && window.webkit.messageHandlers.screenEvent) {
        // Call iOS interface
        window.webkit.messageHandlers.screenEvent.postMessage(message);
    } else {
        // No Android or iOS interface found
        alert("No screenEvent APIs found.");
    }
}

function logEvent(name) {
    if (!name) { return; }
    var message = {
        name: name
    }
    if (isAndroid() && !!window.tswebview.logEvent) {
        // Call Android interface
        window.tswebview.logEvent(JSON.stringify(message));
    } else if (isIOS() && window.webkit.messageHandlers.logEvent) {
        // Call iOS interface
        window.webkit.messageHandlers.logEvent.postMessage(message);
    } else {
        // No Android or iOS interface found
        alert("No logEvent APIs found.");
    }
}

function setUserProperty(name, value) {
    if (!name || !value) { return; }
    var message = {
        name: name,
        value: value
    };
    if (isAndroid() && !!window.tswebview.setUserProperty) {
        // Call Android interface
        window.tswebview.setUserProperty(JSON.stringify(message));
    } else if (isIOS() && window.webkit.messageHandlers.setUserProperty) {
        // Call iOS interface
        window.webkit.messageHandlers.setUserProperty.postMessage(message);
    } else {
        // No Android or iOS interface found
        alert("No setUserProperty APIs found.");
    }
}

document.getElementById("event1").addEventListener("click", function() {
    console.log("event1");
    logEvent("event1", { foo: "bar", baz: 123 });
});

document.getElementById("userprop").addEventListener("click", function() {
    console.log("userprop");
    setUserProperty("userprop", "custom_value");
});
