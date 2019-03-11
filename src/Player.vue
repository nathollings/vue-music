<template>
	<v-app :dark="isDark">
		<v-content>
			<v-container>
				<player-title-bar
					:isDark="isDark"
					@toggledark="toggleDark"
				></player-title-bar> 
				<Player-Info-Panel :trackInfo="getTrackInfo" ></Player-Info-Panel>
				<player-controls-bars
					:loop="loop"
					:shuffle="shuffle"
					:progress="progress"
					:playing="playing"
					@skiptrack="skip"
					@playtrack="play"
					@pausetrack="pause"
					@stoptrack="stop"
					@toggleloop="toggleLoop"
					@toggleshuffle="toggleShuffle"
					@updateseek="setSeek"
					 ></player-controls-bars>
				<player-playlist-panel 
					:isDark="isDark"
					:selectedTrack="selectedTrack"
					:playlist="playlist" 
					@playtrack="play"
					@selecttrack="selecttrack"
					></player-playlist-panel>
				<player-search-bar :playlist="playlist"></player-search-bar>
			</v-container>
		</v-content>
	</v-app>
</template>

<script>
import PlayerTitleBar from "./components/PlayerTitleBar.vue";
import PlayerPlaylistPanel from "./components/PlayerPlaylistPanel.vue";
import PlayerControlsBars from "./components/PlayerControlsBars.vue";
import PlayerInfoPanel from "./components/PlayerInfoPanel.vue";
import PlayerSearchBar from "./components/PlayerSearchBar.vue";
export default {
	components:{
		PlayerTitleBar, 
		PlayerPlaylistPanel,
		PlayerControlsBars,
		PlayerSearchBar,
		PlayerInfoPanel,
	},
	data(){
		return {
			playlist: [
				{file: "forty_six_&_2.mp3", title: "forty six & 2", artist: "Tool", howl: null, display: true},
				{file: "Tool - Stinkfist.mp3", title: "Stinkfist", artist: "Tool", howl: null, display: true},
				{file: "Tool - Third Eye.mp3", title: "Third Eye", artist: "Tool", howl: null, display: true}
			],
			selectedTrack: null,
			index: 0,
			playing: false,
			seek: 0,
			loop: false,
			shuffle: false,
			isDark: true,
		}
	}, 
	watch: {
		playing(playing) {
			this.seek = this.currentTrack.howl.seek()
			let updateSeek
			if (playing) {
				updateSeek = setInterval(()=>{
					this.seek = this.currentTrack.howl.seek()
				}, 250)
			} else {
				clearInterval(updateSeek)
			}
		},
	},
	created(){
		this.playlist.forEach( (track) => {
			track.howl = new Howl({
				src: `./playlist/${track.file}`,
				onend: () => {
					if(this.loop) {
						this.play(this.index)
					} else {
						this.skip('next')
					}
				}
			})
		} )
	},
	methods: {
		toggleLoop(value){
			this.loop = value
		},
		toggleShuffle(value){
			this.shuffle = value
		},
		toggleDark(value){
			this.isDark = value
			
		},
		selecttrack(track) {
			this.selectedTrack = track
		},
		play(index){
			let selectedTrackIndex = this.playlist.findIndex(track => track === this.selectedTrack)

			if (typeof index === 'number' ) {
				index = index 
			} else if (this.selectedTrack) {
				if (this.selectedTrack != this.currentTrack) {
					this.stop()
				}
				index = selectedTrackIndex
			} else {
				index = this.index
			}

			let track = this.playlist[index].howl
			if (track.playing()) {
				return
			} else {
				track.play()
			}

			this.selectedTrack = this.playlist[index]
			this.playing = true
			this.index = index
		},
		pause() {
			this.currentTrack.howl.pause()
			this.playing = false
		},
		skip(direction){
			let index = 0
			let lastIndex = this.playlist.length - 1
			if (this.shuffle) {
				index = Math.round(Math.random() * lastIndex)
				while(index === this.index) {
					index = Math.round(Math.random() * lastIndex)
				}
			} else if (direction === "next") {
				index = this.index + 1
				if (index >= this.playlist.length) {
					index = 0
				} 
			} else {
					index = this.index - 1
					if (index < 0 ) {
						index = this.playlist.length - 1
					}
				}

				this.skipTo(index)
			
		
		},
		skipTo(index) {
			if (this.currentTrack) {
				this.stop()		
			}
			this.play(index)
		},
		stop() {
			this.currentTrack.howl.stop()
			this.playing = false
		},
		setSeek(percents) {
			let track = this.currentTrack.howl
	
			if (track.playing()) {
				this.pause()
				track.seek((track.duration() / 100) * percents)
				this.play()
			}
		}
	},
	computed: {
		currentTrack() {
			return this.playlist[this.index]
		},
		progress() {
			if (this.currentTrack.howl.duration() === 0) return 0
			return this.seek / this.currentTrack.howl.duration()
		},
		getTrackInfo(){
			let artist = this.currentTrack.artist,
				title = this.currentTrack.title,
				seek = this.seek,
				duration = this.currentTrack.howl.duration()
			return {
				artist,
				title,
				seek,
				duration
			}
		}
	}
}
</script>

<style>

</style>
