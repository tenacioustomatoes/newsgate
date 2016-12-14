$(document).ready(function() {
  $('a').attr('data-toggle', 'popover').popover({
    container: 'body',
    content: 'test',
    trigger: 'hover',
    placement: 'auto top'
  });
});

