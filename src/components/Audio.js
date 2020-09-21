import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { withNamespaces } from 'react-i18next';
import colors from '../theme.json'
import TrackPlayer from 'react-native-track-player';
import RNFetchBlob from 'rn-fetch-blob'
import PropTypes from 'prop-types';


let dirs = RNFetchBlob.fs.dirs



class Audio extends Component {
    state = {
        isPlaying: false,
        currentTrackId: null,
        donePlaying: false
    }

    onQueueEnd = null;
    track = {};

    getProperSourceForOS(source) {
        return Platform.OS === 'android' ? 'file://' + source : '' + source
    }

    async togglePlayPause() {
        if (this.state.isPlaying) {
            await TrackPlayer.pause();
            this.setState({ isPlaying: false });

        } else {
            if (this.state.donePlaying) {
                await TrackPlayer.skip(this.state.currentTrackId);
                this.setState({ isPlaying: false, donePlaying: false });
            }
            await TrackPlayer.play();
            this.setState({ isPlaying: true });
            this.setState({ donePlaying: false });
        }
    }


    async componentDidMount() {
        this.track = {
            url: this.getProperSourceForOS(
                `${dirs.DocumentDir}/${this.props.url.replace(/https?:\/\//, '')}`
            ),
            id: this.props.audioId
        };
        TrackPlayer.destroy();
        TrackPlayer.setupPlayer();
        const trackPlayerCapabilities = [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE,
            TrackPlayer.CAPABILITY_SEEK_TO,
            TrackPlayer.CAPABILITY_JUMP_BACKWARD,
            TrackPlayer.CAPABILITY_JUMP_FORWARD,
        ];
        TrackPlayer.updateOptions({
            stopWithApp: false,
           
        });
        await TrackPlayer.add(this.track);
        const current = await TrackPlayer.getCurrentTrack();
        this.setState({ isPlaying: false, currentTrackId: current });
        this.onQueueEnd = TrackPlayer.addEventListener('playback-queue-ended', async (data) => {
            this.setState({ isPlaying: false, isPlaying: false, donePlaying: true });
            await TrackPlayer.stop();

        })
    }

    componentWillUnmount() {
        TrackPlayer.stop();
        TrackPlayer.reset();
        TrackPlayer.destroy();
    }
    render() {
        const { isPlaying } = this.state;
        return (
            <>
                {isPlaying ?
                    <Icon id="player" name="pause-circle-filled" onPress={() => {
                        this.togglePlayPause();
                    }} style={{
                        color: colors.palegreen,
                        position: 'absolute',
                        top: '55%',
                        left: '20%',
                    }} size={40} />
                    :
                    <Icon id="player" name="play-circle-filled" onPress={() => {
                        this.togglePlayPause();
                    }} style={{
                        color: colors.palegreen,
                        position: 'absolute',
                        top: '55%',
                        left: '20%',
                    }} size={40} />
                }
            </>
        )
    }

}

Audio.propTypes = {
    audioId: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
}


export default withNamespaces()(Audio);