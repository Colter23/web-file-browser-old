<script setup lang="ts">
import { useEditorStore } from '../store'

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
import {FileInfo, FolderData, FolderInfo} from "../class.ts";

// 文件原始信息列表
const rawFileList: Map<String, FileInfo> = new Map();

// 编辑器数据仓库
const editorStore = useEditorStore();

// 创建图标元素
const genIcon = (icon: any) => h(NIcon, null, {default: () => h(icon)});
const fileIcon = () => genIcon(FileTrayFullOutline);
const folderIcon = () => genIcon(Folder);
const folderOpenIcon = () => genIcon(FolderOpenOutline);
const renderSwitcherIcon = () => genIcon(ChevronForward);

// 更新文件夹展开图标
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

// 文件树事件
const nodeProps = ({ option }: { option: TreeOption }) => {
  return {
    // 双击文件事件
    ondblclick() {
      // 仅叶子节点（文件）触发
      if (option.isLeaf) {
        console.log('%c[Click] ' + option.label, 'background:rgba(133,108,217,1)');

        const fileKey = option.key as string;
        if (editorStore.getEditFileInfo(fileKey) == undefined) {
          editorStore.addEditFile(fileKey, rawFileList.get(fileKey));
        }
        editorStore.currentFile = fileKey;
      }
    },
  };
}

// 异步加载文件树数据
const handleLoad = (node: TreeOption) => {
  return new Promise<void>((resolve) => {
    // setTimeout(() => {
      node.children = convertFolderData(getFolderData(node.key as string));
      resolve();
    // }, 1000)
  });
}

// 转换文件夹数据到文件树
function convertFolderData(data: FolderData): TreeOptions {
  const treeData: TreeOptions = [];

  data.folder?.forEach((folder: FolderInfo) => {
    treeData.push({
      key: folder.path,
      label: folder.name,
      isLeaf: false,
      prefix: folderIcon
    });
  })

  data.file?.forEach((file: FileInfo) => {
    treeData.push({
      key: file.path,
      label: file.name,
      isLeaf: true,
      prefix: fileIcon
    });

    // 将文件添加到列表
    rawFileList.set(file.path, file);
  })

  return treeData;
}

// 临时获取文件夹数据
function getFolderData(path: string): FolderData {
  // TODO("使用 axios 获取文件夹数据")
  if (path == '/user') {
    return userFolder as FolderData;
  }else if (path == "/user/docker") {
    return dockerFolder as FolderData;
  } else {
    return {
      path: path
    } as FolderData;
  }
}

// 获取根目录数据
const data = ref(convertFolderData(getFolderData('/user')));

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
  max-height: 100vh;
  height: 100vh;
  overflow: auto;
}
</style>