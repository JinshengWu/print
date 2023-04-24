<template>
  <view>
    <page-nav :iconSrc="iconSrc" :desc="desc" :title="title"> </page-nav>
	
    <view class="u-demo-block__content father">
		<u-picker
		  v-if="!this.is_leader"
		  ref="uPicker"
		  :show="batch_show"
		  :columns="batch_columns"
		  @confirm="batch_confirm"
		  @cancel="cancel"
		  keyName="batch_lable"
		  itemHeight="80"
		></u-picker>
		<u-button @click="isBatch_show()" type="primary" v-if="!this.is_leader">{{
		  this.show_lable_yuan+this.batch+this.show_lable_yuan2
		}}</u-button>
							
      <u-subsection
        v-if="!this.is_leader"
        style="height: 80rpx"
        :list="list"
        mode="button"
        :current="current4"
        activeColor="#f9ae3d"
        fontSize="30"
        @change="change4"
      ></u-subsection>
	  <u-badge v-if="!this.is_leader" class="children" type="success" max="9999" :value="yicount" shape="circle" :offset="[80,530]" :absolute="true"></u-badge>
	  	  <u-badge v-if="!this.is_leader" class="children" type="error" max="9999" :value="weicount" shape="circle" :offset="[80,280]" :absolute="true"></u-badge>
		  	  <u-badge v-if="!this.is_leader" class="children" type="primary" max="9999" :value="qingcount" shape="circle" :offset="[80,40]" :absolute="true"></u-badge>
	  
      <!-- <u-subsection v-if="this.is_leader"
						style = "height: 80rpx; width: 50%;"
							:list="leader_list"
							mode="button"
							:current="leader_current"
							activeColor="#f9ae3d"
							fontSize = '30'
							@change="leader_change"
						></u-subsection> -->
	<!-- 查询批次 -->
	
	<!-- 学校用户用于选择学院的picker -->
      <u-picker
        v-if="this.is_leader"
        ref="uPicker"
        :show="show"
        :columns="columns"
        @confirm="confirm"
        @cancel="cancel"
        keyName="department_lable"
        itemHeight="80"
      ></u-picker>
      <u-button @click="is_show()" type="primary" v-if="this.is_leader">{{
        this.show_lable + "  点我查询各学院数据"
      }}</u-button>
	  <!-- 学院用户用于更改人员状态的picker -->
	  <u-picker
	    v-if="!this.is_leader"
	    :show="xy_show"
	    :columns="xy_columns"
	    @confirm="confirm"
	    @cancel="cancel"
	    keyName="label"
	    itemHeight="80"
	  ></u-picker>
	
    </view>
	
 <view>
    <u-list v-if="!this.is_leader" height="100%" >
      <u-list-item v-for="(item, index) in indexList" :key="index">
        <u-row style="height: 80rpx">
          <u-col span="3" align="center">{{ item.stuid }}</u-col>
          <u-line dashed direction="col"></u-line>
          <u-col span="2" align="center">{{ item.stu_name }}</u-col>
          <u-line dashed direction="col"></u-line>
          <u-col span="4" align="center">{{ item.stu_class }}</u-col>
          <u-line dashed direction="col"></u-line>
          <u-button v-if="current4 ==0" type="success" span="2" align="center" style="height: 60rpx;" @click="is_show(item.stuid)">{{
            item.status ? item.status : "未签到"
          }}</u-button>
		  <u-button v-if="current4 ==1" type="error" span="2" align="center" style="height: 60rpx;" @click="is_show(item.stuid)">{{
		    item.status ? item.status : "未签到"
		  }}</u-button>
		  <u-button v-if="current4 ==2" type="primary" span="2" align="center" style="height: 60rpx;" @click="is_show(item.stuid)">{{
		    item.status ? item.status : "未签到"
		  }}</u-button>
        </u-row>
      </u-list-item>
	  <u-loadmore
	    fontSize="40"
	    :line="true"
	    :status="loadmore_status"
	    @loadmore="loadmore"
	    :loading-text="loadingText"
	    :loadmore-text="loadmoreText"
	    :nomore-text="nomoreText"
	  />
    </u-list>
