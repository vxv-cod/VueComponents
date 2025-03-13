<template>
    <DxPopup class="popup-list-component"
        ref="popupRef"
        :visible="visible"
        :drag-enabled="true"
        :hide-on-outside-click="true"
        :show-title="true"
        :width="width"
        :height="height"
        @hiding="popupHiding"
        :title="title">
        <div class="popup-list">
            <DxList
                ref="listRef"
                :items="items"
                :selectedItems="items"
                :show-selection-controls="true"
                selection-mode="all"
                :display-expr="displayExpr"/>
        </div>
        <DxToolbarItem 
            widget="dxButton"
            toolbar="bottom"
            :options="popupButtonOptions"
            location="after">
        </DxToolbarItem>
    </DxPopup>
</template>

<script>
import { DxPopup, DxToolbarItem } from 'devextreme-vue/popup';
import DxList from 'devextreme-vue/list';
import localizeFilter from '@/localize';

export default {
    components: {
        DxPopup,
        DxToolbarItem,
        DxList
    },
    props: {
        title: {
            type: String,
            default: () => null
        },
        applyButtonTitle: {
            type: String,
            default: () => null
        },
        items: {
            type: Array,
            default: () => []
        },
        displayExpr: {
            type: String,
            default: () => null
        },
        visible: {
            type: Boolean,
            default: () => false
        },
        width: {
            type: Number,
            default: () => null
        },
        height: {
            type: Number,
            default: () => null
        },
        onApply: {
            type: Function,
            default: () => function() {}
        },
        onClose: {
            type: Function,
            default: () => function() {}
        },
    },
    data() {
        return {
            isApply: false,
            popupButtonOptions: {
                text: this.applyButtonTitle ? this.applyButtonTitle : localizeFilter("Apply"),
                onClick: () => {
                    this.isApply = true;
                    const result = this.listInstance.option("selectedItems");
                    if(result.length > 0) {
                        if(this.onApply) this.onApply(result);
                        this.popup.hide();
                    }
                }
            },
            
        }
    },
    methods: {
        popupHiding() {
            if(!this.isApply) {
                if(this.onClose) this.onClose();
            }
            this.isApply = false;
        }
    },
    computed: {
        popup() {
            return this.$refs["popupRef"].instance;
        },
        listInstance() {
            return this.$refs["listRef"].instance;
        },
    },
    mounted() {
    }
};

</script>

<style>
    .popup-list-component .popup-list {
        display: flex;
    }
</style>