// Include requirements
require("dotenv").config();
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");

// var spotify = new Spotify(keys.spotify);

// Take in user input as the command
var command = process.argv[2];
// Create search term from arguments 3 and on 
var term = process.argv.slice(3).join(" ");
// Create an array that contains the results to display and save to log.txt
var results = [];

// Define functions for the four commands:
// Command 1: concert-this
// concert-this checks BANDSINTOWN to see if that band is playing anywhere
function concertThis(){    
    // use axios to search BANDSINTOWN for the search term
    axios.get("https://rest.bandsintown.com/artists/" + term + "/events?app_id=" + keys.bands.id)
    .then(function (response) {
        // iterate through all the concerts
        for (var i = 0; i < response.data.length; i++) {
            // Show the name, city, and region (state in the US) of the venue and the time of the concert
            var venue = response.data[i].venue;
            // Display state if in the US
            if (venue.country === "United States") {
                results.push(venue.name + " - " + venue.city + ", " + venue.region);
            }
            // Otherwise, display the country
            else {
                results.push(venue.name + " - " + venue.city + ", " + venue.country);
            }
            results.push(moment(response.data[i].datetime).format("MMMM Do YYYY, h:mm a"));
            results.push(" ");
        }
        results = results.join("\n")
        console.log(results);
        archive();
    })
    .catch(function (error) {
        // If there is an error, display the following user-friendly message
        console.log("Either \"" + term + "\" is not a band or they don't appear to be playing anywhere.");
        results.push("There were no results.");
    });
}

// Command 2: spotify-this
// spotify-this returns the name of the band, song, and album of the search term results as well as a URL to a preview of the track.
function spotifyThisSong() {
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
    // These extra quotes make sure the terms are in the correct order to reduce unwanted results.
    spotify.search({ type: "track", query: "\"" + term + "\""}, function(err, response) {
        if (err) {
            return console.log("Error occurred: " + err);
        }; 
        
        // The array for the response from spotify
        var tracks = response.tracks.items;
        // If there were no results, display the following message
        if (tracks.length === 0) {
            console.log("Either \"" + term + "\" is not a song or it isn't known to Spotify.")
            results.push("There were no results.");
        }
        else {
            // Otherwise, display results for all the responses
            for (var i=0; i < tracks.length; i++) {
                results.push(tracks[i].artists[0].name + " - " + tracks[i].name + " (" + tracks[i].album.name + ")");
                results.push("Spotify preview URL: " + tracks[i].preview_url);
                results.push(" ");
            };
            results = results.join("\n")
            console.log(results);
            archive();
        };
    });
};

// Command 3: movie-this
// movie this queries OMDB's API using axios
function movieThis() {
    if (term  === "") {
        // There must be a search term, or spotify will throw a fit. I mean, um, an error.
        console.log("There was no search term, so we are searching for \"Mr. Nobody\".");
        term = "Mr. Nobody";
    };
    // use axios to search BANDSINTOWN for the search term
    axios.get("http://www.omdbapi.com/?apikey=" + keys.omdb.id + "&t=" + term)
    .then(function (response) {
        var movie = response.data;
        // If it can't find the movie
        if (movie.Response === "False") {
            console.log("Either \"" + term + "\" is not a movie or it is not known to OMDB.")
            results.push("There were no results.");
        }
        else {
            // Display title, year, ratings, country, plot, and actors
            results.push(movie.Title + " (" + movie.Year + ")");
            // function to find ratings from specific sources
            var ratings = movie.Ratings;
            function findRating(site) {
                for (var i = 0; i < ratings.length; i++){
                    if (ratings[i].Source === site) {
                        results.push(site + ": " + ratings[i].Value);
                    }
                }
            }
            results.push("Starring: " + movie.Actors);
            results.push("Production Countries: " + movie.Country);
            results.push("Languages: " + movie.Language);
            // Run function and display ratings
            findRating("Internet Movie Database");
            findRating("Rotten Tomatoes");
            results.push("Plot: " + movie.Plot);
            results.push(" ");
            results = results.join("\n")
            console.log(results);
            archive();
        };
    })
    .catch(function (error) {
        // If there is an error, display the following user-friendly message
        // console.log("Either that movie does not exist or it is not known to OMDB.");
        console.log(error);
    });
}

// Command 4: do-what it says
// Do whatever happens to be in the random.txt file
function doWhatItSays() {
    fs.readFile("./random.txt", "utf8", function(error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }
        var arguments = data.split(",");
        command = arguments[0];
        // create search term from arguments 3 and on 
        term = arguments[1];
        executeCommand();
    });
}

// Save these commands and results to log.tx (don't overwrite)
//     Use append fs 

function archive() {
    var text = command + " " + term + ":\n" + results + "\n"; 
    fs.appendFile("log.txt", text, function(err) {
        // If an error was experienced we will log it.
        if (err) {
            console.log(err);
        }
        // If no error is experienced, we'll log the phrase "Content Added" to our node console.
        else {
            console.log("Your search and its results have been saved to the local file log.txt.");
        }
    });
}


function executeCommand() {
    if (command === "concert-this") { concertThis() }
    else if (command === "spotify-this-song") { spotifyThisSong() }
    else if (command === "movie-this") { movieThis() }
    else if (command === "do-what-it-says") {doWhatItSays() }
    else { console.log("LIRI did not receive a functional command.") };
}

executeCommand();
