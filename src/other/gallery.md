---
title: 在线相册
icon: photo
---

# 我的相册

**零手工、R2 直连、横排瀑布流** → 点击放大，暗色模式自适应。

<!-- 自动循环输出 1.png ~ N.png -->
<PhotoSwipe class='PhotoSwipe'>
  <template v-for="i in Array.from({length: 54}, (_, i) => i + 1)">
    <img :src="`https://img.starrycognition.cn/gallery/${i}.png`" :alt="`图 ${i}`" />
  </template>
</PhotoSwipe>