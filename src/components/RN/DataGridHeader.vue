<template>
  <tr v-for="(headerRow, headerIndex) in headerRowsColumns" v-bind:key="headerIndex"
      class="rn-data-grid-header">
    <th v-if="selectionMode === 'multiple' && headerIndex === 0" 
      :rowspan="headerRowsColumns.length"
      class="rn-fixed-left-checking">
      <div class="rows-multiple-checkbox-column">
        <CheckBox 
            :value="rowsCheck" 
            :allow-not-all-checked="true"
            :on-check-changed="onRowsChecked" />
      </div>
    </th>
    <th v-if="allowUpdating && headerIndex === 0" 
      :rowspan="headerRowsColumns.length"
       class="rn-fixed-left-control">
    </th>
    <th v-for="(column, columnIndex) in headerRow.columns"  
      v-bind:key="columnIndex"
      :data-index="column.visibleIndex"
      :rowspan="column.headerRowspan"
      :colspan="column.headerColspan"
      :class="columnClass(column)"
      :style="columnStyle(column)">
      <DataGridColumn
        :column="column"
        :allow-column-fixing="allowColumnFixing"
        :allow-grouping="allowGrouping"
        :on-sort-order-changed="onSortOrderChanged"
        :on-filter-changed="onFilterChanged"
        :on-column-context-menu-item-click="onColumnContextMenuItemClick" />
      <div class="column-resizer" v-if="allowColumnResizing && !column.fixed" @mousedown="initColumnResize"></div>
    </th>
    <th v-if="allowDeleting && headerIndex === 0" 
      :rowspan="headerRowsColumns.length"
      class="rn-fixed-right-control">
    </th>
  </tr>
</template>

<script>
  
  import CheckBox from './CheckBox.vue';
  import DataGridColumn from './DataGridColumn.vue';

  export default {
    components: {
      CheckBox,
      DataGridColumn
    },
    props: {
      columns: {
        type: Object,
        default: () => {}
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
      rowsCheck: {
          type: Boolean,
          default: () => false
      },
      allowColumnResizing: {
          type: Boolean,
          default: () => false
      },
      allowColumnFixing: {
        type: Boolean,
        default: () => false
      },
      allowGrouping: {
        type: Boolean,
        default: () => false
      },
      onRowsChecked: {
        type: Function,
        default: () => {}
      },
      onSortOrderChanged: {
        type: Function,
        default: () => {}
      },
      onFilterChanged: {
        type: Function,
        default: () => {}
      },
      onColumnResized: {
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
      }
    },
    methods: {
      columnClass(column) {
        return column.fixed ? column.fixedPosition === 'right' ? 'rn-fixed-right-cell' : 'rn-fixed-left-cell' : '';
      },
      columnStyle(column) {
          let style = "";
          if(column.width) {
            style += `width:${column.width}px;min-width:${column.width}px;max-width:${column.width}px;`;
          }
          return style;
      },

      initColumnResize(e) {
        this.currentTh = e.target.parentElement;
        this.startX = e.clientX;
        this.startWidth = this.currentTh.offsetWidth;

        document.addEventListener('mousemove', this.resizeColumn);
        document.addEventListener('mouseup', this.stopResize);
      },

      resizeColumn(e) {
        const newWidth = this.startWidth + (e.clientX - this.startX);
        this.currentTh.style.width = `${newWidth}px`;
        this.currentTh.style.minWidth = `${newWidth}px`;
        this.currentTh.style.maxWidth = `${newWidth}px`;
      },

      stopResize() {
        document.removeEventListener('mousemove', this.resizeColumn);
        document.removeEventListener('mouseup', this.stopResize);
        this.onColumnResized({
          component: this,
          element: this.currentTh,
          width: this.currentTh.style.width,
          minWidth: this.currentTh.style.width,
          maxWidth: this.currentTh.style.width,
          column: this.column
        });
      }
  },
  computed: {
    headerRowsColumns() {
      let rowsColumns = [];
      let number = 1;
      while(this.columns) {
        let columns = this.columns.filter(column => column.headerRowNumber === number);
        if(columns.length === 0) {
          break;
        }
        rowsColumns.push({
          columns
        });
        number++;
      }
      return rowsColumns;
    }
  }
}
</script>
<style scoped>
  .rows-multiple-checkbox-column {
    text-align: center;
  }
  .rn-data-grid-header th {
    position: relative;
  }
  .column-resizer {
      position: absolute;
      top: 0;
      right: 0;
      width: 2px;
      height: 100%;
      cursor: col-resize;
      background-color: transparent;
      user-select: none;
    }

    .column-resizer:hover {
      background-color: #888888;
    }
</style>
