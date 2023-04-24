<template>
	<view class="u-page">
		<page-nav :iconSrc="iconSrc" :desc="desc" :title="title"> </page-nav>
		<view class="u-demo-block">
			<!-- 	<u-popup :show="batchSelectShow" @open="batchSelectOpen" @close="batchSelectClose" >
			            <view>
			                <u-list v-if="!this.is_leader" height="100%">
			                  <u-list-item v-for="(item, index) in batchSelectList" :key="index">
			                    <u-row style="height: 80rpx">
			                      <u-col span="3" align="center">{{ item.department }}</u-col>
			                      <u-line dashed direction="col"></u-line>
			                    </u-row>
			                  </u-list-item>
							  </u-list>
			            </view>
					</u-popup> -->
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
					  "现为"+batch+"批次应做核酸人员"
					}}</u-button>
					<!-- <u-button @click="batchSelectShow = true">打开</u-button> -->
			<u-row>
				<u-col span="12" align="center"><text class="subsection" style="font-size: 35rpx;">{{ batch }}: 学生合计{{ c_all }}人</text>
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
			<u-line-progress :percentage="p_done" activeColor="#FF0000"  height="20" v-if="p_done>0&&p_done<30"></u-line-progress>
			<u-line-progress :percentage="p_done" activeColor="#FF7D00" height="20" v-else-if="p_done>=30&&p_done<60"></u-line-progress>
			<u-line-progress :percentage="p_done" activeColor="#FFD700" height="20" v-else-if="p_done>=60&&p_done<100"></u-line-progress>
			<u-line-progress :percentage="p_done" activeColor="#00FF00" height="20" v-else></u-line-progress>
	
			<u-line></u-line>
			<u-row style="margin-top: 7px">
				<u-col span="4" style="padding: 5px 5px 0px 5px">
					<u-button type="primary" text="启动读卡" @click="startNFC()"></u-button>
				</u-col>
				<u-col span="4" style="padding: 5px 5px 0px 5px">
					<u-button type="primary" text="刷新人数" @click="refreshCount()"></u-button>
				</u-col>
				<u-col span="4" style="padding: 5px 5px 0px 5px">
					<u-button type="primary" text="无卡签到" @click="nonecard()"></u-button>
				</u-col>
			</u-row>
			<br>
			<u-line></u-line>
			<u-row>
				<u-col span="4" style="padding: 5px 5px 0px 5px"></u-col><view
					style="text-align: center;font-size:100upx " center>
					<image src="../../static/images/user.png" style="width: 50upx;height: 50upx;"></image>
					{{this.stu_name}}
				</view></u-col>
			</u-row>

			<u-cell-group style="padding-top: 10px">

				<!-- <u-cell icon="account-fill" title="姓名" size="500" :value="stu_name"> </u-cell> -->
				<u-cell v-if="this.is_leader" icon="integral-fill" title="学院" :value="stu_department"></u-cell>
				<u-cell icon="integral-fill" title="学号" :value="stuid"> </u-cell>
				<u-cell icon="integral-fill" title="班级" :value="stu_class"></u-cell>
				<u-cell icon="integral-fill" title="卡号" :value="rfid"></u-cell>
				<u-cell icon="integral-fill" title="身份证卡号" :value="personid"></u-cell>
				<u-cell icon="integral-fill" title="签到状态" :value="status"></u-cell>
				<u-cell icon="integral-fill" title="签到时间" :value="present_time"></u-cell>
			</u-cell-group>
			<u-row v-if="is_none">
				<u-col span="6" style="padding: 5px 5px 5px 5px">
					<u-input placeholder="请输入学号" border="surround" v-model="crt_id"></u-input>
				</u-col>
				<u-col span="2" style="padding: 5px 5px 5px 5px">
					<u-button type="primary" text="确认" @click="isCorrectBatchStuid()"></u-button>
				</u-col>
				<u-col span="2" style="padding: 5px 5px 5px 5px">
					<u-button type="primary" text="重置" @click="resetStatus()"></u-button>
				</u-col>
				<u-col span="2" style="padding: 5px 5px 5px 5px">
					<u-button type="primary" text="取消" @click="cancel()"></u-button>
				</u-col>
			</u-row>
			<!-- 无卡签到 -->
			<u-modal :content="content" :show="showNoCard" showCancelButton closeOnClickOverlay @confirm="savecard()"
				@cancel="cancel()" @close="cancel()"></u-modal>
			<!-- 重置 -->
			<u-modal :content="content" :show="showModal" showCancelButton closeOnClickOverlay @confirm="confirm"
				@cancel="cancel()" @close="cancel()"></u-modal>
			<u-modal :content="noPerson" :show="showNoPerson" closeOnClickOverlay
				@confirm="() => (showNoPerson = false)"></u-modal>
			<!-- 提示卡号为0时得提示框 -->
			<u-modal :content="eorrCard" :show="showEorrCard" closeOnClickOverlay
				@confirm="() => (showEorrCard = false)"></u-modal>
			<!-- 提示总表中有重复的卡号 -->
			<u-modal :content="contentRepeat" :show="showRepeat" closeOnClickOverlay
				@confirm="() => (showRepeat = false)"></u-modal>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex";
	// 包路径
	const package_NdefRecord = "android.nfc.NdefRecord";
	const package_NdefMessage = "android.nfc.NdefMessage";
	const package_TECH_DISCOVERED = "android.nfc.action.TECH_DISCOVERED";
	const package_Intent = "android.content.Intent";
	const package_Activity = "android.app.Activity";
	const package_PendingIntent = "android.app.PendingIntent";
	const package_IntentFilter = "android.content.IntentFilter";
	const package_NfcAdapter = "android.nfc.NfcAdapter";
	const package_Ndef = "android.nfc.tech.Ndef";
	const package_NdefFormatable = "android.nfc.tech.NdefFormatable";
	const package_Parcelable = "android.os.Parcelable";
	const package_String = "java.lang.String";

	let NfcAdapter;
	let NdefRecord;
	let NdefMessage;
	// let readyWriteData = false;//开启写
	// let readyRead = false;//开启读
	let noNFC = false;
	let techListsArray = [
		["android.nfc.tech.IsoDep"],
		["android.nfc.tech.NfcA"],
		["android.nfc.tech.NfcB"],
		["android.nfc.tech.NfcF"],
		["android.nfc.tech.Nfcf"],
		["android.nfc.tech.NfcV"],
		["android.nfc.tech.NdefFormatable"],
		["android.nfc.tech.MifareClassi"],
		["android.nfc.tech.MifareUltralight"],
	];
	export default {
		data() {
			return {
				contentRepeat:"",
				showRepeat:false,
				batch_show:false,
				 batch_columns:[[]],
				batchSelectShow:false,
				title: "NFC刷卡签到",
				desc: "",
				iconSrc: "../../static/images/nfc.png",
				department: "信电学院",
				c_all: 0,
				c_done: 0,
				c_not: 0,
				c_left: 0,
				stu_department: "",
				stu_class: "",
				stuid: "",
				stu_name: "",
				rfid: "",
				personid: "",
				status: "",
				present_time: "",
				is_none: false,
				crt_card: "",
				crt_id: "",
				showModal: false,
				content: "您确认要重置该学号的学生签到状态为空么？",
				noPerson: "该卡未绑定相关人员，请输入学号进行绑定！",
				showNoPerson: false,
				eorrCard: "卡号读取错误，请重新读取！",
				showEorrCard: false,
				lst_id: "",
				lst_time: 0,
				is_dept:"",
				is_leader:false,
				p_done:0,
				showNoCard:false,
				batch_name:"",
				batch:"全院",
				new_batch:"",
			};
		},
		onLoad() {
			this.batch_columns = [[]];
			this.department = this.userInfo.departmentName;
			if(this.department == "河北工程大学"){
				this.is_dept = "";
				this.is_leader = true;
			}else{
				this.is_dept = `department:{_eq:"${this.department}"}`
			}
			this.refreshCount();
			this.getBatch();
		},
		computed: {
			...mapGetters(["userInfo"]),
		},
		methods: {
			isBatch_show() {
				this.batch_show = true
				},
				//获取批次列表
				getBatch: function () {
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
					  this.batch_columns[0].push({
					    batch_name: rest.data.stu_statis_batch[i].batch,
					    batch_lable:
					      rest.data.stu_statis_batch[i].batch
					  });
				  }
				   });
				  },
				  batch_confirm(e){
				  	this.batch_show = false;	
				  	this.batch = e.value[0].batch_name;
					
					 this.new_batch = this.batch == "全院"?"":`batch:{_eq:"${this.batch}"}`;
					
					 this.refreshCount()
				  },
				
			startNFC: function() {
				// console.log("---------listenNFCStatus--------------")
				let that = this;
				try {
					let main = plus.android.runtimeMainActivity();
					let Intent = plus.android.importClass("android.content.Intent");
					let Activity = plus.android.importClass("android.app.Activity");
					let PendingIntent = plus.android.importClass(
						"android.app.PendingIntent"
					);
					let IntentFilter = plus.android.importClass(
						"android.content.IntentFilter"
					);
					NfcAdapter = plus.android.importClass("android.nfc.NfcAdapter");
					let nfcAdapter = NfcAdapter.getDefaultAdapter(main);

					if (nfcAdapter == null) {
						uni.showToast({
							type: "error",
							title: "设备不支持NFC！",
							icon: "none",
						});
						noNFC = true;
						return;
					}

					if (!nfcAdapter.isEnabled()) {
						uni.showToast({
							type: "error",
							title: "请在系统设置中先启用NFC功能！",
							icon: "none",
						});
						noNFC = true;
						return;
					} else {
						noNFC = false;
						uni.showToast({
							type: "success",
							title: "成功启用NFC功能！",
							icon: "none",
						});
					}

					let intent = new Intent(main, main.getClass());
					intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
					let pendingIntent = PendingIntent.getActivity(main, 0, intent, 0);
					let ndef = new IntentFilter("android.nfc.action.TECH_DISCOVERED");
					ndef.addDataType("*/*");
					let intentFiltersArray = [ndef];

					plus.globalEvent.addEventListener("newintent", function() {
						// console.log('newintent running');
						// 轮询调用 NFC
						setTimeout(that.nfcRuning(), 1000);
					});
					plus.globalEvent.addEventListener("pause", function(e) {
						// console.log('pause running');
						if (nfcAdapter) {
							//关闭前台调度系统
							//恢复默认状态
							nfcAdapter.disableForegroundDispatch(main);
						}
					});
					plus.globalEvent.addEventListener("resume", function(e) {
						// console.log('resume running');
						if (nfcAdapter) {
							//开启前台调度系统
							// 优于所有其他NFC
							nfcAdapter.enableForegroundDispatch(
								main,
								pendingIntent,
								intentFiltersArray,
								techListsArray
							);
						}
					});
					nfcAdapter.enableForegroundDispatch(
						main,
						pendingIntent,
						intentFiltersArray,
						techListsArray
					);
				} catch (e) {
					console.error(e);
				}
			},
			nfcRuning: function() {
				// console.log("--------------nfcRuning---------------")
				NdefRecord = plus.android.importClass("android.nfc.NdefRecord");
				NdefMessage = plus.android.importClass("android.nfc.NdefMessage");
				let main = plus.android.runtimeMainActivity();
				let intent = main.getIntent();

				// console.log("action type:" + intent.getAction());
				// console.log(package_TECH_DISCOVERED == intent.getAction());
				if (package_TECH_DISCOVERED == intent.getAction()) {
					let bytesId = intent.getByteArrayExtra(NfcAdapter.EXTRA_ID);
					let nfc_id = this.byteArrayToHexString(bytesId);
					// console.log('nfc_id:', nfc_id);
					// readyRead = false;
					// }
					this.isCorrectBatchCardid(nfc_id);
				}
			},
			byteArrayToHexString: function(inarray) {
				// converts byte arrays to string
				let i, j, inn;
				let hex = [
					"0",
					"1",
					"2",
					"3",
					"4",
					"5",
					"6",
					"7",
					"8",
					"9",
					"A",
					"B",
					"C",
					"D",
					"E",
					"F",
				];
				let out = "";
				for (j = 0; j < inarray.length; ++j) {
					inn = inarray[j] & 0xff;
					i = (inn >>> 4) & 0x0f;
					out += hex[i];
					i = inn & 0x0f;
					out += hex[i];
				}
				return out;
			},
		
			//通过读取卡号查询此人是否应该在这一批次做核酸
			isCorrectBatchCardid:function(cardid){
				let query = "";
				if (cardid == "00000000" || cardid == "0000000000000000") {
					this.showEorrCard = true
					return;
				}
				if ((cardid === this.lst_id) && ((new Date()).getTime() - this.lst_time) < 3000) {
					return;
				}
				this.lst_id = cardid;
				this.lst_time = (new Date()).getTime();
				if (cardid.length === 8){
					query = `
							query MyQuery {
							  stu_info(where: {rfid: {_eq: "${cardid}"}}) {
								batch
								stu_name
							}
						}`;
				}else if(cardid.length === 16){
					query = `
							query MyQuery {
							  stu_info(where: {personid: {_eq: "${cardid}"}}) {
								batch
								stu_name
							}
						}`;
				};
					this.postGraphql(query).then((rest) => {
						//先判断卡号相对应的人员是否存在
						if(rest.data.stu_info.length>0){
							//如果存在，判断当前批次在与选择批次相等或者选择批次为全院时，则查询总表中的数据
							let stu_name = rest.data.stu_info[0].stu_name;
							let batch = rest.data.stu_info[0].batch
							if(this.batch =="全院" || rest.data.stu_info[0].batch == this.batch){
								this.querySummary(cardid);
								
							}else if(rest.data.stu_info[0].batch != this.batch){
								//如果不是当前批次则进行弹窗提示
								this.stu_department = "";
								this.stu_class = "";
								this.stuid = "";
								this.stu_name = stu_name;
								this.rfid = "";
								this.personid = "";
								this.status = "";
								this.present_time = "";
								this.crt_id = "";
								this.crt_card = "";
								uni.showToast({
								  type: "success",
								  title: `${stu_name}应为${batch}批次做核酸人员！`,
								  icon: "none",
								});
							}
						}else{
							//如果该卡号相对应的人员在打卡表中不存在，则应查询总表中是否有相匹配的人员
							this.querySummary(cardid);
							
						}
						
						// uni.showToast({
						//   type: "success",
						//   title: `${this.department}已签到${this.c_done}人！`,
						//   icon: "none",
						// });
					})
				
			},
			//通过输入学号判断此人是否应该在这里做核酸
			isCorrectBatchStuid:function(){
				let query = "";
				if (this.crt_id.length < 9) {
					uni.showToast({
						type: "error",
						title: "学号长度不足，请检查核对！",
						icon: "none",
					});
					return;
				}
					query = `
							query MyQuery {
							  stu_info(where: {stuid: {_eq: "${this.crt_id}"}}) {
								batch
								stu_name
							}
						}`;
				
					this.postGraphql(query).then((rest) => {
						if(rest.data.stu_info.length>0){
						let stu_name = rest.data.stu_info[0].stu_name;
						let batch = rest.data.stu_info[0].batch
						//如果不是当前批次则进行弹窗提示
						if(this.batch =="全院" || rest.data.stu_info[0].batch == this.batch){
							this.savecard_show();
						}else if(rest.data.stu_info[0].batch != this.batch){
							//如果不是当前批次则进行弹窗提示
							this.stu_department = "";
							this.stu_class = "";
							this.stuid = "";
							this.stu_name = "";
							this.rfid = "";
							this.personid = "";
							this.status = "";
							this.present_time = "";
							this.crt_id = "";
							this.crt_card = "";
							uni.showToast({
							  type: "success",
							  title: `${stu_name}应为${batch}批次做核酸人员！`,
							  icon: "none",
							});
						}
						}else {
							uni.showToast({
								type: "error",
								title: `${this.department}内没有查询到学号为${this.crt_id}的学生信息，请检查核对！`,
								icon: "none",
							});
						return
					}
							
						
						// uni.showToast({
						//   type: "success",
						//   title: `${this.department}已签到${this.c_done}人！`,
						//   icon: "none",
						// });
					})
				
			},
			//更改总表中的卡号
			mutationSummary: function (cardid){
				let query = "";
					//判断是校园卡还是身份证
					//查询是否为当前批次应做核酸人员
					if (cardid.length === 8) {
						query = `
							mutation MyMutation {
							  update_stu_info_summary(_set: {status: "已签到", present_time: "now()",rfid:"${cardid}"}, where: {stuid: {_eq: "${this.crt_id}"}}) {
								returning {
								  department
								  personid
								  present_time
								  rfid
								  status
								  stu_class
								  stu_name
								  stuid
								}
								affected_rows
							  }
							}`;
					} else if (cardid.length === 16) {
						query = `
							mutation MyMutation {
							  update_stu_info_summary(_set: {status: "已签到", present_time: "now()",personid:"${cardid}"}, where: {stuid: {_eq: "${this.crt_id}"}}) {
								returning {
								  department
								  personid
								  present_time
								  rfid
								  status
								  stu_class
								  stu_name
								  stuid
								}
								affected_rows
							  }
							}`;
					}
					this.postGraphql(query).then((rest) => {
							console.log("总表更新成功");
								})
					},
				//查询总表中是否存在该卡卡号
				querySummary: function (cardid) {
					let query = ""
				if (cardid.length === 8) {
					query = `
						query MyQuery {
							  stu_info_summary(where: {rfid: {_eq: "${cardid}"}}) {
							   stuid
							   stu_name
							}
							stu_info(where: {rfid: {_eq: "${cardid}"}}) {
								stuid
							}
						}`;
						}else if(cardid.length === 16){
							query = `
								query MyQuery {
									  stu_info_summary(where: {personid: {_eq: "${cardid}"}}) {
									   stuid
									   stu_name
									}
									stu_info(where: {personid: {_eq: "${cardid}"}}) {
										stuid
									}
								}`;
						}
				this.postGraphql(query).then((rest) => {
					
					//总表中存在，需判断查询出来两表中的学号是否相对应
					if(rest.data.stu_info_summary.length>0){
						let stuid_info = rest.data.stu_info.length?rest.data.stu_info[0].stuid:""
						let stuid_summary =  rest.data.stu_info_summary.length?rest.data.stu_info_summary[0].stuid:"";
						let stu_name = rest.data.stu_info_summary.length?rest.data.stu_info_summary[0].stu_name:"";
						if(stuid_info ==stuid_summary){
							//如果汇总表中的学号与打卡表中的学号相对应，则更新打卡表
							this.showInfo(cardid)
						}else{
							//如果不相等，则弹出提示框，提示刷卡人员联系信电学院管理人员
							
							this.contentRepeat = "此卡已被学号为"+stuid_summary+"的"+stu_name+"同学绑定，如需解绑请截图并联系信电学院管理员解绑！"
							setTimeout(()=>{
								this.showRepeat = true;
							},300)
						}
						//总表中不存在，打卡表中存在，则根据学号更新总表		
					}else {
						//如果该卡号在总表中不存在，则应该进行绑卡，更新两张表的操作
						this.showInfo(cardid);
					}
					
							// uni.showToast({
							//   type: "success",
							//   title: `${this.department}已签到${this.c_done}人！`,
							//   icon: "none",
							// });
						})
			},
			showInfo: function(cardid) {
				let query = "";
				//判断是校园卡还是身份证
				//查询是否为当前批次应做核酸人员
				if (cardid.length === 8) {
					query = `
						mutation MyMutation {
						  update_stu_info(_set: {status: "已签到", present_time: "now()"}, where: {${this.is_dept},rfid: {_eq: "${cardid}"}}) {
							returning {
							  department
							  personid
							  present_time
							  rfid
							  status
							  stu_class
							  stu_name
							  stuid
							}
							affected_rows
						  }
						}`;
				} else if (cardid.length === 16) {
					query = `
						mutation MyMutation {
						  update_stu_info(_set: {status: "已签到", present_time: "now()"}, where: {${this.is_dept},personid: {_eq: "${cardid}"}}) {
							returning {
							  department
							  personid
							  present_time
							  rfid
							  status
							  stu_class
							  stu_name
							  stuid
							}
							affected_rows
						  }
						}`;
				}
				if (query.length > 0) {
					this.postGraphql(query).then((rest) => {
						// console.log(rest);
						if (rest.data.update_stu_info.affected_rows > 0) {
							this.stu_department =
								rest.data.update_stu_info.returning[0].department;
							this.stu_class = rest.data.update_stu_info.returning[0].stu_class;
							this.stuid = rest.data.update_stu_info.returning[0].stuid;
							this.stu_name = rest.data.update_stu_info.returning[0].stu_name;
							this.rfid = rest.data.update_stu_info.returning[0].rfid;
							this.personid = rest.data.update_stu_info.returning[0].personid;
							this.status = rest.data.update_stu_info.returning[0].status;
							this.present_time = rest.data.update_stu_info.returning[0]
								.present_time ?
								new Date(
									rest.data.update_stu_info.returning[0].present_time
								).format("yyyy-MM-dd hh:mm:ss") :
								"";
							this.is_none = false;
						} else {
							this.stu_department = "未知人员";
							this.stu_class = "未知人员";
							this.stuid = "未知人员";
							this.stu_name = "未知人员";
							this.rfid = "未知人员";
							this.personid = "未知人员";
							this.status = "未知人员";
							this.present_time = "未知人员";
							if (cardid.length === 8) {
								this.rfid = cardid;
							}
							if (cardid.length === 16) {
								this.personid = cardid;
							}
							this.is_none = true;
							this.crt_card = cardid;
							this.showNoPerson = true;
						}
					});
				} else {
					uni.showToast({
						type: "error",
						title: "卡号长度错误，请检查核对！",
						icon: "none",
					});
				}
				this.refreshCount();
			},
			refreshCount: function() {
				 
				let difference = 0;
				let query = "";
				//如果this.batch为全院，需查询stu_statis表，否则查询stu_statis_batch表
				if(this.batch == "全院"){
					query = `
							query MyQuery {
							  stu_statis(where: {${this.is_dept},${this.new_batch}}) {
							    department
							    c_all
							    c_attend
							    c_left
							    c_none
							    c_not
							}
						}`;
						this.postGraphql(query).then((rest) => {
							this.c_all = rest.data. stu_statis[0].c_all;
							this.c_done =
								rest.data.stu_statis[0].c_attend + rest.data. stu_statis[0].c_none;
							this.c_not = rest.data.stu_statis[0].c_not;
							this.c_left = rest.data. stu_statis[0].c_left;
							this.p_done = ((Number(rest.data.stu_statis[0].c_attend + rest.data. stu_statis[0].c_none) * 100) /(rest.data.stu_statis[0].c_all - rest.data. stu_statis[0].c_left)).toFixed(1);
							difference = ((Number(rest.data.stu_statis[0].c_attend + rest.data. stu_statis[0].c_none))-(rest.data.stu_statis[0].c_all - rest.data.stu_statis[0].c_left))
							if(this.p_done == 100 && difference != 0){
								this.p_done = 99.99
							}
							// uni.showToast({
							//   type: "success",
							//   title: `${this.department}已签到${this.c_done}人！`,
							//   icon: "none",
							// });
						})
						
				}else{
					query = `
							query MyQuery {
							  stu_statis_batch(where: {${this.is_dept},${this.new_batch}}) {
							    department
							    c_all
							    c_attend
							    c_left
							    c_none
							    c_not
							}
						}`;
						this.postGraphql(query).then((rest) => {
							this.c_all = rest.data. stu_statis_batch[0].c_all;
							this.c_done =
								rest.data.stu_statis_batch[0].c_attend + rest.data. stu_statis_batch[0].c_none;
							this.c_not = rest.data.stu_statis_batch[0].c_not;
							this.c_left = rest.data. stu_statis_batch[0].c_left;
							this.p_done = ((Number(rest.data.stu_statis_batch[0].c_attend + rest.data. stu_statis_batch[0].c_none) * 100) /(rest.data.stu_statis_batch[0].c_all - rest.data. stu_statis_batch[0].c_left)).toFixed(1);
							difference = ((Number(rest.data.stu_statis_batch[0].c_attend + rest.data. stu_statis_batch[0].c_none))-(rest.data.stu_statis_batch[0].c_all - rest.data.stu_statis_batch[0].c_left))
							if(this.p_done == 100 && difference != 0){
								this.p_done = 99.99
							}
							// uni.showToast({
							//   type: "success",
							//   title: `${this.department}已签到${this.c_done}人！`,
							//   icon: "none",
							// });
						})
				}
				
			
			},
			savecard: function() {
				let query = "";
				if (this.crt_card.length === 8) {
					query = `
						mutation MyMutation {
						  update_stu_info(_set: {status: "已签到", present_time: "now()",rfid:"${this.crt_card}"}, where: {${this.is_dept},${this.new_batch},stuid: {_eq: "${this.crt_id}"}}) {
							returning {
							  department
							  personid
							  present_time
							  rfid
							  status
							  stu_class
							  stu_name
							  stuid
							}
							affected_rows
						  }
						}`;
				} else if (this.crt_card.length === 16) {
					query = `
						mutation MyMutation {
						  update_stu_info(_set: {status: "已签到", present_time: "now()",personid:"${this.crt_card}"}, where: {${this.is_dept},${this.new_batch},stuid: {_eq: "${this.crt_id}"}}) {
							returning {
							  department
							  personid
							  present_time
							  rfid
							  status
							  stu_class
							  stu_name
							  stuid
							}
							affected_rows
						  }
						}`;
				} else {
					query = `
						mutation MyMutation {
						  update_stu_info(_set: {status: "无卡已签到", present_time: "now()"}, where: {${this.is_dept},${this.new_batch},stuid: {_eq: "${this.crt_id}"}}) {
							returning {
							  department
							  personid
							  present_time
							  rfid
							  status
							  stu_class
							  stu_name
							  stuid
							}
							affected_rows
						  }
						}`;
				}

				this.postGraphql(query).then((rest) => {
					if (rest.data.update_stu_info.affected_rows > 0) {
						//当卡号未绑定相关人员，并绑定成功后，进行更新总表操作
						if(this.crt_card){
							this.mutationSummary(this.crt_card)
						}
						this.stu_department =
							rest.data.update_stu_info.returning[0].department;
						this.stu_class = rest.data.update_stu_info.returning[0].stu_class;
						this.stuid = rest.data.update_stu_info.returning[0].stuid;
						this.stu_name = rest.data.update_stu_info.returning[0].stu_name;
						this.rfid = rest.data.update_stu_info.returning[0].rfid;
						this.personid = rest.data.update_stu_info.returning[0].personid;
						this.status = rest.data.update_stu_info.returning[0].status;
						this.present_time = rest.data.update_stu_info.returning[0]
							.present_time ?
							new Date(
								rest.data.update_stu_info.returning[0].present_time
							).format("yyyy-MM-dd hh:mm:ss") :
							"";
						this.refreshCount();
						this.cancel();
					} else {
						uni.showToast({
							type: "error",
							title: `${this.department}内没有查询到学号为${this.crt_id}的学生信息，请检查核对！`,
							icon: "none",
						});
					}
				});
			},
			cancel: function() {
				this.batch_show = false;
				this.is_none = false;
				this.crt_id = "";
				this.crt_card = "";
				this.showNoCard = false;
				this.showNoCard = false
			},
			nonecard: function() {
				this.stu_department = "";
				this.stu_class = "";
				this.stuid = "";
				this.stu_name = "";
				this.rfid = "";
				this.personid = "";
				this.status = "";
				this.present_time = "";
				this.crt_id = "";
				this.crt_card = "";
				this.is_none = true;
			},
			getStudentName: async function() {
				let stu_name = ""
				let query = `
						query MyQuery {
						  stu_info(where: {${this.is_dept},stuid: {_eq: "${this.crt_id}"}}) {
						    stu_name
						}
					}`;
				let result = await this.postGraphql(query);
				stu_name = result.data.stu_info[0].stu_name
				return stu_name
			},
			// 无卡考勤确认提示框
			async savecard_show(){
				this.stu_name="";
				await this.getStudentName().then((res)=>{
					this.content = "确定要给" + res + "同学无卡签到么？";
					this.showNoCard = true;
				})
			},
			
			resetStatus: function() {
				if (this.crt_id.length < 9) {
					uni.showToast({
						type: "error",
						title: "学号长度不足，请检查核对！",
						icon: "none",
					});
					return;
				}
				this.stu_name="";
				this.getStudentName();
				setTimeout(() => {
					if(this.stu_name){
					this.content = "确定要重置" + this.stu_name + "同学的考勤状态么？";
					this.showModal = true;
					}
				}, 400);


			},
			confirm: function() {
				 
				let query = `
						mutation MyMutation {
						  update_stu_info(_set: {status: "", present_time: null}, where: {${this.is_dept},${this.new_batch},stuid: {_eq: "${this.crt_id}"}}) {
							returning {
							  department
							  personid
							  present_time
							  rfid
							  status
							  stu_class
							  stu_name
							  stuid
							}
							affected_rows
						  }
						}`;

				this.postGraphql(query).then((rest) => {
					if (rest.data.update_stu_info.affected_rows > 0) {
						this.stu_department =
							rest.data.update_stu_info.returning[0].department;
						this.stu_class = rest.data.update_stu_info.returning[0].stu_class;
						this.stuid = rest.data.update_stu_info.returning[0].stuid;
						this.stu_name = rest.data.update_stu_info.returning[0].stu_name;
						this.rfid = rest.data.update_stu_info.returning[0].rfid;
						this.personid = rest.data.update_stu_info.returning[0].personid;
						this.status = rest.data.update_stu_info.returning[0].status;
						this.present_time = rest.data.update_stu_info.returning[0]
							.present_time ?
							new Date(
								rest.data.update_stu_info.returning[0].present_time
							).format("yyyy-MM-dd hh:mm:ss") :
							"";

						this.refreshCount();
						this.cancel();
					} else {
						uni.showToast({
							type: "error",
							title: `${this.department}内没有查询到学号为${this.crt_id}的学生信息，请检查核对！`,
							icon: "none",
						});
					}
				});
				this.showModal = false;
			},
		}
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