</view>



<view>
    <u-row style="padding-top: 10px" v-if="this.is_leader">
      <u-col span="3" align="center">
        <text>学院</text>
      </u-col>
      <u-col span="3" align="center">
        <text>学号</text>
      </u-col>
      <u-col span="2" align="center">
        <text>姓名</text>
      </u-col>
      <u-col span="4" align="center">
        <text>专业班级</text>
      </u-col>
    </u-row>
    <u-list v-if="this.is_leader" height="100%">
      <u-list-item v-for="(item, index) in indexList" :key="index">
        <u-row style="height: 80rpx">
          <u-col span="3" align="center">{{ item.department }}</u-col>
          <u-line dashed direction="col"></u-line>
          <u-col span="3" align="center">{{ item.stuid }}</u-col>
          <u-line dashed direction="col"></u-line>
          <u-col span="2" align="center">{{ item.stu_name }}</u-col>
          <u-line dashed direction="col"></u-line>
          <u-col span="4" align="center">{{ item.stu_class }}</u-col>
        </u-row>
      </u-list-item>
      <u-loadmore
        fontSize="40"
        :line="true"
        :status="loadmore_status"
        @loadmore="loadmore"
        :loading-text="loadingText"
        :loadmore-text="loadmoreText"
        :nomore-text="nomoreText"
      />
    </u-list>
	</view>
  </view>
</template>

