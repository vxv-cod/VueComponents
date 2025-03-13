<template>
  <div class="rn-data-grid-pager">
    <div class="rn-data-grid-page-sizes" v-if="showPageSelector">
      <div v-for="size in allowedPageSizes" v-bind:key="size">
        <div :class="size === pager.pageSize ? 'current-item' : 'item'" @click="() => selecionPageSize(size)">
          {{size}}
        </div>
      </div>
    </div>
    <div v-else></div>
    <div class="rn-data-grid-pages">
      <div class="rn-data-grid-pager-info">
        Страница {{pager.currentPageIndex + 1}} из {{pager.pageCount}} (Всего строк: {{pager.rowsCount}})
      </div>
      <div v-for="item in selectionPageItems" v-bind:key="item.pageIndex">
        <div v-if="!item.separator" :class="item.pageIndex === pager.currentPageIndex ? 'current-item' : 'item'" @click="() => selecionPage(item.pageIndex)">
          {{ item.pageTitle }}
        </div>
        <div v-else class="separator">
          ...
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
  },
  props: {
    pager: {
      type: Object,
      default: () => {}
    },
    showPageSelector: {
      type: Boolean,
      default: () => false
    },
    onSelecionPageSize: {
      type: Function,
      default: () => {}
    },
    onSelecionPage: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      allowedPageSizes: [10, 20, 50, 100, 200, 500, 1000],
      allowedPageCount: 8,
      selectionPageItems: []
    }
  },
  methods: {
    setSelectionPageItems() {
      let items = [];
      
      let visiblePageIndexes = [];
      const startPageIndex = 0;
      const currentPageIndex = this.pager.currentPageIndex;
      const lastPageIndex = this.pager.pageCount - 1;


      const addIfVisiblePageIndex = (pageIndex) => {
        if(pageIndex >= 0 && visiblePageIndexes.find(index => index === pageIndex) == null) {
          if(visiblePageIndexes.length < this.allowedPageCount && visiblePageIndexes.length < this.pager.pageCount) {
            visiblePageIndexes.push(pageIndex);
          }
        }
      }

      addIfVisiblePageIndex(startPageIndex);
      addIfVisiblePageIndex(currentPageIndex);
      addIfVisiblePageIndex(lastPageIndex);

      let tmpIndex = currentPageIndex-2

      while(visiblePageIndexes.length < this.allowedPageCount && visiblePageIndexes.length < this.pager.pageCount) {
        addIfVisiblePageIndex(tmpIndex);
        tmpIndex++;
      }

      if(visiblePageIndexes.length < this.allowedPageCount) {
        while(tmpIndex > 0) {
          addIfVisiblePageIndex(tmpIndex);
          tmpIndex--;
        }
      }

      let separator = false;
      for(let pageIndex=0; pageIndex < this.pager.pageCount; pageIndex++) {
        if(visiblePageIndexes.find(index => index === pageIndex) != null) {
          items.push({
            pageIndex,
            pageTitle: pageIndex + 1
          });
          separator = false;
        }
        else {
          if(!separator) {
            items.push({
              separator: true
            });
          }
          separator = true;
        }
      }

      this.selectionPageItems = items;
    },
    selecionPageSize(size) {
      if(size != this.pager.pageSize) {
        this.onSelecionPageSize(size);
        this.setSelectionPageItems();
      }
    },
    selecionPage(index) {
      if(index != this.pager.currentPageIndex) {
        this.onSelecionPage(index);
        this.setSelectionPageItems();
      }
    }
  },
  watch: {
    pager() {
      this.setSelectionPageItems();
    }
  },
  mounted() {
    this.setSelectionPageItems();
  }
}
</script>

<style scoped>
  .rn-data-grid-pager {
    display: flex;
    justify-content: space-between;
    padding: 8px 2px;
    font-size: 13px;
  }


  .rn-data-grid-page-sizes,
  .rn-data-grid-pages {
    display: flex;
    justify-content: space-between;
  }

  .rn-data-grid-pager-info {
    padding: 6px;
    color: #999;
    user-select: none;
  }

  .rn-data-grid-page-sizes .current-item,
  .rn-data-grid-pages .current-item {
    font-weight: bold;
    cursor: default;
    background: #eee;
    padding: 6px;
    user-select: none;
  }
  .rn-data-grid-page-sizes .item,
  .rn-data-grid-pages .item {
    font-weight: normal;
    cursor: pointer;
    padding: 6px;
    user-select: none;
  }

  .rn-data-grid-pages .separator {
    font-weight: normal;
    padding: 6px;
    user-select: none;
  }

  .rn-data-grid-page-sizes .item:hover,
  .rn-data-grid-pages .item:hover {
    border: 1px solid #999;
    padding: 5px;
  }

</style>
