<template>
	<v-card height="330" :class="{playlist}">
		<v-list>
			<v-list-tile
				v-for="(track, index) in playlist"
				:key="track.title"
				v-show="track.display"
				:class="[{ selected: track === selectedTrack }, {even: (index % 2 == 0 & !isDark )}, {'dark-even': (index % 2 == 0 & isDark )} ]"
			>
				<v-list-tile-content @dblclick="playTrack()" @click="selectTrack(track)">
					<v-list-tile-title>{{ index | number }} {{ track.artist }} - {{ track.title }}</v-list-tile-title>
				</v-list-tile-content>
				<v-spacer></v-spacer>
				{{ track.howl.duration() | minutes }}
			</v-list-tile>
		</v-list>
	</v-card>
</template>

<script>
export default {
	props: {
		playlist: Array,
		selectedTrack: Object,
		isDark: Boolean
	},
	methods: {
		selectTrack(track) {
			this.$emit('selecttrack', track)
		},
		playTrack(index){
			this.$emit('playtrack', index)
		}
	}
}
</script>

<style>
  .selected {
    background-color:  orange !important;
  }
  .even {
    background-color: #f0f0f0;
  }
  .dark-even {
    background-color: #505050;
  }
  .playlist {
    overflow: auto
  }
</style>
