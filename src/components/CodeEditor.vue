<script setup lang="ts">
import ace, {Ace, EditSession} from "ace-builds"
import {onMounted, ref, watch, PropType} from "vue";
import 'ace-builds/src-noconflict/ext-language_tools'
// import modeList from 'ace-builds/src-noconflict/ext-modelist'
import 'ace-builds/esm-resolver'

import dockerFile from "../assets/docker.json"

import {events} from "../bus.ts";
import {FileInfo} from "../class.ts";
import axios from "axios";

ace.config.setModuleUrl('ace/mode/base_worker', "ace-editor/worker-base.js")
ace.config.setModuleUrl('ace/mode/css_worker', "ace-editor/worker-css.js")
ace.config.setModuleUrl('ace/mode/html_worker', "ace-editor/worker-html.js")
ace.config.setModuleUrl('ace/mode/json_worker', "ace-editor/worker-json.js")
ace.config.setModuleUrl('ace/mode/xml_worker', "ace-editor/worker-xml.js")
ace.config.setModuleUrl('ace/mode/yaml_worker', "ace-editor/worker-yaml.js")
// ace.require("ace/ext/language_tools");


const props = defineProps({
  currTab: String,
  info: Object as PropType<FileInfo>,
});

let text = ref("")


onMounted(() => {
  const editor = ace.edit("ace-editor");

  editor.setOptions({
    theme: 'ace/theme/dracula',
    fontSize: 20,
    mode: 'ace/mode/text',

    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
  });


  // const modes = modeList.modes
  // console.log(modeList.modes)


  // 设置和获取内容
  // editor.setValue("the new text here"); // 或 session.setValue
  // editor.getValue(); // 或 session.getValue


  // editor.find('true',{
  //   backwards: false,
  //   wrap: false,
  //   caseSensitive: false,
  //   wholeWord: false,
  //   regExp: false
  // });
  // editor.findNext();
  // editor.findPrevious();

  const sessions: Map<string, Ace.EditSession> = new Map();

  // const sessions: EditSessionCache[] = []

  watch(() => props.info!, (value: FileInfo) => {
    console.log('[Watch] ' + value)

    if (value.path == '') {
      editor.setSession(new EditSession(''))
    }else {
      const session: Ace.EditSession | undefined = sessions.get(value.path)
      if (session == undefined) {
        const newSession = new EditSession(getFileData(value.path))
        newSession.setMode(value.mode)
        sessions.set(value.path, newSession)
        editor.setSession(newSession)
      } else {
        editor.setSession(session)
      }
    }

  })

  watch(() => props.currTab!, (value: String) => {
    const session: Ace.EditSession | undefined = sessions.get(value as string)
    editor.setSession(session)
  })

  events.on('changeMode', (mode) => {
    console.log("[Mode] " + mode)
    editor.session.setMode(mode as string)
  })

  events.on('closeFile',(message)=>{
    console.log('[Close] ' + message)
    const path = message as string
    sessions.delete(path)
  })

  function getFileData(path: string): string {
    console.log('[Axios] ' + path)
    if (path.endsWith('.json')) {
      return JSON.stringify(dockerFile, null, 2)
    }

    return path
  }


})
</script>

<template>
  <div id="ace-editor">
    {{text}}
  </div>
</template>

<style scoped>
#ace-editor {
  width: 100%;
  flex-grow: 1;
}
</style>