<template>
  <div class="rn-group-panel">
    <div v-for="(group, index) in groups" v-bind:key="index"
        :class="'rn-group-level-' + group.level + ' rn-group-item'">
      <span class="rn-grouping-column" >
        <DataGridColumn
          :column="group.column"
          :allow-grouping="allowGrouping"
          :on-sort-order-changed="onSortOrderChanged"
          :on-filter-changed="onFilterChanged"
          :on-column-context-menu-item-click="onColumnContextMenuItemClick" />
      </span>
      <span class="rn-grouping-removed-button" @click="onGroupingRemoved(group)" title="Разгруппировать"> x </span>
    </div>
  </div>
</template>

<script>
  import DataGridColumn from './DataGridColumn.vue';
  export default {
    components: {
      DataGridColumn
    },
    props: {
      groups: {
        type: Array,
        default: () => []
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
      onGroupingRemoved: {
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
    }
  }
</script>

<style scoped>
  .rn-group-panel {
    display: flex;
  }
  .rn-group-item {
    display: flex;
    border: 1px solid #aaa;
    /* border-radius: 5px; */
    margin-right: 3px;
    padding: 0 3px;
  }
  .rn-grouping-column {
    min-width: 150px;
    max-width: 250px;
    white-space: nowrap;
    /* overflow: hidden; */
  }
  .rn-grouping-removed-button {
    cursor: pointer;
    font-weight: bold;
    margin-left: 3px;
    margin-top: -3px;
  }
</style>
