<script setup lang="ts">
import ace, {EditSession} from "ace-builds"
import {onMounted, watch} from "vue";
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/esm-resolver'
import {useEditorStore} from "../store";
import axios from "axios";

// 导入语言工作文件（用于语法提示）
ace.config.setModuleUrl('ace/mode/base_worker', "ace-editor/worker-base.js")
ace.config.setModuleUrl('ace/mode/css_worker', "ace-editor/worker-css.js")
ace.config.setModuleUrl('ace/mode/html_worker', "ace-editor/worker-html.js")
ace.config.setModuleUrl('ace/mode/json_worker', "ace-editor/worker-json.js")
ace.config.setModuleUrl('ace/mode/xml_worker', "ace-editor/worker-xml.js")
ace.config.setModuleUrl('ace/mode/yaml_worker', "ace-editor/worker-yaml.js")


// 编辑器数据仓库
const editorStore = useEditorStore();

onMounted(() => {
  // 创建编辑器
  const editor = ace.edit("ace-editor");

  // 初始化编辑器
  editor.setOptions({
    theme: 'ace/theme/dracula',
    fontSize: 20,
    mode: 'ace/mode/text',

    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
  });

  // 监听当前编辑文件变化
  watch(() => editorStore.currentFile, async (value: string) => {
    if (value == '') {
      editor.setSession(new EditSession(''))
    } else {
      const file = editorStore.getCurrentEditFileInfo();
      if (file.session == undefined) {
        console.log('[Session] ' + value)
        const newSession = new EditSession(await getFileData(value));
        newSession.setMode(file.mode);
        editor.setSession(newSession);
        file.session = newSession
      } else {
        editor.setSession(file.session);
      }
    }
  })

})

// 临时返回文件数据
async function getFileData(path: string): Promise<string> {
  console.log('%c[Axios] ' + path, 'background: #1db361');

  return await axios.get("http://127.0.0.1:8080/file" + path).then(res => {
    return res.data;
  })
}

</script>

<template>

  <div id="ace-editor"></div>

</template>

<style scoped>
#ace-editor {
  width: 100%;
  flex-grow: 1;
}
</style>