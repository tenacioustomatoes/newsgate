$(document).ready(function() {

  // create popover
  var gifUrl = chrome.extension.getURL("contentScriptAssets/spin.gif");
  $('a').attr('data-toggle', 'popover').popover({
    html: true,
    container: 'body',
    content: '<img class="gifLoading" src="' + gifUrl + '"/>',
    trigger: 'manual',
    placement: 'auto top'
  })
  // keep popover open while hovering over popover
  // and slight delay to popover hide
  .on('mouseenter', function () {
    var $context = $(this);
    $context.popover('show');
    $('.popover').on('mouseleave', function () {
      $context.popover('hide');
    });
  }).on('mouseleave', function () {
    var $context = $(this);
    setTimeout(function () {
      if (!$('.popover:hover').length) {
        $context.popover('hide');
      }
    }, 300);
  });

  $('a').hover(
    function(e) {
      var $context = $(this);
      var hoverUrl = $(this).attr('href');

      // retrieve popover content
      $.ajax({
        url: 'http://localhost:8000/api/popover',
        type: 'POST',
        data: {'url': hoverUrl},
        dataType: 'json'
      })

      .done(function(json) {
        console.log(json);
        content = '<div class="popoverContent">';

        // add report card to content
        content += '<p><a>View Report Card</a></p>';

        // add bias to content
        var leaningGifs = {
          Right: '<img class="gifLeaning" src="' + chrome.extension.getURL("contentScriptAssets/elephant.gif") + '"/>',
          Left: '<img class="gifLeaning" src="' + chrome.extension.getURL("contentScriptAssets/elephant.gif") + '"/>'
        };
        var leaning = json.bias.bias;
        content += '<p>' + 'Leaning: ' + '</p>' + leaningGifs[leaning];

        // add emotions to content
        var emotions = json.emotions.docEmotions;
        var emos = {};
        for (var emo in emotions) {
          console.log(emo, emotions[emo]);
          emos[emo] = emotions[emo] > 0.5;
        }
        content += '<p>' + 'Emotions: ';
        for (var emo in emos) {
          if (emos[emo]) {
            content += emo + ', ';
          }
        }
        if (content[content.length - 2] === ':') {
          content += 'N/A';
        } else {
          content = content.slice(0, -2) + '</p>';
        }

        // add sentiment to content
        var sentiment = json.sentiment.docSentiment.type;
        content += '<p>' + 'Sentiment: ' + sentiment + '</p>';
        content += '</div>';
        // console.log('content', content);

        // set content to popover
        $context.attr('data-content', content).data('bs.popover').setContent();
      })

      .fail(function() {
        console.log('post req failure');
      });
    }
  );

});


