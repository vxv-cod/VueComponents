<template>
  <div class="box-parent" >
    <vxv_tree 
      v-model="current_node_tree"
      :nodes="nodes" 
      :label_name="'label'"
      :children_name="'children'"
      dark
      />
      <!-- <div><pre>current_node_tree = {{ current_node_tree }}</pre></div> -->

  </div>
</template>
  
  <script setup>
    import vxv_tree from "@/components/vxv/vxv_tree/vxv_tree.vue"
    import {nodes} from "@/components/vxv/vxv_tree/example_data.js"

    // import * as data from "src/components/vxv/vxv_tree/data.js"
    // :nodes="data.nodes" 
  
    defineOptions({name: 'ttree_test'})

    // Получаем выбранный узел дерева, 
    // т.е. ее рекативную ссылку на данные, которые можем менять, догружать
    const current_node_tree = defineModel()
  
    // Пропсы, необязятельны, если поля в объектах соответствуют указанным:
      // :label_name="'label'"
      // :children_name="'children'"
  
  </script>


<style lang="sass" >
@import "@/assets/scrollbar.sass"
@import "@/assets/quasar_color.sass"


html, body
  font-size: 14px
  
.page
  position: relative
  height: 100vh
  display: flex
  flex-direction: column

.body
  position: relative
  background-color: $grey-4

.box-parent
  position: relative
  border:  0.5px solid $grey-5
  box-shadow: 3px 0px 10px $grey-7
  height: 100%
  width: 20%


</style>
  