// Include requirements
require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');

// var spotify = new Spotify(keys.spotify);

// Take in user input as the command
var command = process.argv[2];

// create search term from arguments 3 and on 
var term = process.argv.slice(3).join(" ");

// Command 1: concert-this
// concert-this checks BANDSINTOWN to see if that band is playing anywhere
if (command === "concert-this") {
    
    // use axios to search BANDSINTOWN for the search term
    axios.get("https://rest.bandsintown.com/artists/" + term + "/events?app_id=" + keys.bands.id)
    .then(function (response) {
        // iterate through all the concerts
        for (var i = 0; i < response.data.length; i++) {
            // Show the name, city, and region (state in the US) of the venue and the time of the concert
            var venue = response.data[i].venue;
            console.log(venue.name + " - " + venue.city + ", " + venue.region);
            console.log(moment(response.data[i].datetime).format('MMMM Do YYYY, h:mm a'));
            console.log();
        }
    })
    .catch(function (error) {
        // If there is an error, display the following user-friendly message
        console.log("Either that band does not exist or it doesn't appear to be playing anywhere.");
    });
}

// Command 2: spotify-this
if (command === "spotify-this") {
    // Import the spotify keys from .env
    var spotify = new Spotify({
      id: keys.spotify.id,
      secret: keys.spotify.secret
    });
    // Verify there was a search term
    if (term  === "") {
        console.log("There was no search term, so we are Searching for \"The Sign\".");
        term = "The Sign";
    };

    // Use the search method of the node-spotify-api module 
    spotify.search({ type: 'track', query: term }, function(err, response) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }; 
        
        // The array for the response from spotify
        var tracks = response.tracks.items;
        // If there were no results, display the following message
        if (tracks.length === 0) {
            console.log("Either that song does not exist or it isn't known to Spotify.")
        }
        else {
            // Otherwise, display results for all the responses
            for (var i=0; i < tracks.length; i++) {
                console.log(tracks[i].artists[0].name);
                console.log(tracks[i].name);
                console.log(tracks[i].preview_url);
                console.log(tracks[i].album.name);
                console.log();
            };
        };
    });

//     if there is no argv3, it will give the Sign from Ace of Base (set search to that by default)}
}
// Command 3: movie this
//     Use axios and omdb api to access that database and find the arg 3+ movie
//     SHows:
//         Totle
//         Release Year
//         IMDB rating
//         Rotten tomatoes Rating
//         Country of production
//         LAnguage of movie
//         Plot
//         Actors in the movie
//     Default to Mr. Nobody

// Command 4: do-what it says
//     Call text from Random.txt 
//     currently that says do a spotify search for I want it that way
//     Mess with it to see if it can do the other ones, too

// Save these commands and results to log.tx (don't overwrite)
//     Use append fs 

// JEFFREY BONUS
//     Ask user if they would like to check performances for the artist after they songified a song
//     Save the API keys for OMDB and BANDSINTOWN in the .env file as well (ast TAs to make sure that will be okay)
