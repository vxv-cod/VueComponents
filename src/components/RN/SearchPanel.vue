<template>
  <div class="rn-search-panel">
    <SearchBox :on-search-text-changed="onSearchTextChanged"/>
  </div>
</template>
<script>
import SearchBox from '@/components/RN/SearchBox.vue';

export default {
  components: {
    SearchBox
  },
  props: {
    onSearchTextChanged: {
      type: Function,
      default: () => null
    }
  },
  data() {
    return {
    }
  },
  methods: {
  },
  computed: {
  }
}
</script>

<style scoped>
  .rn-search-panel {
    display: flex;
  }
</style>
