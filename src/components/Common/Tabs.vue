<template>
  <div class="tabs-component">
    <div>
      <ul class="tabs-header">
        <li 
          v-for="(tab, index) in tabs"
          :key="tab.title"
          :class='{"tabs-selected": (index == selectedIndex)}'
          @click="selectTab(index)">{{ tab.title }}
        </li>
      </ul>
    </div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        selectedIndex: 0, // the index of the selected tab,
        tabs: []         // all of the tabs
      }
    },
    props: {
      onSelectTab: {
        type: Function,
        default: () => function() {}
      },
      initTab: {
        type: String,
        default: () => null
      }      
    },
    methods: {
      selectTab (i) {
        this.selectedIndex = i

        // loop over all the tabs
        this.tabs.forEach((tab, index) => {
          tab.isActive = (index === i)
        })

        this.onSelectTab(i);
      },
      selectTabByName (tabName) {
        if (!this.tabs || !this.tabs.length) {
          return;
        }

        for(let i=0; i < this.tabs.length; i++) {
          if (this.tabs[i].getName() == tabName) {
            this.selectedIndex = i;
            break;
          }
        }
        // loop over all the tabs
        this.tabs.forEach((tab, index) => {
          tab.isActive = (index === this.selectedIndex)
        })

        this.onSelectTab(this.selectedIndex);
      }
    },
    watch: {
      initTab(value) {      
        this.selectTabByName(value);
      }
    },
    created () {
      this.tabs = this.$children
    },
    mounted() {      
      if (this.initTab) {
        this.selectTabByName(this.initTab);
      } else {
        this.selectTab(0);
      }
    }
  }
</script>
<style scoped>
  .tabs-component {
    margin: 0;
    padding: 0;
    border: 0;
  }
  .tabs-header {
    padding: 0px;  
    margin: 5px 0 10px 0;  
  }
  .tabs-header li {
    display: inline;
    border: 1px solid #e8eaeb;
    padding: 10px;    
    cursor: pointer;
    color: #333;
    font-size: 9pt;
    margin-right: 2px;
    background: rgb(235, 235, 235);
    clear: both;    
  }
  .tabs-header li:hover {
    background: rgb(243, 242, 242);
  }
  .tabs-selected {
    background-color: #fff!important;
    border: 2px solid #e8eaeb;
    font-weight: 600;    
  }  
</style>