<script>
import $ from "../../jquery-3.5.1.min.js"
import { mapGetters } from "vuex";
export default {
  data() {
    return {
	  batch_show:false,
	  error:"error",
      loadmore_status: "loadmore",
      loadingText: "努力加载中",
      loadmoreText: "点击加载",
      nomoreText: "实在没有了",
      count: 0,
	  columns: [[]],
	  batch_columns:[[]],
      show: false,
	  xy_show: false,
      xy_columns: [  
		  [
			{
                 label: '已签到',
				 value: '无卡已签到'
                }, 
				{
                    label: '未签到',
					value: ''
                    },
					{
					    label: '已请假',
						value: '已请假'
					    }
					]],
      show_lable: "现为全校未检测人员",
	  show_lable_yuan: "现为",
	  show_lable_yuan2: "返校人员,点我更换批次",
	  batch:"全院",
      is_leader: false,
      status: "未签到",
      department: "",
      page: 1,
      c_all: 0,
      title: "人员列表查询",
      desc: "",
      selectedDate: null,
      iconSrc: "../../static/images/abcd.png",
      indexList: [],
      a: [],
      current4: 1,
      leader_current: 0,
      list: ["已签到", "未签到", "已请假"],
      leader_list: ["未签到"],
	  yicount:0,
	  weicount:0,
	  qingcount:0,
	  stu_id:"",
	  xy_status:"",
	  batchList:[],
	  batch_name:"",
    };
  },

  computed: {
    ...mapGetters(["userInfo"]),
  },

  onShow() {
	this.batch = "全院";
    this.page = 1;
    this.loadmore_status = "loadmore";
    this.columns = [[]];
	this.batch_columns = [[]];
    this.show_lable = "现为全校未检测人员";
    this.indexList = [];
    this.department = this.userInfo.departmentName;
    if (this.department == "河北工程大学") {
      this.is_leader = true;
    } else {
      this.is_leader = false;
    }
    this.department = this.userInfo.departmentName;
    this.getData();
	if(this.batch == "全院"){
		this.getDepartmentData();
	}else{
		this.getBatchData()
	};

	this.changeLoad();
	this.getBatch();
  },

  onUnload() {
    (this.max = 0), (this.data = []), (this.loadMoreText = "");
  },
  methods: {
	  //获取批次列表
	getBatch: function () {
		let batch_all = 0;
		batch_all = this.yicount+this.weicount+this.qingcount
		let yi_count = 0;
		let wei_count = 0;
		let qing_count = 0;
	 let query = `
	   		query MyQuery {
	   			stu_statis_batch(order_by: {batch: asc},
				where: {${
				  this.department == "河北工程大学"
				    ? ""
				    : 'department: {_eq: "' + this.department + '"}, '
				}}) {
	   			   batch
	   			   c_not
	   			   c_none
	   			   c_left
	   			   c_attend
	   			   c_all
	   			  }
	   					}`;
	this.postGraphql(query).then((rest) => {
		this.batch_columns[0].push({
		  batch_name:"全院",
		  batch_lable:
		   "全院"
		});
		
	  // console.log(rest.data.stu_info);
	  for (var i = 0; i < rest.data.stu_statis_batch.length; i++) {
		yi_count =  rest.data.stu_statis_batch[i].c_attend + rest.data.stu_statis_batch[i].c_none;
		wei_count = rest.data.stu_statis_batch[i].c_not;
		qing_count =rest.data.stu_statis_batch[i].c_left;
		  this.batch_columns[0].push({
		    batch_name: rest.data.stu_statis_batch[i].batch,
		    batch_lable:
		      rest.data.stu_statis_batch[i].batch + "(已做"+yi_count+"人,未做"+wei_count+"人,请假"+qing_count+"人)"
		  });
	  }
	   });
	  },
	  //获取批次中学生的数量
	 getBatchData: function () {
		
	   let query = `
	    		query MyQuery {
	    			stu_statis_batch(order_by: {c_not: desc},
	 			where: {${
	 			  this.department == "河北工程大学"
	 			    ? ""
	 			    : 'department: {_eq: "' + this.department + '"}, '
	 			},
				${
				  this.batch == "全院"? 
				  "": 'batch: {_eq: "' + this.batch + '"}, '
				  
				}}
	 			){
	    			   batch
	    			   c_not
	    			   c_none
	    			   c_left
	    			   c_attend
	    			   c_all
	 			   
	    						}
	    					}`;
	   this.postGraphql(query).then((rest) => {
	     for (var i = 0; i < rest.data.stu_statis_batch.length; i++) {
	         //已检测人数
	         this.yicount =
	           rest.data.stu_statis_batch[i].c_attend + rest.data.stu_statis_batch[i].c_none;
	      //未检测人数
	         this.weicount = this.is_leader
	           ? rest.data.stu_statis_batch[0].c_not
	           : rest.data.stu_statis_batch[i].c_not;
	         //已请假人数
	         this.qingcount = rest.data.stu_statis_batch[i].c_left;
	     }
	   });
	 },
	 
	  
    confirm(e) {
		if(this.is_leader){
			this.loadmore_status = "loadmore";
			this.page = 1;
			this.indexList = [];
			setTimeout(() => {
			  this.show_lable = e.value[0].department_lable;
			  this.department =
			    e.value[0].department == "全校合计"
			      ? "河北工程大学"
			      : e.value[0].department;
			  this.columns = [[]];
			  this.getData();
			}, 100);
			
			this.show = false;
		}else{
			
			this.xy_status = e.value[0].value
			this.updataData();
			this.xy_show = false;
			this.stu_id = 0
		}
     
    },
	
    is_show(stuid) {
		if(this.is_leader){
			this.department = "河北工程大学";
			this.show = true;
			this.columns = [[]];
			this.getDepartmentData();
			
		}else{
			this.xy_show = true
			this.stu_id = stuid;
		}
		

      // console.log(this.department);
    },
	isBatch_show() {
		this.batch_show = true
		},
    cancel() {
      // console.log('cancel');
	  if(this.is_leader){
		   this.show = false;
	  }else{
		  this.xy_show = false;
		  this.batch_show = false;
	  }
    },
	batch_confirm(e){
		this.batch_show = false;	
		this.batch = e.value[0].batch_name
		this.batch_columns = [[]];
		if(this.batch == "全院"){
			this.getDepartmentData();
		}else{
			this.getBatchData()
		}
		if (this.current4 == 0) {
		  this.refreshData("已签到");
		} else if (this.current4 == 1) {
		  this.refreshData("未签到");
		} else {
		  this.refreshData("已请假");
		}
		 this.getBatch();
		
	},
    loadmore() {
      uni.$u.toast("加载中");
    this.loadmore_status = "loading";
        this.changeLoad();

      setTimeout(() => {
        this.page++;
        this.getData();
        // this.loadmore_status = 'loading'
      }, 100);

      // this.status = status
    },
    changeLoad() {
		
		setTimeout(() => {
			if(this.current4 == 0){
				this.loadmore_status =this.indexList.length < this.yicount?"loadmore":"nomore"
			}else if(this.current4 == 1){
				this.loadmore_status =this.indexList.length < this.weicount?"loadmore":"nomore"
			}else{
				// console.log(this.indexList.length)
				// console.log(this.qingcount)
				this.loadmore_status =this.indexList.length < this.qingcount?"loadmore":"nomore"
			}
		}, 300);
     
    },
    async change4(index) {
      this.current4 = index;
	   if (index == 0) {
	     this.refreshData("已签到");
	   } else if (index == 1) {
	     this.refreshData("未签到");
	   } else {
	     this.refreshData("已请假");
	   }
	   this.changeLoad();
    },
    // leader_change(index) {
    // this.leader_current = index;
    // if(this.leader_current == 0){
    // 	this.refreshData('已签到')
    // }
    // },
	updataData: function () {
			  let present_time = ""
	    if (this.stu_id == "") {
	      uni.showToast({
	        type: "error",
	        title: `请重新点击按钮进行操作`,
	        icon: "none",
	      });
	      return;
	    }
		  if (this.xy_status == "已请假") {
		  		present_time = `present_time:null`
		  } else if (this.xy_status == "无卡已签到") {
		  		present_time = `present_time:"now()"`
		  } else {
		  		present_time = `present_time:null`
		  }
	    let query = `
							mutation MyMutation {
							  update_stu_info(where: {stuid:{_eq:"${this.stu_id}"}},_set: {status: "${this.xy_status}", updated_at: "now()",${present_time}}) {
								affected_rows
							  }
							}`;
	    this.postGraphql(query).then((rest) => {
	      if (rest.data.update_stu_info.affected_rows > 0) {
	        uni.showToast({
	          type: "error",
	          title: `修改成功`,
	          icon: "none",
	        });
			 this.indexList = [];
			 if(this.batch =="全院"){
				 this.getDepartmentData();
			 }else{
				 this.getBatchData()
			 }
			
			this.getData();
	      }
	    });
	  },
    refreshData(status) {
      this.page = 1;
      this.status = status;
      this.indexList = [];
      this.getData();
      // if(this.status == "未签到"){
      //  this.getNotData();
      // }else if(this.status == "已签到"){
      //  this.getDoneData();
      // }else{
      //  this.getLeaveData();
      // }
    },
	
	//获取数据数量
    getDepartmentData: function () {
      let query = `
	   		query MyQuery {
	   			stu_statis(order_by: {c_not: desc},
				 where: {${
           this.department == "河北工程大学"
             ? ""
             : 'department: {_eq: "' + this.department + '"}, '
         }}
				){
	   			   department
	   			   c_not
	   			   c_none
	   			   c_left
	   			   c_attend
	   			   c_all
				   
	   						}
	   					}`;
      this.postGraphql(query).then((rest) => {
        // console.log(this.page)
        // console.log(rest)
        for (var i = 0; i < rest.data.stu_statis.length; i++) {
          this.columns[0].push({
            department: rest.data.stu_statis[i].department,
            department_lable:
              rest.data.stu_statis[i].department +
              "  未检测(" +
              rest.data.stu_statis[i].c_not +
              "人)",
          });
		
            //已检测人数
            this.yicount =
              rest.data.stu_statis[i].c_attend + rest.data.stu_statis[i].c_none;
         //未检测人数
            this.weicount = this.is_leader
              ? rest.data.stu_statis[0].c_not
              : rest.data.stu_statis[i].c_not;
            //已请假人数
            this.qingcount = rest.data.stu_statis[i].c_left;
        }
		
      });
	 
    },

    //请假数据
    getData: function () {
		
      // let new_status = status?status:"已签到";
      // console.log((this.page - 1) * 10)
      // this.status = this.status == "未签到"?" ":this.status;
      let status = "";
      if (this.is_leader) {
        this.status == "未签到";
      }
      if (this.status == "已签到") {
        status = `status:{_in:["已签到","无卡已签到"]}`;
      } else if (this.status == "未签到") {
        status = `status:{_eq:""}`;
      } else {
        status = `status:{_eq:"${this.status}"}`;
      }
      // let status = this.status == "未签到"?"":this.status;
      let query = `
		query MyQuery {
			stu_info(limit: 30,
              offset:  ${(this.page - 1) * 10},
			  order_by: {department:asc,stu_class:desc,stuid:asc},
			  where: {${
          this.department == "河北工程大学"? 
		  "": 'department: {_eq: "' + this.department + '"}, '},
		  ${status},
		  ${
		    this.batch == "全院"? 
		    "": 'batch: {_eq: "' + this.batch + '"}, '
		    
		  }}
			  ){
			    id
               stuid
               stu_name
               stu_class
               status
               rfid
               department
               present_time
						}
					}`;
      this.postGraphql(query).then((rest) => {
        for (var i = 0; i < rest.data.stu_info.length; i++) {
			if(rest.data.stu_info[i].status == "无卡已签到"){
				rest.data.stu_info[i].status = "已签到"
			}
          this.indexList.push({
            stu_name: rest.data.stu_info[i].stu_name,
            stuid: rest.data.stu_info[i].stuid,
            stu_class: rest.data.stu_info[i].stu_class,
            status: rest.data.stu_info[i].status
              ? rest.data.stu_info[i].status
              : "",
            department: rest.data.stu_info[i].department,
          });

        }
		
      });
      //this.loadmore()
    },
    //this.loadmore()
  },
  
  change1(index) {
    this.selectedIndex = index;
  },
 
};
</script>
<style>
.father {
 position: relative;
}
.children {
	position:absolute
}
.charts-box {
  width: 100%;
  height: 300px;
}
.u-demo-block {
  margin-left: 10px;
  margin-right: 10px;
}

.uni-table .uni-table-th .uni-table-th-content {
  width: 20%;
}

.uni-form-item {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-top: 30px;
  margin-bottom: 10px;
}

.table {
  margin-left: 10px;
  margin-right: 5px;
}

.u-demo-block__content {
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}

.title {
  font-size: 25px;
  font-weight: bold;
  text-align: left;
}

.time-picker {
  margin-bottom: 15px;
}

.subsection {
  font-size: 20px;
}
.box {
		justify-content: space-between;
	}

	.u-page__tag-item {
		margin-left: 40px;
		margin-top: -10px;
	}

	.badge-box {
		width: 45px;
		height: 45px;
		border-top-left-radius: 3px;
		border-top-right-radius: 3px;
		border-bottom-left-radius: 3px;
		border-bottom-right-radius: 3px;
		background-color: #E6E6E6;
	}


/* .album {
  @include flex;
  align-items: flex-start;

  &__avatar {
    background-color: $u-bg-color;
    padding: 5px;
    border-radius: 3px;
  }

  &__content {
    margin-left: 10px;
    flex: 1;
  }
} */
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
