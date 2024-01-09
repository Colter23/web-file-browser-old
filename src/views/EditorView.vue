<script setup lang="ts">
import FileTree from "../components/FileTree.vue";
import EditorPanel from "../components/EditorPanel.vue";

import {
  NSpace,
  NSplit
} from 'naive-ui'

</script>

<template>
  <n-space vertical size="large">
    <n-split default-size="0.15">
      <template #1>
        <file-tree></file-tree>
      </template>
      <template #2>
        <editor-panel></editor-panel>
      </template>
    </n-split>
  </n-space>
</template>

<style scoped>

</style>