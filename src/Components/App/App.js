import './App.css';
import React from 'react';
import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults';
import {Playlist} from '../Playlist/Playlist';
import Spotify from '../../util/Spotify.js';

let savedSearchTerm = '';

export class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track){
    if(!this.state.playlistTracks.some( playlistTrack => playlistTrack.id === track.id )){
      let newPlaylistTracks = this.state.playlistTracks.concat([track]);
      this.setState( {playlistTracks: newPlaylistTracks});
    }

    //remove track from Search results
    let newResults = this.state.searchResults.filter( 
      result => result.id !== track.id
    );
    this.setState( {searchResults: newResults});
  }

  async removeTrack(track){
    let newPlaylistTracks = this.state.playlistTracks.filter( 
      playlistTrack => playlistTrack.id !== track.id
    );
    this.setState( {playlistTracks: newPlaylistTracks} );

    //refetch results, only displaying results that are not already in playlist
    await this.search(savedSearchTerm);
  }


  updatePlaylistName(name){
    this.setState( {playlistName: name} );
  }

  inPlaylist(track){
    return this.state.playlistTracks.some( playlistTrack => playlistTrack.id === track.id);
  }

  async search( searchTerm ){
    savedSearchTerm = searchTerm; //For refreshing search result purposes
    let newResults = await Spotify.search(searchTerm);
    //only save results that are not already in the playlist
    let filteredResults = newResults.filter( track => !this.inPlaylist(track));
    this.setState( {searchResults: filteredResults});
  }

  async savePlaylist(){
    await Spotify.savePlaylist(this.state.playlistName, this.state.playlistTracks.map(track => track.uri));
    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: []
    });
  }

  render(){
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}
