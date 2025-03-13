<template>
  <div class="data-grid-container">
      <DxDataGrid
        v-if="gridColumns"
        :columns="gridColumns"
        :allow-column-reordering="allowColumnReordering"
        :summary="summary"
        :data-source="dataSource"
        :selected-row-keys="selectedRowKeys"
        :show-borders="true"
        :show-row-lines="true"
        :column-auto-width="false"
        :allow-column-resizing="allowColumnResizing"
        column-resizing-mode="widget"
        :width="width"
        :height="height"
        :hover-state-enabled="true"
        :word-wrap-enabled="wordWrapEnabledValue"
        :selection="selection"
        :key-expr="keyExpr"
        @toolbar-preparing="toolbarPreparing"
        @context-menu-preparing="contextMenuPreparing"
        @content-ready="contentReady"
        @row-click="rowClick"
        @cell-click="onCellClick"
        @cell-hover-changed="onCellHoverChanged"
        @row-prepared="rowPrepared"
        @cell-prepared="cellPrepared"
        @cell-dbl-click="onCellDblClick"
        @selection-changed="selectionChanged"
        @init-new-row="initNewRow"
        @edit-canceling="onEditCanceling"
        @editing-start="editingStart"
        @option-changed="onOptionChanged" 
        @editor-preparing="editorPreparing"
        @row-validating="rowValidating"
        @row-expanded="onRowExpanded"
        @row-expanding="onRowExpanding"
        @row-collapsed="onRowCollapsed" 
        @row-inserting="rowInserting"
        @row-updating="rowUpdating"
        @row-removing="rowRemoving"
        @row-inserted="rowInserted"
        @row-updated="rowUpdated"
        @row-removed="rowRemoved"
        @saving="onSaving"
        @exported="onExported"
        @exporting="onExporting">
        <DxSearchPanel :visible="showSearchPanel"/>
        <DxHeaderFilter :visible="true"/>
        <DxFilterRow :visible="showFilterRow"/>
        <DxGroupPanel 
            :visible="allowGrouping"
            :allow-column-dragging="allowColumnDragging"
        />
        <DxScrolling show-scrollbar="always" :columnRenderingMode="columnRenderingMode" />
        <DxRowDragging
            :allow-reordering="allowReordering"
            :on-reorder="onReorder"
            :show-drag-icons="true"
        />
        <DxColumnChooser 
            :enabled="showColumnChooser"
            :search="columnChooserSearch"
            mode="select"
        />
        <DxColumnFixing 
            :enabled="allowColumnFixing"
        />
        <DxEditing
            :allow-adding="allowAdding"
            :allow-updating="allowUpdating"
            :allow-deleting="allowDeleting"
            :use-icons="true"
            :mode="editingMode"
            :form="formOptions">
            <DxPopup
                :show-title="!!editingFormTitle"
                :title="editingFormTitle"
                :width="editingFormWidth"
                :height="editingFormHeight"
                :min-width="editingFormWidth"
                :min-height="editingFormHeight"
                :toolbar-items="toolbarItems"
                :drag-enabled="true"
                :resize-enabled="editingPopupResizeEnabled"      
                />
        </DxEditing>
        <DxPaging 
            :enabled="allowPaging"
            :page-size="pageSize"
        />
        <DxPager
            :show-page-size-selector="showPageSelector"
            display-mode="full"
            :allowed-page-sizes="[10, 20, 50, 100, 200, 500]"
            :show-info="showPageSelector"
            :visible="pagerVisible"
        />
        
        <DxExport
            :enabled="exportEnabled"
            :customize-excel-cell="customizeExcelCell"
            :file-name="exportFileName"
        />
        <DxMasterDetail
            :enabled="allowMasterDetail"
            template="masterDetailTemplate"
        />
        <template #masterDetailTemplate="{ data }">
            <slot name="masterDetail" v-bind:data="data">
            </slot>
        </template>
        <template #headerCellTemplate="{ data }">
            <slot name="headerCellTemplate" v-bind:data="data">
            </slot>
        </template>
        <template #titlesTemplate="{ data: cellInfo }">
            <div v-if="wordWrapEnabledValue">
                <div v-for="(item, index) in cellInfo.value" v-bind:key="index">
                    {{ getItemTitle(cellInfo, item) }}
                </div>
            </div>
            <div v-else :title="getItemTitles(cellInfo, cellInfo.value)">
                <span v-for="(item, index) in cellInfo.value" v-bind:key="index">{{index > 0 ? ", " : ""}}{{ getItemTitle(cellInfo, item) }}</span>
            </div> 
        </template>
        <template #numericTitlesTemplate="{ data: cellInfo }">
            <div v-if="cellInfo.value && cellInfo.value.length == 1" :title="getItemTitle(cellInfo, cellInfo.value[0])">
                {{ getItemTitle(cellInfo, cellInfo.value[0]) }}
            </div>
            <div v-else-if="wordWrapEnabledValue">
                <div v-for="(item, index) in cellInfo.value" v-bind:key="index">
                    {{ (index + 1) }}) {{ getItemTitle(cellInfo, item) }}
                </div>
            </div>
            <div v-else :title="getItemTitles(cellInfo, cellInfo.value)">
                <span v-for="(item, index) in cellInfo.value" v-bind:key="index">{{index > 0 ? "; " : ""}}{{ (index + 1) }}) {{ getItemTitle(cellInfo, item) }}</span>
            </div> 
        </template>
        <template #multilineTextTemplate="{ data }">
            <div v-if="wordWrapEnabledValue">
                <span v-for="(line, index) in data.text.split('\n')"  v-bind:key="index">{{line}}<br/></span>
            </div>
            <div v-else :title="data.text">
                {{data.text}}
            </div>
        </template>
        <template #hyperlinkTemplate="{ data }">
            <a v-if="hyperLinkIsWeb(data.text)" :title="data.text" class="data-grid-hyperlink" :href="data.text" target="_blank">{{data.text}}</a>
            <span v-else @click="hyperLinkClick" :title="data.text" class="data-grid-hyperlink">{{data.text}}</span>
        </template>
        <template #dataGridBoxEditTemplate="{ data: cellInfo }">
            <div class="data-grid-box-editor">
                <DataGridBox
                    :columns="cellInfo.column.lookup ? cellInfo.column.lookup.columns : null"
                    :data-source="cellInfo.column.lookup ? cellInfo.column.lookup.dataSource : null"
                    :value="cellInfo.value"
                    :allow-editing="allowEditing"
                    :allow-adding="cellInfo.column.lookup ? cellInfo.column.lookup.allowAdding : null"
                    :allow-updating="cellInfo.column.lookup ? cellInfo.column.lookup.allowUpdating : null"
                    :allow-deleting="cellInfo.column.lookup ? cellInfo.column.lookup.allowDeleting : null"
                    :editing-mode="cellInfo.column.lookup ? cellInfo.column.lookup.editingMode : null"
                    :on-content-ready="cellInfo.column.lookup ? cellInfo.column.lookup.onContentReady : null"
                    :on-editor-preparing="cellInfo.column.lookup ? cellInfo.column.lookup.onEditorPreparing : null"
                    :on-row-validating="cellInfo.column.lookup ? cellInfo.column.lookup.onRowValidating : null"
                    :on-value-changed="(value) => cellValueChanged(value, cellInfo)"
                />
            </div>
        </template>
        <template #listEditTemplate="{ data: cellInfo }">
            <div class="list-editor">
                <List
                    :data-source="listEditorOption(cellInfo, (cellInfo.column.lookup && cellInfo.column.lookup.dataSource ? 'dataSource' : 'items'))"
                    :items="listEditorOption(cellInfo, 'items')"
                    :selected-items="listEditorOption(cellInfo, 'selectedItems')"
                    :show-selection-controls="true"
                    :display-expr="cellInfo.column.lookup ? cellInfo.column.lookup.displayExpr : null"
                    :key-expr="cellInfo.column.lookup ? cellInfo.column.lookup.keyExpr : null"
                    :search-enabled="cellInfo.column.lookup ? cellInfo.column.lookup.searchEnabled : false"
                    :height="cellInfo.column.lookup ? cellInfo.column.lookup.height : null"
                    :selection-mode="listEditorSelectionMode(cellInfo)"
                    :on-selection-changed="(e) => listSelectionChanged(cellInfo, e.addedItems, e.removedItems)"
                />
            </div>
        </template>
        <template #graphBandTemplate="{ data: cellInfo }">
            <GraphBand
                :task="cellInfo.data"
                :month="cellInfo.column.month"
                :minimizied="!wordWrapEnabledValue"
            />
        </template>
        <template #indicatorCounterTemplate="{ data: cellInfo }">
            <IndicatorCounter
                :counter="cellInfo.value"
                :on-click="onIndicatorCounterClick"
            />
        </template>
        <template #fileUploadTemplate="{ data: cellInfo }">
            <div v-if="fileUploadUrl && fileDownloadUrl && fileDownloadNameExpr">
                <div v-if="cellInfo.data[fileDownloadNameExpr]">
                    <h4>
                        <a :href="fileDownloadUrl(cellInfo.data[fileDownloadNameExpr])">{{cellInfo.data[fileDownloadNameExpr]}}</a>
                    </h4>
                </div>
                <div>
                    <DxFileUploader
                        accept="*"
                        :multiple="false"
                        upload-mode="instantly"
                        :upload-url="fileUploadUrl()"
                        @uploaded="(e) => onFileUploaded({cellInfo, fileInfo: e.file})"
                    />
                </div>
            </div>
        </template>

        <template #sortIndexTemplate="{ data: cellInfo }">
            <div>{{cellInfo.row.loadIndex + 1}}</div>
        </template>
        <template #popupDataGridEditTemplate="{ data: cellInfo }">
            <div class="popup-data-grid-editor">
                <DropDownDataGridEditor
                    :columns="cellInfo.column.lookup ? cellInfo.column.lookup.columns : null"
                    :data-source="listEditorOption(cellInfo, (cellInfo.column.lookup && cellInfo.column.lookup.dataSource ? 'dataSource' : 'items'))"
                    :on-refreshing="cellInfo.column.lookup && cellInfo.column.lookup.onRefreshing ? cellInfo.column.lookup.onRefreshing : null"
                    :display-expr="cellInfo.column.lookup ? cellInfo.column.lookup.displayExpr : null"
                    :is-required="cellInfo.column.isRequired"
                    :height="500"
                    :key-expr="cellInfo.column.lookup ? cellInfo.column.lookup.keyExpr : null"
                    :value-expr="cellInfo.column.lookup ? cellInfo.column.lookup.valueExpr : null"
                    :on-value-changed="typeof cellInfo.setValue ==='function' ? cellInfo.setValue : null"
                    :selection-mode="cellInfo.column.lookup ? cellInfo.column.lookup.selectionMode : null"
                    :value="cellInfo.value"
                    :editor-height="cellInfo.column.editorHeight ? cellInfo.column.editorHeight : null"
                    :read-only="isDropDownEditorReadOnly(cellInfo)"
                    :width="cellInfo.column.lookup ? cellInfo.column.lookup.width : null"
                    :use-multiline-read-only="cellInfo.column.lookup ? cellInfo.column.lookup.useMultilineReadOnly : null"/>
            </div>
        </template>
        <template #popupTextAreaEditTemplate="{ data: cellInfo }">
            <div class="popup-text-area-editor">                
                <DropDownTextAreaEditor               
                    :cell-element="cellInfo"                                                                 
                    :on-value-changed="typeof cellInfo.setValue ==='function' ? cellInfo.setValue : null"                
                    :data-source="cellInfo.data"
                    :value="cellInfo.value"
                    :read-only="isDropDownEditorReadOnly(cellInfo)"
                    :editor-height="cellInfo.column.editorHeight ? cellInfo.column.editorHeight : null"
                    :height="cellInfo.column.dropDownHeight ? cellInfo.column.dropDownHeight : null" />
            </div>
        </template>
      </DxDataGrid>
  </div>
