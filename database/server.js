var Crawler = require("crawler");
var url = require('url');

var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, result, $) {
        // $ is Cheerio by default
        //a lean implementation of core jQuery designed specifically for the server

        if(result){
            var page= result.body;
            var res=page.match();
            if(res&&res.length>0){
                console.log(result.body);
            }
        }
        $('a').each(function(index, a) {
            var toQueueUrl = $(a).attr('href');
            c.queue(toQueueUrl);
        });
    }
});

// Queue just one URL, with default callback
c.queue('https://egov.uscis.gov/cris/processingTimesDisplay.do');