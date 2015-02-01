$(document).ready(function() {

  var worker1;
  var worker2;

  $(".controls").on("click", "#run-button", function() {

    var task1 = new Blob([$("#worker1").val()]);
    var task2 = new Blob([$("#worker2").val()]);
    var url1 = window.URL.createObjectURL(task1);
    var url2 = window.URL.createObjectURL(task2);

    if (worker1 != null || worker2 != null) {
      worker1.terminate();
      worker2.terminate();
    };
    worker1 = new Worker(url1);
    worker2 = new Worker(url2);
    worker1.name = 'Worker 1';
    worker2.name = 'Worker 2';
    $("#output-box").prepend('<hr>');

    worker1.onmessage = function(e) {
      $("#output-box").prepend('<p>' + e.data + '</p>');
    }

    worker2.onmessage = function(e) {
      $("#output-box").prepend('<p>' + e.data + '</p>');
    }

    function onError(e) {
      $("#output-box").prepend('<p>' + [
        'Error in Line ', e.lineno, ' of ', e.target.name , ': ', e.message
      ].join('') + '</p>');
    }
    worker1.addEventListener('error', onError, false);
    worker2.addEventListener('error', onError, false);

  }).on("click", "#stop-button", function() {

    $("#output-box").prepend('<p>Workers terminated.</p>');
    worker1.terminate();
    worker2.terminate();

  }).on("click", "#clear-output-button", function() {

    $("#output-box").empty();
    
  });
});
