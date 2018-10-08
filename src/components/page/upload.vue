<template>
  <div>
    <!--多张图片上传-->
    <el-upload
      action="http://172.16.30.45:9999/yt/rest/v1/file/upload"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :before-upload="beforeUploadMoreImg"
      :on-success='uploadSuccessMoreImg'
      :on-remove="handleRemoveMoreImg"
      :file-list="fileListImg"
      :limit="3"
      ref="uploadImg"
    >
      <i class="el-icon-plus"></i>
    </el-upload>

    <!--单张图片上传-->
    <el-upload
      list-type="picture-card"
      action="http://172.16.30.45:9999/yt/rest/v1/file/upload"
      :show-file-list="false"
      :before-upload="beforeUploadImg"
      :on-success="uploadSuccessImg"
      ref="OneUploadImg"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus"></i>
    </el-upload>



    <!--多个视频上传-->
    <el-upload
      class="upload-demo"
      action="http://172.16.30.45:9999/yt/rest/v1/file/upload"
      :before-upload="beforeUploadVideo"
      :on-success='uploadSuccessVideo'
      :on-remove="handleRemoveVideo"
      multiple
      :limit="3"
      :file-list="fileListVideo"
      ref="uploadVideo"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>



    <!--多个语音上传-->
    <el-upload
      class="upload-demo"
      action="http://172.16.30.45:9999/yt/rest/v1/file/upload"
      :before-upload="beforeUploadVoice"
      :on-success='uploadSuccessVoice'
      :on-remove="handleRemoveVoice"
      multiple
      :limit="3"
      :file-list="fileListVoice"
      ref="uploadVoice"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>



    <!--多个文件上传-->
    <el-upload
      class="upload-demo"
      action="http://172.16.30.45:9999/yt/rest/v1/file/upload"
      :before-upload="beforeUploadTxt"
      :on-success='uploadSuccessTxt'
      :on-remove="handleRemoveTxt"
      multiple
      :limit="3"
      :file-list="fileListTxt"
      ref="uploadTxt"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-button @click="submit">提交</el-button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dialogImageUrl: '',//图片预览字段
        dialogVisible: false,
        fileListImg: [],  //多张图片上传字段(limit可限制个数)
        fileListVoice: [], //多个语音上传字段(limit可限制个数)
        fileListVideo: [],  //多个视频上传字段(limit可限制个数)
        fileListTxt: [],  //多个文件上传字段(limit可限制个数)
        imageUrl: ""   //单张图片上传字段
      }
    },
    created: function () {
      this.$store.dispatch('reset');
    },
    methods: {
      /*多个图片调用的删除方法*/
      handleRemoveMoreImg(file, fileList) {
        this.fileListImg.forEach((currentValue, index) => {
          if (currentValue.id == file.id) {
            this.fileListImg.splice(index, 1);
          }
        })
      },
      /*多个语音调用的删除方法*/
      handleRemoveVoice(file, fileList){
        this.fileListVoice.forEach((currentValue, index) => {
          if (currentValue.id == file.id) {
            this.fileListVoice.splice(index, 1);
          }
        })
      },
      /*多个视频调用的删除方法*/
      handleRemoveVideo(file, fileList){
        this.fileListVideo.forEach((currentValue, index) => {
          if (currentValue.id == file.id) {
            this.fileListVideo.splice(index, 1);
          }
        })
      },
      /*多个文件调用的删除方法*/
      handleRemoveTxt(file, fileList){
        this.fileListTxt.forEach((currentValue, index) => {
          if (currentValue.id == file.id) {
            this.fileListTxt.splice(index, 1);
          }
        })
      },
      /*多图片上传预览方法*/
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      /*单张图片文件上传验证方法*/
      beforeUploadImg(file){
        const fileNameArr = file.name.split('.');
        const typeName = fileNameArr[fileNameArr.length - 1].toLocaleLowerCase();
        if (typeName != 'jpg' && typeName != 'png' && typeName != 'jpeg' && typeName != 'gif') {
          this.$message("上传文件只能是 jpg、png、jpeg、gif 格式!");
          return false;
        }
      },
      /*多图片文件上传验证方法*/
      beforeUploadMoreImg(file){
        const fileNameArr = file.name.split('.');
        const typeName = fileNameArr[fileNameArr.length - 1].toLocaleLowerCase();
        const sourceData = this.$refs.uploadImg;
        if (typeName != 'jpg' && typeName != 'png' && typeName != 'jpeg' && typeName != 'gif') {
          this.$message("上传文件只能是 jpg、png、jpeg、gif 格式!");
          return false;
        }
        return this.limit(sourceData);
      },
      /*多语音上传验证方法*/
      beforeUploadVoice(file){
        const fileNameArr = file.name.split('.');
        const typeName = fileNameArr[fileNameArr.length - 1].toLocaleLowerCase();
        const sourceData = this.$refs.uploadVoice;
        if (typeName != 'mp3' && typeName != 'wav' && typeName != 'wma') {
          this.$message("上传文件只能是 mp3、wav、wma格式!");
          return false;
        }
        return this.limit(sourceData);
      },
      /*多视频上传验证方法*/
      beforeUploadVideo(file){
        const fileNameArr = file.name.split('.');
        const typeName = fileNameArr[fileNameArr.length - 1].toLocaleLowerCase();
        const sourceData = this.$refs.uploadVideo;
        if (typeName != 'mp4' && typeName != 'webm' && typeName != 'rmvb') {
          this.$message("上传文件只能是 mp4、webm、rmvb格式!");
          return false;
        }
        return this.limit(sourceData);
      },
      /*多文件上传验证方法*/
      beforeUploadTxt(file){
        const fileNameArr = file.name.split('.');
        const typeName = fileNameArr[fileNameArr.length - 1].toLocaleLowerCase();
        const sourceData = this.$refs.uploadTxt;
        if (typeName != 'doc' && typeName != 'xls' && typeName != 'pdf' && typeName != 'pptx' && typeName != 'ppt') {
          this.$message("上传文件只能是 doc、xls、pdf、pptx、ppt格式!");
          return false;
        }
        return this.limit(sourceData);
      },
      uploadSuccessImg(res, file){//单个图片上传
        this.imageUrl = res.url;
      },
      uploadSuccessMoreImg(res, file){//多张图片上传
        this.fileListImg.push(res);
      },
      uploadSuccessVoice(res, file){//多个语音上传
        this.fileListVoice.push(res);
      },
      uploadSuccessVideo(res, file){//多个视频上传
        this.fileListVideo.push(res);
      },
      uploadSuccessTxt(res, file){//多个文件上传
        this.fileListTxt.push(res);
      },
      limit(sourceData){
        if(sourceData != undefined){
          if (sourceData.$attrs.limit != undefined) {
            if (sourceData.$attrs.limit <= sourceData.fileList.length) {
              this.$message("上传文件个数超出限制");
              return false;
            }
          }
        }
      },
      submit(){
        console.log(this.fileListImg)
        console.log(this.fileListVideo)
        console.log(this.fileListVoice)
        console.log(this.fileListTxt)
        console.log(this.imageUrl)
      }
    }
  }
</script>

<style scoped>
  .avatar {
    width: 148px;
    height: 148px;
    display: block;
  }
</style>
