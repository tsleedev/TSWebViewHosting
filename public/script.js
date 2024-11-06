// Bridge 관련 이벤트 핸들러 설정
document.addEventListener("DOMContentLoaded", async function() {
    // 페이지 로딩 완료 후 실행될 코드
    // URL에서 쿼리 파라미터를 파싱하는 함수
    function getQueryParam(param) {
        var queryString = window.location.search.substring(1);
        var params = queryString.split("&");
        for (var i = 0; i < params.length; i++) {
            var pair = params[i].split("=");
            if (pair[0] == param) {
                return decodeURIComponent(pair[1]);
            }
        }
        return null;
    }
    
    // 'page' 쿼리 파라미터 값을 가져옴
    var page = getQueryParam("page");
    
    // 제목이 존재하면, 페이지 상단에 제목을 추가
    if (page) {
        var header = document.createElement("h1");
        header.textContent = "Page " + page;
        document.body.insertBefore(header, document.body.firstChild);
    } else {
        var header = document.createElement("h1");
        header.textContent = "Main Page";
        document.body.insertBefore(header, document.body.firstChild);
    }
});

/* Bridge 기능 */
document.getElementById("bridgeFirebaseScreenEvent").onclick = async function() {
    await screenEvent("스크린_테스트");
};

document.getElementById("bridgeFirebaseLogEvent").onclick = async function() {
    var message = {
        value: "파라미터",
    };
    await logEvent("이벤트_테스트", message);
};

document.getElementById("bridgeFirebaseSetUserProperty").onclick = async function() {
    await setUserProperty("Property_테스트", "PropertyValue");
};

document.getElementById("bridgeOpenPhoneSettings").onclick = async function() {
    try {
        await callNativeMethod('openPhoneSettings', {});
        onAppResponse("App Response: openPhoneSettings");
    } catch (error) {
        console.error('Open phone settings failed:', error);
    }
};

document.getElementById("bridgeShowTabBar").onclick = async function() {
    try {
        await toggleTabBar(true);
    } catch (error) {
        console.error('Show TabBar failed:', error);
    }
};

document.getElementById("bridgeHideTabBar").onclick = async function() {
    try {
        await toggleTabBar(false);
    } catch (error) {
        console.error('Hide TabBar failed:', error);
    }
};

// 클릭 이벤트 핸들러 
document.getElementById("bridgeEnableIOSSwipeGesture").onclick = async function() {
    try {
        await toggleIOSSwipeGesture(true);
    } catch (error) {
        console.error('Enable iOS SwipeGesture failed:', error);
    }
};

document.getElementById("bridgeDisableIOSSwipeGesture").onclick = async function() {
    try {
        await toggleIOSSwipeGesture(false);
    } catch (error) {
        console.error('Disable iOS SwipeGesture failed:', error);
    }
};

/* 기본 브라우저 기능 */
document.getElementById("tapOpenAndCloseWindow").onclick = async function() {
    let newUrl = openNextPageInNewWindow();
    window.open(newUrl, '_blank');
    setTimeout(function() {
        window.close();
    }, 1000); // 1000밀리초(1초) 후에 창 닫음
};

document.getElementById("tapOpenWindow").onclick = async function() {
    let newUrl = openNextPageInNewWindow();
    window.open(newUrl, '_blank');
};

document.getElementById("tapOpenWindowModal").onclick = async function() {
    let newUrl = openNextPageInNewWindow() + "&appmode=modal"
    window.open(newUrl, '_blank');
};

document.getElementById("tapOpenWindowExternal").onclick = async function() {
    window.open('https://www.google.com', '_blank');
};

document.getElementById("btnNavigatePageHideTabBar").onclick = async function() {
    try {
        await toggleTabBar(false);
        let newUrl = openNextPageInNewWindow()
        window.location.href = newUrl;
    } catch (error) {
        console.error('Page navigation with hide tabbar failed:', error);
    }
};

document.getElementById("tapCloseWindow").onclick = async function() {
    window.close();
};

document.getElementById("tapCloseParentWindow").onclick = async function() {
    if (window.opener) {
        window.opener.close();
    } else {
        alert("No opener available");
    }
};

// document.getElementById("tapOpenPopupWindow").onclick = function() {
//     window.open('popupHtml.html', '_blank');
// };

document.getElementById("tapLocationReload").onclick = async function() {
    location.reload();
};

document.getElementById("tapGetUserAgent").onclick = async function() {
    var userAgent = navigator.userAgent;
    alert(userAgent);
};

document.getElementById("tapShowAlert").onclick = async function() {
    alert("Alert 테스트");
};

document.getElementById("tapShowConfirm").onclick = async function() {
    if (confirm("이 작업을 계속 진행하시겠습니까?")) {
        setTimeout(async function() {
            alert("작업을 계속 진행합니다.");
        }, 500);
    } else {
        setTimeout(async function() {
            alert("작업을 취소합니다.");
        }, 500);
    }
};

// 부모에게 값 전달
document.getElementById("tapSendMessageToParent").onclick = async function() {
    setParentText();
};

document.getElementById('tapCheckPermissionCamera').onclick = async function() {
    try {
        const state = await checkCameraPermission();
        if (state === 'granted') {
            alert('카메라 접근 권한이 허용되었습니다.');
        } else if (state === 'prompt') {
            alert('카메라 접근 권한이 prompt.');
        }
    } catch (error) {
        console.error('Camera permission check failed:', error);
    }
};

