<template>
  <div v-show="isActive" class="tab-container">
    <slot></slot>
  </div>
</template>
  
<script setup>
  import { ref, defineProps, inject, onMounted} from 'vue'
  const props = defineProps({
    title: {
      type: String,
      default: 'Tab'
    },
    name: {
      type: String,
      default: ''
    },
    selectedTab: {
      type: String,
      default: ''
    }
  })
  
  const isActive = ref(false)
  const registerTab = inject("registerTab")
  
  const setIsActive = (value) => {
    isActive.value = value;
  }
  
  onMounted(() => {
    registerTab({name: props.name, title: props.title, setIsActive: setIsActive })  
  })
</script>
<style scoped>
    .tab-container {
        border: 1px solid #ccc;
        background-color: #fff;
        padding: 6px 12px;      
        position:relative;
        margin: 0;
    }
  </style>