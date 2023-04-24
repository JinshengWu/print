import {postRequest,getRequest,postGraphql,postSql} from '@/util/request/graphql.js'
// import {login,person,logout} from '@/util/request/api'
export default {
	state: {
		token: uni.getStorageSync("token") || null,
		info: uni.getStorageSync("userInfo") || {},
		update: uni.setStorage("token") || {},
	},
	actions: {

		userLogin({ commit }, form) {
			// return login(form,{ custom: { auth: true }}).then((res) => {
			// 	commit("SET_TOKEN", res.token);
			// 	return res;
			// })
			return postRequest('/dev/admin/comm/login',form).then((res) => {
				commit("SET_TOKEN", res.token);
				return res;
			});
		},

		userLogout({ dispatch }) {
			// return login(form,{ custom: { auth: true }}).then((res) => {
			// 	commit("SET_TOKEN", res.token);
			// 	return res;
			// })
			return new Promise((resolve) => {
				return postRequest('/dev/admin/comm/logout',form).done(() => {
					dispatch("userRemove").then(() => {
						resolve();
					});
				});
			});
		},

		userInfo({ commit }) {
			// return person({params:{} ,custom: { auth: true}}).then((res) => {
			// 	console.log(res)
			// 	commit("SET_USERINFO", res);
			// 	return res;
			// });
			return getRequest('/dev/admin/comm/person').then((res) => {
				// console.log(res)
				commit("SET_USERINFO", res);
				return res;
			});
		},
			/**
			 * 用户信息修改
			 *
			 * @param {*} params
			 * @returns
			 * @memberof CommonService
			 */
			userUpdate({ commit }, form) {
				return postRequest('/dev/admin/comm/person-update',form).then((res) => {
					//console.log(res);
					commit("SET_UPDATE", res);
					return res;
				});
			},

		userRemove({ commit }) {
			commit("CLEAR_USER");
			commit("CLEAR_TOKEN");
			commit("RESET_PROCESS");
			commit("SET_MENU_GROUP", []);
			commit("SET_VIEW_ROUTES", []);
			commit("SET_MENU_LIST", 0);
		}
	},
	mutations: {
		SET_USERINFO(state, val) {
			state.info = val;
			uni.setStorageSync("userInfo", val)
		},

		SET_TOKEN(state,  token ) {
			state.token = token;
			//console.log(token)
			uni.setStorageSync("token", token)
		},

		CLEAR_TOKEN(state) {
			state.token = null;
			uni.clearStorageSync("token");
		},

		CLEAR_USER(state) {
			state.info = {};
			uni.clearStorageSync("userInfo");
		},
		SET_UPDATE: (state, update) => {
		      state.update ="test " +update 
		    }
	}
};
