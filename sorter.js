onmessage = function(e) {
  var data = e.data.data;
  var threshold = e.data.threshold;
  var length = data.length;

  function merge(left, right) {
    var combine = new Array(length);
    var i = 0;
    var j = 0;
    var k = 0;
    for (i = 0; i < length; i++) {
      if (j >= left.length) {
        combine[i] = right[k++];
      } else if (k >= right.length) {
        combine[i] = left[j++];
      } else if (left[j] > right[k]) {
        combine[i] = right[k++];
      } else {
        combine[i] = left[j++];
      }
    }
    return combine;
  }

  if (length <= threshold) {
    postMessage(data.sort(function(a, b) {
      return a - b;
    }));
  } else {

    var minion1 = new Worker("sorter.js");
    var minion2 = new Worker("sorter.js");

    var minion1_returned = false;
    var minion2_returned = false;

    var right = data;
    var left = right.splice(0, Math.floor(length / 2));

    minion1.onmessage = function(e) {
      left = e.data;
      minion1_returned = true;
      if (minion2_returned) {
        postMessage(merge(left, right));
        close();
      }
    };
    minion2.onmessage = function(e) {
      right = e.data;
      minion2_returned = true;
      if (minion1_returned) {
        postMessage(merge(left, right));
        close();
      }
    };

    function onError(e) {
      console.log([
        'Error in Line ', e.lineno, ' of ', e.target.name , ': ', e.message
      ].join(''));
    }

    minion1.onerror = onError;
    minion2.onerror = onError;

    minion1.postMessage({data: left, threshold: threshold});
    minion2.postMessage({data: right, threshold: threshold});
  }

};
