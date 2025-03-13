<template>
  <div class="contener tree-base-wrapper" >
    <div class="tree_node" v-for="node in nodes" :key="node.label">
      <vxv_tree_node :class="'box_root'" 
        v-model="current_node"
        :node="node" 
        :label_name="label_name" 
        :children_name="children_name" 
        />
    </div>
  </div>
</template>


<script setup>
  import { toRefs, ref, watch, watchEffect, computed } from 'vue'
  import vxv_tree_node from './vxv_tree_node.vue'
  
  defineOptions({name: 'vxv_tree'})
  const current_node = defineModel()
  const props = defineProps({ 
    nodes: { type: Array, required: true }, 
    label_name: { type: String, default: 'label' }, 
    children_name: { type: String, default: 'children' }
  })
  const { nodes, label_name, children_name } = toRefs(props)  
</script>


<style lang="sass" >
@import "./vxv_tree.sass"

.tree-base-wrapper
  height: 100%
  width: 100%
  box-sizing: border-box
  overflow: auto
  position: absolute
  position: sticky
  top: 0
  left: 0
  right: 0
  bottom: 0

</style>