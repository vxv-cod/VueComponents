<template>
    <DxDropDownBox 
        :field-template="tempateName"
        content-template="contentTemplate"        
        ref="dropDownBoxRef" 
        :data-source="dataSource" 
        :drop-down-options="dropDownOptions"         
        :input-attr="{ 'aria-label': 'Owner' }"
        :on-value-changed="onDropDownValueChanged"
        :show-clear-button="!isRequired"
        :value="selectedRows"
        :read-only="readOnly"
        :height="editorHeight"
        :display-expr="displayExpr"
        :value-expr="keyExpr">
        <template #contentTemplate="{}">
            <DxDataGrid 
                :columns="columns" 
                :data-source="dataSource" 
                :height="gridHeight"              
                :hover-state-enabled="true"
                :key-expr="keyExpr"
                :on-selection-changed="dataGridSelectionChanged"                
                :selected-row-keys="newSelectedRows"
                :show-borders="true" 
                :show-column-lines="true"
                :show-filter-row="true"  
                :show-row-lines="true"
                :word-wrap-enabled="true"
                @toolbar-preparing="toolbarPreparing"
                :width="gridWidth">
                <DxSelection :mode="selectionMode" />
                <DxFilterRow :visible="true"/>
                <DxScrolling mode="virtual"/>
                <DxHeaderFilter :visible="true"/>
                <DxSearchPanel :visible="true"/>
            </DxDataGrid>
        </template>
        <template #field="{}">
            <div class="custom-item">
                 <DxTextBox
                    :value="textValue"
                    :read-only="true"
                    :visible="false"
                />
                <div class="drop-down-data-grid-editor-value">
                    {{ textValue }}
                </div>
            </div>
        </template>
    </DxDropDownBox>                
</template>
<script>

import DxDropDownBox from 'devextreme-vue/drop-down-box';
import DxTextBox from 'devextreme-vue/text-box';
import localizeFilter from '@/localize';
import componentUtils from '@/utils/components';
import { 
    DxDataGrid,
    DxSelection,  
    DxFilterRow,   
    DxScrolling,
    DxHeaderFilter,
    DxSearchPanel,
} from 'devextreme-vue/data-grid';



