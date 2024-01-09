<script setup lang="ts">
import {
  NTabs,
  NTab,
  NLayoutHeader,
  NBreadcrumbItem,
  NSpace,
  NLayout,
  NBreadcrumb,
  NLayoutFooter,
  NLayoutContent, NButton, NSelect
} from 'naive-ui'
import { ref, watch } from "vue";
import CodeEditor from "./CodeEditor.vue";
import languageList from '../assets/language_mode.json'
import {useEditorStore} from "../store";


// 编辑器数据仓库
const editorStore = useEditorStore();

// Tab列表
const tabPanels = ref(new Map());

interface LanguageMode {
  name: string;
  reg: RegExp;
  mode: string
}

const modes: LanguageMode[] = [];

// 语言模型
const languageMode = ref("ace/mode/text");
// 语言模型选项
const languageOptions: object[] = [];


// 处理语言模型
languageList['mode'].forEach((lan: string[]) => {
  modes.push({
    name: lan[0],
    reg: new RegExp(lan[1], "gi"),
    mode: lan[2]
  });
  languageOptions.push({
    label: lan[0],
    value: lan[2]
  });
})


// 监听当前编辑文件路径变化
watch(() => editorStore.currentFile, (key: string) => {
  const file = editorStore.getCurrentEditFileInfo();
  if (!file) return;
  // 当 mode 为空时，检测更新文件语言
  if (file.mode == undefined) {
    tabPanels.value.set(key, file.name);

    const mode = checkFileLanguageMode(key);
    editorStore.updateCurrentEditFileMode(mode);
    languageMode.value = mode;
  }else {
    languageMode.value = file.mode;
  }
});

// 关闭标签处理函数
function handleClose (path: string) {
  console.log("%c[Close] " + path, 'background: rgb(255 129 129)');
  // const { value: panels } = tabPanels;
  tabPanels.value.delete(path);
  editorStore.deleteEditFile(path);
  if (editorStore.currentFile === path) {
    editorStore.currentFile = '';
  }
}

// 新建空标签处理函数
function handleAdd() {
  // TODO("新建空标签");
  console.log("%c[TODO] Add", 'background: #4aa2ff');
}

// 更新 tab
function updateTab(value: string) {
  console.log('[Tab] ' + value);
  editorStore.currentFile = value;
  languageMode.value = editorStore.getCurrentEditFileInfo().mode;
}

// 更新语言模型
function handleUpdateMode(value: string) {
  console.log('[Mode] ' + value);
  editorStore.updateCurrentEditFileMode(value);
}


// 检查文件语言
function checkFileLanguageMode(path: string): string {
  const mode: LanguageMode | undefined = modes.find(mode => {
    return path.match(mode.reg);
  })
  if (mode != undefined)
    return mode.mode;
  else
    return 'ace/mode/text';
}

</script>

<template>
  <n-layout class="editor-container" content-class="editor-layout">
    <n-layout-header>
      <n-space>
        <n-button type="info">Info</n-button>
        <n-select 
            filterable 
            placeholder="语言" 
            v-model:value="languageMode"
            :options="languageOptions"
            @update:value="handleUpdateMode"
        />
      </n-space>
    </n-layout-header>
    <n-layout-content content-class="editor-layout-content">
      <n-tabs
          v-model:value="editorStore.currentFile"
          type="card"
          addable
          closable
          tab-style="min-width: 80px; height: 40px;"
          @add="handleAdd"
          @close="handleClose"
          @update:value="updateTab"
      >
        <n-tab
            v-for="tab in tabPanels"
            :key="tab[0]"
            :tab="tab[0].toString()"
            :name="tab[0]"
        >
          {{ tab[1] }}
        </n-tab>
      </n-tabs>
      <code-editor></code-editor>
    </n-layout-content>
    <n-layout-footer>
      <n-breadcrumb>
        <n-breadcrumb-item v-for="path in editorStore.currentFile.split('/')">{{ path }}</n-breadcrumb-item>
      </n-breadcrumb>
    </n-layout-footer>
  </n-layout>


</template>

<style scoped>
.editor-container {
  height: 100vh;
}
</style>

<style>
.editor-layout{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.editor-layout-content{
  display: flex;
  flex-direction: column;
}
</style>