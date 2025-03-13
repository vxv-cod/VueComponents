<template>
  <div class="contener tree-wrapper" >
    <vxv_search class="vxv_search"
      v-model="nodes"
      :origin_data="$props.nodes"
      />
    <!-- <div class="contener" > -->
      <vxv_tree_base 
        v-model="current_node"
        :nodes="nodes" 
        :label_name="label_name"
        :children_name="children_name"
      />
    <!-- </div> -->
  </div>
</template>


<script setup>
  import { toRefs, ref, watch, watchEffect, computed } from 'vue'
  import vxv_tree_base from "./vxv_tree_base.vue"

  import vxv_search from '../vxv_filter/vxv_search.vue'
  
  defineOptions({name: 'vxv_tree_filter'})

  const current_node = defineModel()

  const props = defineProps({ 
    nodes: { type: Array, required: true }, 
    label_name: { type: String, default: 'label' }, 
    children_name: { type: String, default: 'children' }
  })

  const { label_name, children_name } = toRefs(props)  

  const nodes = ref([])

  watchEffect(() => {
    if (props?.nodes) {
      nodes.value = [...props.nodes]
    }
  })


</script>


<style lang="sass" >
@import "./vxv_tree.sass"

.tree-wrapper
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  width: 100%
  display: flex
  flex-direction: column
  height: 100%
  background-color: blue
  // overflow: hidden

</style>