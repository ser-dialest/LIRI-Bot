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
        console.log("Either \"" + term + "\" is not a band or they don't appear to be playing anywhere.");
    });
}

// Command 2: spotify-this
// spotify-this returns the name of the band, song, and album of the search term results as well as a URL to a preview of the track.
if (command === "spotify-this") {
    // Import the spotify keys from .env
    var spotify = new Spotify({
      id: keys.spotify.id,
      secret: keys.spotify.secret
    });
    // Verify there was a search term
    if (term  === "") {
        // There must be a search term, or spotify will throw a fit. I mean, um, an error.
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
            console.log("Either \"" + term + "\" is not a song or it isn't known to Spotify.")
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
};
// Command 3: movie-this
// movie this queries OMDB's API using axios
if (command === "movie-this") {
    if (term  === "") {
        // There must be a search term, or spotify will throw a fit. I mean, um, an error.
        console.log("There was no search term, so we are searching for \"Mr. Nobody\".");
        term = "Mr. Nobody";
    };
    
    // use axios to search BANDSINTOWN for the search term
    axios.get("http://www.omdbapi.com/?apikey=" + keys.omdb.id + "&t=" + term)
    .then(function (response) {
        var movie = response.data;
        if (movie.Response === "False") {
            console.log("Either \"" + term + "\" is not a movie or it is not known to OMDB.")
        }
        else {
            // Display title, year, ratings, country, plot, and actors
            console.log(movie.Title);
            console.log(movie.Year);
            // function to find ratings from specific sources
            var ratings = movie.Ratings;
            function findRating(site) {
                for (var i = 0; i < ratings.length; i++){
                    if (ratings[i].Source === site) {
                        console.log(site + ": " + ratings[i].Value);
                    }
                }
            }
            // Run function and display ratings
            findRating('Internet Movie Database');
            findRating('Rotten Tomatoes');
            console.log(movie.Country);
            console.log(movie.Language);
            console.log(movie.Plot);
            console.log(movie.Actors);
        };
    })
    .catch(function (error) {
        // If there is an error, display the following user-friendly message
        // console.log("Either that movie does not exist or it is not known to OMDB.");
        console.log(error);
    });
}

// Command 4: do-what it says
//     Call text from Random.txt 
//     currently that says do a spotify search for I want it that way
//     Mess with it to see if it can do the other ones, too

// Save these commands and results to log.tx (don't overwrite)
//     Use append fs 

// JEFFREY BONUS
//     Ask user if they would like to check performances for the artist after they songified a song
//     Save the API keys for OMDB and BANDSINTOWN in the .env file as well (ast TAs to make sure that will be okay)





