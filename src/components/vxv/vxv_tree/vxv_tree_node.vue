  <template>
    <div class="tree_header" 
      v-bind="$attrs"
      @click.stop="current_node = node"
      @dblclick.stop="status = !status"
      :activated="activated"
      :status="status"
      >
      <div class="header_icon" v-if="node_is_child" :status="status">
        <Icon 
          size="12px" 
          :color="status ? '#ffc107' : `${$text-color}`"
          :icon="status ? 'folder-open' : 'folder-closed'"
        />
      </div>
      <div class="header_icon" v-if="!node_is_child">
        <Icon 
          size="12px" 
          :color="status ? '#ffc107' : `${$text-color}`"
          :icon="'file'"
        />
      </div>

      <div class="header_text" v-text="node[label_name]" :status_and_is_child="status_and_is_child"></div>
    </div>
    <div class="node_child" v-show="status" v-if="node_is_child">
      <div class="box_node" v-for="(child, index) in node[children_name]"
          :class="position_class(index, node[children_name].length-1)"
        >
        <vxv_tree_node 
          v-model="current_node"
          :node="child" 
          :label_name="label_name" 
          :children_name="children_name"           
          />
      </div>
    </div>
  </template>


<script setup>
  import { toRefs, ref, watch, watchEffect, computed } from 'vue'

  
  defineOptions({
    name: 'vxv_tree_node',
    inheritAttrs: false
  })
  const current_node = defineModel()
  const props = defineProps({ 
    node: { type: Object }, 
    label_name: { type: String, default: 'label' }, 
    children_name: { type: String, default: 'children' }
  })
  const {
    node,
    label_name,
    children_name,
  } = toRefs(props)
  
  const status = ref(false)
  
  const node_is_child = computed(() => {
    if (node.value[children_name.value]) return true
    else return false
  })
  
  const status_and_is_child = computed(() => status.value && node_is_child.value)

  const activated = computed(() => {
    if (current_node.value == node.value) return true
    else return false
  })

  function position_class(index, index_last) {
    if (index == index_last) return '_last'
    else return ''
  }
  
</script>


<style lang="sass" scoped>
@import "./vxv_tree.sass"
</style>