<template>
  <view class="u-page">
    <page-nav :iconSrc="iconSrc" :desc="desc" :title="title"> </page-nav>
    <u-row>
      <u-col span="12" align="center"
        ><text class="subsection">{{ department }}</text>
        <u-line></u-line>
      </u-col>
    </u-row>
    <u--form labelPosition="left" :model="model1" ref="formSetting" :labelStyle="{fontSize:'20px', marginBottom: '5px',marginTop: '5px'}">
      <u-form-item
        prop="userInfo.stuid_search"
        borderBottom
        ref="item1"
        labelWidth="100"
      >
        <u-search
          placeholder="请输入学号或姓名搜索"
          v-model="model1.userInfo.stuid_search"
          :clearabled="true"
          :height="85"
          @blur="getData()"
          style="padding-top: 20px"
        ></u-search>
      </u-form-item>
      <u-form-item
        v-if="this.is_leader"
        label="学　　院"
        prop="userInfo.dept_name"
        borderBottom
        ref="item1"
        labelWidth="200"
      >
        <u--input
          v-model="model1.userInfo.dept_name"
          disabled
          border="none"
		 fontSize="20px"
        ></u--input>
      </u-form-item>
      <u-form-item
        label="学　　号"
        prop="userInfo.stuid"
        borderBottom
        ref="item1"
        labelWidth="200"
		
      >
        <u--input
          v-model="model1.userInfo.stuid"
          disabled
          border="none"
		   fontSize="20px"
        ></u--input>
      </u-form-item>
      <u-form-item
        label="姓　　名"
        prop="userInfo.stu_name"
        borderBottom
        ref="item1"
        labelWidth="200"
      >
        <u--input v-model="model1.userInfo.stu_name" border="none"   fontSize="20px"></u--input>
      </u-form-item>

      <u-form-item
        label="专业班级"
        prop="userInfo.stu_class"
        borderBottom
        ref="item1"
        labelWidth="200"
      >
        <u--input v-model="model1.userInfo.stu_class" border="none"   fontSize="20px"></u--input>
      </u-form-item>
	  <u-form-item
	    label="返校批次"
	    prop="userInfo.stu_batch"
	    borderBottom
	    ref="item1"
	    labelWidth="200"
	  >
	    <u--input v-model="model1.userInfo.stu_batch" border="none"   fontSize="20px"></u--input>
	  </u-form-item>
      <u-form-item prop="form_status" borderBottom ref="item1">
        <u-radio-group
          v-model="model1.form_status"
          placement="row"
          @change="groupChange"
          size="45rpx"
        >
          <u-radio
            :customStyle="{
              marginBottom: '1px',
              marginLeft: '10px',
              marginRight: '20px',
            }"
            v-for="(item, index) in radiolist1"
            :key="index"
            :label="item.name"
            :name="item.name"
            labelSize="35rpx"
          >
          </u-radio>
        </u-radio-group>
      </u-form-item>
    </u--form>

    <u-row style="padding-top: 10px">
      <u-col span="3">
        <u-button
          type="primary"
          text="确定"
          style="margin-left: 300%"
          @click="updataData()"
        ></u-button>
      </u-col>
    </u-row>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      showSex: false,
      model1: {
        userInfo: {
			stu_batch:"",
          stu_name: "",
          dept_name: "",
          stu_class: "",
          stuid: "",
          stuid_search: "",
        },
        form_status: "",
      },
      //   rules: {
      //     "userInfo.name": {
      //       type: "string",
      //       required: true,
      //       message: "请填写姓名",
      //       trigger: ["blur", "change"],
      //     },
      //     "userInfo.sex": {
      //       type: "string",
      //       max: 1,
      //       required: true,
      //       message: "请选择男或女",
      //       trigger: ["blur", "change"],
      //     },
      //   },
      radio: "",
      switchVal: false,
      radiolist1: [
        {
          name: "已请假",
          disabled: false,
        },
        {
          name: "已签到",
          disabled: false,
        },
        {
          name: "未签到",
          disabled: false,
        },
      ],
      desc: "",
      iconSrc: "../../static/images/setting_blue.png",
      title: "人员信息修改",
      department: "",
      is_dept: "",
      is_leader: false,
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  onLoad() {
    this.department = this.userInfo.departmentName;
    this.department = this.userInfo.departmentName;
    if (this.department == "河北工程大学") {
      this.is_dept = "";
      this.is_leader = true;
    } else {
      this.is_dept = `department:{_eq:"${this.department}"}`;
    }
  },
  methods: {
    getData() {
      if (this.model1.userInfo.stuid_search.length != 0) {
        this.refreshCount();
      }
    },
    refreshCount: function () {
      let query = `
						query MyQuery {
						  stu_info(where: {${this.is_dept},_or:[{stuid:{_eq:"${this.model1.userInfo.stuid_search}"}},{stu_name:{_eq:"${this.model1.userInfo.stuid_search}"}}]}) {
						    department
						    personid
						    present_time
						    rfid
						    status
						    stu_class
						    stu_name
						    stuid
							batch
						}
					}`;
      this.postGraphql(query).then((rest) => {
        if (rest.data.stu_info.length > 0) {
          this.model1.userInfo.dept_name = rest.data.stu_info[0].department;
          this.model1.userInfo.stu_name = rest.data.stu_info[0].stu_name;
          this.model1.userInfo.stu_class = rest.data.stu_info[0].stu_class;
          this.model1.userInfo.stuid = rest.data.stu_info[0].stuid;
		  this.model1.userInfo.stu_batch = rest.data.stu_info[0].batch;
          if (rest.data.stu_info[0].status == "已请假") {
            this.model1.form_status = "已请假";
          } else if (rest.data.stu_info[0].status == "") {
            this.model1.form_status = "未签到";
          } else {
            this.model1.form_status = "已签到";
          }
        } else if (this.model1.userInfo.stuid_search >= 9) {
          uni.showToast({
            type: "error",
            title: `${this.department}内没有查询到学号为${this.model1.userInfo.stuid_search}的学生信息，请检查核对！`,
            icon: "none",
          });
        } else {
          uni.showToast({
            type: "error",
            title: `${this.department}内没有查询到学号为${this.model1.userInfo.stuid_search}的学生信息，请检查核对！`,
            icon: "none",
          });
        }

        // uni.showToast({
        //   type: "success",
        //   title: `${this.department}已签到${this.c_done}人！`,
        //   icon: "none",
        // });
      });
    },
    groupChange(n) {
      this.model1.form_status = n;
    },

    updataData() {
		let present_time = ""
      if (this.model1.userInfo.stu_name == "") {
        uni.showToast({
          type: "error",
          title: `学生姓名不能为空`,
          icon: "none",
        });
        return;
      }
      if (this.model1.userInfo.stu_class == "") {
        uni.showToast({
          type: "error",
          title: `专业班级不能为空`,
          icon: "none",
        });
        return;
      }
      if (this.model1.form_status == "已请假") {
        this.model1.form_status = "已请假";
		present_time = `present_time:null`
      } else if (this.model1.form_status == "已签到") {
        this.model1.form_status = "无卡已签到";
		present_time = `present_time:"now()"`
      } else {
        this.model1.form_status = "";
		present_time = `present_time:null`
      }

      let query = `
						mutation MyMutation {
						  update_stu_info(where: {stuid:{_eq:"${this.model1.userInfo.stuid}"}},_set: {status: "${this.model1.form_status}", updated_at: "now()",stu_name:"${this.model1.userInfo.stu_name}",stu_class:"${this.model1.userInfo.stu_class}",batch:"${this.model1.userInfo.stu_batch}",${present_time}}) {
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
          this.model1.userInfo.stuid_search = "";
          this.model1.userInfo.dept_name = "";
          this.model1.userInfo.stuid = "";
          this.model1.userInfo.stu_name = "";
          this.model1.userInfo.stu_class = "";
		   this.model1.userInfo.stu_batch = "";
          this.model1.form_status = "";
        }
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
</style>
