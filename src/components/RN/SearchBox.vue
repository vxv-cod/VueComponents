<template>
  <div class="rn-search-box">
    <input class="rn-search-text" type="text" placeholder="Искать..." v-model="searchText" @keydown="searchTextChanged">
    <Icon class="rn-search-icon" icon="magnifying-glass" color="#aaa" size="15px" />
  </div>
</template>
<script>
export default {
  components: {
  },
  props: {
    onSearchTextChanged: {
      type: Function,
      default: () => null
    }
  },
  data() {
    return {
      searchText: "",
      searchStarted: false,
      lastSearchText: ""
    }
  },
  methods: {
    searchTextChanged(e) {
      if(!this.searchStarted && this.searchText !== this.lastSearchText) {
        if(e.key === "Enter") {
          this.startSearch();
        }
        else {
          this.searchStarted = true;
          setTimeout(() => {
            this.startSearch();
          }, 500)
        }
      }
    },
    startSearch() {
      this.onSearchTextChanged(this.searchText);
      this.lastSearchText = this.searchText;
      this.searchStarted = false;
    }
  },
  computed: {
  }
}
</script>
<style scoped>
  .rn-search-box {
    position: relative;
    width: 180px;
    margin-right: 2px;
  }
  .rn-search-box input {
    height: 24px;
    border: 1px solid #aaa;
    border-radius: 5px;
    padding: 2px 10px;
  }
  .rn-search-box input:active {
    border: 1px solid #87a8ad;
    padding-right: 24px;
  }
  .rn-search-text {
    width: 158px;
  }
  .rn-search-icon {
    position: absolute;
    right: 8px;
    padding-top: 8px;
  }
</style>
