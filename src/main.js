import Vue from 'vue'
import Vuetify from 'vuetify'
import Player from './Player.vue'
import 'vuetify/dist/vuetify.css'
import { Howl, Howler } from "howler";
import Vue2TouchEvents from 'vue2-touch-events';

Vue.use(Vuetify)

Vue.filter('number', (value) => {
	let number = value + 1
	if (number < 10) {
		number =  "0" + number
	}
	return number + ".";
})

Vue.filter('minutes', (value) => {
	if (!value || typeof value !== "number") return "00:00"
	
	let min = parseInt(value / 60),
		sec = parseInt(value % 60)
	min = min < 10 ? "0" + min : min
	sec = sec < 10 ? "0" + sec : sec
	value = min + ":" + sec
	return value	
})

Vue.use(Vue2TouchEvents)

new Vue({
  el: '#app',
  render: h => h(Player)
})
