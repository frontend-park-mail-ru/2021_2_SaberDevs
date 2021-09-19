const ajaxMethods = {
    post: 'POST',
    get: 'GET'
};

const ajaxStatuses = {
    ok: 200,
    notFound: 404,
    redirect: 303,
    badRequest: 400,
};

function ajax(requestParams) {
    const {method = ajaxMethods.get, url = '/', body = null, callback = () => {}} = requestParams;
    if (ajaxDebug) {
        console.log("ajax request: " + JSON.stringify(requestParams));
    }

    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);  // true means async
    xhr.withCredentials = true;  // true means CORS

    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }

        if (ajaxDebug) console.log("ajax resolved: " + xhr.status, ": " + xhr.responseText);
        callback(xhr.status, xhr.responseText);
    });

    if (body) {
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        xhr.send(JSON.stringify(body));
        return;
    }

    xhr.send();
}

function ajaxGet(requestParams) {
    return ajax({method: ajaxMethods.get, ...requestParams});
}

function ajaxPost(requestParams) {
    return ajax({method: ajaxMethods.post, ...requestParams});
}

const Ajax = {
    AJAX_METHODS: ajaxMethods,
    STATUS: ajaxStatuses,
    get: ajaxGet,
    post: ajaxPost
};

export default Ajax;
