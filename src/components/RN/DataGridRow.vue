<template>
  <tr v-if="row.type === 'group'" 
     @contextmenu="columnContextMenuClick"
     @click="rowClick" 
     :class="'rn-group-row rn-group-level-' + row.level">
    <td :class="groupColumnClass()">
      <div :class='"group-row-content group-row-level-" + row.level'>
        <Icon :icon="row.expanded ? 'caret-down' : 'caret-right'" color="#333" size="12px" />
        {{ row.caption }} 
        <!-- ({{ row.childRowsCount !== row.pageRowsCount ? (row.pageRowsCount + ' из ') : '' }}{{ row.childRowsCount }}) -->
        ({{ row.pageRowsCount }})
      </div>
    </td>
    <td :colspan="groupColspan"></td>
  </tr>
  <tr v-if="row.type === 'data'"
     @contextmenu="columnContextMenuClick"
     @click="rowClick" 
     :class="'rn-data-grid-row' + (row.selected ? ' rn-data-grid-selected-row' : '')">
    <td v-if="selectionMode === 'multiple'" class="rn-fixed-left-checking">
      <div class="row-checking">
        <input type="checkbox" :checked="row.selected">
      </div>
    </td>
    <td v-if="allowUpdating" class="rn-fixed-left-control">
      <div class="row-controls" title="Редактировать строку">
        <Icon icon="edit" color="#333" size="13px" />
      </div>
    </td>
    <td v-for="(column, index) in columns" v-bind:key="index" :data-index="column.visibleIndex"
      :class="columnClass(column)">
      <div class="row-cell">
        <DataGridCell
          :cell="getCell(column)"
          :word-wrap="wordWrap" />
      </div>
    </td>
    <td v-if="allowDeleting" class="rn-fixed-right-control">
      <div class="row-controls" title="Удалить строку">
        <Icon icon="trash" color="#333" size="13px" />
      </div>
    </td>
  </tr>
  <DropDownMenu
    v-if="contextMenuVisible && contextMenuItems.length > 0"
    :items="contextMenuItems"
    :position-x="dropDownPositionX"
    :position-y="dropDownPositionY"
    key-expr="Name"
    display-expr="Title"
    :on-item-click="contextMenuItemClick"
    :on-close="contextMenuClose" />
</template>

<script>

import DataGridCell from '@/components/RN/DataGridCell.vue';
import DropDownMenu from './DropDownMenu.vue';

export default {
  components: {
    DataGridCell,
    DropDownMenu
  },
  props: {
    columns: {
      type: Object,
      default: () => {}
    },
    row: {
      type: Object,
      default: () => {}
    },
    wordWrap: {
      type: Boolean,
      default: () => true
    },
    allowUpdating: {
      default: () => false
    },
    allowDeleting: {
      default: () => false
    },
    selectionMode: {
        type: String
    },
    onRowClick: {
      type: Function,
      default: () => {}
    },
    onRowContextMenuItemClick: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      dropDownPositionX: null,
      dropDownPositionY: null,
      contextMenuVisible: false,
    }
  },
  methods: {
    columnClass(column) {
      return column.fixed ? column.fixedPosition === 'right' ? 'rn-fixed-right-cell' : 'rn-fixed-left-cell' : '';
    },
    groupColumnClass() {
      return this.columns.find(c => c.fixed) ? 'rn-fixed-left-group' : '';
    },
    getCell(column) {
      return this.row.cells.find(cell => cell.column === column);
    },
    rowClick() {
      const row = this.row;
      row.selected = !row.selected
      this.onRowClick({
        row
      });
    },
    columnContextMenuClick(e) {
      event.preventDefault();
      this.dropDownPositionX = e.pageX;
      this.dropDownPositionY = e.pageY;
      this.contextMenuVisible = true;
    },
    contextMenuItemClick(item) {
      this.onRowContextMenuItemClick({
        row: this.row,
        item
      });
      this.contextMenuVisible = false;
    },
    contextMenuClose() {
      this.contextMenuVisible = false;
    }
  },
  computed: {
    groupColspan() {
      let groupColspan = this.columns.length - 1;
      if(this.allowUpdating) groupColspan++;
      if(this.allowDeleting) groupColspan++;
      if(this.selectionMode === 'multiple') groupColspan++;
      return groupColspan;
    },
    contextMenuItems() {
      return [
        {
          Name: "Ungrouping",
          Title: "Разгруппировать",
          visible: this.row.type === 'group'
        }
      ].filter(item => item.visible);
    }
  }
}
</script>
<style scoped>
  .rn-group-row {
    position: relative;
  }

  .rn-group-row td {
    height: 28px;
    position: sticky;
    left: 0;
    border-right: 0;
  }

  .group-row-content {
    top: 0;
    padding: 5px;
    position: absolute;
    white-space: nowrap;
  }
  .group-row-level-0 {
    padding-left: 3px;
  }
  .group-row-level-1 {
    padding-left: 15px;
  }
  .group-row-level-2 {
    padding-left: 27px;
  }
  .group-row-level-3 {
    padding-left: 39px;
  }
  .group-row-level-4 {
    padding-left: 51px;
  }
  .row-checking {
    margin: 4px 5px;
    width: 20px;
  }
  .row-checking input {
    cursor: pointer;
  }
  .row-controls {
    margin: 4px 10px;
    width: 12px;
    cursor: pointer;
  }
  .row-cell {
    padding: 2px;
  }
</style>
