<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :class-name="'sub-navbar '+postForm.status">
        <CommentDropdown v-model="postForm.allowComment"/>
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布
        </el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm">草稿</el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>

          <el-col :span="24">
            <el-form-item style="margin-bottom: 20px;text-align: start" label="标题:" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                标题
              </MDinput>
            </el-form-item>

            <el-form-item style="margin-bottom: 10px;margin-left: 15px" label-width="45px" label="封面图:" prop="imgUrl">
              <Upload v-model="postForm.imgUrl" :fileList="fileList"/>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="45px" label="作者:" class="postInfo-container-item" prop="userName">
                    <el-select v-model="postForm.userId" :remote-method="getRemoteUserList" filterable remote
                               placeholder="搜索用户">
                      <el-option v-for="item in userListOptions" :key="item.id" :label="item.userName"
                                 :value="item.id"/>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="10">
                  <el-form-item label-width="80px" label="发布时间:" class="postInfo-container-item">
                    <el-date-picker v-model="postForm.publishTime" type="datetime" placeholder="选择日期时间"/>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label-width="60px" label="重要性:" class="postInfo-container-item">
                    <el-rate
                      v-model="postForm.sort"
                      :max="5"
                      :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                      :low-threshold="1"
                      :high-threshold="5"
                      style="margin-top:8px;"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 20px;" label-width="45px" label="摘要:">
          <el-input :rows="1" v-model="postForm.summary" type="textarea" class="article-textarea" autosize
                    placeholder="请输入内容"/>
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}字</span>
        </el-form-item>

        <div class="editor-container">
          <Tinymce ref="editor" :height="400" v-model="postForm.content"/>
        </div>
      </div>
    </el-form>

  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import Upload from '@/components/Upload/faceImage'
  import MDinput from '@/components/MDinput'
  import Sticky from '@/components/Sticky' // 粘性header组件
  import {validateURL} from '@/utils/validate'
  import {CommentDropdown, PlatformDropdown, SourceUrlDropdown} from './Dropdown'
  import {create, deleted, detail, fetchPage, modify, operate, userByName} from "@/api/article";

  const defaultForm = {
    status: 'draft',
    title: '', // 文章题目
    content: '', // 文章内容
    summary: '', // 文章摘要
    sourceUrl: '', // 文章外链
    imgUrl: '', // 文章图片
    publishTime: undefined, // 前台展示时间
    id: undefined,
    allowComment: false,
    sort: 0,
    userName: '',
    userId: undefined
  }

  export default {
    name: 'ArticleDetail',
    components: {Tinymce, MDinput, Upload, Sticky, CommentDropdown, PlatformDropdown, SourceUrlDropdown},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const validateRequire = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            message: rule.field + '为必传项',
            type: 'error'
          })
          callback(new Error(rule.field + '为必传项'))
        } else {
          callback()
        }
      }
      const validateSourceUri = (rule, value, callback) => {
        if (value) {
          if (validateURL(value)) {
            callback()
          } else {
            this.$message({
              message: '外链url填写不正确',
              type: 'error'
            })
            callback(new Error('外链url填写不正确'))
          }
        } else {
          callback()
        }
      }
      return {
        postForm: Object.assign({}, defaultForm),
        loading: false,
        userListOptions: [],
        rules: {
          imgUrl: [{required: true, validator: validateRequire}],
          title: [{required: true, validator: validateRequire}],
          content: [{validator: validateRequire}],
          sourceUri: [{validator: validateSourceUri, trigger: 'blur'}],
          userName: [{required: true, message: '请选择作者', trigger: 'blur'}]
        },
        fileList: [],
      }
    },
    computed: {
      contentShortLength() {
        return this.postForm.summary.length
      }
    },
    created() {
      if (this.isEdit) {
        const id = this.$route.params && this.$route.params.id
        this.fetchData(id)
        this.getRemoteUserList('')
      } else {
        this.postForm = Object.assign({}, defaultForm)
      }
    },
    methods: {
      fetchData(id) {
        detail(id).then(response => {
          this.postForm = response.data
          this.initImgArr(this.postForm.imgUrl)
        }).catch(err => {
          console.log(err)
        })
      },
      initImgArr(imgInfo) {
        const url = imgInfo
        const name = imgInfo.substr(imgInfo.lastIndexOf('/') + 1)
        this.fileList.push({url, name})
      },
      submitForm() {
        for (let item of this.userListOptions) {
          if (item.id === this.postForm.userId) {
            this.postForm.userName = item.userName
            break;
          }
        }
        this.$refs.postForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.postForm.status = 'published'
            create(this.postForm).then(res => {
              if (res.code == 0) {
                this.$notify({
                  title: '成功',
                  message: '发布成功',
                  type: 'success',
                  duration: 2000
                })
              } else {
                this.$notify({
                  title: '失败',
                  message: '发布失败',
                  type: 'error',
                  duration: 2000
                })
              }
              this.loading = false
              // TODO 跳转到列表页面
              this.$router.push('/article/list')
            }).catch(function (err) {
              console.error(err)
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      draftForm() {
        this.postForm.status = 'draft'
        if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
          this.$message({
            message: '请填写必要的标题和内容',
            type: 'warning'
          })
          return
        }
        create(this.postForm).then(res => {
          if (res.code == 0) {
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 1000
            })
          } else {
            this.$notify({
              title: '失败',
              message: '保存失败',
              type: 'error',
              duration: 1000
            })
          }
          this.loading = false
          // TODO 跳转到列表页面
          this.$router.push('/article/list')
        }).catch(function (err) {
          console.error(err)
        })
        this.postForm.status = 'draft'
      },
      getRemoteUserList(query) {
        userByName(query).then(res => {
          if (!res.data) return
          this.userListOptions = res.data
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        .postInfo-container-item {
          float: left;
        }
        .el-form-item {
          margin-bottom: 10px;
        }
      }
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
          text-align: right;
          margin-right: 10px;
          .editor-upload-btn {
            display: inline-block;
          }
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }
</style>
