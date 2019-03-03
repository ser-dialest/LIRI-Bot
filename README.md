# LIRI-Bot

## Overview

Language Interpretation and Recognition Interface: Command line Node.js app that searches for songs, performances, and films.

## Requirements

The user will need to install the following NPM Modules as per the dependencies found in the included package.JSON:

* Axios
* Moment
* Spotify

## User Input

This is a command line application, so the user will be required to input arguments following the call of the application. These arguments should have the following format:

    node liri <command> <search term>

The search term is a single value, but may contain many words separated by spaces. These arguments are then concatenated into a single term taht is then passed into subsequent functions.

## Commands

The following are the commands accepted by LIRI:

1. concert-this
2. spotify-this-sond
3. movie-this
4. do-what-it-says

Any argument other than the above will return only a message that LIRI did not receive a functional command.

#### Concert-this

The search term passed into concert-this is presumed to be a band name. Concert-this takes this term and passes it into a request made to the Bands in Town API though Axios. From the information returned by the API, it displays information about upcoming concerts featuring that band. The information displayed is:

* Concert Venue
* City and State (or country if outside of the U.S.)
* Date and Time of the concert

#### Spotify-this-song

The search term passed into spotify-this-song is presumed to be a song name. Spotify-this-song takes this term and passes it into a request made to the Spotify NPM Module. From the information returned by the module, it lists songs that meet that contain the search terms. In order to reduce the number of responses and increase relevance, it only displays those songs containing the words as they appear in the search term. The information displayed is:

* Names of the Performing Artist, SOng, and Album.
* URL of a 30-second preview available through Spotify

#### Movie-this

The search term passed into movie-this is presumed to be a film name. Movie-this takes this term and passes it into a request made to the OMDB API though Axios. It displays information about the film returned by the API. The information displayed is:

* Title and Release Year
* Prominent Actors
* Country or Countries in which it was produced
* Language of the film
* Review scores from IMDB and Rotten Tomatoes
* Plot

#### Do-what-it-says

The fourth (and most peculiar) of the commands takes arguments from a text file (random.txt), and uses them to as the command and search term. It pulls this information using node fs. In this case, random.txt contains the assigned text:

    spotify-this-song,"I Want it That Way"


Predictably, it runs the spotify-this-song command on the search term, returning, among others, The Backstreet Boys' "I Want It That Way".

## Archiving

In addition to printing out the results of these commands to the console, the user arguments and the search results are committed to a text file (log.txt). Subsequent searches continue to add this information without overwriting the previous results.