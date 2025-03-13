<template>
  <div class="rn-list-box">
    <div class="rn-list-search-panel" v-if="showSearchPanel">
      <SearchBox :on-search-text-changed="searchTextChanged"/>
    </div>
    <div class="rn-list-items rn-thin-scrollbar">
      <div class="rn-list-item" v-for="(item, index) in listItems" v-bind:key="index" @click="filterItemClick(item)">
        <span v-if="iconExpr" class="rn-list-icon">
          <Icon :icon="item[iconExpr]" :color="item[iconColorExpr]" size="14px" />
        </span>
        <span v-if="item[disabledExpr]" class="disabled" :title="item[displayExpr]">{{ item[displayExpr] }}</span>
        <span v-else-if="item[selectedExpr]" class="selected" :title="item[displayExpr]">{{ item[displayExpr] }}</span>
        <span v-else class="normal" :title="item[displayExpr]">{{ item[displayExpr] }}</span>
      </div>
    </div>
  </div>
</template>

<script>
const includesCaseInsensitive = (str, searchString) => new RegExp(searchString, 'i').test(str);

import SearchBox from './SearchBox.vue';

export default {
  components: {
    SearchBox
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
    disabledExpr: {
      type: String,
      default: () => "disabled"
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
      serchText: ""
    }
  },
  methods: {
    searchTextChanged(serchText) {
      this.serchText = serchText;
    },
    filterItemClick(item) {
      if(item[this.disabledExpr]) return;

      let selectedItems = [];
      if(this.selectionMode == "single") {
        item[this.selectedExpr] = true;
        for(let listItem of this.listItems) {
          if(listItem !== item) {
            listItem[this.selectedExpr] = false;
          }
        }
        selectedItems.push(item);
      }
      else if (this.selectionMode == "multiple") {
        item[this.selectedExpr] = !item[this.selectedExpr];
        for(let listItem of this.listItems) {
          if(listItem[this.selectedExpr]) {
            selectedItems.push(listItem);
          }
        }
      }
      
      this.filterChanged = true;
      this.onSelectionChanged({selectedItems});
    }
  },
  computed: {
    listItems() {
      return this.items.filter(item => this.serchText == "" || includesCaseInsensitive(item[this.displayExpr], this.serchText));
    }
  },
  mounted() {
    if(this.selectedValues.length) {
      for(let listItem of this.listItems) {
        listItem[this.selectedExpr] = this.selectedValues.find(value => value === listItem[this.keyExpr]);
      }
    }
  }
}
</script>
<style scoped>
  .rn-list-box {
    padding: 0;
  }
  .rn-list-search-panel {
    padding: 4px 0;
  }
  .rn-list-items {
    max-height: 260px;
    overflow: hidden;
    overflow-y: auto;
    padding: 2px;
  }
  .rn-list-item {
    padding: 4px;
    white-space: nowrap;
    min-width: 130px;
    max-width: 350px;
    overflow-x: hidden;
  }
  .rn-list-item:hover {
    background-color: #74747436;
  }

  .rn-list-icon {
    width: 24px;
    margin-right: 6px;
  }

  .rn-list-item .normal {
    cursor: pointer;
  }
  .rn-list-item .disabled {
    color: #aaa;
    cursor: default;
  }
  .rn-list-item .selected {
    font-weight: bold;
    cursor: pointer;
  }
</style>
