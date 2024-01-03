<script setup lang="ts">
import FileTree from "../components/FileTree.vue";
import EditorPanel from "../components/EditorPanel.vue";

import {
  NSpace,
  NLayout, NLayoutSider
} from 'naive-ui'

</script>

<template>
  <n-space vertical size="large">
    <n-layout has-sider >
      <n-layout-sider content-style="">
        <file-tree></file-tree>
      </n-layout-sider>
      <editor-panel></editor-panel>
    </n-layout>
  </n-space>
</template>

<style scoped>

</style>