/* Function */
function openNextPageInNewWindow() {
    // 현재 URL에서 페이지 번호 추출
    function getQueryParam(param) {
        var queryString = window.location.search.substring(1);
        var params = queryString.split("&");
        for (var i = 0; i < params.length; i++) {
            var pair = params[i].split("=");
            if (pair[0] === param) {
                return decodeURIComponent(pair[1]);
            }
        }
        return null;
    }

    // 'page' 쿼리 파라미터 값 추출 및 다음 페이지 번호 계산
    var currentPage = getQueryParam("page");
    var nextPage = currentPage ? Number(currentPage) + 1 : 1;  // 페이지 정보가 없으면 기본값으로 1로 설정

    // 새 창에서 다음 페이지 URL 열기
    var baseUrl = window.location.href.split('?')[0];
    var newUrl = baseUrl + "?page=" + nextPage;
    return newUrl
}

// show/hide tabbar
let isTabBarVisible = true;

async function toggleTabBar(visible) {
    // 현재 상태와 같으면 불필요한 호출 방지
    if (isTabBarVisible === visible) {
        onAppResponse(`TabBar is already ${visible ? 'visible' : 'hidden'}`);
        return;
    }
    
    try {
        const response = await callNativeMethod('setTabBarVisible', {
            visible: visible
        });
        isTabBarVisible = visible;
        onAppResponse(`TabBar ${visible ? 'shown' : 'hidden'}`);
        return response;
    } catch (error) {
        console.error('Failed to toggle TabBar:', error);
        onAppResponse('Failed to toggle TabBar:', error);
        throw error;
    }
}

// iOS swipe gesture toggle
let isIOSSwipeEnabled = true;

async function toggleIOSSwipeGesture(enabled) {
    if (!(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.setSwipeGestureEnabled)) {
       console.log('iOS SwipeGesture is not supported in this environment');
       onAppResponse('iOS SwipeGesture is not supported in this environment');
       return;
    }
    if (isIOSSwipeEnabled === enabled) {
        onAppResponse(`iOS swipe gesture is already ${enabled ? 'enabled' : 'disabled'}`);
        return;
    }

    try {
        const response = await callNativeMethod('setSwipeGestureEnabled', {
            enabled: enabled
        });
        isIOSSwipeEnabled = enabled;
        onAppResponse(`iOS SwipeGesture ${enabled ? 'enabled' : 'disabled'}`);
        return response;
    } catch (error) {
        console.error('Failed to toggle iOS SwipeGesture:', error);
        onAppResponse('Failed to toggle iOS SwipeGesture:', error);
        throw error;
    }
}

// Promise 기반 브릿지 래퍼 함수
function callNativeMethod(methodName, message = {}) {
    return new Promise((resolve, reject) => {
        callPlatformSpecificMethod(methodName, message, (response) => {
            if (response && response.error) {
                reject(response.error);
            } else {
                resolve(response);
            }
        });
    });
}

// bridge
function callPlatformSpecificMethod(methodName, message, callback) {
    if (callback) {
        const callbackId = 'cb_' + new Date().getTime();
        message.callbackId = callbackId;
        // 콜백 함수를 글로벌로 설정
        window[callbackId] = function(response) {
            onAppResponse(callbackId);
            callback(response);
            delete window[callbackId];
        };
    }
    
    resetMessage()
    if (window.Android) {
        // Android 인터페이스 호출
        if (typeof window.Android[methodName] === 'function') {
            window.Android[methodName](JSON.stringify(message));
            return
        }
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers[methodName]) {
        // iOS 인터페이스 호출
        window.webkit.messageHandlers[methodName].postMessage(message);
        return
    } 
    
    // 플랫폼 인터페이스를 찾을 수 없음
    if (callback) {
        callback({ error: "No native " + methodName + " method found." });
    } else {
        alert("No native " + methodName + " method found.");
    }
}

// 앱에서 javascript로 응답 확인용
function resetMessage() {
    var messageContainer = document.getElementById('message-container');
    messageContainer.innerText = '응답 대기';
}

function onAppResponse(message) {
    var messageContainer = document.getElementById('message-container');
    messageContainer.innerText = message;
}

// 부모와 자식 간의 통신
window.addEventListener("message", async (event) => {
    var messageContainer = document.getElementById('message-container');
    messageContainer.innerText = event.data;
}, false);

async function setParentText() {
    if (window.opener) {
        window.opener.postMessage("자식에서 전달", "*");
    } else {
        throw new Error("No opener available");
    }
}

// Firebase
async function screenEvent(name, parameters) {
    if (!name) return;
    
    var message = {
        name: name,
        parameters: parameters
    };
    
    return await callNativeMethod('screenEvent', message);
}

async function logEvent(name, parameters) {
    if (!name) return;
    
    var message = {
        name: name,
        parameters: parameters
    };
    
    return await callNativeMethod('logEvent', message);
}

async function setUserProperty(name, value) {
    if (!name || !value) return;
    
    var message = {
        name: name,
        value: value
    };
    
    return await callNativeMethod('setUserProperty', message);
}

// 페이지 로딩 시 또는 특정 동작을 할 때 권한 상태 확인
function checkCameraPermission() {
    return navigator.permissions.query({ name: 'camera' })
        .then((permissionStatus) => permissionStatus.state)
        .catch((error) => {
            throw new Error('카메라 권한 상태 확인 오류: ' + error);
        });
}

// 앱에서 호출
function onAppBackground() {
    // 앱이 백그라운드로 전환될 때 실행할 코드
    onAppResponse("App has entered the background");
}

function onAppForeground() {
    // 앱이 포어그라운드로 전환될 때 실행할 코드
    onAppResponse("App has entered the foreground");
}
