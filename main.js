import Vue from 'vue'
import App from './App'

// vuex
import store from './store'

// 引入全局uView
import uView from '@/uni_modules/uview-ui'

import mixin from './common/mixin'

Vue.prototype.$store = store

Vue.config.productionTip = false

App.mpType = 'app'
Vue.use(uView)
uni.$u.config.unit = 'rpx'

// #ifdef MP
// 引入uView对小程序分享的mixin封装
const mpShare = require('@/uni_modules/uview-ui/libs/mixin/mpShare.js')
Vue.mixin(mpShare)
// #endif

Vue.mixin(mixin)


//////////////////////////////
import {postRequest,getRequest,postGraphql,postSql} from './util/request/graphql.js'
Vue.prototype.postRequest = postRequest
Vue.prototype.getRequest = getRequest
Vue.prototype.postGraphql = postGraphql
Vue.prototype.postSql = postSql
Number.prototype.Fixed = function (n) {
	let p = Math.pow(10, n);
	return (Math.round(this * p) / p).toFixed(n);
};
Date.prototype.format = function (fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		S: this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(
				RegExp.$1,
				RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
			);
		}
	}
	return fmt;
};

//////////////////////////////

const app = new Vue({
    store,
    ...App
})

// 引入请求封装
require('./util/request/index')(app)
app.$mount()

