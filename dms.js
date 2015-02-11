$(document).ready(function() {

  var input = [];



  $('#file_upload').on('change', function () {

    var merge_sorter = new Worker("sorter.js");

    merge_sorter.onmessage = function(e) {
      $("#output-box").append('<p>Done!</p>');
      if (e.data.length > 100) {
        console.log(e.data);
        $("#output-box").append('<p>See console.</p>');
      } else {
        $("#output-box").append('<p>' + e.data.toString() + '</p>');
      }
    };

    merge_sorter.onerror = function(e) {
      $("#output-box").append([
        'Error in Line ', e.lineno, ' of ', e.target.name , ': ', e.message
      ].join(''));
    };

    var dataFile = $(this)[0].files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      input = e.target.result.split("\n").map(Number);
      var threshold = Math.ceil(input.length / 8);
      merge_sorter.postMessage({data: input, threshold: threshold});
    };
    reader.readAsText(dataFile);

  });


});
