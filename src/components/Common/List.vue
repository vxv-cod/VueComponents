<template>
    <DxList
        ref="listRef"
        :items="items"
        :data-source="dataSource"
        :selected-items="selectedItems"
        :show-selection-controls="showSelectionControls"
        :display-expr="displayExpr"
        :key-expr="keyExpr"
        :width="width"
        :height="height"
        :search-enabled="searchEnabled"
        :search-expr="displayExpr"
        search-mode="contains"
        :selection-mode="selectionMode"
        select-all-mode="allPages"
        :grouped="grouped"
        :disabled="disabled"
        @selection-changed="onSelectionChanged">
      </DxList>
</template>

<script>

import DxList from 'devextreme-vue/list';

export default {
  components: { 
    DxList
  },
  props: {
    dataSource: {
    },
    items: {
      type: Array,
      default: () => []
    },
    selectedItems: {
      type: Array,
      default: () => []
    },
    showSelectionControls: {
      type: Boolean,
      default: () => false
    },
    searchEnabled: {
      type: Boolean,
      default: () => false
    },
    grouped: {
      type: Boolean,
      default: () => false
    },
    displayExpr: {
      type: String,
      default: () => null
    },
    keyExpr: {
      type: String,
      default: () => null
    },
    width: {
      default: () => null
    },
    height: {
      default: () => null
    },
    selectionMode: {
      type: String,
      default: () => "single"
    },
    onSelectionChanged: {
      type: Function,
      default: () => function() {}
    },
    disabled: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    instance () {
      return this.$refs["listRef"].instance;
    }
  }
}
</script>