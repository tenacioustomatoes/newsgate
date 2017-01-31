//See README.md for how to utilize the function below.

function promiseArr(keywords, timePeriod) {
  return groupKeywords(keywords).map(function (keyword, index, arr) {
    console.log('called this');
    return rp({
      uri: 'http://www.google.com/trends/fetchComponent?q=' + keyword + '&cid=TIMESERIES_GRAPH_0&export=3&' + timePeriod,
      headers: {
        //Personal cookie can be found in Chrome, this cookie will not work
        'Cookie': 'APISID=eaG4dlzL4wdAsT0Q/AwJ_zhs9WtTAU8Sa1; HSID=AC-IKbR1TdFl70xX2; NID=91=N-oreStVlwDe2-PDnacTbIk4OGaHuyixHk2w4piqnbvgzQP8TT-j751-eU3H3nSKz8bd3NUA5hj_2oma0cWqIDtbrnji__GaIWAoKAcJVppb0Oo1IftvjoM9jqcTPGNUwW56hR5SONnAdA9VrK7tEkxEcZ2HxbvmGVZAIUuMRysty34GchpCpc8IqNIaiPGFiz5h9CE-ipiTomTJ8s-aSq7PnzdtsvE_BMhKGocgcwR1_rzeXT96YrPJQTkUxMhOBJk; SAPISID=cZpNlAneFfMDfB3FLx/AB-QxJFQYeWxEY6zB; SID=EAQD1Fw_xunL5mMmH2e-_8TWWIzoEG0b6aFRfM8ozBR5ry9-uQfJ77e1NdqFCWLc7Pik7Q.; SSID=A8JQiw6UKoJ8DT7r9;'
      }
    })
    .then(function (htmlString) {
      return parseJSON(htmlString, arr[index].split(','));
    });
  });
}