const request = require('request');
const cheerio = require('cheerio');
const url = require('url-parse');

const crawledUrls = [];

const requestUrl = (searchUrl, depth) => {
  const urlParse = new url(searchUrl);
  const baseUrl = urlParse.protocol + "//" + urlParse.hostname;

  if (depth <= 3) {
    if (!crawledUrls.includes(searchUrl)) {
      request(searchUrl, (err, resp, body) => {
        $ = cheerio.load(body);
        pageLinksControl($, depth, baseUrl);
        console.log("Visiting page: " + searchUrl);
      });
    }
  }
}

const pageLinksControl = ($, depth, baseUrl) => {
  const $relativeLinks = $("a[href^='/']");

  $relativeLinks.each(function(){
    const newUrl = baseUrl + $(this).attr("href");
    requestUrl(newUrl, depth+1);
    crawledUrls.push(newUrl);
  });
}


const init = (searchUrl) => {
  requestUrl(searchUrl, 1);
}


module.exports = init;
