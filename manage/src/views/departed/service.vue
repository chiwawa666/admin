<template>
  <div class="app-container">
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="finalObj"
      label-position="left"
      label-width="70px"
      style="margin-left: 50px"
    >
      <el-form-item label="逝者姓名">
        <span>{{ finalObj.defunctName }}</span>
      </el-form-item>
      <el-form-item label="订单编号">
        <span>{{ finalObj.orderno }}</span>
      </el-form-item>
    </el-form>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      v-if="false"
      :data="finishedProduct"
      border
      fit
      highlight-current-row
      style="width: 100%; margin-bottom: 20px"
    >
      <el-table-column label="选择服务" align="center" width="auto">
        <template slot-scope="{}"> 已缴费 </template>
      </el-table-column>
      <el-table-column label="服务项目" align="center" width="auto">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.names }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" align="center" width="auto">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center" width="auto">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="补贴" align="center" width="auto">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.subsidyPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否加班" align="center" width="auto">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.overTime ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额" align="center" width="auto">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.total - row.subsidyPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排号" align="center" width="auto">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.lineName }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="service"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="选择服务" align="center" width="auto">
        <template slot-scope="{ row }">
          <el-checkbox
            v-model="row.selected"
            @change="handleCheckedChange(row)"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="服务项目" align="center" width="auto">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.names }}</span>
        </template>
      </el-table-column>

      <el-table-column label="价格" align="center" width="auto">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格单位" align="center" width="auto">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.priceUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center" width="320px">
        <template slot-scope="{ row }">
          <el-input-number
            v-model="row.count"
            :min="0"
            :max="100"
            :step="1"
            :step-strictly="true"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="加班" align="center" width="auto">
        <template slot-scope="{ row }">
          <el-checkbox v-model="row.overTime"></el-checkbox>
        </template>
      </el-table-column>

      <el-table-column
        label="补贴金额"
        align="center"
        width="200px"
        class="limitWidth"
        style="padding-left: 10px"
      >
        <template slot-scope="{ row }">
          <el-input v-model="row.subsidy" placeholder="请输入"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="金额" align="center" width="auto">
        <template slot-scope="{ row }">
          <span class="link-type">{{
            !row.selected
              ? 0
              : Number(row.price) * Number(row.count) - Number(row.subsidy) > 0
              ? Number(row.price) * Number(row.count) - Number(row.subsidy)
              : 0
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="auto">
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            size="mini"
            @click="handleLine(row)"
            v-if="
              row.selected &&
              (row.productid == 2 ||
                row.productid == 3 ||
                (row.productid == 4 && freezerState != 1) ||
                row.productid == 5 ||
                (row.productid == 12 && morgueState != 1))
            "
          >
            排号
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="getOut(0)"
            v-if="row.selected && row.productid == 4 && freezerState == 1"
          >
            去出库
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="getOut(1)"
            v-if="row.selected && row.productid == 12 && morgueState == 1"
          >
            去出库
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="排号" align="center" width="auto">
        <template slot-scope="{ row }">
          <span>{{ row.productid | productidFilter }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="filter-container">
      <router-link
        :to="'/departed/serviceFinal/' + finalObj.orderno"
        v-if="finalObj.state >= 1"
      >
        <el-button type="success" class="float-right-button">
          查看最终清单
        </el-button>
      </router-link>
      <el-button
        type="primary"
        class="float-right-button"
        @click="updateData"
        :disabled="freezerState == 1 || morgueState == 1"
      >
        确定
      </el-button>
      <el-button
        type="primary"
        class="float-right-button"
        @click="chcheData"
        :disabled="freezerState == 1 || morgueState == 1"
      >
        暂存选择
      </el-button>
      <el-button
        type="primary"
        class="float-right-button"
        @click="getChcheData"
        :disabled="freezerState == 1 || morgueState == 1"
      >
        获取上一次暂存选择
      </el-button>
      <router-link to="/departed/index">
        <el-button class="float-right-button"> 返回 </el-button>
      </router-link>
    </div>
    <!-- 冷藏柜选择 -->
    <el-dialog
      title="冷藏柜选择"
      :visible.sync="dialogFormVisibleFreezer"
      width="30%"
    >
      <div class="center">
        <!-- <div> -->
        <!-- <el-date-picker
            v-model="startTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="开始时间"
          />
        </div>
        <div>
          <el-date-picker
            v-model="endTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="结束时间"
          />
        </div> -->
        <div>
          <el-date-picker
            v-model="value1"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </div>
        <div v-if="startTime != '' && endTime != ''">
          <el-radio
            v-model="Freezer"
            v-for="item in templist"
            :key="item.id"
            :label="item.freezerid"
            border
          >
            {{ item.names }}</el-radio
          >
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="updateFreezer"
          :disabled="startTime == '' && endTime == '' && Freezer == ''"
        >
          确定
        </el-button>
        <el-button @click="dialogFormVisibleFreezer = false"> 关闭 </el-button>
      </div>
    </el-dialog>
    <!-- 告别礼厅 -->
    <el-dialog
      title="告别礼厅选择"
      :visible.sync="dialogFormVisibleAudi"
      width="30%"
    >
      <div class="center">
        <!-- <div>
          <el-date-picker
            v-model="startTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="开始时间"
          />
        </div>
        <div>
          <el-date-picker
            v-model="endTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="结束时间"
          />
        </div> -->
        <div>
          <el-date-picker
            v-model="value1"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </div>
        <div v-if="startTime != '' && endTime != ''">
          <el-radio v-model="auditorium" label="1" border>小悼念厅</el-radio>
          <el-radio v-model="auditorium" label="2" border>中悼念厅</el-radio>
          <el-radio v-model="auditorium" label="3" border>大悼念厅</el-radio>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="updateAuditorium"
          :disabled="startTime == '' && endTime == '' && auditorium == ''"
        >
          确定
        </el-button>
        <el-button @click="dialogFormVisibleAudi = false"> 关闭 </el-button>
      </div>
    </el-dialog>
    <!-- 骨灰盒 -->
    <el-dialog
      title="存放柜选择"
      :visible.sync="dialogFormVisibleBlock"
      width="30%"
    >
      <div class="center">
        <!-- <div>
          <el-date-picker
            v-model="startTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="开始时间"
          />
        </div>
        <div>
          <el-date-picker
            v-model="endTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="结束时间"
          />
        </div> -->
        <div>
          <el-date-picker
            v-model="value1"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </div>
        <div v-if="startTime != '' && endTime != ''">
          <el-radio
            v-model="blockid"
            v-for="item in templist"
            :key="item.ashesid"
            :label="item.ashesid"
            border
          >
            {{ item.names }}</el-radio
          >
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="updateBlock"
          :disabled="startTime == '' && endTime == '' && auditorium == ''"
        >
          确定
        </el-button>
        <el-button @click="dialogFormVisibleBlock = false"> 关闭 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getFinalInfo } from "@/api/people";
import {
  getProductionFiler,
  updatefinalOrder,
  updateLine,
  getFreezersEmpty,
  getCinerarysEmpty,
  cacheService,
  getCacheService,
} from "@/api/funeral";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
const moment = require("moment");

let that;
export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },

    change(val) {
      const arr = ["第一班", "第二班", "第三班", "第四班"];
      return arr[val - 1];
    },
    salvage(val) {
      const arr = ["否", "是"];
      return arr[val];
    },
    productidFilter(val) {
      if (val == 2) {
        return that.buryNum1;
      } else if (val == 3) {
        return that.buryNum2;
      } else if (val == 4) {
        return that.FreezerNum;
      } else if (val == 5) {
        return that.auditoriumNum;
      } else if (val == 12) {
        return that.blockNum1;
      }
    },
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      id: "",
      finalObj: {},
      listLoading: true,
      finishedProduct: [],
      listQuery: {
        page: 1,
        limit: 10,
        defunctName: "",
        defunctIdCard: "",
        state: 0,
      },
      importanceOptions: [1, 2, 3],
      stateOptions: [
        {
          id: 0,
          name: "待处理",
        },
        {
          id: 1,
          name: "已调度",
        },
        {
          id: 2,
          name: "已完成",
        },
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        type: "",
        status: "published",
      },
      lineIds: [], //需要排号的id
      service: [],
      dialogFormVisible: false,
      dialogFormVisibleFreezer: false,
      dialogFormVisibleAudi: false,
      dialogFormVisibleBlock: false,

      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create",
      },
      dialogPvVisible: false,
      pvData: [],
      value1: [new Date(), new Date()],
      // startTime: "",
      // endTime: "",
      Freezer: "",
      FreezerNum: "",
      bury: "",
      buryNum1: "",
      buryNum2: "",
      auditorium: "",
      auditoriumNum: "",
      blockid: "",
      blockNum1: "",
      blockNum2: "",
      templist: [],
      freezerState: 0,
      morgueState: 0,
      rules: {
        type: [
          { required: true, message: "type is required", trigger: "change" },
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change",
          },
        ],
        title: [
          { required: true, message: "title is required", trigger: "blur" },
        ],
      },
      downloadLoading: false,
    };
  },
  computed: {
    startTime() {
      const date = moment(this.value1[0]);
      return date.format("YYYY-MM-DD HH:mm:ss");
    },
    endTime() {
      const date = moment(this.value1[1]);
      return date.format("YYYY-MM-DD HH:mm:ss");
    },
  },

  created() {
    this.getList();
    that = this;
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.id = this.$route.params && this.$route.params.id;
      getFinalInfo(this.id).then((response) => {
        const result = JSON.parse(response.result);
        // 去除已缴费的服务
        // this.finalObj = result; //便于filterArrayByEnd对数据操作，后面再次覆盖
        // let tempdata = this.filterArrayByEnd(result);
        // result.product = tempdata.filteredArray;
        // this.finishedProduct = tempdata.array2;
        // console.log("result", result);
        // if (result.ashes !== null) {
        //   this.blockNum1 = result.ashes.names;
        // }
        // if (result.fire !== null) {
        //   if (result.fire.productId == 2) {
        //     this.buryNum1 = result.fire.number;
        //   } else {
        //     this.buryNum2 = result.fire.number;
        //   }
        // }
        // if (result.freezer !== null) {
        //   this.FreezerNum = result.freezer.names;
        //   this.freezerState = result.freezer.state;
        // }
        // if (result.morgue !== null) {
        //   this.auditoriumNum = result.morgue.number;
        //   this.morgueState = result.morgue.state;
        // }

        this.finalObj = result;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 100);
      });
      getProductionFiler({
        page: 1,
        type: 0,
        rows: 100,
      }).then((response) => {
        const templist = JSON.parse(response.result);
        let arr = [];
        templist.forEach((item) => {
          item.voLists.forEach((item2) => {
            arr.push(item2);
          });
        });
        console.log("arr", arr);
        arr.forEach((item) => {
          item.selected = false;
          item.overTime = false;
          item.count = 0;
        });
        this.service = arr;
        //替换or 增加没有的值，方便后面去解构提交
        this.service.forEach((item) => {
          this.finalObj.product.forEach((item2) => {
            // console.log("item2", item2);
            if (item.names == item2.names) {
              if (item2.end !== true) {
                item.selected = true;
                item.count = item2.count;
                item.lineId = item2.lineId;
                item.overTime = item2.overTime;
                item.price = item2.price;
                item.subsidy = item2.subsidyPrice;
                item.subsidyPrice = item2.subsidyPrice;
                item.total = item2.total;
              }
            }
          });
        });
        this.dialogFormVisible = true;
      });
    },
    filterArrayByEnd(obj) {
      let array = obj.product; // 假设这是你的数组
      const array2 = []; // 创建一个新数组来存放符合条件的子项
      const filteredArray = array.filter((item) => {
        // 如果 end 不是 true，则返回 true 以保留在原始数组中
        // 否则返回 false，表示要剔除这个子项
        if (item.end !== true) {
          return true;
        } else {
          if (item.productid == 2 && obj.fire !== null) {
            console.log("setfire");
            this.$set(item, "lineName", obj.fire.number);
            obj.fire = null;
          } else if (item.productid == 3 && obj.fire !== null) {
            console.log("setfire");
            this.$set(item, "lineName", obj.fire.number);
            obj.fire = null;
          } else if (item.productid == 4 && obj.freezer !== null) {
            console.log("setfreezer");
            this.$set(
              item,
              "lineName",
              obj.freezer.names +
                "-" +
                obj.freezer.startTime +
                "-" +
                obj.freezer.endTime
            );
            obj.freezer = null;
          } else if (item.productid == 5 && obj.morgue !== null) {
            console.log("setmorgue");
            this.$set(item, "lineName", obj.morgue.number);
            obj.morgue = null;
          } else if (item.productid == 12 && obj.ashes !== null) {
            console.log("setashes");
            this.$set(item, "lineName", obj.ashes.names);
            obj.ashes = null;
          }
        }

        // 如果 end 是 true，则添加到 array2 中
        array2.push(item);
        // 并返回 false，表示要从原始数组中剔除这个子项
        return false;
      });
      return {
        filteredArray, // 返回过滤后的数组
        array2, // 返回包含 end 为 true 的子项的新数组
      };
    },
    getOut(type) {
      if (type == 1) {
        this.$router.push({
          path: "/operation/cineraryOrders",
        });
      } else {
        this.$router.push({
          path: "/operation/freezerOrders",
        });
      }
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作Success",
        type: "success",
      });
      row.status = status;
    },

    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        status: "published",
        type: "",
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
          this.temp.author = "vue-element-admin";
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Created Successfully",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      let tempArray = [];
      this.service.forEach((item) => {
        if (item.selected) {
          let tempObj = {
            productid: item.productid,
            names: item.names,
            price: item.price,
            subsidyPrice: item.subsidy,
            count: item.count,
            overTime: item.overTime,
            subsidy: item.subsidy == "" ? false : true,
          };
          if (item.productid == 4) {
            tempObj.lineId = this.Freezer;
          } else if (item.productid == 5) {
            tempObj.lineId = this.auditorium;
          } else if (item.productid == 12) {
            tempObj.lineId = this.blockid;
          }
          tempArray.push(tempObj);
        }
      });
      console.log("tempArray", tempArray);
      const data = {
        finalOrderNo: this.finalObj.orderno,
        productDtos: tempArray,
      };
      updatefinalOrder(data, "put").then((response) => {
        console.log("response", response);
        this.dialogFormVisible = false;
        this.$message({
          message: "操作成功！",
          type: "success",
        });
        this.$router.push({
          path: "/departed/serviceFinal/" + this.finalObj.orderno,
        });
      });
    },
    chcheData() {
      let tempArray = [];
      this.service.forEach((item) => {
        if (item.selected) {
          let tempObj = {
            productid: item.productid,
            names: item.names,
            price: item.price,
            subsidyPrice: item.subsidy,
            count: item.count,
            overTime: item.overTime,
            subsidy: item.subsidy == "" ? false : true,
          };
          if (item.productid == 4) {
            tempObj.lineId = this.Freezer;
          } else if (item.productid == 5) {
            tempObj.lineId = this.auditorium;
          } else if (item.productid == 12) {
            tempObj.lineId = this.blockid;
          }
          tempArray.push(tempObj);
        }
      });
      console.log("tempArray", tempArray);
      const data = {
        finalOrderNo: this.finalObj.orderno,
        productDtos: tempArray,
      };
      cacheService(data).then((response) => {
        console.log("response", response);
        this.dialogFormVisible = false;
        this.$message({
          message: "操作成功！",
          type: "success",
        });
        this.$router.push({
          path: "/departed/index",
        });
      });
    },
    getChcheData() {
      getCacheService(this.finalObj.orderno).then((response) => {
        let tempArray = JSON.parse(response.result).productDtos;
        tempArray.forEach((item) => {
          const item2 = this.service.find(
            (item2) => item.productid == item2.productid
          );
          if (item2) {
            item2.count = item.count;
            item2.end = item.end;
            item2.lineId = item.lineId;
            item2.names = item.names;
            item2.overTime = item.overTime;
            item2.price = item.price;
            item2.subsidy = item.subsidyPrice;
            item2.subsidyPrice = item.subsidyPrice;
            item2.total = item.total;
            item2.selected = true;
            item2.count = item.count;
          }
        });
      });
    },
    handleDelete(row, index) {
      this.$notify({
        title: "Success",
        message: "Delete Successfully",
        type: "success",
        duration: 2000,
      });
      this.list.splice(index, 1);
    },
    handleRegister(row) {
      this.finalObj = row;
      this.temp = Object.assign({}, row);
      //获取 接运列表
      getProductionFiler({ type: 0 }).then((response) => {
        const templist = JSON.parse(response.result).rows;
        templist.forEach((item) => {
          item.selected = false;
          item.overTime = false;
          item.count = 0;
        });
        this.service = templist;
        // this.dialogFormVisible = true;
      });
    },
    handleCheckedChange(row) {
      if (row.selected) {
        row.count = 1;
      } else {
        row.count = 0;
      }
    },
    handleLine(row) {
      if (row.categoryid == 2) {
        let tempObj = {
          productId: row.productid,
          orderNo: this.finalObj.orderno,
        };
        console.log("tempObj", tempObj);
        updateLine(tempObj).then((response) => {
          //   this.$set(row, "lineNum", JSON.parse(response.result));
          console.log(row.productid);
          if (row.productid == 2) {
            this.buryNum1 = JSON.parse(response.result);
          } else {
            this.buryNum2 = JSON.parse(response.result);
          }
        });
      } else if (row.categoryid == 3 && row.productid == 4) {
        this.temp = row;

        getFreezersEmpty().then((response) => {
          this.templist = JSON.parse(response.result).rows;
          this.dialogFormVisibleFreezer = true;
        });
      } else if (row.categoryid == 3 && row.productid == 5) {
        this.temp = row;
        this.dialogFormVisibleAudi = true;
      } else {
        //12 存放柜
        this.temp = row;
        getCinerarysEmpty().then((response) => {
          this.templist = JSON.parse(response.result).rows;
          this.dialogFormVisibleBlock = true;
        });
      }
    },
    updateFreezer() {
      let tempObj = {
        productId: this.temp.productid,
        orderNo: this.finalObj.orderno,
        lineId: this.Freezer,
        startTime: this.startTime,
        endTime: this.endTime,
      };
      console.log("tempObj", tempObj);
      updateLine(tempObj).then((response) => {
        this.FreezerNum = JSON.parse(response.result);
        this.dialogFormVisibleFreezer = false;
        this.$message({
          message: "操作成功！",
          type: "success",
        });
      });
    },
    updateAuditorium() {
      let tempObj = {
        productId: this.temp.productid,
        orderNo: this.finalObj.orderno,
        lineId: this.auditorium,
      };
      console.log("tempObj", tempObj);
      updateLine(tempObj).then((response) => {
        this.auditoriumNum = JSON.parse(response.result);
        this.dialogFormVisibleAudi = false;
        this.$message({
          message: "操作成功！",
          type: "success",
        });
      });
    },
    updateBlock() {
      let tempObj = {
        productId: this.temp.productid,
        orderNo: this.finalObj.orderno,
        lineId: this.blockid,
        startTime: this.startTime,
        endTime: this.endTime,
      };
      console.log("tempObj", tempObj);
      updateLine(tempObj).then((response) => {
        this.blockNum1 = JSON.parse(response.result);

        this.dialogFormVisibleBlock = false;

        this.$message({
          message: "操作成功！",
          type: "success",
        });
      });
    },
  },
};
</script>

<style scoped lang="scss">
.el-dialog__body .el-form-item {
  display: inline-block;
  width: 50%;
}
.el-input {
  width: 80%;
}
.el-dialog {
  width: 60%;
}
.center {
  display: inline-block;
  width: auto;
  margin: 0 auto;
  div {
    margin: 10px 0;
    width: 100%;
  }
}
.float-right-button {
  margin: 20px;
}
</style>