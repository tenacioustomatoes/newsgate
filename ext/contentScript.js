$(document).ready(function() {

  $('a').attr('data-toggle', 'popover').popover({
    container: 'body',
    content: 'loading',
    trigger: 'hover',
    placement: 'auto top'
  });

  $('a').hover(
    function(e) {
      var hoverUrl = $(this).attr('href');
      var $context = $(this);

      $.ajax({
        url: 'http://localhost:8000/api/popover',
        type: 'POST',
        data: {'url': hoverUrl},
        dataType: 'json'
      })

      .done(function(json) {
        console.log(json);
        content = '';

        // add bias to content
        var bias = json.bias.bias;
        content += 'bias: ' + bias.toLowerCase();

        // add emotions to content
        var emotions = json.emotions.docEmotions;
        var emos = {};
        for (var emo in emotions) {
          console.log(emo, emotions[emo]);
          emos[emo] = emotions[emo] > 0.5;
        }

        content += '\n' + 'emotions: ';
        for (var emo in emos) {
          if (emos[emo]) {
            content += emo + ', ';
          }
        }

        if (content[content.length - 2] === ':') {
          content += 'N/A';
        } else {
          content = content.slice(0, -2);
        }

        // add sentiment to content
        var sentiment = json.sentiment.docSentiment.type;
        content += '\n' + 'sentiment: ' + sentiment;
        console.log(content);


        // console.log('content', content);

        $context.attr('data-content', content).data('bs.popover').setContent();
      })

      .fail(function() {
        console.log('post req failure');
      });
    }
  );

});



// TODOS:
  // delay popup: http://cherne.net/brian/resources/jquery.hoverIntent.html
  // add loading gif
  // add emojis for emotions
  // add sentiment, 
