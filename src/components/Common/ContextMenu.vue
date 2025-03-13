<template>
<!-- eslint-disable vue/valid-v-model -->
    <DxContextMenu
      :data-source="items"      
      v-model:visible="contentMenuIsVisible"
      :width="width"
      @item-click="click"
      @showing="handleShowingEvent"
      @shown="handleShownEvent"
      @hiding="handleHidingEvent"
      @hidden="handleHiddenEvent"
      :target="target">
    </DxContextMenu>
</template>
<!-- eslint-enable -->
<script>

import DxContextMenu from 'devextreme-vue/context-menu';

export default {
  components: { 
    DxContextMenu,
    // DxContextMenuTypes
  },
  data() {
      return {
        contentMenuIsVisible: false
      }
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    target: { 
    },
    visible: { 
      type: Boolean,
      default: () => false
    },
    width: { 
      type: Number,
      default: () => 200
    },
  },
  methods: {
    click(e) {
      if (e && e.itemData && e.itemData.click) {
        e.itemData.click(e, this.target);
      }
    },
    handleShowingEvent(e) {
          // Handler of the 'showing' event
          console.log("handleShowingEvent", e);
    },
    handleShownEvent(e) {
        // Handler of the 'shown' event
        console.log("handleShownEvent", e);
    },
    handleHidingEvent(e) {
        // Handler of the 'hiding' event
        console.log("handleHidingEvent", e);
    },
    handleHiddenEvent(e) {
        // Handler of the 'hidden' event
        console.log("handleHiddenEvent", e);
    }
  },
  watch: {
    visible(value) {
      this.contentMenuIsVisible = value;
    }
  },
  mounted() { 
    this.contentMenuIsVisible = this.visible;

  }
}
</script>