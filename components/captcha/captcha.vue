<template>
	<!-- <view class="common-captcha" @click="refresh">
		<view class="svg" v-html="svg" v-if="svg"></view>

		<img class="base64" :src="svg" alt="" v-else />
		<br>
		<img class="base64" :src="svg" alt=""  />
	</view> -->
	<div class="common-captcha" @click="refresh">
		<div class="svg" v-html="svg" v-if="svg"></div>

		<img class="base64" :src="base64" alt="" v-else />
	</div>
</template>

<script>
// import LoginMixin from "./index";
import {getMenu} from "@/util/request/api.js";
export default {

	data() {
		return {
			svg: "",
			base64: ""
		};
	},

	mounted() {
		this.refresh();
		// this.text()
	},

	methods: {
		// async text(){
		// 	captcha({params:{height: 36,width: 110} ,custom: { auth: true}}).then(({ captchaId, data }) => {
		// 		if (data.includes(";base64,")) {
		// 			this.base64 = data;
		// 		} else {
		// 			this.svg = data;
		// 		}
		// 		this.$emit("input", captchaId);
		// 		this.$emit("change", {
		// 			base64: this.base64,
		// 			svg: this.svg,
		// 			captchaId
		// 		});
		// 	})
		// },
		async captcha({ height, width }) {
			return this.getRequest('/dev/admin/comm/captcha',{ height, width })
		},
		async refresh() {
			this.captcha({height: 36,width: 110})
				.then(({ captchaId, data }) => {
					if (data.includes(";base64,")) {
						this.base64 = data;
					} else {
						this.svg = data;
					}
					this.$emit("input", captchaId);
					this.$emit("change", {
						base64: this.base64,
						svg: this.svg,
						captchaId
					});
				})
				.catch((err) => {
					console.log(err)
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.common-captcha {
	height: 36px;
	cursor: pointer;
	background-color: lightblue;

	.svg {
		height: 100%;
	}

	.base64 {
		height: 100%;
	}
}
</style>
