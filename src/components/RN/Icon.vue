<template>
    <font-awesome-icon 
        :icon="['fas', props.icon]" 
        :color="color"
        :style="{
            width: size, 
            height: size, 
            margin: 'auto 0px',
            'background-color': 'inherit'
            }"
        />
</template>

<script setup>
    import { getCurrentInstance, toRef } from 'vue'
    import { library } from '@fortawesome/fontawesome-svg-core'
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { fas } from '@fortawesome/free-solid-svg-icons'
    library.add(fas);

    const instance = getCurrentInstance();
    const app = instance.appContext.app;
    app.fontIsRegistred = true;
    if (!app.fontIsRegistred) {
        app.component('font-awesome-icon', FontAwesomeIcon)
    }

    const props = defineProps({
        icon: {
            type: String,
            default: 'face-smile-wink'
        },
        color: {
            type: String,
            default: '#000'
        },
        size: {
            default: '16px'         
        }
    })

    const color = toRef(props, "color")
    const size = toRef(props, "size")
</script>