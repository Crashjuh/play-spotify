var spotify = require('spotify-node-applescript'),
    http = require('http'),
    Promise = require('es6-promise').Promise;

function getSearchResults(query) {
    return new Promise(function(resolve, reject) {
        var SPOTIFY_HOST_URL = 'ws.spotify.com',
            SPOTIFY_SEARCH_URL = '/search/1/track.json?q=',
            data = '';

        http.get({
            host: SPOTIFY_HOST_URL,
            port: 80,
            path: SPOTIFY_SEARCH_URL + query
        }, function (res) {
            res.on('data', function (chunk) {
                data += chunk;
            }).on('end', function () {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e, data);
                }
            });
        }).on('error', function (e) {
            reject(callback(e));
        });
    });
}

function processSearchData(searchData) {
    if (Array.isArray(searchData.tracks)) {
        var artists = '';
        for (var i = 0; i < searchData.tracks[0].artists.length; i += 1) {
            artists += searchData.tracks[0].artists[i].name + ', ';
        }
        artists = artists.substr(0, artists.length - 2);

        console.log('Playing: ' + artists + ' - ' + searchData.tracks[0].name);

        return searchData.tracks[0].href;
    } else {
        console.log('No results, sucker.');
    }
}

function handleError(error) {
    console.trace("ERROR", e.message || e);
}

if (process.argv[2] === 'play' && process.argv[3] && process.argv[3].length > 0) {
    var query = process.argv.splice(3).join('+').toLowerCase();
    getSearchResults(query).then(processSearchData, handleError).then(spotify.playTrack);
} else {
    spotify[process.argv[2]]();
}
