<template>
    <div class="file-uploader">      
      <DxFileUploader
          :accept="accept"
          :multiple="multiple"
          :upload-mode="uploadMode"
          :upload-url="uploadUrl"
          @uploaded="onUploaded"
          :name="fileName"
          width="350"
      />
    </div>
  </template>
  
  <script>

import { DxFileUploader } from 'devextreme-vue/file-uploader';

export default {
  name: 'FileUploader',
  components: {
    DxFileUploader,
  },
  props: {
    fileName: {
        type: String,
        default: () => ""
    },
    uploadUrl: {
        type: String,
        default: () => null
    },
    onUploaded: {
      type: Function,
      default: () => {}
    },
    accept: {
      type: String,
      default:() => "*"
    }
  },
  data() {
    return {
      multiple: false,      
      uploadMode: 'instantly',
    };
  },
  methods: {
  },
  computed: {
  },
  mounted() {
    let open = XMLHttpRequest.prototype.open;  
    XMLHttpRequest.prototype.open = function() {  
        open.apply(this, arguments);
        this.withCredentials = true;
    } 
  }
}
</script>


<style>
  .file-uploader{    
    display: flex;
    padding-top: 100px;
    justify-content: center;
  }
</style>
