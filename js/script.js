// You can also require other files to run in this process
const MarkovChain = require('markovchain'); //For building the chains
const wtf_wikipedia = require("wtf_wikipedia"); //For getting the data
const $ = require('jquery')
console.log("HI!")
var chained = null;
var essay = document.getElementById('essay');
essay.addEventListener('input', load_chain);

function load_wiki() {
    //      console.log("load_wiki")
    document.getElementById('updates').innerHTML = "getting page...";
    wtf_wikipedia.from_api(document.getElementById("title").value.toLowerCase(), "en", function(markup) {
        //          console.time("first");

        w_text = wtf_wikipedia.plaintext(markup).toLowerCase().replace('\'\'', '');
        if (w_text === "") {
            document.getElementById('updates').innerHTML = "Page doesn't exist or doesn't have enough scrapable material";
        } else {
            //          console.timeEnd("first");
            //          console.log("Call to plaintext took " + (t1 - t0) + " milliseconds.");
            //        console.log(w_text);
            //console.log(text);
            //          console.time("second")
            chained = new MarkovChain(w_text);
            //          console.timeEnd("second");
            document.getElementById('updates').innerHTML = "got page";
        }
        //          console.log("Call to chain took " + (t2 - t0) + " milliseconds.");
        //console.log("text: " + text);
        //        console.log(quotes.start('law').end(2).process());
    });
}
$('#essay').keydown(function(e) {
    var code = e.keyCode || e.which;
    if (code === 9) {
        e.preventDefault();
        var new_essay = $('#essay').val() + $('#chain').text();
        $('#essay').val(new_essay);
    } else {
        load_chain();
    }
    $('#essay').attr('size', $('#essay').val().length);
});
var chain = ""

function load_chain() {
    //          console.log("load_chain")
    if (chained != null) {
        var essay = document.getElementById('essay').value.toLowerCase().replace('\'\'', '');
        var words = essay.split(" ")
        var last_word = words[words.length - 1]
        chain = chained.start(last_word).end(2).process();
        //              console.log(chain);
        if (chain !== last_word) {
            document.getElementById('chain').innerHTML = chain.split(last_word)[1];
        } else {
            document.getElementById('chain').innerHTML = ""
        }
    }
}
