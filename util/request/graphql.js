const graphqlUrl = "http://www.powhole.com:1885/v1/graphql";
const sqlUrl = "http://www.powhole.com:1885/v1/query";
const devUrl = "http://www.powhole.com:1886";

export function postGraphql(query, variables) {
  return new Promise((resolve, reject) => {
    let token = uni.getStorageSync("token");
    uni.request({
      url: graphqlUrl,
      method: "POST",
      header: {
        "x-hasura-admin-secret": "hebeucdio.413",
        Authorization: token,
      },
      data: {
        query: query,
        variables: variables,
      },
      success: (res) => {
        resolve(res.data);
      },
    });
  });
}

export function postSql(sqlText, timeout = 10000) {
  let data = {
    type: "bulk",
    args: [
      {
        type: "run_sql",
        args: {
          sql: `SET LOCAL statement_timeout = ${timeout};`,
          cascade: false,
          read_only: false,
        },
      },
      {
        type: "run_sql",
        args: {
          sql: `${sqlText};`,
          cascade: false,
          read_only: false,
        },
      },
    ],
  };
  return new Promise((resolve, reject) => {
    let token = uni.getStorageSync("token");
    uni.request({
      url: sqlUrl,
      method: "POST",
      header: {
        "x-hasura-admin-secret": "hebeucdio.413",
        Authorization: token,
      },
      data: data,
      success: (res) => {
        if (res.data.length > 1 && res.data[1].result_type == "TuplesOk") {
          resolve(res.data[1].result);
        }
        // else {
        // 	resolve [];
        // }
      },
    });
  });
}

export function postRequest(url, params) {
  return new Promise((resolve, reject) => {
    let token = uni.getStorageSync("token");
    if (url.indexOf("/dev") === 0) {
      url = devUrl + url.substr(4);
    }
    uni.request({
      url: `${url}`,
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: token,
      },
      data: params,
      success: (res) => {
        resolve(res.data.data);
      },
    });
  });
}

export function getRequest(url, params) {
  return new Promise((resolve, reject) => {
    let token = uni.getStorageSync("token");
    if (url.indexOf("/dev") === 0) {
      url = devUrl + url.substr(4);
    }
    uni.request({
      url: `${url}`,
      method: "GET",
      data: params,
      header: {
        // token:token,
        Authorization: token,
      },
      success: (res) => {
        resolve(res.data.data);
      },
    });
  });
}
