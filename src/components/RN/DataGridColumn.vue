<template>
  <div class="rn-data-grid-column" :style="columnStyle" @contextmenu="columnContextMenuClick">
    <div class="grid-column-caption" @click="onSortOrderChanged({column})">
      <span>{{column.caption}}</span>
      <span v-if="column.type === 'data'">
        <span v-if="column.sortIndex >= 0 && column.sortOrder==='asc'"> &#8593;</span>
        <span v-else-if="column.sortIndex >= 0 && column.sortOrder==='desc'"> &#8595;</span>
      </span>
    </div>
    <div v-if="column.type === 'data'" class="grid-column-filter">
      <span @click="filterClick" title="Фильтр значений столбца">
        <Icon :icon="'filter'" :color="column.selectedValues.length > 0 ? '#333' : '#aaa'" size="13px" />
      </span>
      <DropDownList 
        v-if="filterBoxVisible"
        :items="filterItems"
        :data-type="column.dataType"
        key-expr="value"
        display-expr="displayValue"
        selected-expr="selected"
        selection-mode="multiple"
        :show-search-panel="true"
        :align="dropDownAlign"
        :position-x="dropDownPositionX"
        :position-y="dropDownPositionY"
        :on-selection-changed="filterSelectionChanged"
        :on-close="filterClose" />
      <DropDownMenu
        v-if="contextMenuVisible && contextMenuItems.length > 0"
        :items="contextMenuItems"
        :align="dropDownAlign"
        :position-x="dropDownPositionX"
        :position-y="dropDownPositionY"
        key-expr="Name"
        display-expr="Title"
        :on-item-click="contextMenuItemClick"
        :on-close="contextMenuClose" />
    </div>
  </div>
</template>
<script>
  import DropDownList from './DropDownList.vue';
  import DropDownMenu from './DropDownMenu.vue';
  export default {
    components: {
      DropDownList,
      DropDownMenu
    },
    props: {
      column: {
        type: Object,
        default: () => {}
      },
      allowColumnFixing: {
        type: Boolean,
        default: () => false
      },
      allowGrouping: {
        type: Boolean,
        default: () => false
      },
      onSortOrderChanged: {
        type: Function,
        default: () => {}
      },
      onFilterChanged: {
        type: Function,
        default: () => {}
      },
      onColumnContextMenuItemClick: {
        type: Function,
        default: () => {}
      }
    },
    data() {
      return {
        filterBoxVisible: false,
        filterChanged: false,
        dropDownPositionX: null,
        dropDownPositionY: null,
        contextMenuVisible: false,
        currentTh: null,
        startX: 0,
        startWidth: 0
      }
    },
    methods: {
      filterClick(e) {
        event.preventDefault();
        this.dropDownPositionX = e.pageX;
        this.dropDownPositionY = e.pageY;
        this.filterBoxVisible = true;
      },
      filterClose() {
        this.filterBoxVisible = false;
        if(this.filterChanged) {
          this.filterChanged = false;
          this.onFilterChanged({column: this.column});
        }
      },
      filterSelectionChanged() {
        this.filterChanged = true;
      },

      columnContextMenuClick(e) {
        event.preventDefault();
        this.dropDownPositionX = e.pageX;
        this.dropDownPositionY = e.pageY;
        this.contextMenuVisible = true;
      },
      contextMenuItemClick(item) {
        this.onColumnContextMenuItemClick({
          column: this.column,
          item
        });
        this.contextMenuVisible = false;
      },
      contextMenuClose() {
        this.contextMenuVisible = false;
      }
    },
    computed: {
      dropDownAlign() {
        return (this.column.visibleIndex > 3 || this.column.groupIndex > 3) ? 'right' : 'left';
      },
      columnStyle() {
        if(this.column.alignment) {
          return "text-align:" + this.column.alignment;
        }
        return null;
      },
      filterItems() {
        return this.column.filterItems.filter(item => !item.disabled)
      },
      contextMenuItems() {
        return [
          {
            Name: "Grouping",
            Title: "Группировать",
            visible: this.allowGrouping && this.column.groupIndex == null  && !this.column.parent
          }, {
            Name: "GroupExpandAllRows",
            Title: "Развернуть все строки",
            visible: this.allowGrouping && this.column.groupIndex >= 0
          }, {
            Name: "GroupCollapseAllRows",
            Title: "Свернуть все строки",
            visible: this.allowGrouping && this.column.groupIndex >= 0
          }, {
            Name: "Invisible",
            Title: "Скрыть",
            visible: this.column.visible
          }, {
            Name: "FixedLeft",
            Title: "Закрепить слева",
            visible: this.allowColumnFixing && this.column.groupIndex == null && (!this.column.fixed || this.column.fixedPosition === 'right') && !this.column.parent
          }, {
            Name: "FixedRight",
            Title: "Закрепить справа",
            visible: this.allowColumnFixing && this.column.groupIndex == null && (!this.column.fixed || this.column.fixedPosition !== 'right') && !this.column.parent
          }, {
            Name: "Unfixed",
            Title: "Отменить закрепление",
            visible: this.allowColumnFixing && this.column.fixed && !this.column.parent
          }
        ].filter(item => item.visible);
      }
    },
    mounted() {
    }
  }
  </script>
  <style scoped>
    .rn-data-grid-column {
        margin: 0;
        padding: 0;
        cursor: default;
        display: flex;
        justify-content: space-between;
        height: 100%;
    }
    .grid-column-caption {
      padding: 6px 3px;
      flex: 1, 1, auto;
      cursor: pointer;
    }
    .grid-column-filter {
      padding: 5px 3px;
      flex: 0, 0, 24px;
      cursor: pointer;
      position: relative;
      width: 13px;
    }
  </style>
