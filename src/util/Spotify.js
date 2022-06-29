let accessToken;
const clientID = '16a0bf290bb1411eadcd0ba425f46d56';
const redirectURI = "http://localhost:3000";

const Spotify = {
    getAccessToken(){
        if(accessToken){
            return accessToken;
        }
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expirationTimeMatch = window.location.href.match(/expires_in=([^&]*)/);


        //if both exist, set access token value and expiration time
        if (accessTokenMatch && expirationTimeMatch){
            accessToken = accessTokenMatch[1];
            const expirationTime = Number(expirationTimeMatch[1]);
            window.setTimeout( () => accessToken = '', expirationTime * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;

        }
    },

    async search( searchTerm ){
        try {
            const accessToken = Spotify.getAccessToken();
            const response = await fetch(
                `https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,
                { headers: {Authorization: `Bearer ${accessToken}`}}
            );

            const jsonResponse = await response.json();
            if(!jsonResponse.tracks){
                return [];
            }
            return jsonResponse.tracks.items.map(track => {
                return {
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                };
            });

        } catch (e) {
            console.log(e);
        }

    },

    async savePlaylist( playlistName, trackURIs){
        if( playlistName && trackURIs.length){
          const accessToken = await Spotify.getAccessToken();
          const headers = { Authorization: `Bearer ${accessToken}`};
          const response = await fetch( 'https://api.spotify.com/v1/me', {headers: headers});
          const jsonResponse = await response.json();
          const userID = jsonResponse.id;

          const playlistResponse = await fetch(
            `https://api.spotify.com/v1/users/${userID}/playlists`,
            {
              headers: headers,
              method: 'POST',
              body: JSON.stringify({name: playlistName})
            }
          );
          const jsonPlaylistResponse = await playlistResponse.json();
          const playlistID = jsonPlaylistResponse.id;
    
          await fetch(
            `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`,
            {
              headers: headers,
              method: 'POST',
              body: JSON.stringify( {uris: trackURIs})
            }
          );
    
        }
        return;
      }
}

export default Spotify;