</template>
<script>

import { 
    DxDataGrid, 
    DxColumnChooser, 
    DxColumnFixing,
    DxEditing, 
    DxGroupPanel,
    DxHeaderFilter,
    DxFilterRow,
    DxSearchPanel,
    DxPopup,
    DxScrolling,
    DxRowDragging,
    DxMasterDetail,
    DxPaging,
    DxPager,
    DxExport
} from 'devextreme-vue/data-grid';

import DropDownDataGridEditor from '@/components/Common/DropDownDataGridEditor.vue';
import DropDownTextAreaEditor from '@/components/Common/DropDownTextAreaEditor.vue';

import List from '@/components/Common/List.vue';
import DataGridBox from '@/components/Common/DataGridBox.vue';
import GraphBand from "@/components/Common/GraphBand.vue";
import IndicatorCounter from "@/components/Common/IndicatorCounter.vue";
import { DxFileUploader } from 'devextreme-vue/file-uploader';
import localizeFilter from '@/localize';
import utils from '@/utils';
import componentUtils from '@/utils/components';
import dataGridUtils from '@/utils/components/dataGrid';
import notify from '@/notify';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';


export default {
  name: "DataGrid",
  components: {
    DxDataGrid, 
    DxColumnChooser,
    DxColumnFixing,
    DxEditing, 
    DxGroupPanel,
    DxHeaderFilter,
    DxFilterRow,
    DxSearchPanel,
    DxPopup,
    DxScrolling,
    DxRowDragging,
    DxMasterDetail,
    DxPaging,
    DxPager,
    DxExport,
    List,
    DataGridBox,
    GraphBand,
    IndicatorCounter,
    DxFileUploader,
    DropDownDataGridEditor,
    DropDownTextAreaEditor
  },
  props: {
    userStateKey: {
        type: String,
        default: () => null
    },

    logMenuEnabled: {
        type: Boolean,
        default: () => false
    },
    logTypeName: {
        type: String,
        default: () => null
    },
    logTypeFieldName: {
        type: String,
        default: () => "LogTypeName"
    },
    logKeyExpr: {
        type: String,
        default: () => "ID"
    },

    width: {
        //type: Number,
        default: () => null
    },
    height: {
        //type: Number,
        default: () => null
    },

    showColumnChooser: {
        type: Boolean,
        default: () => false
    },    
    showReorderButton: {
        type: Boolean,
        default: () => false
    },
    showWordWrapButton: {
        type: Boolean,
        default: () => false
    },
    showRefreshButton: {
        type: Boolean,
        default: () => false
    },
    showResetFiltersButton: {
        type: Boolean,
        default: () => false
    },
    showSearchPanel: {
        type: Boolean,
        default: () => false
    },
    showFilterRow: {
        type: Boolean,
        default: () => false
    },
    showPageSelector: {
        type: Boolean,
        default: () => false
    },
    showEditorByRowClick: {
        type: Boolean,
        default: () => false
    },
    /*allowGraphTaskStyles: {
        type: Boolean,
        default: () => false
    },*/
    allowColumnResizing: {
        type: Boolean,
        default: () => false
    },
    allowColumnFixing: {
        type: Boolean,
        default: () => false
    },
    allowPaging: {
        type: Boolean,
        default: () => true
    },
    
    allowAdding: {
        type: Boolean,
        default: () => false
    },
    allowUpdating: {
        default: () => false
    },
    allowDeleting: {
        default: () => false
    },
    allowGrouping: {
        type: Boolean,
        default: () => false
    },
    allowColumnDragging: {
        type: Boolean,
        default: () => true
    },
    allowMasterDetail: {
        type: Boolean,
        default: () => false
    },
    

    parentData: {
        type: Object,
        default: () => null
    },
    columns: {
        type: Array,
        default: () => []
    },
    summary: {
        type: Object,
        default: () => null
    },
    dataSource: {
        default: () => null
    },
    selectedRowKeys: {
        type: Array,
        default: () => []
    },
    
    keyExpr: {
        type: String,
        default: () => "ID"
    },

    editingMode: {
        type: String,
        default: () => "popup"
    },
    editingFormTitle: {
        type: String,
        default: () => null
    },
    editingFormWidth: {
        type: String,
        default: () => null
    },
    editingFormHeight: {
        type: String,
        default: () => null
    },
    selectionMode: {
        type: String,
        default: () => "single"
    },
    selectFirstRow: {
        type: Boolean,
        default: () => false
    },

    exportEnabled: {
        type: Boolean,
        default: () => false
    },
    exportFileName: {
        type: String,
        default: () => null
    },
    wordWrapEnabled: {
        type: Boolean,
        default: () => true
    },
    pageSize: {
        type: Number,
        default: () => 20
    },
    fileDownloadNameExpr: {
        type: String,
        default: () => null
    },
    fileDownloadUrl: {
        type: Function,
        default: () => null
    },
    fileUploadUrl: {
        type: Function,
        default: () => null
    },
    columnRenderingMode: {
        type: String,
        default: () => "standard"
    },

    onFileUploaded: {
        type: Function,
        default: () => function() {}
    },
    onToolbarPreparing: {
        type: Function,
        default: () => function() {}
    },
    onContextMenuPreparing: {
        type: Function,
        default: () => function() {}
    },
    onContentReady: {
        type: Function,
        default: () => function() {}
    },
    onRowPrepared: {
        type: Function,
        default: () => function() {}
    },
    onCellPrepared: {
        type: Function,
        default: () => function() {}
    },
    onCellHoverChanged: {
        type: Function,
        default: () => function() {}
    },
    onCellDblClick: {
      type: Function,
      default: () => function() {}  
    },
    onCellClick: {
        type: Function,
        default: () => function() {}
    },
    onIndicatorCounterClick: {
        type: Function,
        default: () => function() {}
    },
    onInitNewRow: {
        type: Function,
        default: () => function() {}
    },
    onEditingStart: {
        type: Function,
        default: () => function() {}
    },
    onEditCanceling: {
        type: Function,
        default: () => function() {}
    },
    onOptionChanged: {
        type: Function,
        default: () => function() {}
    },
    onSaving: {
        type: Function,
        default: () => function() {}
    },
    onEditorPreparing: {
        type: Function,
        default: () => function() {}
    },
    onRowValidating: {
        type: Function,
        default: () => function() {}
    },
    onRowExpanded: {
        type: Function,
        default: () => function() {}
    },
    onRowExpanding: {
        type: Function,
        default: () => function() {}
    },
    onRowCollapsed: {
        type: Function,
        default: () => function() {}
    },
    onRowInserting: {
        type: Function,
        default: () => function() {}
    },
    onRowInserted: {
        type: Function,
        default: () => function() {}
    },
    onRowUpdating: {
        type: Function,
        default: () => function() {}
    },
    onRowUpdated: {
        type: Function,
        default: () => function() {}
    },
    onRowRemoving: {
        type: Function,
        default: () => function() {}
    },
    onRowRemoved: {
        type: Function,
        default: () => function() {}
    },
    onReordering: {
        type: Function,
        default: () => function() {}
    },
    onRefreshing: {
        type: Function,
        default: () => function() {}
    },
    onSelectionChanged: {
        type: Function,
        default: () => null
    },
    onResetFiltersButton: {
        type: Function,
        default: () => null
    },
    onExported: {
        type: Function,
        default: () => function() {}
    },
    formOptions: {
      type: Object,
    //   default: () => null
    },
    editingPopupResizeEnabled: {
      type: Boolean,
      dafault: () => true
    },
    allowEditCustomCell: {
        type: Function,
        default: () => function() {}
    },
    onOperationButtonsPreparing: {
        type: Function,
        dafault: () => null
    },
    allowColumnReordering: {
        type: Boolean,
        default: () => false
    },
    onCustomizeExcelCell: {
        type: Function,
        default: () => function() {}
    }
  },

  methods: {
    setGridColumns() {
        let gridColumns = [];
        
        if(this.columns) {
            gridColumns = this.columns.map(column => {
                if(column.isRequired) {
                    column.validationRules = [{ type: "required" }];
                }
                
                if((column.cellTemplate == "titlesTemplate" || column.cellTemplate == "numericTitlesTemplate") && column.lookup && column.lookup.valueExpr) {
                    const valueExpr = column.lookup.valueExpr;
                    column.calculateFilterExpression = function(filterValue, operation, target) {                     
                        const dataField = this.dataField;
                        if(target === 'search' && typeof (filterValue) === 'string') {
                            return [dataField, 'contains', filterValue];
                        }
                        else {
                            return function(data) {
                                
                                let values = [];
                                if(data) {
                                    if(dataField.includes('.')) {
                                        values = { ...data};
                                        const valueSplit = dataField.split('.');
                                        for(let i in valueSplit) {
                                            values = values[valueSplit[i]] || [];
                                        }
                                    }
                                    else {
                                        values = data[dataField] || [];
                                    }
                                }
                                if(filterValue) {
                                    const result = values.find(v => v == filterValue || v[valueExpr] == filterValue) !== undefined;                                    
                                    return result;
                                }
                                else {
                                    return values.length == 0;
                                }
                            };
                        }
                    }
                    if(column.dataField && column.lookup.displayExpr && !column.lookup.dataSource) {
                        column.lookup.dataSource = () => {
                            return utils.getLookupValues(this.dataSource, column.dataField, column.lookup.displayExpr);
                        }
                    }
                }    
                
                if (!column.headerFilter) {
                    column.headerFilter = {};
                }

                if (!column.headerFilter.search) {
                    column.headerFilter.search = {};
                }

                /*if (column.headerFilter.search.enabled === undefined ) {
                    column.headerFilter.search.enabled = true;
                }*/              

                if(this.showFilterRow) {

                    
                    if(column.dataField == "SortIndex") {
                        column.allowFiltering = false;
                        column.allowHeaderFiltering = false;
                        column.headerFilter.search.enabled = false;
                    }
                    if(column.lookup) {
                        column.allowFiltering = false;
                        column.allowHeaderFiltering = true;
                        column.headerFilter.search.enabled = true;
                    }
                }
                
                if (column.lookup) {
                    if (!column.headerFilter.dataSource) {                        
                        column.headerFilter.dataSource = (options) => {
                            // в Lookup headerFilter при большом количестве значений не работает поиск через строку поиска (также значения не упорядочены). Если отключить постраничную выдачу, то проблема решается 
                            options.dataSource.paginate = false;

                            // сортировка значений фильтра
                            if (options.dataSource.store?._array && column.lookup.displayExpr) {
                                const compare = (a, b) => {
                                    if (a[column.lookup.displayExpr] < b[column.lookup.displayExpr]) {
                                        return -1;
                                    }
                                    if (a[column.lookup.displayExpr] > b[column.lookup.displayExpr]) {
                                        return 1;
                                    }
                                    return 0;
                                }

                                options.dataSource.store._array = options.dataSource.store._array.sort(compare);
                            }
                        }

                        // overwriteHeaderFilter можно использовать когда в headerFilter нет значений
                        if (column.lookup.overwriteHeaderFilter) {
                            column.headerFilter.dataSource = (options) => dataGridUtils.setLookupDataSource(options, column.dataField, column.lookup.keyExpr, column.lookup.displayExpr);
                        }
                    }
                }

                /*if (column.lookup && !column.headerFilter.dataSource) {
                    column.headerFilter.dataSource = (options) => dataGridUtils.setLookupDataSource(options, column.dataField, column.lookup.keyExpr, column.lookup.displayExpr);                    
                }*/

                return column;
            });

            let buttonsColumnsWidth = 0;
            if(this.allowUpdating && this.editingMode != "batch") buttonsColumnsWidth += 40;
            if(this.allowDeleting) buttonsColumnsWidth += (buttonsColumnsWidth ? 20 : 40);
            if(buttonsColumnsWidth > 0) {
                gridColumns.push({
                    type: "buttons",
                    width: buttonsColumnsWidth,
                });
            }
        }
        this.gridColumns = gridColumns;
    },
    loadGridState() {
        if (!this.grid) { return; }        
        this.userStateTime = new Date().getTime();

        if (!this.userStateKey) { return; }
        const userState = this.$store.getters.getUserSettingValue(this.userStateKey);
        if(userState) {
            //this.grid.beginUpdate();
            let state = this.grid.state();            
            state.columns = userState.columns;
            state.pageIndex = userState.pageIndex;
            state.pageSize = userState.pageSize ? userState.pageSize : this.pageSize;
            this.grid.state(state);
            this.wordWrapEnabledValue = userState.wordWrapEnabled;
            //this.grid.endUpdate();
            return;
        }
    },
    saveGridState() {
        const currentStateTime = new Date().getTime();
        if (currentStateTime > this.userStateTime + 3000) {
            const state = this.grid.state();
            if (!state.columns) { return; }

            this.$store.dispatch("updateUserSetting", {
                path: this.$route.path,
                key: this.userStateKey,
                value: {
                    columns: state.columns.map(column => {
                        delete column.filterValue
                        return column;
                    }),
                    pageIndex: state.pageIndex,
                    pageSize: state.pageSize,
                    wordWrapEnabled: this.wordWrapEnabledValue,
                }
            });
            this.userStateTime = new Date().getTime();
        }
    },
    async onExporting(e) {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');

        await exportDataGrid({
            component: e.component,
            worksheet: worksheet,
            autoFilterEnabled: true,
           /*customizeCell: (options) => {
                options.excelCell.font = { name: 'Times new roman', size: 10 };
                options.excelCell.alignment = { horizontal: 'left' };
            } */
            customizeCell: this.customizeExcelCell
        });

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), ((this.exportFileName || "dataGrid") + '.xlsx'));
    },
    isDropDownEditorReadOnly(cellInfo) {
        if (cellInfo.row.isNewRow) {
            return false;
        }        

        if (this.allowEditCustomCell && cellInfo.column.editRowPropName) {
            return !this.allowEditCustomCell(cellInfo.data, cellInfo.column.editRowPropName);
        }

        if (cellInfo.column.allowEditing == false) {
            return true;
        }

        return false;
    },
    setSelection(groupOperationsExist) {
        if(groupOperationsExist) {
            this.selection = { 
                mode: "multiple",
                showCheckBoxes: true,
                showCheckBoxesMode: "always",
                selectAllMode: "page"
            };
            return;
        }

        if(this.onSelectionChanged != null) {
            if(this.selectionMode == "single") {
                this.selection =   { 
                    mode: "single"
                };

                return;
            }
            else if(this.selectionMode == "multiple") {
                this.selection =  { 
                    mode: "multiple",
                    showCheckBoxes: true,
                    showCheckBoxesMode: "always",
                    selectAllMode: "page"
                };
                return;
            }
        }
        this.selection = { 
            mode: "none",
        };
    },
    selectionChanged(e) {
        this.selectedRows = e.selectedRowsData.length ? e.selectedRowsData : null;        
        const cells = document.querySelectorAll('.data-grid-group-operations-button' + this.gridId);
        cells.forEach((el) => {
            if (el.textContent) {
                el.style.setProperty("display", !this.selectedRows ? "none" : "inline-block");
            } else {
                el.style.setProperty("display", !this.selectedRows ? "none" : "block");
            }
        });
        this.onSelectionChanged(e);
    },
    toolbarPreparing(e) {

        this.gridToolbar = e;

        if(this.showReorderButton) {
            componentUtils.toolbarAddButton(e, {
                icon: "orderedlist",
                hint: localizeFilter("ReorderList"),
                onClick: async () => {
                    this.allowReordering = !this.allowReordering;
                }
            });
        }

        if(this.showWordWrapButton) {
            componentUtils.toolbarAddButton(e, {
                icon: this.wordWrapIcon,
                hint: this.wordWrapTooltip,
                onClick: async (e) => {
                    this.wordWrapEnabledValue = !this.wordWrapEnabledValue;
                    if(this.userStateKey) {
                        this.$store.dispatch("updateUserSetting", {
                            path: this.$route.path, 
                            key: this.userStateKey,
                            field: "wordWrapEnabled",
                            value: this.wordWrapEnabledValue
                        });
                    }
                    e.component.option("icon", this.wordWrapIcon);
                    e.component.option("hint", this.wordWrapTooltip);
                }
            });
        }

        if(this.showRefreshButton) {
            componentUtils.toolbarAddRefreshButton(e, async () => {
                this.onRefreshing();
            });
        }

        if (this.onOperationButtonsPreparing) {
            const element = { buttons: [] };
            this.onOperationButtonsPreparing(element);
            const groupOperationsExist = !!element.buttons.length;
            this.setSelection(groupOperationsExist);

            for(const buttonOption of element.buttons) {
                componentUtils.toolbarAddButton(e, {
                    icon: buttonOption.icon,
                    text: buttonOption.text,
                    hint: buttonOption.hint,
                    elementAttr: {
                        style: { display: "none" },
                        class: "data-grid-group-operations-button" + this.gridId
                    },
                    onClick: () => {
                        if (buttonOption.onClick) {
                            buttonOption.onClick(this.selectedRows);
                        }
                    }
                });
            }
        }
        
      
        this.onToolbarPreparing(e);

        if(this.showResetFiltersButton) {
            componentUtils.toolbarAddItem(e, {
                location: "after",
                widget: "dxMenu",
                options: {
                    elementAttr: { class: this.gridRowsIsFiltered ? "rows-is-filtered" : "rows-is-not-filtered" },
                    dataSource: [
                        {
                            icon: "clear",
                            items: [{
                                    name: "ClearFilters",
                                    title: localizeFilter("ClearFilters"),
                                }, {
                                    name: "ResetGridState",
                                    title: localizeFilter("ResetGridState"),
                                }
                            ]
                        }
                    ],
                    displayExpr: "title",
                    onItemClick: (data) => {
                        if(data.itemData && data.itemData.name) {
                            // Сбросить фильтры
                            if(data.itemData.name == "ClearFilters") {
                                e.component.clearFilter();                                
                            }
                            // Сбросить все настройки таблицы
                            else if(data.itemData.name == "ResetGridState") {
                                e.component.state(null);
                            }
                            if (this.onResetFiltersButton){
                              this.onResetFiltersButton();
                            }
                        }
                    }
                }
            });
        }
    },
    contentReady(e) {
        this.grid = e.component;
        if (this.userStateKey && this.userStateTime) {
            this.saveGridState();
        }

        if(this.selectFirstRow && !this.firstRowIsSelected && this.dataSource && this.dataSource.length > 0) {
            e.component.selectRowsByIndexes([0]);
            this.firstRowIsSelected = true;
        }
        this.onContentReady(e);

        if(this.grid) {
            const combinedFilter = this.grid.getCombinedFilter();
            const gridRowsIsFiltered = combinedFilter != null && combinedFilter.length > 0;
            if(this.gridToolbar && this.gridRowsIsFiltered != gridRowsIsFiltered) {
                this.gridRowsIsFiltered = gridRowsIsFiltered;
                this.gridToolbar.component.repaint();
            }
        }
    },
    contextMenuPreparing(e) {        
        if(this.grid && this.grid.hasEditData()) {            
            this.grid.cancelEditData();
        }
        if(this.showColumnChooser) {
            if(e.target == 'header') {
                if(!e.items) e.items = [];
                e.items.push({
                    text: localizeFilter("HideColumn"),
                    onItemClick: () => {
                        e.component.columnOption(e.column.dataField, "visible", false);
                    }
                });
            }
        }
        this.onContextMenuPreparing(e);

        if(e.target == 'content' && e.row && e.row.data) {
            if(!e.items) e.items = [];
            if(this.logMenuEnabled) {
                if(this.$store.getters.currentUserIsAllowedAction("LoadPageAppLogs")) {
                    const logObjectID = e.row.data[this.logKeyExpr];
                    const logTypeName = this.logTypeName ? this.logTypeName : this.logTypeFieldName ? e.row.data[this.logTypeFieldName] : null;
                    if(logObjectID && logTypeName) {
                        const logType = this.$store.getters.getTypes.find(t => t.Name == logTypeName) 
                        if(logType) {
                            const query = {type: logType.ID, id: logObjectID};
                            const routeData = this.$router.resolve({name: 'AppLogs', query});
                            componentUtils.contextMenuAddLink(e, routeData.href, "AppLogs", "event");
                        }
                    }
                }
            }
        }
    },
    cellPrepared(e) {
        /*if(this.allowGraphTaskStyles) {
            componentUtils.setGraphTaskCellStyle(e);
        }*/
        this.onCellPrepared(e);
    },
    rowPrepared(e) {
        /*if(this.allowGraphTaskStyles) {
            componentUtils.setGraphTaskRowStyle(e);
        }*/
        this.onRowPrepared(e);
    },
    rowClick(e) {
        if(this.showEditorByRowClick) {
            e.component.editRow(e.rowIndex);
        }
    },
    initNewRow(e) {
        e.parentData = this.parentData;
        this.onInitNewRow(e);
    },
    editingStart(e) {
        if(!this.allowEditing) {
            componentUtils.hideSaveButton();
        }
        this.onEditingStart(e);
    },
    // editingPopupShown(e) {
    //     var toolbarItems = e.component.option("toolbarItems");
    //     toolbarItems[1].options.text = localizeFilter("DoNotSave");
    //     e.component.option("toolbarItems", toolbarItems);  
    // },
    editorPreparing(e) {
        if(e.parentType === "filterRow" || e.parentType === "searchPanel") {
            e.updateValueTimeout = 1000;
        }
        else if(e.parentType == "dataRow") {  
            this.gridEditRow = e.row;
            if(e.lookup && e.lookup.displayExpr) {  
                e.editorOptions.itemTemplate = function(data) {  
                    const title = data[e.lookup.displayExpr];
                    return "<span title='" + title + "'>" + title +"</span>";
                }
            }
        } 
        this.onEditorPreparing(e);
    },
    rowValidating(e) {
        if(!e.isValid && e.brokenRules.length) {
            let brokenRule = null;
            let columnIndex = null;
            for(let i in e.brokenRules) {
                if(brokenRule == null || e.brokenRules[i].columnIndex < columnIndex) {
                    brokenRule = e.brokenRules[i];
                    columnIndex = e.brokenRules[i].columnIndex;
                }
            }
            notify.warning(null, null, brokenRule.message);
        }
        this.onRowValidating(e);
    },
    rowInserting(e) {
        this.onRowInserting(e);
    },
    rowInserted(e) {
        this.onRowInserted(e);
    },
    rowUpdating(e) {
        this.onRowUpdating(e);
    },
    rowUpdated(e) {
        this.onRowUpdated(e);
    },
    rowRemoving(e) {
        this.onRowRemoving(e);
    },
    rowRemoved(e) {
        this.onRowRemoved(e);
    },
    onReorder(e) {
        const visibleRows = e.component.getVisibleRows();
        const toIndex = this.dataSource.indexOf(visibleRows[e.toIndex].data);
        const fromIndex = this.dataSource.indexOf(e.itemData);
        const items = [...this.dataSource];

        items.splice(fromIndex, 1);
        items.splice(toIndex, 0, e.itemData);
    
        let reorderItems = [];
        for(let i = 0; i < items.length; i++) {
            const item = items[i];
            if(item.SortIndex != i + 1) {
                item.SortIndex = i + 1;
                reorderItems.push({ key: item[this.keyExpr], values: item});
            }
        }
        this.onReordering(reorderItems);
    },
    reorderHiding(items) {
        if(items) {
            this.onReordering(items);
        }
        this.showReorderList = false;
    },    
    cellValueChanged(value, cellInfo) {
      cellInfo.setValue(value);
      cellInfo.component.updateDimensions();
      if(cellInfo.column.lookup && cellInfo.column.lookup.onCellValueChanged) {
         cellInfo.column.lookup.onCellValueChanged(cellInfo);
      }
    },
    listSelectionChanged(cellInfo, addedItems, removedItems) {
        let value = cellInfo.value ? cellInfo.value : [];
        value = value.concat(addedItems);
        value = value.filter(v => !removedItems.find(r => r[this.keyExpr] == v[this.keyExpr]));
        cellInfo.setValue(value);
        cellInfo.component.updateDimensions(); // Перерисовка после изменения размера
    },
    listEditorOption(cellInfo, option) {
        if(cellInfo && cellInfo.column && cellInfo.column.lookup && cellInfo.column.lookup[option]) {
            if(typeof cellInfo.column.lookup[option] === 'function') {
                return cellInfo.column.lookup[option](cellInfo);
            }
            else if(cellInfo.column.lookup[option] instanceof Array) {
                return cellInfo.column.lookup[option];
            }
        }
        return null;
    },
    listEditorSelectionMode(cellInfo) {
        if(cellInfo && cellInfo.column && cellInfo.column.lookup && cellInfo.column.lookup.selectionMode) {
            return cellInfo.column.lookup.selectionMode;
        }
        return "single";
    },
    getItemTitle(cellInfo, item) {
        const lookup = cellInfo.column.lookup;
        if (!lookup) { return item.Title; }

        const displayExpr = lookup.displayExpr;
        const keyExpr = lookup.keyExpr;

        let value;

        if (displayExpr) {
            if (displayExpr.includes('.')) {
                value = {...item};
                const displaySplit = displayExpr.split('.');
                for (let displayPart of displaySplit) {
                    value = value[displayPart] ? value[displayPart] : "";
                }
            } else if (lookup.dataSource){
                const dataSource = lookup.items;
                if (typeof item === "object") {
                    //lookupItem = dataSource.find(o => o[keyExpr] == item[keyExpr]) || {};
                    value = item[displayExpr];
                } else {
                    let lookupItem;
                    lookupItem = dataSource.find(o => o[keyExpr] == item) || {};
                    value = lookupItem[displayExpr];
                }
                
            }else {
                value = item[displayExpr];                
            }
        }
        if (value instanceof Date) {
            value = utils.dateToString(value);
        }
        return value;
    },
    getItemTitles(cellInfo, items) {
        let titles = "";
        if(cellInfo && items && items instanceof Array) {
            for(let i in items) {
                if(i > 0) {
                    titles += ", ";
                }
                const title = this.getItemTitle(cellInfo, items[i]);
                if(title) {
                    titles += title;
                }
            }
        }
        return titles;
    },
    getItemShortTitle(cellInfo, item) {
        return item[cellInfo.column.lookup ? cellInfo.column.lookup.displayExpr : "ShortTitle"];
    },
    hyperLinkIsWeb(text) {
        return text.startsWith('http');
    },
    hyperLinkClick(e) {
        componentUtils.copyToClipboard(e.srcElement.innerText);
        notify.info(null, null, "HyperlinkCopiedToClipboard");
        if(this.grid) {
            this.grid.cancelEditData();
        }
    },
    customizeExcelCell(options) {
        var gridCell = options.gridCell;
        if(!gridCell || gridCell.rowType !== "data") { return; }
        options.excelCell.alignment = { wrapText: true, horizontral: "left", vertical: "top" };
        options.wrapTextEnabled = true;
          
        if(gridCell.value instanceof Array) {
            let optionsValue = "";
            for(let i in gridCell.value) {
                const cellValue = gridCell.value[i];
                let displayValue = "";

                if(typeof cellValue === "object")
                {
                    const displayExpr = gridCell.column.lookup ? gridCell.column.lookup.displayExpr : null;
                    if(displayExpr) {
                        displayValue = cellValue[displayExpr];
                        if(!displayValue) {
                            displayValue = "";
                        }
                        if(displayValue instanceof Date) {
                            displayValue = utils.dateToString(displayValue);
                        }
                    }
                    else if(cellValue.ShortTitle) {
                        displayValue = cellValue.ShortTitle;
                    }
                    else if(cellValue.Title) {
                        displayValue = cellValue.Title;
                    }
                    else {
                        displayValue = "";
                    }
                }
                else {
                    const lookup = gridCell.column.lookup;
                    if (lookup && lookup.displayExpr) {
                        // lookup of ids                    
                        const displayExpr = lookup.displayExpr;
                        const keyExpr = lookup.keyExpr || lookup.valueExpr;
                        const items = lookup.items;
                        if (items && items.length ) {
                            const item = items.find(i => i[keyExpr] == cellValue)
                            displayValue = item ? item[displayExpr] : "";
                        }
                    } else {
                        displayValue = cellValue;
                    }
                }

                if(gridCell.value.length > 1) {
                    optionsValue += (i*1 + 1) + ") ";
                }
                optionsValue += displayValue  + "\r\n";
            }
            options.excelCell.value = optionsValue;            
            //options.excelCell.alignment = { wrapText: true, horizontral: "left", vertical: "top" };
            //options.wrapTextEnabled = true;
        }
        this.onCustomizeExcelCell(options);
    },
  },
  data() {
    return {
        grid: null,
        gridId: Math.floor(Math.random() * 10000),
        gridColumns: null,
        gridToolbar: null,
        gridEditRow: null,
        gridRowsIsFiltered: false,
        firstRowIsSelected: false,
        showReorderList: false,
        elementWidth: null,
        elementHeight: null,
        selection: null,
        allowReordering: false,
        wordWrapEnabledValue: this.wordWrapEnabled,
        userStateTime: null,
        columnChooserSearch: {enabled: true},
        selectedRows: null,
        toolbarItems:[{  
            toolbar:'bottom',  
            location: 'after',  
            widget: "dxButton",  
            options: {  
                text: localizeFilter("Save"),  
                onClick: (args) => {  
                    this.onSaving({ component: this.grid, row: this.gridEditRow, args});
                    this.grid.saveEditData();
                }  
            }  
        }, {  
            toolbar:'bottom',  
            location: 'after',  
            widget: "dxButton",  
            options: {  
                text: localizeFilter("DoNotSave"),  
                onClick: (args) => { 
                    this.grid.cancelEditData({ component: this.grid, row: this.gridEditRow, args});
                }  
            }  
        }]
    }
  },
  computed: {

    allowEditing() {
      return this.allowAdding || this.allowUpdating || this.allowDeleting;
    },
    wordWrapIcon() {
        if(this.wordWrapEnabledValue) {
            return "decreaselinespacing";
        }
        else {
            return "increaselinespacing";
        }
    },
    wordWrapTooltip() {
       if(this.wordWrapEnabledValue) {
            return localizeFilter("MinRowHeight");
        }
        else {
            return localizeFilter("MaxRowHeight");
        } 
    },
    pagerVisible() {
        if(this.showPageSelector) return true;
        return "auto";
    }
  },
  watch: {
      columns() {
          this.setGridColumns();
          this.loadGridState();
      },
      grid() {        
        this.loadGridState();
      },
      wordWrapEnabled(value) {
        this.wordWrapEnabledValue = value;
      }
  },
  mounted() {
      this.setGridColumns();
      this.setSelection();
  }
};
</script>

