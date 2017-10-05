var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

var crawledUrls = [];
var searchUrl = 'http://www.github.com';
var url = new URL(searchUrl);
var baseUrl = url.protocol + "//" + url.hostname;

var requestUrl = function(searchUrl, depth) {
  if (depth <= 3) {
    request(searchUrl, function(err, resp, body) {
      $ = cheerio.load(body);
      pageLinksControl($, depth);
      console.log("Visiting page: " + searchUrl);
    });
  }
}

var pageLinksControl = function($, depth){
  var $relativeLinks = $("a[href^='/']");
  $relativeLinks.each(function() {
    var newUrl = baseUrl + $(this).attr("href");
    if (crawledUrls.indexOf(searchUrl) === -1) {
      requestUrl(newUrl, depth+1);
      crawledUrls.push(newUrl);
    }
  });
}

requestUrl(searchUrl, 1);
