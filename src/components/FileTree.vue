<script setup lang="ts">
import {useEditorStore} from '../store'
import {h, Ref, ref} from 'vue'
import {NIcon, NTree, TreeOption} from 'naive-ui'
import {ChevronForward, FileTrayFullOutline, Folder, FolderOpenOutline} from '@vicons/ionicons5'
import {TreeOptions} from "naive-ui/es/tree/src/interface";
import {FileInfo, FolderData, FolderInfo} from "../class.ts";
import network from "../network";

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
  return new Promise<void>(async (resolve) => {
    node.children = convertFolderData(await getFolderData(node.key as string));
    resolve();
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
async function getFolderData(path: string): Promise<FolderData> {
  return (await network.get(`file${path}`)).data
}

const treeData: Ref<TreeOptions> = ref();

// 获取根目录数据
getFolderData('/').then(data => {
  console.log(data)
  treeData.value = convertFolderData(data);
});


</script>

<template>
  <div class="tree">
    <n-tree
        block-line
        expand-on-click
        :show-line="true"
        :data="treeData"
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