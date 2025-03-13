<template>
  <DropDownContent :align="align" :position-x="positionX" :position-y="positionY" :on-close="onClose" >
    <template #content>
      <DateListBox 
        v-if="dataType == 'date'"
        :items="items"
        :selected-values="selectedValues"
        :key-expr="keyExpr"
        :display-expr="displayExpr"
        :selected-expr="selectedExpr"
        :selection-mode="selectionMode"
        :show-search-panel="showSearchPanel"
        :on-selection-changed="onSelectionChanged" />
      <ListBox 
        v-else
        :items="items"
        :selected-values="selectedValues"
        :key-expr="keyExpr"
        :display-expr="displayExpr"
        :selected-expr="selectedExpr"
        :icon-expr="iconExpr"
        :icon-color-expr="iconColorExpr"
        :selection-mode="selectionMode"
        :show-search-panel="showSearchPanel"
        :on-selection-changed="onSelectionChanged" />
      <div class="drop-down-list-buttons">
        <Button 
          text="ОК"
          :width="90"
          :on-click="onClose"/>
      </div>
    </template>
  </DropDownContent>
</template>
<script>
  import DropDownContent from './DropDownContent.vue';
  import ListBox from './ListBox.vue';
  import DateListBox from './DateListBox.vue';
  import Button from './Button.vue';
  
  export default {
    components: {
      DropDownContent,
      ListBox,
      DateListBox,
      Button
    },
    props: {
      items: {
        type: Array,
        default: () => []
      },
      selectedValues: {
        type: Array,
        default: () => []
      },
      dataType: {
        type: String,
        default: () => null
      },
      displayExpr: {
        type: String,
        default: () => "Title"
      },
      keyExpr: {
        type: String,
        default: () => "Id"
      },
      selectedExpr: {
        type: String,
        default: () => "selected"
      },
      iconExpr: {
        type: String,
        default: () => null
      },
      iconColorExpr: {
        type: String,
        default: () => null
      },
      selectionMode: {
        type: String,
        default: () => "single"
      },
      align: {
        type: String,
        default: () => "left"
      },
      showSearchPanel: {
        type: Boolean,
        default: () => false
      },
      positionX: {
        type: Number,
        default: () => null
      },
      positionY: {
        type: Number,
        default: () => null
      },
      onSelectionChanged: {
        type: Function,
        default: () => {}
      },
      onClose: {
        type: Function,
        default: () => {}
      }
    }
  }
  </script>

  <style scoped>
    .drop-down-list-buttons {
      padding-top: 10px;
      display: flex;
      align-items: center;
      align-content: center;
      justify-items: center;
    }
  </style>
