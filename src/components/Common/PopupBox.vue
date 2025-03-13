<template>
    <DxPopup class="popup-box-component"
        ref="popupRef"
        :visible="visible"
        :drag-enabled="true"
        :hide-on-outside-click="true"
        :show-title="true"
        @hiding="popupHiding"
        :width="width"
        :height="height"
        :title="title"
        :position="position">
        <div class="popup-box-container">
            <slot name="container">
            </slot>
        </div>
        <DxToolbarItem 
            v-if="!withoutApplyButton"
            widget="dxButton"
            toolbar="bottom"
            :options="popupButtonOptions"
            location="after">
        </DxToolbarItem>
    </DxPopup>
</template>

<script>

import { DxPopup, DxToolbarItem } from 'devextreme-vue/popup';
import localizeFilter from '@/localize';

export default {
    components: {
        DxPopup,
        DxToolbarItem
    },
    props: {
        title: {
            type: String,
            default: () => null
        },
        applyButtonText: {
            type: String,
            default: () => localizeFilter("Apply")
        },
        applyButtonEnabled: {
            type: Boolean,
            default: () => true
        },
        width: {
            default: () => null
        },
        height: {
            default: () => null
        },
        visible: {
            type: Boolean,
            default: () => false
        },
        onApply: {
            type: Function,
            default: () => function() {}
        },
        onClose: {
            type: Function,
            default: () => function() {}
        },
        withoutApplyButton: {
          type: Boolean,
          default: () => false
        },
        position: {            
            default: () => { return {my: "center", at: "center", of: window }}
        },
        closeOnApply: {
            type: Boolean,
            default: () => true
        }
    },
    data() {
        return {
            isApply: false,
            popupButtonOptions: null
        }
    },
    methods: {
        popupHiding() {
            if(!this.isApply) {
                this.onClose();
            }
            this.isApply = false;
        },
        updatePopupButtonOptions() {
            this.popupButtonOptions = {
                text: this.applyButtonText,
                disabled: !this.applyButtonEnabled,
                onClick: () => {
                    this.isApply = true;                    
                    this.onApply();

                    if (this.closeOnApply) {
                        this.popup.hide();
                    }
                }
            }
        }
    },
    computed: {
        popup() {
            return this.$refs["popupRef"].instance;
        },
    },
    watch: {
        applyButtonEnabled() {
            this.updatePopupButtonOptions();
        }
    },
    mounted() {
        this.updatePopupButtonOptions();
    }
};

</script>

<style>

</style>