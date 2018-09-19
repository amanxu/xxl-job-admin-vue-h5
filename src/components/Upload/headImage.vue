<template>
	<div class="upload-container">
		<div class="image-preview image-app-preview">
			<div class="image-preview-wrapper" v-show="imageUrl.length>1">
				<img :src="imageUrl">
				<div class="image-preview-action">
					<i @click="rmImage" class="el-icon-delete"></i>
				</div>
			</div>
		</div>
		<el-upload class="image-uploader" :data="dataObj" drag :multiple="false" :show-file-list="false" :before-upload="beforeUpload" action="http://upload-z2.qiniu.com"
		  :on-success="handleImageScucess">
			<i class="el-icon-upload"></i>
		</el-upload>
	</div>
</template>

<script>
import axios from 'axios';

export default {
	name: 'headImage',
	props: {
		value: String
	},
	computed: {
		imageUrl() {
			return this.value;
		}
	},
	data() {
		return {
			dataObj: { token: '', key: '' }
		};
	},
	methods: {
		rmImage() {
			this.emitInput('');
		},
		emitInput(val) {
			this.$emit('input', val);
		},
		handleImageScucess(file) {
			let imageUrl = `https://image.xjshen.cn/${file.key}`;
			this.emitInput(imageUrl);
		},
		async beforeUpload() {
			let url = `https://m.xjshen.cn/api/signature`;
			let { data: { success, data: { key, token } } } = await axios.post(url);
			if (success) {
				this.dataObj.token = token;
				this.dataObj.key = key;
			}
		}
	}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.upload-container {
	width: 100%;
	position: relative;
	@include clearfix;
	.image-uploader {
		position: absolute;
		top: 60px;
		left: 200px;
		z-index: 2;
		width: 200px;
		height: 100px;
		line-height: 100px;
		.el-icon-upload {
			margin: 25px 0 16px;
		}
	}
	.image-preview {
		width: 120px;
		height: 160px;
		position: relative;
		border: 1px dashed #d9d9d9;
		.image-preview-wrapper {
			position: relative;
			width: 100%;
			height: 100%;
			img {
				width: 100%;
				height: 100%;
			}
		}
		.image-preview-action {
			position: absolute;
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
			cursor: default;
			text-align: center;
			color: #fff;
			opacity: 0;
			font-size: 20px;
			background-color: rgba(0, 0, 0, 0.5);
			transition: opacity 0.3s;
			cursor: pointer;
			text-align: center;
			line-height: 200px;
			.el-icon-delete {
				font-size: 36px;
			}
		}
		&:hover {
			.image-preview-action {
				opacity: 1;
			}
		}
	}
	.image-app-preview {
		margin-top: 10px;
		height: 160px;
		position: relative;
		border: 1px dashed #d9d9d9;
		.app-fake-conver {
			height: 44px;
			position: absolute;
			width: 100%;
			background: rgba(0, 0, 0, 0.1);
			text-align: center;
			line-height: 64px;
			color: #fff;
		}
	}
}
</style>
