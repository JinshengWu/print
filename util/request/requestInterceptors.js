/**
 * 请求拦截
 * @param {Object} http
 */
// import store from "@/util/store";
module.exports = (vm) => {
    uni.$u.http.interceptors.request.use((config) => { // 可使用async await 做异步操作

        // 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
        // console.log(vm.$store.state);
        // return config
		// 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
		config.data = config.data || {}
		let token = uni.getStorageSync("token")
		// 根据custom参数中配置的是否需要token，添加对应的请求头
		if(config?.custom?.auth) {
			// 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
			// config.header.token = vm.$store.state.userInfo.token
			// config.header.token = uni.getStorageSync("token")
			config.header.Authorization =  token
		}
		// 演示
		if (!token) { // 如果token不存在，return Promise.reject(config) 会取消本次请求
			return Promise.reject(config)
		}
		return config
    }, (config) => // 可使用async await 做异步操作
        Promise.reject(config))
}