export default {
    name: "DropDownDataGridEditor",
    components: {        
        DxDataGrid,
        DxSelection,
        DxDropDownBox,
        DxFilterRow,
        DxScrolling,
        DxHeaderFilter,
        DxSearchPanel,
        DxTextBox
    },
    props: {
        columns: {
            default: () => null
        },
        dataSource: {
            default: () => null
        },
        displayExpr: {
            type: String,
            default: () => "Title"
        },                            
        isRequired: {
            type: Boolean,
            default: () => false
        },
        height: {
            type: Number,
            default: () => 400
        },
        keyExpr: {
            type: String,
            default: () => "ID"
        },
        valueExpr: {
            type: String, // Если значение задано, то будет подразуменваться, что результатом будет ID или массив ID. Если значение пустое, то будут возвращаться объекты
            default: () => null 
        },
        onValueChanged: { // функция меняет значение в ячейке dataGrid. Если новая строка в режиме popup, то это boolean
            type: Function,
            default: () => function() {}
        },        
        selectionMode: {
            type: String,
            default: () => "single"
        },
        value: {
            default: () => null
        },
        width: {
            type: Number,
            default: () => 500
        },        
        readOnly: {     
            type: Boolean,
            default: () => false
        },
        editorHeight: {
            type: Number,
            default: () => 16
        },
        cellInfo: {
            type: Object,
            default: () => null
        },
        useMultilineReadOnly: {
            type: Boolean,
            default: () => false
        },
        onRefreshing: {
            type: Function,
            //default: () => null
        }
    },
    data() {
        return {
            gridWidth: this.width - 20,
            gridHeight: this.height - 60,
            selectedRows: null,
            newSelectedRows: null,
            originalValue: null,
            textValue: "",
            tempateName: null,
            dropDownOptions: { 
                width: this.width, 
                height: this.height, 
                minHeight: this.height,
                toolbarItems: [{
                    toolbar: "bottom",
                    location: "after",
                    widget: "dxButton",
                    options: {
                        text: localizeFilter('Ok'),
                        onClick: () => {
                            this.selectedRows = [].concat(this.newSelectedRows);
                            this.$refs["dropDownBoxRef"].instance.close();
                        }
                    }
                },{
                    toolbar: "bottom",
                    location: "after",
                    widget: "dxButton",
                    options: {
                        text: localizeFilter('Cancel'),
                        onClick: () => {
                            this.$refs["dropDownBoxRef"].instance.close();
                        }
                    }
                }]              
            }
        }
    },
    methods: {
        dataGridSelectionChanged(e) {
            this.newSelectedRows = [].concat(e.selectedRowKeys);
        },
        // selectedRowsChanged() {
        //     if (this.selectionMode == "multiple") {
        //         if (this.valueExpr) {                    
        //             this.selectedRows = [].concat(this.newSelectedRows);
        //         } else {
        //             this.selectedRows = this.dataSource.filter(row => this.newSelectedRows.find(rowID => rowID === row[this.keyExpr]));
        //         }
        //     }
        //     else if (this.selectionMode == "single") {
        //         if (this.valueExpr) {                    
        //             this.selectedRows = this.newSelectedRows[0];
        //         } else {
        //             this.selectedRows = this.dataSource.find(row => row[this.keyExpr] === this.newSelectedRows[0]);
        //         }                
        //     }
        // },
        onDropDownValueChanged(e) {
            let value = null;
            if(e.value) {
                if(this.selectionMode == "multiple") {
                    if(this.valueExpr) {                    
                        value = [].concat(e.value);
                    } 
                    else {
                        value = this.dataSource.filter(row => e.value.find(rowID => rowID === row[this.keyExpr]));
                    }
                }
                else if(this.selectionMode == "single") {
                    if(this.valueExpr) {                    
                        value = e.value[0];
                    } 
                    else {
                        value = this.dataSource.find(row => row[this.keyExpr] === e.value[0]);
                    }                
                }
            }

            if(typeof this.onValueChanged === "function") {
                this.onValueChanged(value);
            }
        },        
        getSelectedRowsByMasterGridValue (masterGridValue)  { 
            if (this.selectionMode == "multiple") {
                if (!masterGridValue || masterGridValue && !masterGridValue.length) {
                    return [];
                } else {                    
                    return this.valueExpr ? masterGridValue : masterGridValue.map(r => r[this.keyExpr]);
                }

            } else if (this.selectionMode == "single") {
                if (!masterGridValue) {
                    return [];
                } else {  
                    return this.valueExpr ? [masterGridValue] : [masterGridValue[this.keyExpr]];
                }
            }

            return [];
        },
        toolbarPreparing (e) {
            if(this.onRefreshing) {
                this.gridToolbar = e;
                componentUtils.toolbarAddRefreshButton(e, async () => {
                    this.onRefreshing();
                });
            }
        }
    },
    computed: {
    },
    async mounted() {
        this.selectedRows = this.getSelectedRowsByMasterGridValue(this.value);
        this.newSelectedRows = [].concat(this.selectedRows);
        if (this.selectedRows && this.useMultilineReadOnly) {
            this.textValue = this.dataSource.filter(d => this.selectedRows.find(r => r == d[this.keyExpr])).map(r => r.Title).join(";");            
        }

        if (this.useMultilineReadOnly) {
            this.tempateName = "field";
        }
    }
};

</script>

<style>
    .drop-down-data-grid-editor-value {
        overflow-y: auto;
        overflow-x: hidden;
        /* scrollbar-color: red orange; */
        scrollbar-width: thin;
        height: 100%;
        padding: 3px;
    }
    .dx-dropdowneditor-field-template-wrapper > * {
        height: 100%;
    }
</style>