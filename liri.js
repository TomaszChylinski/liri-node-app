require("dotenv").config();

//require file structure
var fs = require("fs");
//require keys.js
var keys = require("./keys.js");
//require axios
var axios = require("axios");
//require moment
var moment = require("moment");
//require spotify
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var action = process.argv[2];
var value = process.argv.slice(3).join(" ");

function switchAction() {
  switch (action) {
    case "concert-this":
      getArtist(value);
      break;

    case "spotify-this-song":
      getSong(value);
      break;

    case "movie-this":
      getMovies(value);
      break;

    case "do-what-it-says":
      doWhatItSays();
      break;

    default:
      console.log("Error: Incorrect Input");
      break;
  }
}

function getArtist(artist) {
  if (artist === "") {
    artist = "Justin Bieber";
  }
  axios
    .get(
      "https://rest.bandsintown.com/artists/" +
        artist +
        "/events?app_id=codingbootcamp"
    )
    .then(function(response) {
      console.log(
        "\n-------------------------------------------------\n" +
          "Name of artist: ",
        artist
      );
      console.log("Name of the venue: ", response.data[0].venue.name);
      console.log(
        "Venue location: ",
        response.data[0].venue.city
      );
      console.log(
        "Date of the Event: ",
        moment(response.data[0].datetime).format("MM/DD/YYYY") +  "\n-------------------------------------------------\n"
      );
    })
    .catch(function(error) {
      console.log(error);
    });
}

function getSong(songName) {
  if (songName === "") {
    songName = "The Sign";
  }

  spotify.search({ type: "track", query: songName }, function(err, data) {
    if (err) {
      return console.log("Error occurred " + err);
    }

    console.log(
      "\n-------------------------------------------------\n" + "Artist(s): ",
      data.tracks.items[0].album.artists[0].name
    );
    console.log("Song's name: ", process.argv.slice(3).join(" "));
    console.log("Preview Link: ", data.tracks.items[0].preview_url);
    console.log(
      "Album Name: ",
      data.tracks.items[0].album.name +
        "\n-------------------------------------------------\n"
    );
  });
}

function getMovies(movieName) {
  if (movieName === " ") {
    movieName = "Mr. Nobody";
  }
  axios
    .get("http://www.omdbapi.com/?apikey=trilogy&t=" + movieName)
    .then(function(data) {
      var results = `
     Title of the Movie: ${data.data.Title}
     Year Released: ${data.data.Year}
     IMDB Rating: ${data.data.Rated}
     Rotten Tomatoes Rating: ${data.data.Ratings[1].Value}
     Country: ${data.data.Country}
     Language: ${data.data.Language}
     Plot: ${data.data.Plot}
     Actors: ${data.data.Actors}
     `;
      console.log( "\n-------------------------------------------------\n",
          results, "\n-------------------------------------------------\n"
      );
    })
    .catch(function(error) {
      console.log(error);
    });
}

function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function(err, data) {
    data = data.split(",");
    var action = data[0];
    var value = data[1];
    switch (action) {
      case "concert-this":
        getArtist(value);
        break;
      case "spotify-this-song":
        getSongs(value);
        break;
      case "movie-this":
        getMovies(value);
        break;
      default:
        break;
    }
  });
}

switchAction();
