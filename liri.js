// Include requirements
require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var keys = require("./keys.js");


// var spotify = new Spotify(keys.spotify);

// Take in user input as the command
var command = process.argv[2];

// Command 1: concert-this
// concert-this checks BANDSINTOWN to see if that band is playing anywhere
if (command === "concert-this") {

    var artist = process.argv.slice(3).join(" ");
    // console.log(artist);
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
            var venue = response.data[i].venue;
            console.log(venue.name + " - " + venue.city + ", " + venue.region);
            console.log(moment(response.data[i].datetime).format('MMMM Do YYYY, h:mm a'));
            console.log();
        }
    })
    .catch(function (error) {
        console.log("Either that band does not exist or it doesn't appear to be playing anywhere.");
    });
}
// PSEUDO CODE!!!! And goals.

// Argument 2 is gonna be the command. 
// There are 4 commands

// COmmand 1: Concert this
//     It pulls argument 3 and beyond to be the artist in thw query URL
//     It will reach out to the API using AXIOS and the query URL provided
//     It will respond with 
//         Venue name 
//         Venue location
//         Date of the event
    
// Command 2: Sootify this song
//     3 argument and beyond is the song
//     it will use node-spotify-api- mojo to grab info from spotify's api
//     Gonna have to look up how touse that mojo
//     Will need to pull the api key and secret code from keys, which pulls it from .env
//     It provides
//         Artist name
//         song name
//         link to preview the song on spotify
//         the album name of the album
//         (I don't think I want it in that order)
//     if there is no argv3, it will give the Sign from Ace of Base (set search to that by default)

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
