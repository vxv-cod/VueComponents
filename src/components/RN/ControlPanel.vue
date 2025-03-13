<template>
  <div class="rn-control-panel">
    <div class="rn-control-panel-item" v-if="allowAdding" title="Добавить строку">
      <Icon icon="plus" size="13px" />
    </div>
    <div class="rn-control-panel-item" v-if="showWordWrapButton" title="Вкл/выкл перенос по строкам">
      <Icon icon="text-height" size="13px"  @click="onWordWrapChanged" />
    </div>
    <div class="rn-control-panel-item" v-if="showColumnChooser" title="Выбрать столбцы">
      <Icon icon="table-columns" color="#333" size="13px" @click="columnsClick" />
      <DropDownList 
          v-if="columnsBoxVisible"
          :items="columnsBoxItems"
          key-expr="name"
          display-expr="caption"
          selected-expr="selected"
          icon-expr="icon"
          icon-color-expr="iconColor"
          selection-mode="multiple"
          align="right"
          :position-x="dropDownPositionX"
          :position-y="dropDownPositionY"
          :show-search-panel="true"
          :on-selection-changed="columnsSelectionChanged"
          :on-close="columnsClose" />
    </div>
    <div class="rn-control-panel-item" v-if="showResetFiltersButton && filterOn" @click="onFilterReset" title="Сбросить все фильтры">
      <Icon icon="filter-circle-xmark" color="#333" size="13px" />
    </div>
  </div>
</template>
<script>
import DropDownList from './DropDownList.vue';
export default {
  components: {
    DropDownList
  },
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    allowAdding: {
        type: Boolean,
        default: () => false
    },
    showWordWrapButton: {
      type: Boolean,
      default: () => false
    },
    showColumnChooser: {
        type: Boolean,
        default: () => false
    },
    showResetFiltersButton: {
        type: Boolean,
        default: () => false
    },
    onWordWrapChanged: {
      type: Function,
      default: () => {}
    },
    onSelectedColumnsChanged: {
      type: Function,
      default: () => {}
    },
    onFilterReset: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      columnsBoxVisible: false,
      dropDownPositionX: null,
      dropDownPositionY: null,
      selectedColumns: []
    }
  },
  methods: {
      columnsClick(e) {
        this.dropDownPositionX = e.pageX;
        this.dropDownPositionY = e.pageY;
        this.columnsBoxVisible = true;
      },
      columnsClose() {
        this.columnsBoxVisible = false;
        if(this.columnsChanged) {
          this.columnsChanged = false;
          this.onSelectedColumnsChanged({selectedColumns: this.selectedColumns});
        }
      },
      columnsSelectionChanged(e) {
        this.selectedColumns = e.selectedItems;
        this.columnsChanged = true;
      },
  },
  computed: {
    filterOn() {
      return !!this.columns.find(column => column.type === 'data');
    },
    columnsBoxItems() {
      return this.columns.map(item => {
        if(item.selected) {
          item.icon = "eye";
          item.iconColor = "#333";
        }
        else {
          item.icon = "eye-slash";
          item.iconColor = "#aaa";
        }
        return item;
      });
    }
  },
  mounted() {
  }
}
</script>
<style scoped>
  .rn-control-panel {
    display: flex;
    padding-right: 3px;
  }
  .rn-control-panel-item {
    position: relative;
    margin: 2px 1px;
    padding: 4px 5px;
    border: 1px solid #888;
    border-radius: 5px;
    width: 14px;
    cursor: pointer;
    fill: #555;
  }
  .rn-control-panel-item:hover {
    fill: #111;
    background-color: #ddd;
  }
</style>
