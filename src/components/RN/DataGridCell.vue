<template>
  <span v-if="wordWrap">
      {{cell?.displayValue}}
  </span>
  <div v-else class="word-nowrap-container" :title="cell?.displayValue">
      <span class="word-nowrap-text">
        {{cell?.displayValue}}
      </span>
      <span>
        &nbsp;
      </span>
  </div>
</template>
<script>
  // import utils from '@/utils';
  export default {
    components: {
    },
    props: {
      cell: {
        type: Object,
        default: () => null
      },
      wordWrap: {
        type: Boolean,
        default: () => true
      }
    },
    data() {
      return {
      }
    },
    computed: {
    }
  }
</script>

<style scoped>
  .word-nowrap-container {
    position: relative;
    overflow: hidden;
    padding: 2px;
  }
  .word-nowrap-text {
    white-space: nowrap;
    position: absolute;
  }
</style>