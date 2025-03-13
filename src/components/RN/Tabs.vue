<template>
  <div class="tabs-component">
    
    <ul class="tabs-header">
      <li  v-for="tab in tabs" :key="tab.name" @click="selectTab(tab.name)"
        :class='{"tabs-selected": tab.name === selectedTab }'> {{ tab.title }}
      </li>
    </ul>
    <div class="tab-content">
      <slot :selected-tab="selectedTab"></slot>
    </div>
  </div>
</template>
  
<script setup>
  import { ref, defineProps, provide, onMounted } from 'vue'
  
  const props = defineProps({
    onSelectTab: {
      type: Function,
      default: () => function () { }
    },
    initTab: {
      type: String,
      default: () => null
    }
  })
  
  const tabs = ref([]);
  const selectedTab = ref(props.initTab || "");
  
  const selectTab = (tabName) => {
    tabs.value.forEach((tab, index) => {
      if (tab.name === tabName) {
        selectedTab.value = tab.name      
      }
      tab.setIsActive(tab.name === tabName)
    })  
    props.onSelectTab(selectedTab.value);
  }
  
  const selectTabByIndex = (i) => {
    tabs.value.forEach((tab, index) => {
      if (index === i) {
        selectedTab.value = tab.name      
      }
      tab.setIsActive(index === i)
    })
    props.onSelectTab(selectedTab.value);
  }
  
  provide("registerTab", (tab) => {
    tabs.value.push(tab);
  })
  
  onMounted(() => {
    if (props.initTab) {
      selectTab(props.initTab)
    } else {
      selectTabByIndex(0)
    }
  })
  </script>
  
  
<style scoped>
    .tabs-component {
      margin: 20px 0 0 0;
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
      background-color: #fff !important;
      border: 2px solid #e8eaeb;
      font-weight: 600;
    }
  </style>