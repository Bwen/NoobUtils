if (typeof jQuery == 'undefined') {
    throw new Error('This library requires JQuery library!');
}

var jquery_version = jQuery.fn.jquery.split('.');
if (jquery_version[0] < 1  || (jquery_version[0] == 1 && jquery_version[1] < 6)) {
    throw new Error('This library requires JQuery version 1.6+');
}

var loadedFiles = {}, noobLoaderInitialized = false, initBuffer = [];
function NoobLoad(files, callback) {
    initBuffer.push([files, callback]);
}

function NoobLoadInit(files, callback) {
    var head, files, allLoadedAlready = 0, indexesLoaded = [], loadCallback, loadTimeout = null;

    // make it so we can accept an array or a single string
    files = [].concat( files );

    for (var i=0; i < files.length; i++) {
        if (loadedFiles.hasOwnProperty(files[i])) {
            allLoadedAlready++;
        }
    }

    if (files.length == allLoadedAlready) {
        if (typeof callback == 'function') {
            callback();
        }

        return;
    }

    loadTimeout = setTimeout(function () {
        var failedFiles = [];
        for (var i=0; i < files.length; i++) {
            if (indexesLoaded.indexOf(i) === -1) {
                failedFiles.push(files[i]);
            }
        }
        console.error('Could not load the following files:', failedFiles);
    }, 3000);

    loadCallback = function (index) {
        indexesLoaded.push(index);
        if (files.length == indexesLoaded.length) {
            if (typeof callback == 'function') {
                callback();
            }
            clearTimeout(loadTimeout);
        }
    };

    var head = document.getElementsByTagName('head')[0]
    for (var i=0; i < files.length; i++) {

        // if we already loaded this class we callback right away and continue,
        // avoid duplicate <script> tags for the same file
        if (loadedFiles.hasOwnProperty(files[i])) {
            loadCallback(i);
            continue;
        }

        var element = document.createElement('script');
        element.type = 'text/javascript';
        element.src = files[i]+(!files[i].match(/\.js$/i) ? '.js' : '');

        (function (index) {
            element.onreadystatechange = function () {
                if (this.readyState == 'complete') {
                    loadCallback(index);
                }
            };
        })(i);

        (function (index) {
            element.onload = function () {
                loadCallback(index);
            }
        })(i);
        head.appendChild(element);

        loadedFiles[ files[i] ] = true;
    }
}

NoobLoadInit($('[data-jsinit]')[0].getAttribute('data-jsinit'), function () {
    var bufferInterval = setInterval(function () {
        if (noobLoaderInitialized) {
            NoobLoad = NoobLoadInit;
            NoobLoadInit = null;

            if (initBuffer.length > 0) {
                for (var i=0; i < initBuffer.length; i++) {
                    NoobLoad(initBuffer[i][0], initBuffer[i][1]);
                }

                initBuffer = [];
            }
            clearInterval(bufferInterval);
        }
    }, 100);
});
