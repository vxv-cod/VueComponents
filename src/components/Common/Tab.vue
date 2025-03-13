<template lang="html">
  <div v-show="isActive" class="tab-container">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: 'Tab'
      },
      name: {
        type: String,
        default: ''
      }
    },
     methods: {
      getName () {
        return this.name;
      }
    },
    data () {
      return {
        isActive: true
      }
    }
  }
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