function parseQuerystring(string) {
    if (string == '' || string == undefined) {
        return {};
    }

    var obj = {}
      , pairs = string.split('&');
    
    $.each(pairs, function(i, v){
        var pair = v.split('='), value = pair[1];
      
        if (value.match(/^\d+$/)) {
            value = parseFloat(value);
        }
        else if (value.match(/^true$/i)) {
            value = true;
        }
        else if (value.match(/^false$/i)) {
            value = false;
        }
        else if (value.match(/^null$/i)) {
            value = null;
        }

        obj[pair[0]] = value;
    });
    return obj;
};

function getCookie(name) {
  var rawCookies = document.cookie.split(';');
  for (var i=0; i < rawCookies.length; i++) {
    var keyValue = rawCookies[i].split('=');
    if (keyValue[0] == name) {
      return keyValue[1];
    }
  }
  return null;
};

function ucfirst (str) {
    str += '';
    var f = str.charAt(0).toUpperCase();
    return f + str.substr(1);
};

function removeDupes(arr) {
    var nonDupes = [];
    arr.forEach(function(value) {
        if (nonDupes.indexOf(value) == -1) {
            nonDupes.push(value);
        }
    });
    return nonDupes;
};

function inherits (subClass, baseClass) {
    function inheritance() {}
    inheritance.prototype = baseClass.prototype;

    subClass.prototype = new inheritance();
    subClass.prototype.constructor = subClass;
};

function MergeRecursive(obj1, obj2) {
    for (var p in obj2) {
        try {
            // Property in destination object set; update its value.
            if ( obj2[p].constructor==Object ) {
                obj1[p] = MergeRecursive(obj1[p], obj2[p]);
            }
            else {
                obj1[p] = obj2[p];
            }
        }
        catch(e) {
            // Property in destination object not set; create it and set its value.
            obj1[p] = obj2[p];
        }
    }

    return obj1;
}

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}


if ('undefined' == typeof window) {
    module.exports.MergeRecursive = MergeRecursive;
    module.exports.removeDupes = removeDupes;
    module.exports.inherits = inherits;
}
