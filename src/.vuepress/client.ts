import { defineClientConfig } from 'vuepress/client'
import MusicPlayer from './components/MusicPlayer.vue'

export default defineClientConfig({
  enhance({ app }) {
    app.component('MusicPlayer', MusicPlayer)
  },
  rootComponents: [MusicPlayer],
})