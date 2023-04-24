<template>
	<view class="nav-wrap">
		<view class="nav-title">
			<u--image :src="iconSrc" width="70px" @click="imgClick()"
				height="70px" />
			<view class="nav-info">
				<view class="nav-info__title" >
					<text class="nav-info__title__text"> {{title}}</text>
				</view>
				<text class="nav-slogan">{{desc}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			iconSrc:String,
			title: String,
			desc: String,
		},
		data() {
			return {
				
			}
		},
		methods: {
			imgClick(){
				this.$emit('imgClick')
			}
		},
	}
</script>

<style lang="scss" scoped>
	.nav-wrap {
		padding: 10px;
		position: relative;
	}

	.lang {
		position: absolute;
		top: 15px;
		right: 15px;
	}

	.nav-title {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}

	.nav-info {
		margin-left: 15px;
		
		&__title {
			/* #ifndef APP-NVUE */
			display: flex;
			/* #endif */
			flex-direction: row;
			align-items: center;
			
			&__text {
				/* #ifndef APP-NVUE */
				display: flex;
				/* #endif */
				color: $u-main-color;
				font-size: 25px;
				font-weight: bold;
				text-align: left;
			}
			
			&__jump {
				font-size: 12px;
				color: $u-primary;
				font-weight: normal;
				margin-left: 20px;
			}
		}
	}

	.logo {
		width: 70px;
		height: 70px;
		/* #ifndef APP-NVUE */
		height: auto;
		/* #endif */
	}

	.nav-slogan {
		color: $u-tips-color;
		font-size: 14px;
	}

	.nav-desc {
		margin-top: 10px;
		font-size: 14px;
		color: $u-content-color;
		line-height: 20px;
	}
</style>
