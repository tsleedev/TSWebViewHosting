// Bridge 관련 이벤트 핸들러 설정
document.addEventListener("DOMContentLoaded", function() {
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
document.getElementById("bridgeFirebaseLogScreen").onclick = function() {
    firebaseLogScreen("스크린_테스트");
};

document.getElementById("bridgeFirebaseLogEvent").onclick = function() {
    var message = {
        value: "파라미터",
    };
    firebaseLogEvent("이벤트_테스트", message);
};

document.getElementById("bridgeFirebaseSetUserProperty").onclick = function() {
    firebaseSetUserProperty("Property_테스트", "PropertyValue");
};

document.getElementById("bridgeRevealSettings").onclick = function() {
    callPlatformSpecificMethod('revealSettings', {}, function(response) {
        onAppResponse("App Response: revealSettings");
    });
};

document.getElementById("bridgeOpenPhoneSettings").onclick = function() {
    callPlatformSpecificMethod('openPhoneSettings', {}, function(response) {
        onAppResponse("App Response: openPhoneSettings");
    });
};


/* 기본 브라우저 기능 */
document.getElementById("tapOpenAndCloseWindow").onclick = function() {
    openNextPageInNewWindow()
    setTimeout(function() {
        window.close();
    }, 1000); // 1000밀리초(1초) 후에 창 닫음
};

document.getElementById("tapOpenWindow").onclick = function() {
    openNextPageInNewWindow()
};

document.getElementById("tapOpenWindowPlayStore").onclick = function() {
    window.open('https://play.google.com/store/apps/details?id=com.google.android.googlequicksearchbox', '_blank');
};

document.getElementById("tapOpenWindowAppStore").onclick = function() {
    window.open('https://apps.apple.com/us/app/google/id284815942', '_blank');
};

document.getElementById("tapCloseWindow").onclick = function() {
    window.close();
};

document.getElementById("tapCloseParentWindow").onclick = function() {
    if (window.opener) {
        window.opener.close();
    } else {
        alert("No opener available");
    }
};

document.getElementById("tapOpenPopupWindow").onclick = function() {
    window.open('popupHtml.html', '_blank');
};

document.getElementById("tapGetUserAgent").onclick = function() {
    var userAgent = navigator.userAgent;
    alert(userAgent);
};

document.getElementById("tapShowAlert").onclick = function() {
    alert("Alert 테스트");
};

document.getElementById("tapShowConfirm").onclick = function() {
    if (confirm("이 작업을 계속 진행하시겠습니까?")) {
        setTimeout(function() {
            alert("작업을 계속 진행합니다.");
        }, 500); // 500밀리초(0.5초) 후에 alert 실행
    } else {
        setTimeout(function() {
            alert("작업을 취소합니다.");
        }, 500); // 500밀리초(0.5초) 후에 alert 실행
    }
};

// 부모에게 값 전달
document.getElementById("tapSendMessageToParent").onclick = function() {
    setParentText();
};

document.getElementById('tapCheckPermissionCamera').onclick = function() {
//    alert("작업을 취소합니다.");
    checkCameraPermission((state) => { // 화살표 함수를 사용한 콜백
//        alert('camera permission state is ' + state);
        if (state === 'granted') {
            alert('카메라 접근 권한이 허용되었습니다.');
            // 카메라 접근 권한이 허용된 경우의 로직
        } else if (state === 'prompt') {
            alert('카메라 접근 권한이 prompt.');
        }
    });
//    document.getElementById('cameraInput').click(); // input[type=file] 트리거
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
    window.open(newUrl, '_blank');
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
    if (window.AnalyticsWebInterface) {
        // Android 인터페이스 호출
        if (typeof window.AnalyticsWebInterface[methodName] === 'function') {
            window.AnalyticsWebInterface[methodName](JSON.stringify(message));
        }
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers[methodName]) {
        // iOS 인터페이스 호출
        window.webkit.messageHandlers[methodName].postMessage(message);
    } else {
        // 플랫폼 인터페이스를 찾을 수 없음
        if (callback) {
            callback({ error: "No native " + methodName + " method found." });
        } else {
            alert("No native " + methodName + " method found.");
        }
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
window.addEventListener("message", (event) => {
    var messageContainer = document.getElementById('message-container');
    messageContainer.innerText = event.data;
}, false);

function setParentText() {
    if (window.opener) {
        window.opener.postMessage("자식에서 전달", "*"); // 최대한 안전을 위해 '*' 대신 정확한 부모 URL 사용
    } else {
        alert("No opener available");
    }
}

// Firebase
function firebaseLogScreen(name) {
    if (!name) {
        return;
    }
    
    var message = {
        screenName: name,
    };
    
    callPlatformSpecificMethod('firebaseLogScreen', message);
}

function firebaseLogEvent(name, params) {
    if (!name) {
        return;
    }
    
    var message = {
        eventName: name,
        param: params
    };
    
    callPlatformSpecificMethod('firebaseLogEvent', message);
}

function firebaseSetUserProperty(name, value) {
    if (!name || !value) {
        return;
    }
    
    var message = {
        name: name,
        value: value
    };
    
    callPlatformSpecificMethod('firebaseSetUserProperty', message);
}

// 페이지 로딩 시 또는 특정 동작을 할 때 권한 상태 확인
function checkCameraPermission(onPermissionChecked) {
    navigator.permissions.query({ name: 'camera' })
        .then((permissionStatus) => { // 여기서 화살표 함수 사용
            // 클로저를 통해 permissionStatus.state를 외부 함수에 전달
            onPermissionChecked(permissionStatus.state);
        })
        .catch(function(error) {
            alert('카메라 권한 상태 확인 오류: ' + error);
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
