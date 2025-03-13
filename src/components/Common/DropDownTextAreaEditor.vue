<template>
    <DxDropDownBox 
        content-template="contentTemplate"
        field-template="field"
        ref="dropDownTextAreaRef"
        :data-source="[textAreaValue]"
        :drop-down-options="dropDownOptions"         
        :input-attr="{ 'aria-label': 'Owner' }"
        :on-value-changed="onDropDownValueChanged"
        :height="editorHeight"
        :show-clear-button="false"
        :read-only="readOnly"
        :value="textAreaValue">
        <template #contentTemplate="{}">
            <DxTextArea 
                :value="textAreaValue"
                @value-changed="onTextAreaValueChanged">                
            </DxTextArea>
        </template>
        <template #field="{}">
            <div class="custom-item">
                 <DxTextBox
                    :value="textAreaValue"
                    :read-only="true"
                    :visible="false"
                />
                <DxTextArea 
                    :value="textAreaValue"
                    :read-only="true">                
                </DxTextArea>
            </div>
        </template>
    </DxDropDownBox>                
</template>
<script>
import DxDropDownBox from 'devextreme-vue/drop-down-box';
import DxTextArea from 'devextreme-vue/text-area';
import DxTextBox from 'devextreme-vue/text-box';

export default {
    components: {
        DxDropDownBox,
        DxTextArea,
        DxTextBox 
    },
    props: {        
        isRequired: {
            type: Boolean,
            default: () => false
        },
        height: {
            type: Number,
            default: () => 600
        },
        onValueChanged: { // функция, которая сообщает dataGrid об изменениях
            type: Function,
            default: () => function() {}
        },
        value: {
            default: () => null
        },
        cellElement: {
            type: Object,
            default: () => null
        },
        readOnly: {     
            type: Boolean,
            default: () => false       
        },
        editorHeight: {
            type: Number,
            default: () => 16
        }
    },
    data() {
        return {
            textAreaValue: "",
            dropDownOptions: {minWidth:"400", height: this.height, minHeight: this.height}
        }
    },
    methods: {
        onTextAreaValueChanged(textAreaChangedArgs) {
            this.textAreaValue = textAreaChangedArgs.value;
            this.onValueChanged(textAreaChangedArgs.value);                                 
        },
        onDropDownValueChanged(e) {            
            if (e.value == null) {
                this.textAreaValue = "";
                this.onValueChanged(null);
            }
        }  
    },
    computed: {
    },
    async mounted() { 
        if (this.value) {
            this.textAreaValue = this.value;            
        } else {
            this.textAreaValue = "";
        }        
    }
};

</script>