<template>
    <div ref="progressBar" class="rn-progress-container">
        <div class="rn-base rn-progress-bar">
            <div class="rn-progress-bar-fill" :class="getClass()" :style="{width: fillPercentage + '%'}"></div>
            <div class="rn-progress-percentage">{{ fillPercentage }}%</div>
        </div>
        <div class="rn-progress-plan" v-if="props.showPlan" :style="{left: planPositon + 'px'}">
            <label class="rn-plan-label">{{ planPercentage }}%</label>
        </div>
    </div>
</template>

<script setup>
import { ref, toRef, defineProps, computed } from 'vue'

const progressBar = ref(null)

const props = defineProps({
    showPlan: {
        type: Boolean,
        default: true
    },
    fillPercentage: {
        type: Number,
        default: 0
    },
    planPercentage: {
        type: Number,
        default: 100
    },
})

const fillPercentage = toRef(props, "fillPercentage")
const planPercentage = toRef(props, "planPercentage")

const planPositon = computed(() => {
    if (!progressBar.value) {
        return 0;
    }
    const progressBarWidth = progressBar.value.offsetWidth;    
    return (planPercentage.value / 100) * progressBarWidth;
})

const getClass = () => {
    if (props.showPlan && fillPercentage.value < planPercentage.value) {
        return "rn-progress-bar-fill--expired"
    } else {
        return "rn-progress-bar-fill--correct"
    }
}
</script>


<style scoped>
.rn-progress-container {
    position: relative;
}

.rn-progress-bar {
    position: relative;
    height: 20px;
    background-color: #f2f2f2;
    border-radius: 4px;
    overflow: hidden;
}

.rn-progress-bar-fill {
    height: 100%;
    width: 0;
    /*background-color: #4caf50;*/
    transition: width 0.5s ease;
}

.rn-progress-bar-fill--correct {
    background-color: #88fca3;
}

.rn-progress-bar-fill--expired {
    background-color: #ff6b51;
}

.rn-progress-plan {
    position: absolute;
    top: -10px;
    height: 10px;
    width: 2px;
    background-color: #000;
    transform: translateX(-50%);
}		

.rn-progress-percentage {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
    font-weight: bold;
    color: #323232;
    font-size: 12px;
}

.rn-plan-label {
    position: absolute;
    top: -20px;
    transform: translateX(-50%);
    font-size: 12px;
    color: #000;
}	
.rn-progress-bar {
    border: 1px solid lightgray;
}


</style>
