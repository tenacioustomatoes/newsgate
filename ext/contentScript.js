$(document).ready(function() {
  
  $('a').hoverIntent(function() {
    var hoverUrl = $(this).attr('href').match(/page=(.*)/)[1];
    var popover = $('a').attr('data-toggle', 'popover').popover({
        container: 'body',
        content: loading,
        trigger: 'hover',
        placement: 'auto top'
      });
    
    $.ajax({
      url: 'http://localhost:8000/api/popover',
      type: 'POST',
      data: {'url': hoverUrl},
      dataType: 'json'
    })

    .done(function(json) {



      // $('a').attr('data-toggle', 'popover').popover({
      //   container: 'body',
      //   content: ENTER_JSON_DATA_HERE,
      //   trigger: 'hover',
      //   placement: 'auto top'
      // });
    })

    .fail(function() {

    });
  });
});



// TODOS:
  // delay popup: http://cherne.net/brian/resources/jquery.hoverIntent.html
  // initial popup with 'analyzing'
  // replace 'analyzing' with data
