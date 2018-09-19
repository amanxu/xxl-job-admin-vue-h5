<template>
  <div class='tinymce-container editor-container' :class="{fullscreen:fullscreen}">
    <textarea class='tinymce-textarea' language="zh-CN" :id="tinymceId" ></textarea>
    <!-- <div class="editor-custom-btn-container">
     <editorImage  color="#20a0ff" class="editor-upload-btn" @successCBK="imageSuccessCBK"></editorImage>
      </div> -->
  </div>
</template>

<script>
import editorImage from './components/editorImage'

export default {
  name: 'tinymce',
  components: { editorImage },
  props: {
    id: {
      type: String
    },
    value: {
      type: String,
      required: false,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return ['removeformat undo redo |  bold italic blockquote | alignleft aligncenter alignright | outdent indent | fontsizeselect forecolor | fullscreen code']
      }
    },
    menubar: {
      default: ''
    },
    height: {
      type: Number,
      required: false,
      default: 360
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id || 'vue-tinymce-' + +new Date(),
      fullscreen:false,
    }
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(val))
      }
    }
  },
  mounted() {
    const _this = this
    window.tinymce.init({
      fontsize_formats: '10px 12px 14px 16px 18px 20px 22px 24px 26px 28px 30px 32px',
      selector: `#${this.tinymceId}`,
      height: this.height,
      body_class: 'panel-body ',
      object_resizing: false,
      toolbar: this.toolbar,
      menubar: this.menubar,
      plugins: 'advlist,autolink,code,paste,textcolor, colorpicker,fullscreen,link,lists,media,wordcount, imagetools',
      end_container_on_empty_block: true,
      powerpaste_word_import: 'clean',
      code_dialog_height: 450,
      code_dialog_width: 1000,
      advlist_bullet_styles: 'square',
      advlist_number_styles: 'default',
      block_formats: '普通标签=p;小标题=h2;',
      imagetools_cors_hosts: ['wpimg.wallstcn.com', 'wallstreetcn.com'],
      imagetools_toolbar: 'watermark',
      default_link_target: '_blank',
      link_title: false,
      init_instance_callback: editor => {
        if (_this.value) {
          editor.setContent(_this.value)
        }
        _this.hasInit = true
        editor.on('NodeChange Change KeyUp', () => {
          this.hasChange = true
          this.$emit('input', editor.getContent({ format: 'raw' }))
        })
        editor.on('blur', () => {
          this.hasChange = false
        })
      },
      setup(editor) {
        editor.on('FullscreenStateChanged', (e) => {
          _this.fullscreen = e.state
        })
      }
          // 整合七牛上传
          // images_dataimg_filter(img) {
          //   setTimeout(() => {
          //     const $image = $(img);
          //     $image.removeAttr('width');
          //     $image.removeAttr('height');
          //     if ($image[0].height && $image[0].width) {
          //       $image.attr('data-wscntype', 'image');
          //       $image.attr('data-wscnh', $image[0].height);
          //       $image.attr('data-wscnw', $image[0].width);
          //       $image.addClass('wscnph');
          //     }
          //   }, 0);
          //   return img
          // },
          // images_upload_handler(blobInfo, success, failure, progress) {
          //   progress(0);
          //   const token = _this.$store.getters.token;
          //   getToken(token).then(response => {
          //     const url = response.data.qiniu_url;
          //     const formData = new FormData();
          //     formData.append('token', response.data.qiniu_token);
          //     formData.append('key', response.data.qiniu_key);
          //     formData.append('file', blobInfo.blob(), url);
          //     upload(formData).then(() => {
          //       success(url);
          //       progress(100);
          //     })
          //   }).catch(err => {
          //     failure('出现未知问题，刷新页面，或者联系程序员')
          //     console.log(err);
          //   });
          // },
    })
  },
  methods: {
    imageSuccessCBK(arr) {
      const _this = this
      arr.forEach(v => {
        window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`)
      })
    }
  },
  destroyed() {
    window.tinymce.get(this.tinymceId).destroy()
  }
}
</script>

<style scoped>
.tinymce-container {
  position: relative;
}
.tinymce-container>>>.mce-fullscreen {
  z-index: 10000;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}
.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}
.editor-upload-btn {
  display: inline-block;
}
</style>
