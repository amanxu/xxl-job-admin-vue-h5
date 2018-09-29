<template>
  <div>
    <el-upload
      action="/art/oss/upLoadFile"
      list-type="picture"
      :file-list="fileList"
      :limit="1"
      :on-preview="handlePictureCardPreview"
      :on-success="handleImageSuccess"
      :on-remove="handleRemove">
      <el-button :disabled="uploadButtonDisabled" plain class="el-icon-plus" style="width: 60px" size="medium"
                 type="success"></el-button>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>

</template>

<script>
  export default {
    name: "face-image",
    props: {
      fileList: Array
    },
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        uploadButtonDisabled: false
      };
    },
    methods: {

      rmImage() {
        this.emitInput('')
      },
      emitInput(val) {
        this.$emit('input', val)
      },
      handleImageSuccess(file) {
        this.uploadButtonDisabled = true
        this.emitInput(file.data)
      },

      handleRemove(file, fileList) {
        this.rmImage()
        this.uploadButtonDisabled = false
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
    }
  }
</script>

<style scoped>

</style>
