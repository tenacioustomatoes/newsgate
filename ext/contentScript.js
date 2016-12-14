$(document).ready(function() {
  
  $('a').hover(function() {
    var hoverUrl = $(this).attr('href').match(/page=(.*)/)[1];
    $.ajax({
      url: 'http://localhost:8000/api/popover',
      type: 'POST',
      data: {'url': hoverUrl},
      dataType: 'json'
    })

    .done(function(json) {
      $('a').attr('data-toggle', 'popover').popover({
        container: 'body',
        content: ENTER_JSON_DATA_HERE,
        trigger: 'hover',
        placement: 'auto top'
      });
    })

    .fail(function() {

    });
  });
});



// TODOS:
  // delay popup: http://cherne.net/brian/resources/jquery.hoverIntent.html
  // initial popup with 'analyzing'
  // replace 'analyzing' with data
