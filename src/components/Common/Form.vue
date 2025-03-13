<template>
  <div v-if="!!formItems" class="form-container">
      <div v-if="allowUpdating && showEditButtons" class="form-buttons-container">
        <div v-if="!editMode" class="form-buttons">
          <DxButton
            :hint="'Edit'|localize"
            icon="edit"
            @click="editClick"
          />
        </div>
        <div v-else class="form-buttons">
          <DxButton
            :hint="'Save'|localize"
            icon="save"
            :validation-group="validationGroup"
            @click="saveClick"
          />
          <DxButton
            :hint="'Cancel'|localize"
            icon="undo"
            @click="cancelClick"
          />
        </div>
      </div>
      <DxForm
        ref="formRef"
        :on-content-ready="onContentReady"
        :form-data="formData"
        :read-only="readOnly"
        :col-count="colCount"
        :items="items"
        @field-data-changed="fieldDataChanged" 
        :validation-group="validationGroup">
        <template #popupDataGridEditTemplate="{ data }">
            <div class="popup-data-grid-editor">
                <DropDownDataGridEditor
                  :columns="data && data.editorOptions ? data.editorOptions.columns : null"
                  :data-source="data && data.editorOptions ? data.editorOptions.items : null"
                  :is-required="data && data.editorOptions ? data.editorOptions.isRequired : null"
                  :height="500"
                  :key-expr="data && data.editorOptions ? data.editorOptions.keyExpr : null"
                  :value-expr="data && data.editorOptions ? data.editorOptions.valueExpr : null"
                  :display-expr="data && data.editorOptions ? data.editorOptions.displayExpr : null"
                  :selection-mode="data && data.editorOptions ? data.editorOptions.selectionMode : null"
                  :editor-height="data && data.editorOptions ? data.editorOptions.editorHeight : null"
                  :read-only="readOnly"
                  :width="data && data.editorOptions ? data.editorOptions.width : null"
                  :use-multiline-read-only="data && data.editorOptions ? data.editorOptions.useMultilineReadOnly : null"
                  :value="getValue(data)"
                  :on-value-changed="(value) => setValue(data, value)"
                />
            </div>
        </template>
      </DxForm>
  </div>
</template>
<script>

import { DxForm } from 'devextreme-vue/form';
import DxButton from 'devextreme-vue/button';
import DropDownDataGridEditor from '@/components/Common/DropDownDataGridEditor.vue';
import ValidationEngine from 'devextreme/ui/validation_engine';

