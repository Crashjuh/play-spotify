var spotify = require('spotify-node-applescript'),
    http = require('http');

function getSong(query, callback) {
    var searchData = '';

    http.get({
        host: 'ws.spotify.com',
        port: 80,
        path: '/search/1/track.json?q=' + query
    }, function (res) {
        res.on('data', function (chunk) {
            searchData += chunk;
        }).on('end', function () {
            searchData = JSON.parse(searchData);
            if (Array.isArray(searchData.tracks)) {
                callback(null, searchData.tracks[0].href);
            } else {
                console.log('No results, sucker.');
            }
        });
    }).on('error', function (e) {
        console.log("Got error: " + e.message);
        callback(e.message);
    });
}

if (process.argv[2] === 'play' && process.argv[3] && process.argv[3].length > 0) {
    var query = process.argv.splice(3).join('+').toLowerCase();
    getSong(query, function (error, songUri) {
        spotify.playTrack(songUri);
    });
} else {
    spotify[process.argv[2]]();
}
