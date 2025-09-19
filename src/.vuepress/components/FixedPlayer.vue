<template>
  <div id="fixed-player" class="music-bar"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import Player from 'xgplayer'

onMounted(() => {
  new Player({
    id: 'fixed-player',
    url: '/assets/audio/demo.mp3',
    poster: '/assets/images/cover2.jpg',
    width: 280,
    height: 80,
    videoInit: false,   // 音频模式
    autoplay: false,
    loop: true,
    lang: 'zh-cn',
    theme: '#b7daff'
  })
})
</script>

<style scoped>
.music-bar {
  position: fixed;
  left: 16px;
  bottom: 16px;
  z-index: 9999;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>