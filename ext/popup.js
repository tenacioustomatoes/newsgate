// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */


function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
};


// getCurrentTabUrl(function(tabUrl) {
//   var urlData = $.ajax({
//     url: 'http://localhost:8000/api/ext',
//     type: 'POST',
//     data: {'url': tabUrl},
//     dataType: 'json'
//   })
//   .done(function (json) {
//     console.log(json);
//     var rating = '';
//     if ((json.fake.rating.score + '') === '0') {
//       rating = 'This page does not exist in our Fake News blacklist.';
//     } else if ((json.fake.rating.score + '') === '100') {
//       rating = 'WARNING: This page is hosted on a domain that has been blacklisted because of fake news.';
//     }
//     //$("<h1>").text(rating).appendTo('body');
//   })
//   .fail(function( xhr, status, errorThrown ) {
//     console.log( "Error: " + errorThrown );
//     console.log( "Status: " + status );
//     console.dir( xhr );
//   });
// });

var saveLink = function() {
  console.log('in save link');
  getCurrentTabUrl(function(url) {
    console.log(url)
    $.ajax({
      url: 'http://localhost:8000/api/links',
      type: 'POST',
      data: {'url': url},
      dataType: 'json'
    }).done(function(results) {
      if (results === 'false') {
        console.log('please login')
      } else {
        console.log(results)
        $('#SaveLink').text('Link Saved!')
      }
    });
  })
}    

var loginToFB = function() {
  console.log('in fb login');
  getCurrentTabUrl(function(url) {
    $.ajax({
      url: 'http://localhost:8000/auth/facebook',
      type: 'GET',
    }).done(function(results) {
      console.log(results)
      if (results.status === 'success') {
        console.log('signed in')
        $('#login').toggle();
        $('#logout').toggle();
      } else {
        chrome.tabs.create({url: 'http://localhost:8000/auth/facebook'});
        window.close(); // Note: window.close(), not this.close() 
          //console.log(results)
      }
    });
  })
}    



$(document).ready(function() {
  $('#SaveLink').on('click', saveLink);
  $('#login').on('click', loginToFB);
})
