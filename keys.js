console.log('API keys have been loaded');
console.log();

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

exports.bands = {
  id: process.env.BANDS_ID
}

exports.omdb = {
  id: process.env.OMDB_ID
}