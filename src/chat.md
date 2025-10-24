---
title: 聊天室
toc: false
sidebar: false
pageInfo: false
breadcrumb: false
contributors: false
editLink: false
lastUpdated: false
prev: false
next: false
comment: false
---

<style>
.vp-content:not(.custom) {
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* 确保聊天室占满整个视口 */
main {
  padding: 110px 0 0 0 !important;
  margin: 0 !important;
}

/* 针对聊天室页面的特殊样式 */
.chat-fullscreen {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 200px;
  left: 0;
  z-index: 1000;
}
</style>

<div class="chat-fullscreen">
  <ChatBox />
</div>