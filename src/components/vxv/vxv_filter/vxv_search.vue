<template>
  <div class="search" 
    :text_there="text_there"
    :focusinput="focusinput"
    >
    <input type="text" placeholder="Поиск" v-model="search"
      :id="'search-input-' + $.uid"
      :text_there="text_there"
      @focusin="focusinput = true"
      @focusout="focusinput = false"
      @keyup.esc="search = ''"
    >
    <label :for="'search-input-' + $.uid">
      <Icon size="20px" class="Icon"
        :icon="text_there ? 'filter-circle-xmark' : 'filter'"
        :text_there="text_there"
        @click="search = ''"
      />
    </label>
  </div>

  <!-- <div class="test"><pre>data = {{ data }}</pre></div> -->

</template>


<script setup>
import { ref, watch, toRefs, watchEffect, computed } from 'vue'


defineOptions({
  name: 'vxv_search',
})


const props = defineProps({
    origin_data: {type: Array, default: null},
  })
  const {
    origin_data,
    } = toRefs(props)
    
const data = defineModel()

const search = ref('')
const focusinput = ref(false)
const text_there = computed(() => search.value === '' ? false : true)

function filtering(obj, v) {
  // для каждого значения ключа ищем совпадение из search
  return Object.values(obj).some(value => {
    // если значение не массив (список)
    if (!Array.isArray(value)) {
      // делаем строкой в нижнем регистре
      const str_value = (value || '').toString().toLowerCase()
      const str_find = (v || '').toString().toLowerCase()
      // выводим наличие поисковых букв str_find в value
      return str_value.includes(str_find)
    }
    // если значение массив
    if (Array.isArray(value)) {
      // запускаем рекурсию по объектам списка
      return value.some(child => filtering(child, v))
    }
  })
}

watch(() => search.value, (v) => {
  data.value = origin_data?.value?.filter(obj => filtering(obj, v))
}, { deep: true })


</script>

<style lang="sass" scoped>
@import "@/assets/quasar_color.sass"
@import "./vxv_search.sass"

</style>

