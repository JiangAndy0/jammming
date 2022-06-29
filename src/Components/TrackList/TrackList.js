import React from 'react';
import './TrackList.css';
import { Track } from '../Track/Track';

export class TrackList extends React.Component {
    render(){
        return (
            <div className="TrackList">
                {this.props.trackList.map( track => {
                    return <Track track={track} onAdd={this.props.onAdd} onRemove={this.props.onRemove} isRemoval={this.props.isRemoval}/>
                })}
            </div>
        );
    }
}