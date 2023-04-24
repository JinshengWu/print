<template>
	<view class="login">
		<u-row customStyle="margin: 20px 10px 0px 10px">
			<u-col span="12" align="center">
				<u--image :showLoading="true" src="../../static/images/hebeu.png" width="100px" height="100px">
				</u--image>
			</u-col>
		</u-row>
		<view class="content-wrapper">
			<view class="title">
				<h1>校园核酸检测信息管理系统</h1>
			</view>
			<view class="login-form" ref="form" size="medium" :disabled="saving">
				<view class="login-form-items">
					<view class="login-form-items-title">用户名</view>
					<input type="text" v-model="form.username" class="login-input" placeholder="请输入用户名" />
				</view>

				<view class="login-form-items">
					<view class="login-form-items-title">密码</view>
					<input type="password" v-model="form.password" class="login-input" placeholder="请输入密码" />
				</view>

				<view class="login-form-items">
					<view class="login-form-items-title">验证码</view>

					<input type="text" v-model="form.verifyCode" @change="captchaChange" class="login-input"
						placeholder="请输入验证码" />
					<captcha ref="captcha" class="value" v-model="form.captchaId" @change="captchaChange"></captcha>
				</view>

				<view class="login-form-items">
					<checkbox-group @change="checkboxChange">
						<checkbox id="chkRem" type="checkbox" :checked="rememberPsw" @tap="rememberPsw = !rememberPsw">
							记住密码
						</checkbox>
					</checkbox-group>

					<button type="primary" :plain="true" @click="next" :loading="saving" style="width: 200rpx;">
						登录
					</button>
				</view>
			</view>

			<u-row customStyle="margin: 220px 10px 0px 10px">
				<u-col span="12" align="center" style="font-size: 14px; color: #777777">
					技术支持：信息与电气工程学院
				</u-col>
			</u-row>
			<u-row customStyle="margin: 0px 10px 10px 10px">
				<u-col span="12" align="center" style="font-size: 14px; color: #777777">
					河北省安防信息感知与处理重点实验室
				</u-col>
			</u-row>
			<u-row customStyle="margin: 20px 10px 0px 10px">
				<u-col span="12" align="center">&nbsp; </u-col>
			</u-row>
		</view>
	</view>
</template>

<script>
	import LoginMixin from "./index";

	export default {
		mixins: [LoginMixin],
	};
</script>

<style lang="scss">
	page {
		background: url("../../static/images/hesuan.png") no-repeat center bottom;
	}

	.RememberCheck {
		margin-left: 0%;
		margin-top: 10px;
		color: #adadad;
	}

	.login {
		.content-wrapper {
			width: 100%;
			background: #ffffff;
			opacity: 0.8;

			/**内容居中*/
			.title {
				margin-top: 35rpx;
				width: 100%;
				margin-bottom: 10px;

				h1 {
					border: 0px;
					width: 60%;
					margin: 0 auto;
					text-align: center;
					border-bottom: 1px solid #e3e3e3;
					height: 40px;
					line-height: 40px;
					font-size: 17px;
					overflow: hidden;
					font-weight: 400;
				}
			}

			.login-form {
				margin: 20px 10px 20px 15px;

				.login-form-items {
					align-items: center;
					padding: 10px 40px 10px 40px;
					border-bottom: 1px solid #f3f4f5;
					position: relative;
					display: -webkit-flex;
					display: flex;

					.login-form-items-title {
						width: 25%;
						line-height: 22px;
						height: 22px;
						flex-shrink: 0;
					}

					.login-input {
						width: 100%;
					}

					img {
						width: auto;
						height: auto;
						max-width: 100%;
						max-height: 100%;
					}
				}
			}
		}

		.submit {
			padding: 10px 150px 10px 150px;
		}
	}
</style>
