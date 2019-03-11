<template>
	<div>
		<v-toolbar flat height="90">
			<v-btn flat icon @click="toggleMute">
				<template v-if="!this.muted">
					<v-icon v-if="this.volume >= 0.5">volume_up</v-icon>
					<v-icon v-else-if="this.volume > 0">volume_down</v-icon>
					<v-icon v-else>volume_mute</v-icon>
				</template>
				<v-icon v-show="this.muted">volume_off</v-icon>
			</v-btn>
			<v-slider v-model="volume" @input="updateVolume(volume)" max="1" step="0.1"></v-slider>
			<v-spacer></v-spacer>
			{{ this.volume * 100 + '%' }}
			<v-btn outline small fab color="light-blue" @click="skipTrack('prev')" >
				<v-icon>skip_previous</v-icon>
			</v-btn>
			<v-btn outline fab small color="light-blue" 
			 @touch="stopTrack"
			 @click="stopTrack" v-show="playing" >

				<v-icon>stop</v-icon>
			</v-btn>
			<v-btn outline fab color="light-blue" @touch="playTrack"
			 @click="playTrack">
				<v-icon large>play_arrow</v-icon>
			</v-btn>
			<v-btn outline fab small color="light-blue" 
			 @touch="pauseTrack"
			 @click="pauseTrack" v-show="playing" >

				<v-icon large>pause</v-icon>
			</v-btn>
			<v-btn outline  small fab color="light-blue" 
			 @touch="skipTrack('next')"
			 @click="skipTrack('next')" >
				<v-icon>skip_next</v-icon>
			</v-btn>
			<v-spacer></v-spacer>
			<v-btn flat icon @touch="toggleLoop" @click="toggleLoop">
				<v-icon color="light-blue" v-if="this.loop">repeat_one</v-icon>
				<v-icon color="blue-grey" v-else>repeat_one</v-icon>
			</v-btn>
			<v-btn flat icon @touch="toggleShuffle" @click="toggleShuffle">
				<v-icon color="light-blue" v-if="this.shuffle">shuffle</v-icon>
				<v-icon color="blue-grey" v-else>shuffle</v-icon>
			</v-btn>
		</v-toolbar>
		<v-toolbar flat height="40">
			<v-progress-linear 
			height="40"
			v-model="trackProgress"
			@click="updateSeek($event)"></v-progress-linear> 
		</v-toolbar>
	</div>
</template>

<script>
export default {
	methods : {
		playTrack(index){
			this.$emit('playtrack', index)
		},
		pauseTrack(){
			this.$emit('pausetrack')
		},
		skipTrack(direction){
			this.$emit('skiptrack', direction)
		},
		stopTrack(){
			this.$emit('stoptrack')
		},
		updateVolume(vol) {
			Howler.volume(vol)
		},
		toggleMute() {
			Howler.mute(!this.muted)
			this.muted = !this.muted
		},
		toggleLoop() {
			this.$emit('toggleloop', !this.loop)
		},
		toggleShuffle(){
			this.$emit('toggleshuffle', !this.shuffle)
		},
		updateSeek(event){
			let el = document.querySelector(".v-progress-linear__bar"),
				mousePos = event.offsetX,
				elWidth = el.clientWidth,
				percents = (mousePos / elWidth) * 100
			this.$emit('updateseek', percents)
		}
	},
	props: {
		loop: Boolean,
		shuffle: Boolean,
		playing: Boolean,
		progress: Number
	},
	data() {
		return {
			muted: false,
			volume: 0.5
		}
	},
	created(){
		Howler.volume(this.volume)
	},
	computed : {
		trackProgress () {
			return (this.progress * 100)
		}
	}
}
</script>

<style>

</style>
