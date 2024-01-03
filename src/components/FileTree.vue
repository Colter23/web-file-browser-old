<script setup lang="ts">
import { useStore } from 'vuex'
import { events } from '../bus.js'

import userFolder from "../assets/folder.json"
import dockerFolder from "../assets/docker.json"

import {h, ref} from 'vue'
import { NTree, NIcon, TreeOption } from 'naive-ui'
import {
  Folder,
  FolderOpenOutline,
  FileTrayFullOutline,
  ChevronForward
} from '@vicons/ionicons5'
import {TreeOptions} from "naive-ui/es/tree/src/interface";
import axios from "axios";



const genIcon = (icon: any) => h(NIcon, null, {default: () => h(icon)})
const fileIcon = () => genIcon(FileTrayFullOutline)
const folderIcon = () => genIcon(Folder)
const folderOpenIcon = () => genIcon(FolderOpenOutline)

const updatePrefixWithExpaned = (
    _keys: Array<string | number>,
    _option: Array<TreeOption | null>,
    meta: {
      node: TreeOption | null
      action: 'expand' | 'collapse' | 'filter'
    }
) => {
  if (!meta.node) return
  switch (meta.action) {
    case 'expand':
      meta.node.prefix = folderOpenIcon
      break
    case 'collapse':
      meta.node.prefix = folderIcon
      break
  }
}
const nodeProps = ({ option }: { option: TreeOption }) => {
  return {
    ondblclick() {
      if (option.isLeaf) {
        console.log('[Click] ' + option.label)
        events.emit('openFile', option)

      }
    },
  }
}

const renderSwitcherIcon = () => h(NIcon, null, { default: () => h(ChevronForward) })

const handleLoad = (node: TreeOption) => {
  return new Promise<void>((resolve) => {
    // setTimeout(() => {
      node.children = convertFolderData(getFolderData(node.key as string));
      resolve()
    // }, 1000)
  })
}

type FolderInfos = FolderInfo[]
type FileInfos = FileInfo[]

interface FolderData {
  path: string;
  folder?: FolderInfos;
  file?: FileInfos;
}

interface FolderInfo {
  path: string;
  name: string;
  modified: string;
}

interface FileInfo {
  path: string;
  name: string;
  size: number;
  extension: string;
  modified: string;
}


function convertFolderData(data: FolderData): TreeOptions {

  const treeData: TreeOptions = []

  data.folder?.forEach((folder: FolderInfo) => {
    treeData.push({
      key: folder.path,
      label: folder.name,
      isLeaf: false,
      prefix: folderIcon
    })
  })

  data.file?.forEach((file: FileInfo) => {
    treeData.push({
      key: file.path,
      label: file.name,
      isLeaf: true,
      prefix: fileIcon
    })
  })

  return treeData;
}

function getFolderData(path: string): FolderData {
  if (path == '/user') {
    return userFolder as FolderData
  }else if (path == "/user/docker") {
    return dockerFolder as FolderData
  } else {
    return {
      path: path
    } as FolderData
  }
}

const data = ref(convertFolderData(getFolderData('/user')))


</script>

<template>
  <div class="tree">
    <n-tree
        block-line
        expand-on-click
        :show-line="true"
        :data="data"
        :on-load="handleLoad"
        :node-props="nodeProps"
        check-strategy="all"
        :on-update:expanded-keys="updatePrefixWithExpaned"
        :render-switcher-icon="renderSwitcherIcon"
    />
  </div>
</template>

<style scoped>
.tree {
  /*background: #181825;*/

  max-height: 100vh;
  height: 100vh;
  overflow: auto;
}
</style>