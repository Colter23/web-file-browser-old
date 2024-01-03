<script setup lang="ts">
import {
  NTabs,
  NTab,
  TreeOption,
  NLayoutHeader,
  NBreadcrumbItem,
  NSpace,
  NLayout,
  NBreadcrumb,
  NLayoutFooter,
  NLayoutContent, NButton, NSelect
} from 'naive-ui'
import {onBeforeUnmount, onMounted, reactive, ref, watch} from "vue";
import { events } from '../bus.js'
import CodeEditor from "./CodeEditor.vue";
import {FileInfo} from "../class.ts";


// 当前Tab
const currTab = ref('')
let fileInfo: FileInfo = reactive({path: '', mode: 'ace/mode/text'})

// Tab列表
// const tabPanels = ref([])
const tabPanels = ref(new Map())

// 当前文件路径
// let path = ref("")

onMounted(()=>{
  events.on('openFile',(message)=>{
    const file = message as TreeOption
    const key = file.key! as string
    tabPanels.value.set(key, file.label)
    // tabPanels.value[key] = file.label

    // path.value = key
    const mode = checkFileLanguageMode(key)
    fileInfo = {
      path: key,
      mode: mode
    }

    currTab.value = key
    languageMode.value = mode
  })
})
onBeforeUnmount(()=>{
  events.off('openFile')
})


function handleClose (path: string) {
  const { value: panels } = tabPanels
  panels.delete(path)
  // delete panels[path]
  //panels.splice(index, 1)
  events.emit('closeFile', path)
  if (currTab.value === path) {
    currTab.value = ''
  }
}
function handleAdd() {
  // tabPanels.value.push('test.txt')
  console.log("aaaaa")
}

function updateTab(value: string) {
  console.log('[Update] ' + value)
  currTab.value = value
}

function checkFileLanguageMode(path: string): string {
  const mode: LanguageMode | undefined = modes.find(mode => {
    return mode.reg.exec(path) != null
  })
  if (mode != undefined)
    return mode.mode
  else
    return 'ace/mode/text'
}


interface LanguageMode {
  name: string;
  reg: RegExp;
  mode: string
}

const modes: LanguageMode[] = []
const languageList = [
  ["Apache Conf", "^htaccess$|^htgroups$|^htpasswd$|^conf$|^.*\\.htaccess$|^.*\\.htgroups$|^.*\\.htpasswd$", "ace/mode/apache_conf"],
  ["AsciiDoc", "^.*\\.(asciidoc|adoc)$", "ace/mode/asciidoc"],
  ["C/C++", "^.*\\.(cpp|c|cc|cxx|h|hh|hpp|ino)$", "ace/mode/c_cpp"],
  ["C#", "^.*\\.(cs)$", "ace/mode/csharp"],
  ["CSS", "^.*\\.(css)$", "ace/mode/css"],
  ["Dart", "^.*\\.(dart)$", "ace/mode/dart"],
  ["Dockerfile", "^Dockerfile$", "ace/mode/dockerfile"],
  ["Go", "^.*\\.(go)$", "ace/mode/golang"],
  ["Groovy", "^.*\\.(groovy)$", "ace/mode/groovy"],
  ["HTML", "^.*\\.(html|htm|xhtml|vue|we|wpy)$", "ace/mode/html"],
  ["INI", "^.*\\.(ini|cfg|prefs)$", "ace/mode/ini"],
  ["Java", "^.*\\.(java)$", "ace/mode/java"],
  ["JavaScript", "^.*\\.(js|jsm|jsx|cjs|mjs)$", "ace/mode/javascript"],
  ["JSON", "^.*\\.(json)$", "ace/mode/json"],
  ["JSP", "^.*\\.(jsp)$", "ace/mode/jsp"],
  ["Kotlin", "^.*\\.(kt|kts)$", "ace/mode/kotlin"],
  ["Log", "^.*\\.(log)$", "ace/mode/log"],
  ["Lua", "^.*\\.(lua)$", "ace/mode/lua"],
  ["Markdown", "^.*\\.(md|markdown)$", "ace/mode/markdown"],
  ["MATLAB", "^.*\\.(matlab)$", "ace/mode/matlab"],
  ["MySQL", "^.*\\.(mysql)$", "ace/mode/mysql"],
  ["Nginx", "^.*\\.(nginx|conf)$", "ace/mode/nginx"],
  ["pgSQL", "^.*\\.(pgsql)$", "ace/mode/pgsql"],
  ["PHP", "^.*\\.(php|inc|phtml|shtml|php3|php4|php5|phps|phpt|aw|ctp|module)$", "ace/mode/php"],
  ["Powershell", "^.*\\.(ps1)$", "ace/mode/powershell"],
  ["Properties", "^.*\\.(properties)$", "ace/mode/properties"],
  ["Protobuf", "^.*\\.(proto)$", "ace/mode/protobuf"],
  ["Python", "^.*\\.(py)$", "ace/mode/python"],
  ["Ruby", "rb$|^.*\\.ru$|^.*\\.gemspec$|^.*\\.rake$|^Guardfile$|^Rakefile$|^Gemfile$", "ace/mode/ruby"],
  ["Rust", "^.*\\.(rs)$", "ace/mode/rust"],
  ["SQL", "^.*\\.(sql)$", "ace/mode/sql"],
  ["Swift", "^.*\\.(swift)$", "ace/mode/swift"],
  ["Text", "^.*\\.(txt)$", "ace/mode/text"],
  ["Toml", "^.*\\.(toml)$", "ace/mode/toml"],
  ["Typescript", "^.*\\.(ts|mts|cts|typescript|str)$", "ace/mode/typescript"],
  ["XML", "^.*\\.(xml|rdf|rss|wsdl|xslt|atom|mathml|mml|xul|xbl|xaml)$", "ace/mode/xml"],
  ["YAML", "^.*\\.(yaml|yml)$", "ace/mode/yaml"]
]


const languageMode = ref("ace/mode/text")
const options: object[] = []

watch(languageMode, (value: string) => {
  // console.log(value)
  events.emit('changeMode', value)
})

languageList.forEach((lan: string[]) => {
  modes.push({
    name: lan[0],
    reg: new RegExp(lan[1], "gi"),
    mode: lan[2]
  })
  options.push({
    label: lan[0],
    value: lan[2]
  })
})


</script>

<template>
  <n-layout content-class="editor-layout">
    <n-layout-header>
      <n-space>
        <n-button type="info">Info</n-button>
        <n-select filterable placeholder="语言" v-model:value="languageMode" :options="options" />
      </n-space>
    </n-layout-header>
    <n-layout-content content-class="editor-layout-content">
      <n-tabs
          v-model:value="currTab"
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
      <code-editor :info="fileInfo" :curr-tab="currTab"></code-editor>
    </n-layout-content>
    <n-layout-footer>
      <n-breadcrumb>
        <n-breadcrumb-item>root</n-breadcrumb-item>
        <n-breadcrumb-item>user</n-breadcrumb-item>
        <n-breadcrumb-item>docker</n-breadcrumb-item>
      </n-breadcrumb>
    </n-layout-footer>
  </n-layout>


</template>

<style >
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