//只要是未登录状态，想要跳转到名单内的路径时，直接跳到登录页。
// 页面白名单，不受拦截
const whiteList = [
	'/pages/login/index',
	'/dev/admin/comm/captcha',
	'/dev/admin/comm/login',
]
 
function hasPermission (url) {
	let token = uni.getStorageSync("token");
	// console.log('token',token)
	let islogin = token === '' ? false : true;//返回布尔值
	// console.log('islogin',islogin)
    // 在白名单中或有登录判断条件可以直接跳转
    if(whiteList.indexOf(url) !== -1 || islogin) {
        return true
    }
    return false
}
 
uni.addInterceptor('navigateTo', {
    // 页面跳转前进行拦截, invoke根据返回值进行判断是否继续执行跳转
    invoke (e) {
        if(!hasPermission(e.url)){
            uni.reLaunch({
                url: '/pages/login/index'
            })
            return false
        }
        return true
    },
    success (e) {
    }
})
 
uni.addInterceptor('switchTab', {
    // tabbar页面跳转前进行拦截
    invoke (e) {
        if(!hasPermission(e.url)){
            uni.reLaunch({
                url: '/pages/login/index'
            })
            return false
        }
        return true
    },
    success (e) {
    }
})

uni.addInterceptor('request', {
  invoke(e) {
	if(!hasPermission(e.url)){
	    uni.reLaunch({
	        url: '/pages/login/index'
	    })
	    return false
	}
	return true
  },
  success(e) {
    // 请求成功后，修改code值为1
	if (e.statusCode == 401){
		uni.reLaunch({
		    url: '/pages/login/index'
		})
	}
  }, 
  // fail(err) {
  //   console.log('interceptor-fail',err)
  // }, 
  // complete(res) {
  //   console.log('interceptor-complete',res)
  // }
})