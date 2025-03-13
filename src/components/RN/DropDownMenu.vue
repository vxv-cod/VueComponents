<template>
  <DropDownContent :align="align" :position-x="positionX" :position-y="positionY" :on-close="onClose" >
    <template #content>
      <ListBox 
        :items="items"
        :key-expr="keyExpr"
        :display-expr="displayExpr"
        selection-mode="single"
        :show-search-panel="false"
        :on-selection-changed="selectionChanged" />
    </template>
  </DropDownContent>
</template>
<script>
  import DropDownContent from './DropDownContent.vue';
  import ListBox from './ListBox.vue';
  export default {
    components: {
      DropDownContent,
      ListBox
    },
    props: {
      items: {
        type: Array,
        default: () => []
      },
      displayExpr: {
        type: String,
        default: () => "Title"
      },
      keyExpr: {
        type: String,
        default: () => "Id"
      },
      align: {
        type: String,
        default: () => "left"
      },
      positionX: {
        type: Number,
        default: () => null
      },
      positionY: {
        type: Number,
        default: () => null
      },
      onItemClick: {
        type: Function,
        default: () => {}
      },
      onClose: {
        type: Function,
        default: () => {}
      }
    },
    data() {
      return {
        listVisible: false,
        listBoxActive: false,
      }
    },
    methods: {
      selectionChanged(e) {
        if(e.selectedItems?.length === 1) {
          const item = e.selectedItems[0];
          item.selected = null;
          this.onItemClick(item);
        }
      }
    }
  }
  </script>

  <style scoped>

  </style>
