// const http = uni.$u.http

// post请求，获取菜单
export const postMenu = (params, config = {}) => uni.$u.http.post('/ebapi/public_api/index', params, config)

export const login = (params, config = {}) => uni.$u.http.post('/dev/admin/comm/login', params, config)

export const logout = (params, config = {}) => uni.$u.http.post('/dev/admin/comm/logout', params, config)

// get请求，获取菜单，注意：get请求的配置等，都在第二个参数中，详见前面解释
export const getMenu = (data) => uni.$u.http.get('/dev/admin/comm/captcha', data)

export const captcha = (data) => uni.$u.http.get('/dev/admin/comm/captcha', data)

export const person = (data) => uni.$u.http.get('/dev/admin/comm/person', data)
