$(document).ready(function() {
  $('a').hover(
    function(event) {
      var href = $('a').attr('href');
      alert(href);
    });
});