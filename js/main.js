"use strict";

window.onload = function () { // Display basic information from the start
    
    var page = document.getElementById('info');
    var article = document.createElement('article'); // Article to put the text within
    var h1 = document.createElement('h1'); // Get the headline 
    h1.innerHTML = 'Välkommen till tablåer för Sveriges Radio!';
    var info = document.createElement('p');
    info.innerHTML = 'Denna webb-applikation använder Sveriges Radios öppna API för tabeller och program.<br/>Välj kanal till vänster för att visa tablå för denna kanal.';

    article.appendChild(h1);
    article.appendChild(info);
    page.appendChild(article);
}

var ajax = new XMLHttpRequest(); //var for ajax request
var contentajax = new XMLHttpRequest(); //variable for content request

var channelnumber = document.getElementById("numrows").value; //var for showing channel number in console

console.log(channelnumber);


ajax.open('GET', 'http://api.sr.se/api/v2/channels?format=json', true);
ajax.onload = function loaddata() {
    console.log('loading data!!');

    if (ajax.status === 200) { // if ajax request is okey (200) success

    var parsedtext = JSON.parse(ajax.response); // json respons with ajax through request

    parsedtext.channels.forEach(channel => { //shows channel name
        var ul = document.getElementById('mainnavlist'); //shows list
        var li = document.createElement('li');
        var a = document.createElement('a');
        
        a.title = channel.tagline;
        if (((channel.tagline).toLowerCase()).includes('mainchannel')) {
            a.title = channel.name; // Change the name from the once without a tag and only show "main channel"
        }
        a.id = channel.scheduleurl;
        a.innerHTML = channel.name;
        a.onclick = function() { // change into =>
            editMainFunction(channel.scheduleurl);
        }
        li.appendChild(a); // appendchild adds to the following statement
        ul.appendChild(li); //adds to list

        var player = document.getElementById('playchannel'); //shows player
        var option = document.createElement('option');
        option.value = channel.liveaudio.url; 
        option.label = channel.name;

        player.appendChild(option);

    });
    
    } else {
        alert('error, ajax status = ' + ajax.status);
    }
}
ajax.send();


function editMainFunction(fetchurl) { // getting new content for main: ' + fetchurl

    contentajax.open('GET', fetchurl + '&format=json&size=1000', true); // Get the data about the channels in json
    contentajax.onload = function () {
        if (ajax.status === 200) {
            var page = document.getElementById('info');
            page.innerHTML = ''; // Remove what's written in info to prepair new writing 

            var maincontent = JSON.parse(contentajax.response); // Parse json data, get json data for main content
            var currenttime = Date.now(); // Time for now, need to compare time later

            maincontent.schedule.forEach(program => { // Each program for the station

                var tajmstart = new Date(parseInt(program.starttimeutc.substr(6))); //Parse SR Date()
                var tajmend = new Date(parseInt(program.endtimeutc.substr(6)));

                if (currenttime < tajmend) { // Checks if the program already ended

                function maketimereadable(time) { //Adds a extra 0 if thenumber is less than 10
                    if (time < 10) {
                        time = '0' + time;
                    }
                    return time;
                }

                var article = document.createElement('article'); // writes in "article"
                var h1 = document.createElement('h1');
                h1.innerHTML = program.title; // Program titel
                var time = document.createElement('p');
                time.innerHTML = `${maketimereadable(tajmstart.getHours())}:${maketimereadable(tajmstart.getMinutes())} - ${maketimereadable(tajmend.getHours())}:${maketimereadable(tajmend.getMinutes())}`; // Start and stop time
                var info = document.createElement('p');
                info.innerHTML = program.description; // Program description
 
                article.appendChild(h1); // appendchild adds to the following statement
                article.appendChild(time);
                article.appendChild(info);
                page.appendChild(article);
                
                
                } else {
                    /*
                    console.log('show has already ended');
                    console.log(tajmstart + ' - ' + tajmend);
                    */
                }
                
            });
        } else {
            alert('could not fetch: ' + fetchurl);
        }
    }
    contentajax.send();
}

document.getElementById('playbutton').addEventListener('click', play); // Listener for play button

function play() {
    var selectedvalue = document.getElementById('playchannel').value; // Get valuet from chosen channels, that are made  for playing channels (mp3 file)
    var radioplayer = document.getElementById('radioplayer');
    radioplayer.innerHTML = '<audio controls="" autoplay=""><source src="' + selectedvalue + '" type="audio/mpeg"></audio>'; // insert into audio element 
}