<style>

    .data-grid-container {
        margin: 0;
        padding: 0;
    }

    .data-grid-container .tag-box-editor {
        display: block;
    }
    .data-grid-container .data-grid-box-editor {
        display: block;
        padding-bottom: 20px;
    }

    .data-grid-container .dx-datagrid {
        font-size: 11px;
    }

    .data-grid-container .dx-toolbar-items-container {
        border-top: 2px solid #fff;
    }

    .data-grid-container .dx-datagrid-rowsview .dx-row > .dx-master-detail-cell {
        padding: 0;
    }

    .data-grid-container .dx-invalid-message {
        display: none;
    }

    .data-grid-details-container {
        background-color: rgb(253, 252, 251);
        padding: 5px 10px 10px 20px;
    }

    .data-grid-sub-details-container {
        background-color: rgb(243, 242, 241);
        padding: 5px 10px 10px 20px;
    }

    .data-grid-container .rows-is-filtered {
        background-color: rgb(255, 196, 196);
        border: 1px solid rgb(255, 86, 86);
        border-radius: 3px;
    }

    .data-grid-container .rows-is-not-filtered {
        border: 1px solid rgb(212, 212, 212);
        border-radius: 3px;
    }

    .data-grid-hyperlink {
        text-decoration: underline;
        color: blue;
        cursor: pointer;
    }

</style>