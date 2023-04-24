<template>
  <view class="u-page">
    <page-nav :iconSrc="iconSrc" :desc="desc" :title="title"> </page-nav>
    <view class="u-demo-block">
      <u-row>
        <u-col span="12" align="center"
          ><text class="subsection"
            >{{ department }}: 学生合计{{ c_all }}人</text
          >

          <u-line></u-line>
        </u-col>
      </u-row>
      <u-row style="padding-top: 10px">
        <u-col span="4" align="center">
          <text>已请假</text>
        </u-col>
        <u-col span="4" align="center">
          <text>已签到</text>
        </u-col>
        <u-col span="4" align="center">
          <text>未签到</text>
        </u-col>
      </u-row>
      <u-row>
        <u-col span="4" align="center">
          <text class="subsection">{{ this.c_left }}</text>
        </u-col>
        <u-col span="4" align="center">
          <text class="subsection">{{ this.c_done }}</text>
        </u-col>
        <u-col span="4" align="center">
          <text class="subsection">{{ this.c_not }}</text>
        </u-col>
      </u-row>
      <u-line></u-line>
      <u-row style="padding-top: 10px" v-if="!this.is_leader">
        <u-col span="12" align="center"
          ><text class="subsection">签到消息列表</text>
          <u-line></u-line>
        </u-col>
      </u-row>
      <u-row style="padding-top: 10px" v-if="this.is_leader">
        <u-col span="12" align="center"
          ><text class="subsection">各学院核酸检测情况列表</text>
          <u-line></u-line>
        </u-col>
      </u-row>
      <u-row style="height: 50%" v-if="!this.is_leader">
        <u-list>
          <u-list-item v-for="(item, index) in students" :key="index">
            <u-row style="height: 60rpx">
              <u-col span="3" align="center">{{ item.stuid }}</u-col>
              <u-line dashed direction="col"></u-line>
              <u-col span="3" align="center">{{ item.stu_name }}</u-col>
              <u-line dashed direction="col"></u-line>
              <u-col span="3" align="center">{{
                item.status ? item.status : "未签到"
              }}</u-col>
              <u-line dashed direction="col"></u-line>
              <u-col span="3" align="center">
                {{
                  item.present_time
                    ? new Date(item.present_time).format("hh:mm:ss")
                    : ""
                }}
              </u-col>
              <!-- <u-line dashed direction="col"></u-line>
							<u-col span="3" align="left" style="padding-left:10px;">{{item.stu_class}}</u-col> -->
            </u-row>
            <u-line></u-line>
          </u-list-item>
        </u-list>
      </u-row>
      <u-row style="padding-top: 10px" v-if="this.is_leader">
        <u-col span="3" align="center">
          <text>学院</text>
        </u-col>
        <u-col span="3" align="center">
          <text>需检测</text>
        </u-col>
        <u-col span="3" align="center">
          <text>已检测</text>
        </u-col>
        <u-col span="3" align="center">
          <text>未检测</text>
        </u-col>
        <!-- <u-col span="2" align="center">
	      <text>完成率</text>
	    </u-col> -->
      </u-row>
      <u-row style="height: 10%" v-if="this.is_leader">
        <u-list height="100%" :scrollable="false">
          <u-list-item v-for="(item, index) in deptInfo" :key="index">
            <u-row style="height: 60rpx">
              <u-col span="3" align="center">{{ item.department }}</u-col>
              <u-line dashed direction="col"></u-line>
              <u-col span="3" align="center">{{ item.c_need }}人</u-col>
              <u-line dashed direction="col"></u-line>
              <u-col span="3" align="center">{{ item.c_done }}人</u-col>
              <u-line dashed direction="col"></u-line>
              <u-col span="3" align="center">{{ item.c_not }}人</u-col>
              <u-line dashed direction="col"></u-line>
              <!--       <u-col span="2" align="center">{{ item.p_done }}</u-col>
	         <u-line dashed direction="col"></u-line> -->
              <!-- <u-line dashed direction="col"></u-line>
	  							<u-col span="3" align="left" style="padding-left:10px;">{{item.stu_class}}</u-col> -->
            </u-row>
            <u-line-progress
              :percentage="deptInfo[index].p_done_line"
              activeColor="#FF0000"
              height="20"
              v-if="
                deptInfo[index].p_done_line > 0 &&
                deptInfo[index].p_done_line < 30
              "
            ></u-line-progress>
            <u-line-progress
              :percentage="deptInfo[index].p_done_line"
              activeColor="#FF7D00"
              height="20"
              v-else-if="
                deptInfo[index].p_done_line >= 30 &&
                deptInfo[index].p_done_line < 60
              "
            ></u-line-progress>
            <u-line-progress
              :percentage="deptInfo[index].p_done_line"
              activeColor="#FFD700"
              height="20"
              v-else-if="
                deptInfo[index].p_done_line >= 60 &&
                deptInfo[index].p_done_line < 100
              "
            ></u-line-progress>
            <u-line-progress
              :percentage="deptInfo[index].p_done_line"
              activeColor="#00FF00"
              height="20"
              v-else
            ></u-line-progress>
            <u-line color="#2979ff" :hairline="false" margin="3rpx"></u-line>
          </u-list-item>
        </u-list>
      </u-row>
    </view>
  </view>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      a: 30,
      is_leader: false,
      title: "实时刷卡数据",
      desc: "",
      iconSrc: "../../static/images/chip-proc.png",
      socketOpen: false,
      socketMsgQueue: [],
      department: "",
      students: [],
      c_all: 0,
      c_done: 0,
      c_not: 0,
      c_left: 0,

      deptInfo: [],
      // socketTask: null,
      // max: 0
    };
  },

  onShow() {
    this.department = this.userInfo.departmentName;
    if (this.department == "河北工程大学") {
      this.is_leader = true;
    } else {
      this.is_leader = false;
    }
    this.initSocket();
  },
  onUnload() {
    let initTerminate = {
      type: "connection_terminate",
    };
    uni.sendSocketMessage({
      data: JSON.stringify(initTerminate),
    });
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    // style="height: 60rpx;background-color: #18BC37;"

    // tableRowStyle({ row, rowIndex }) {
    //       let rowBackground = {};
    //       if ((row.status=='已签到') || (row.status=='无卡已签到') ) {
    //         // 设置条件
    //         rowBackground.background = "#aaff7f";
    //         return rowBackground;
    //       }
    // },

    initSocket: function () {
      let _this = this;
      uni.connectSocket({
        url: "ws://www.powhole.com:1885/v1/graphql",
        header: {
          "content-type": "application/json",
        },
        protocols: ["protocol1"],
        method: "GET",
      });

      uni.onSocketOpen(function (res) {
        this.socketOpen = true;
        // console.log('WebSocket连接成功！');

        let initMsg = {
          type: "connection_init",
          payload: {
            headers: {
              "content-type": "application/json",
              "x-hasura-admin-secret": "hebeucdio.413",
            },
            lazy: false,
          },
        };
        uni.sendSocketMessage({
          data: JSON.stringify(initMsg),
        });
        // console.log(JSON.stringify(initMsg));
        let startMsg = {
          id: "1",
          type: "start",
          payload: {
            variables: {},
            extensions: {},
            operationName: "MySubscription",
            query: `subscription MySubscription{
						stu_statis${
              _this.is_leader
                ? ""
                : '(where: {department: {_eq: "' + _this.department + '"}})'
            } 
								 {
									department
									c_not
									c_none
									c_left
									c_attend
									c_all
								}
							}`,
          },
        };

        uni.sendSocketMessage({
          data: JSON.stringify(startMsg),
        });

        startMsg = {
          id: "2",
          type: "start",
          payload: {
            variables: {},
            extensions: {},
            operationName: "MySubscription",
            query: `subscription MySubscription {
								stu_info(${
                  _this.is_leader
                    ? ""
                    : 'where: {department: {_eq: "' + _this.department + '"}}, '
                }limit: 1, order_by: {updated_at: desc}) {
									present_time
									status
									stu_class
									stu_name
									stuid
								}
							}`,
          },
        };

        uni.sendSocketMessage({
          data: JSON.stringify(startMsg),
        });
        // console.log(JSON.stringify(startMsg));
      });

      uni.onSocketMessage(function (res) {
        // console.log('收到服务器内容：' + res.data);
        let msg = JSON.parse(res.data);
        let p_done = 0;
        let difference = 0;
        if (msg.type == "data") {
          if (msg.id == "1") {
            _this.c_all = msg.payload.data.stu_statis[0].c_all;
            _this.c_left = msg.payload.data.stu_statis[0].c_left;
            _this.c_done =
              msg.payload.data.stu_statis[0].c_attend +
              msg.payload.data.stu_statis[0].c_none;
            _this.c_not = msg.payload.data.stu_statis[0].c_not;
            if (_this.is_leader) {
              _this.deptInfo = [];
              msg.payload.data.stu_statis.forEach((e) => {
                p_done = (
                  (Number(e.c_attend + e.c_none) * 100) /
                  (e.c_all - e.c_left)
                ).toFixed(1);
                difference =
                  Number(e.c_attend + e.c_none) - (e.c_all - e.c_left);
                if (p_done == 100 && difference != 0) {
                  p_done = 99.99;
                }
                _this.deptInfo.push({
                  department: e.department,
                  c_need: e.c_all - e.c_left,
                  c_done: e.c_attend + e.c_none,
                  c_not: e.c_not,
                  p_done:
                    (
                      (Number(e.c_attend + e.c_none) * 100) /
                      (e.c_all - e.c_left)
                    ).toFixed(1) + "%",
                  p_done_line: p_done,
                });
              });
            }
          } else if (msg.id == "2") {
            _this.students.unshift(msg.payload.data.stu_info[0]);
          }
          // console.log('收到服务器内容：' + res.data);
        }
      });

      uni.onSocketError(function (res) {
        uni.showToast({
          type: "error",
          title: "WebSocket连接异常，请检查！",
          icon: "none",
        });
      });
    },
  },
};
</script>

<style>
.charts-box {
  width: 100%;
  height: 300px;
}

.u-demo-block {
  margin-left: 0px;
  margin-right: 0px;
}

.uni-table .uni-table-th .uni-table-th-content {
  width: 20%;
}

.table {
  margin-left: 10px;
  margin-right: 5px;
}

.u-demo-block {
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}

.title {
  font-size: 25px;
  font-weight: bold;
  text-align: left;
}

.subsection {
  font-size: 20px;
  margin-bottom: 5px;
}

/* 	.u-text {
		margin: 0px !important;
		justify-content: center !important;
		font-size: 20px;
	}

	.u-text .u-text__value {
		font-size: 15px !important;
		color: rgb(102, 102, 102) !important;
	} */
</style>
