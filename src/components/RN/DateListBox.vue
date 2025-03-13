<template>
  <div class="rn-date-list-box">
    <div class="rn-date-list-items rn-thin-scrollbar">
      <div v-for="(item, index) in visibleListItems" 
          v-bind:key="index" 
          :class="item.class"
          @click="expandItemClick(item)">
        <Icon v-if="!item.day" :icon="item.expanded ? 'caret-down' : 'caret-right'" color="#333" size="12px" />
        <CheckBox 
          :value="item.checked" 
          :allow-not-all-checked="true"
          :on-check-changed="(value) => checkItemChanged(item, value)" />
        <span>{{ item[displayExpr] }}</span>
      </div>
    </div>
  </div>
</template>

<script>

import CheckBox from './CheckBox.vue';
import utils from '@/utils';

export default {
  components: {
    CheckBox
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
    keyExpr: {
      type: String,
      default: () => "Id"
    },
    displayExpr: {
      type: String,
      default: () => "Title"
    },
    selectedExpr: {
      type: String,
      default: () => "selected"
    },
    selectionMode: {
      type: String,
      default: () => "single"
    },
    showSearchPanel: {
        type: Boolean,
        default: () => false
    },
    onSelectionChanged: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      filterChanged: false,
      listItems: []
    }
  },
  methods: {
    setListItems() {
      this.listItems = [];
      if(this.items) {
        for(let item of this.items) {
          if(item.value instanceof Date) {
            let year = item.value.getFullYear();
            let month = item.value.getMonth() + 1;
            let day = item.value.getDate();

            let yearItem = this.listItems.find(li => li.year == year);
            if(!yearItem) {
              yearItem = {
                year,
                displayValue: year,
                class: "rn-date-list-item rn-date-year-item",
                childs: [],
                expanded: false
              };
              this.listItems.push(yearItem);
            }

            let monthItem = this.listItems.find(li => li.year == year && li.month == month);
            if(!monthItem) {
              monthItem = {
                year,
                month,
                displayValue: utils.getMonthTitle(month),
                class: "rn-date-list-item rn-date-month-item",
                parent: yearItem,
                childs: [],
                expanded: false
              };
              this.listItems.push(monthItem);
            }
            yearItem.childs.push(monthItem);

            let dayItem = this.listItems.find(li => li.year == year && li.month == month && li.day == day);
            if(!dayItem) {
              dayItem = {
                year,
                month,
                day,
                displayValue: day,
                items: [],
                class: "rn-date-list-item rn-date-day-item",
                parent: monthItem
              };
              this.listItems.push(dayItem);
            }
            monthItem.childs.push(dayItem);
            dayItem.items.push(item);
          }
        }
      }

      for(let dayItem of this.listItems.filter(li => li.year && li.month && li.day)) {
        const selectedItems = dayItem.items.filter(item => item[this.selectedExpr]);
        dayItem.checked = dayItem.items.length === selectedItems.length;
        if(selectedItems.length === dayItem.items.length) {
          dayItem.checked = true;
        }
        else {
          dayItem.checked = false;
          for(let item of dayItem.items) {
            item[this.selectedExpr] = false;
          }
        }
      }

      this.setListItemsCheckAndVisible();
    },
    setListItemsCheckAndVisible() {
     
      for(let monthItem of this.listItems.filter(li => li.year && li.month && !li.day)) {
        if(monthItem.childs.filter(child => child.checked === false).length === monthItem.childs.length) {
          monthItem.checked = false;
        }
        else if(monthItem.childs.filter(child => child.checked === true).length === monthItem.childs.length) {
          monthItem.checked = true;
        }
        else {
          monthItem.checked = null;
        }
      }
      
      for(let yearItem of this.listItems.filter(li => li.year && !li.month && !li.day)) {
        if(yearItem.childs.filter(child => child.checked === false).length === yearItem.childs.length) {
          yearItem.checked = false;
        }
        else if(yearItem.childs.filter(child => child.checked === true).length === yearItem.childs.length) {
          yearItem.checked = true;
        }
        else {
          yearItem.checked = null;
        }
      }
    },
    checkItemChanged(item, checked) {
      event.stopImmediatePropagation();

      item.checked = checked;
      if(item.day) {
        for(let i of item.items) {
          i[this.selectedExpr] = item.checked;
        }
      }
      for(let listItem of this.listItems) {
        if(listItem?.parent === item || listItem?.parent?.parent === item) {
          listItem.checked = item.checked;
          if(listItem.day) {
            for(let i of listItem.items) {
              i[this.selectedExpr] = item.checked;
            }
          }
        }
      }

      this.setListItemsCheckAndVisible();

      this.onSelectionChanged({selectedItems: this.items.filter(i => i[this.selectedExpr])});
    },
    expandItemClick(item) {
      if(item.expanded !== undefined) {
        item.expanded = !item.expanded;
      }
    }
  },
  computed: {
    visibleListItems() {
      return this.listItems.filter(li => !li.parent || li.parent.expanded && (!li.parent.parent || li.parent.parent.expanded));
    }
  },
  mounted() {
    this.setListItems();
  }
}
</script>
<style scoped>
  .rn-date-list-box {
    padding: 0;
  }
  .rn-date-list-search-panel {
    padding: 4px 0;
  }
  .rn-date-list-items {
    max-height: 250px;
    overflow: hidden;
    overflow-y: auto;
    padding: 2px;
  }
  .rn-date-list-item {
    cursor: pointer;
    padding: 2px;
  }
  .rn-date-list-item:hover {
    background-color: #74747436;
  }

  .rn-date-year-item,
  .rn-date-month-item,
  .rn-date-day-item {
    white-space: nowrap;
    width: 150px;
  }

  .rn-date-year-item {
    padding-left: 2px;
  }
  .rn-date-month-item {
    padding-left: 16px;
  }
  .rn-date-day-item {
    padding-left: 30px;
  }
</style>
