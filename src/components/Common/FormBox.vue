<template>
    <PopupBox
        :visible="visible"
        :title="title"
        width="80%"
        height="80%"
        :apply-button-text="'Save'|localize"
        :close-button-text="'DoNotSave'|localize"
        :apply-button-enabled="applyButtonEnabled"
        :without-apply-button="false"
        :close-on-apply="true"
        :on-apply="apply"
        :on-close="onClose">
        <template #container>
            <div class="object-form-box-container">
                <Form
                  :form-data="formData"
                  :form-items="formItems"
                  :enable-edit-mode="true"
                  :only-edit-mode="false"
                  :allow-editing="true"
                  :show-edit-buttons="false"
                  :col-count="2"
                  :external-is-valid="externalIsValid"
                  :allow-updating="allowEditing"
                  :label-location="labelLocation"
                  :on-edit="onEdit"
                  :on-updating="formUpdating"
                  :on-cancel="formCancel"
                  :on-content-ready="onContentReady"
                  :on-field-data-changed="onFieldDataChanged"
                  :on-validation-changed="validationChanged"
                />
            </div>
        </template>
    </PopupBox>
</template>

<script>


import PopupBox from '@/components/Common/PopupBox.vue';
import Form from "@/components/Common/Form.vue";


export default {
    components: {
        PopupBox,
        Form
    },
    props: {
        title: {
            type: String,
            default: () => ""
        },
        formData: {
            type: Object,
            default: () => null
        },
        formItems: {
            type: Array,
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
        externalIsValid: {
          type: Function,
          default: () => {return true;}
        },
        enableEditMode: {
          type: Boolean,
          default: () => false
        },
        onlyEditMode: {
          type: Boolean,
          default: () => true
        },
        allowEditing: {
          type: Boolean,
          default: () => true
        },
        showEditButtons: {
          type: Boolean,
          default: () => false
        },
        colCount: {
          type: Number,
          default: () => 2
        },
        labelLocation: {
          type: String,
          default: () => "left"
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
        }
    },
    data() {
      return {
        applyButtonEnabled: false
      }
  },
  methods: {
    validationChanged(isValid) {
        this.applyButtonEnabled = isValid;
        this.onValidationChanged();
    },
    async apply() {
        if(this.formData) {
            this.onApply(this.formData);
        }
        else {
            this.onClose();
        }
    },
    async formUpdating(data) {
      this.onUpdating(data);
    },
    formCancel() {
      this.onCancel();
    },
  },
  computed: {
  },
  mounted() {
  }
};

</script>

<style>
    .object-form-box-container {
        /* display: flex; */
        margin: 2px 0 10px 0;
    }

    .dx-toolbar-label > div,
    .dx-toolbar-label .dx-toolbar-item-content > div {
      overflow: initial;
    }
</style>