export default {
  components: {  
    DxForm,
    DxButton,
    DropDownDataGridEditor
  },
  props: {
    formData: {
      type: Object,
      default: () => {}
    },
    formItems: {
      type: Array,
      default: () => null
    },
    allowUpdating: {
        type: Boolean,
        default: () => false
    },
    showEditButtons: {
        type: Boolean,
        default: () => true
    },
    colCount: {
      type: Number,
      default: () => 2
    },
    externalIsValid: {
      type: Function,
      default: () => function() { return true; }
    },
    enableEditMode: {
      type: Boolean,
      default: () => false
    },
    onlyEditMode: {
      type: Boolean,
      default: () => false
    },
    onEdit: {
      type: Function,
      default: () => function() {}
    },
    onUpdating: {
      type: Function,
      default: () => function() {}
    },
    onCancel: {
      type: Function,
      default: () => function() {}
    },
    onContentReady: {
      type: Function,
      default: () => function() {}
    },
    onFieldDataChanged: {
      type: Function,
      default: () => function() {}
    },
    onValidationChanged: {
      type: Function,
      default: () => function() {}
    },
    allowEditCustomCell: {
        type: Function,
        default: () => function() {}
    },
  },
  data() {
    return {
      editMode: false,
      items: null,
      validationGroup: "validationGroup" + new Date().getTime()
    }
  },
  methods: {
    setItems() {
      let items = [];
      for(let formItem of this.formItems) {
        let item = this.newItem(formItem);
        items.push(item)
      }
      this.items = items;
    },
    newItem(formItem) {
      const readOnly = this.readOnly || (formItem.allowEditing == false);

      let item = {
        label: {
          text: formItem.caption
        }
      };
      
      if(formItem.dataField) {
        item.dataField = formItem.dataField;
      }

      if(formItem.colSpan) {
        item.colSpan = formItem.colSpan;
      }

      if(formItem.colCount) {
        item.colCount = formItem.colCount;
      }

      if(formItem.itemType) {
        item.itemType = formItem.itemType;
      }

      if(formItem.editorOptions) {
        item.editorOptions = formItem.editorOptions;
        item.editorOptions.readOnly = readOnly;
      }
      else {
        item.editorOptions = { readOnly }
      }

      if(formItem.editorType === "selectBox") {
        item.editorType = "dxSelectBox";
        item.editorOptions.searchEnabled = true;
        item.editorOptions.showClearButton = !formItem.isRequired;
      }
      else if(formItem.editorType === "multiSelectBox") {
        item.editorType = "dxTagBox";
        item.editorOptions.searchEnabled = true;
        item.editorOptions.showClearButton = !formItem.isRequired;
      }

      if(formItem.items) {
        item.label.location = "top";
        item.items = formItem.items.map(i => {
          return this.newItem(i, readOnly);
        });
      }

      if(!readOnly) {
        if(formItem.isRequired) {
          item.validationRules = [{ 
            type: "required",
            validationGroup: this.validationGroup
          }];
        }
      }

      if(formItem.dataType === "date") {
        item.editorType = "dxDateBox";
      }
      else if(formItem.dataType === "boolean") {
        item.editorType = "dxCheckBox";
      }
      else if(formItem.dataType === "number") {
        item.editorType = "dxNumberBox";
      }
      else if(formItem.dataType === "textArea") {
        item.editorType = "dxTextArea";
        if(formItem.editorOptions) {
          item.editorOptions = formItem.editorOptions;
        }
      }
      else if(formItem.lookup) {
        if(formItem.editCellTemplate === "popupDataGridEditTemplate") {
          item.template = formItem.editCellTemplate;
        }
        else if(formItem.lookup.selectionMode === "multiple") {
          item.editorType = "dxTagBox";
        }
        else {
          item.editorType = "dxSelectBox";
        }
        item.editorOptions = {
          items: formItem.lookup.dataSource(),
          valueExpr: formItem.lookup.valueExpr,
          displayExpr: formItem.lookup.displayExpr,
          keyExpr: formItem.lookup.keyExpr,
          columns: formItem.lookup.columns,
          useMultilineReadOnly: formItem.lookup.useMultilineReadOnly,
          selectionMode: formItem.lookup.selectionMode,
          searchEnabled: true,
          editorHeight: formItem.editorHeight,
          showClearButton: !formItem.isRequired,
          readOnly
        };
      }
      else if(formItem.cellTemplate === "multilineTextTemplate") {
        item.editorType = "dxTextArea";
        item.editorOptions = {
          inputAttr: {
            rows: 3
          },
        }
      }

      return item;
    },
    getValue(data) {
      return this.formData[data?.dataField];
    },
    setValue(data, value) {
      data.value = value;
      this.formData[data?.dataField] = value;
      this.fieldDataChanged(data);
    },
    editClick() {
      this.editMode = true;
      this.setItems();
      this.onEdit(true);
    },
    saveClick() {
      const result = ValidationEngine.validateGroup(this.validationGroup);
      if(result?.isValid && this.externalIsValid()) { 
        this.onUpdating({...this.formData});
        this.editMode = this.onlyEditMode ? true : false;
        this.setItems();
        this.onEdit(this.editMode);
      }
    },
    cancelClick() {
      this.onCancel();
      this.editMode = false;
      this.setItems();
      this.onEdit(false);
    },
    fieldDataChanged(e) {
      const result = ValidationEngine.validateGroup(this.validationGroup);
      this.onFieldDataChanged(e);
      this.onValidationChanged(result?.isValid);
    },
  },
  computed: {
    readOnly() {
      return !this.allowUpdating || !this.editMode;
    }
  },
  watch: {
    formData() {
      this.editMode = this.onlyEditMode ? true : false;
      this.setItems();
    }
  },
  mounted() {
    this.editMode = this.enableEditMode;
    this.setItems();
  }
};
</script>

<style>
  .form-container {
    border: 1px solid rgb(230, 230, 230);
    border-radius: 5px;
    padding: 10px;
    position: relative;
  }
  .form-container .dx-layout-manager .dx-field-item:not(.dx-first-row) {
    padding-top: 4px;
  }
  .form-container .dx-texteditor.dx-state-readonly {
    /* border-style: dashed; */
    border: 1px solid #f7f7f7;
  }
  .form-container .dx-field-item-label-text {
   white-space: normal;
  }
  .form-container .popup-data-grid-editor .dx-dropdowneditor {
    min-height: 26px;
  }

  .form-container .dx-field-item-has-group {
    border: 1px solid rgb(230, 230, 230);
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 5px;
  }

  .form-container  .dx-field-item-label-location-top {
    margin-top: 3px;
    padding-bottom: 5px;
    margin-bottom: 8px;
    border-bottom: 1px solid rgb(221, 186, 120);
   }

  .form-container .dx-field-item-label-location-top .dx-field-item-label-content .dx-field-item-label-text {
    font-size: 13px;
    color: rgb(124, 100, 90);
  }

  .form-buttons-container {
    background-color: rgba(252, 252, 252, 0.815);
    padding: 3px 10px;
    margin: -6px 6px 0 0;
    position: absolute;
    right: 0;
    border: 1px solid #eee;
    border-radius: 4px;
    z-index: 100;
  }
  .form-buttons {
    text-align: right;
  }
  .form-buttons .dx-button {
    margin-left: 5px;
  }
</style>