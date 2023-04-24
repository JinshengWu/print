import Captcha from "@/components/captcha/captcha";

export default {
	components: {
		Captcha
	},

	data() {
		return {
			rememberPsw: true,
			form: {
				username: "",
				password: "",
				captchaId: "",
				verifyCode: ""
			},
			saving: false
		};
	},
	mounted() {
		//缓存的账号
		const HCusername = uni.getStorageSync('HCusername');
		//缓存的密码
		const HCpassword = uni.getStorageSync('HCpassword');
		//       console.log(HCpassword+"缓存的密码")
		//         console.log(HCuname)
		//有缓存就赋值给文本没有就清空
		if (HCusername && HCpassword) {
			this.form.username = HCusername;
			this.form.password = HCpassword;
		} else {
			this.form.username = "";
			this.form.password = "";
		}
	},
	methods: {
		captchaChange() {
			this.form.verifyCode = "";
		},
		checkboxChange: function(e) {
			if (e.detail.value.length == 1) {
				//获取缓存的账号
				uni.getStorageSync('HCusername', this.form.username);
				uni.getStorageSync('HCpassword', this.form.password);
			} else {
				uni.removeStorageSync('HCusername');
				uni.removeStorageSync('HCpassword');
			}
		},

		async next() {
			const {
				username,
				password,
				verifyCode
			} = this.form;

			if (!username) {
				return console.log("用户名不能为空");
			}

			if (!password) {
				return console.log("密码不能为空");
			}

			if (!verifyCode) {
				return console.log("图片验证码不能为空");
			}

			this.saving = true;

			try {
				// 登录
				await this.$store.dispatch("userLogin", this.form);

				// 用户信息
				await this.$store.dispatch("userInfo");

				// uni.navigateTo({
				// 	url: '/cameraImage/cameraImage',
				// });
				if (this.rememberPsw) {
					uni.setStorageSync('HCusername', this.form.username);
					uni.setStorageSync('HCpassword', this.form.password);
				} else {
					uni.removeStorageSync('HCusername');
					uni.removeStorageSync('HCpassword');
				}
				uni.switchTab({
					url: '/pages/nfcreader/nfcreader'
				});
				// 权限菜单
				// const [first] = await this.$store.dispatch("permMenu");

				// if (!first) {
				// this.$message.error("该账号没有权限");
				// console.log("该账号没有权限")
				// } else {
				// this.$router.push("/");
				// }
				// this.$router.push("/");
				this.saving = false;
			} catch (err) {
				this.$refs.captcha.refresh();
				this.saving = false;
				console.log("密码有误");
				uni.showModal({
					title: '密码或验证码有误,请重新输入',
					duration: 2000
				});
				console.log(err)
			}
		}
	}
};
