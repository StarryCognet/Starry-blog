---
title: Element Plus 示例
icon: fab fa-elementor
---

# Element Plus 组件示例

这是 Element Plus 组件库的使用示例。当您切换网站的深色/浅色模式时，Element Plus 组件也会相应地切换主题。

## 基础组件

### Button 按钮

<el-button>默认按钮</el-button>
<el-button type="primary">主要按钮</el-button>
<el-button type="success">成功按钮</el-button>
<el-button type="info">信息按钮</el-button>
<el-button type="warning">警告按钮</el-button>
<el-button type="danger">危险按钮</el-button>

### Link 文字链接

<el-link href="https://element-plus.org/" target="_blank">Element Plus</el-link>
<el-link type="primary">主要链接</el-link>
<el-link type="success">成功链接</el-link>
<el-link type="warning">警告链接</el-link>
<el-link type="danger">危险链接</el-link>
<el-link type="info">信息链接</el-link>

## 表单组件

### Input 输入框

<el-input placeholder="请输入内容"></el-input>

### Select 选择器

<el-select placeholder="请选择">
  <el-option label="选项1" value="1"></el-option>
  <el-option label="选项2" value="2"></el-option>
  <el-option label="选项3" value="3"></el-option>
</el-select>

## 数据展示

### Tag 标签

<el-tag>标签一</el-tag>
<el-tag type="success">标签二</el-tag>
<el-tag type="info">标签三</el-tag>
<el-tag type="warning">标签四</el-tag>
<el-tag type="danger">标签五</el-tag>

### Card 卡片

<el-card class="box-card">
  <template #header>
    <div class="card-header">
      <span>卡片名称</span>
      <el-button class="button" type="text">操作按钮</el-button>
    </div>
  </template>
  <div v-for="o in 4" :key="o" class="text item">{{'列表内容 ' + o }}</div>
</el-card>

## 图标（自动按需引入）

<el-icon size="20"><Edit /></el-icon>
<el-icon color="#409efc"><Share /></el-icon>

## 自定义组件

下面是使用 Not 组件创建的通知按钮：

<Not />

## 交互组件

<el-popconfirm title="确定删除吗？">
  <template #reference>
    <el-button type="danger">删除</el-button>
  </template>
</el-popconfirm>

## 表格

<el-table :data="[
  {name:'Tom', age:20},
  {name:'Jerry', age:18}
]" style="width: 240px">
  <el-table-column prop="name" label="姓名" />
  <el-table-column prop="age" label="年龄" width="80"/>
</el-table>

## 深色模式支持

本项目已配置 Element Plus 的深色模式支持。当您点击页面右上角的深色模式切换按钮时，Element Plus 组件会自动切换到相应的主题，无需额外配置。

<style scoped>
.box-card {
  width: 480px;
  margin: 20px 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}
</style>