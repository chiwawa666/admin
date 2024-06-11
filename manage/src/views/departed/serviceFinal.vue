<template>
  <div class="app-container">
    <div id="printBox">
      <div class="info">
        <div>逝者姓名：{{ finalObj.defunctName }}</div>
        <div>订单编号：{{ finalObj.orderno }}</div>
      </div>
      <h3 v-if="finishedProduct.length > 0">已缴费清单</h3>
      <table v-if="finishedProduct.length > 0">
        <thead>
          <tr>
            <th>服务<br />项目</th>
            <th>是否<br />加班</th>
            <th>是否<br />补贴</th>
            <th>价格</th>
            <th>价格<br />单位</th>
            <th>数量</th>
            <th>金额</th>
            <th>补贴<br />金额</th>
            <th>实收<br />金额</th>
            <th>排号</th>
            <th>经办人<br />签名</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in finishedProduct" :key="index">
            <td>{{ item.names }}</td>
            <td>{{ item.overTime | Strfilter }}</td>
            <td>{{ item.subsidy | salvage }}</td>
            <td>{{ item.price }}</td>
            <td>{{ item.priceUnit }}</td>
            <td>{{ item.count }}</td>
            <td>{{ Number(item.price) * Number(item.count) }}</td>
            <td>{{ Number(item.subsidyPrice) }}</td>
            <td>
              {{ (Number(item.total) - Number(item.subsidyPrice)) | overzero }}
            </td>
            <td>{{ item.lineName }}</td>
            <td></td>
          </tr>
          <tr>
            <td>合计</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>{{ finishedProduct | totalPrice }}</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <h3 v-if="service.length > 0">未缴费清单</h3>
      <table v-if="service.length > 0">
        <thead>
          <tr>
            <th>服务<br />项目</th>
            <th>是否<br />加班</th>
            <th>是否<br />补贴</th>
            <th>价格</th>
            <th>价格<br />单位</th>
            <th>数量</th>
            <th>金额</th>
            <th>补贴<br />金额</th>
            <th>实收<br />金额</th>
            <th>排号</th>
            <th>经办人<br />签名</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in service" :key="index">
            <td>{{ item.names }}</td>
            <td>{{ item.overTime | Strfilter }}</td>
            <td>{{ item.subsidy | salvage }}</td>
            <td>{{ item.price }}</td>
            <td>{{ item.priceUnit }}</td>
            <td>{{ item.count }}</td>
            <td>{{ Number(item.price) * Number(item.count) }}</td>
            <td>{{ Number(item.subsidyPrice) }}</td>
            <td>
              {{ (Number(item.total) - Number(item.subsidyPrice)) | overzero }}
            </td>
            <!-- <td>{{ item.productid | productidFilter }}</td> -->
            <td>{{ item.line }}</td>
            <td></td>
          </tr>
          <tr>
            <td>合计</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>{{ service | totalPrice }}</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="filter-container btnCenter">
      <el-button type="primary" size="large" @click="print"> 打印 </el-button>
      <el-button
        type="primary"
        size="large"
        @click="pay"
        v-if="service.length > 0"
      >
        完成缴费
      </el-button>
      <el-button type="" size="large" @click="updateData"> 返回 </el-button>
    </div>
    <div class="filter-container btnCenter finish"></div>
  </div>
</template>

<script>
import print from "print-js";
import { getFinalOrder, getFinalInfo } from "@/api/people";
import {
  getProduction,
  updatefinalOrder,
  updateLine,
  getFreezersEmpty,
  getCinerarysEmpty,
  pay,
} from "@/api/funeral";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

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
      if (val == 0) {
        return "否";
      } else {
        return "是";
      }
    },
    Strfilter(val) {
      if (val) {
        return "是";
      } else {
        return "否";
      }
    },
    totalPrice(list) {
      return list.reduce((pre, cur) => {
        let cal =
          Number(cur.total) - Number(cur.subsidyPrice) > 0
            ? Number(cur.total) - Number(cur.subsidyPrice)
            : 0;
        return pre + cal;
      }, 0);
    },
    overzero(val) {
      return val >= 0 ? val : 0;
    },
    productidFilter(val) {
      let obj = that.finalObj;
      // console.log(typeof obj.fire);
      for (let key in obj) {
        // 确保该键是对象自身的属性，而不是原型链上的属性
        if (typeof obj[key] == "object" && obj[key] !== null) {
          // 检查当前属性的proid是否等于传入的id
          // console.log(typeof obj[key]);
          // console.log("key", key);
          if (obj[key].productId === val) {
            // 如果找到匹配的proid，返回对应的workTime
            return obj[key].workTime;
          }
        }
      }

      return "";
      // if (val == 2 || 3) {
      //   return that.finalObj.fire.workTime;
      // } else if (val == 4) {
      //   return that.finalObj.freezer.workTime;
      // } else if (val == 5) {
      //   return that.auditoriumNum;
      // } else if (val == 12) {
      //   return that.blockNum1;
      // } else {
      //   return "";
      // }
    },
  },
  data() {
    return {
      fff: {},
      tableKey: 0,
      list: [],
      total: 0,
      id: "",
      finalObj: {},
      finishedProduct: [],
      listLoading: true,
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
      finalObj: [],
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
      startTime: "",
      endTime: "",
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
  created() {
    this.getList();
    that = this;
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.id = this.$route.params && this.$route.params.id;
      console.log(typeof this.id);

      if (this.id.length > 10) {
        getFinalOrder(this.id).then((response) => {
          const result = JSON.parse(response.result);
          console.log("getFinalOrderresult", result);
          let tempdata = this.filterArrayByEnd(result);
          result.product = tempdata.filteredArray;
          this.finishedProduct = tempdata.array2;
          // console.log("result", result);
          if (result.ashes !== null) {
            this.blockNum1 = result.ashes.names;
          }
          if (result.fire !== null) {
            if (result.fire.productId == 2) {
              this.buryNum1 = result.fire.number;
            } else {
              this.buryNum2 = result.fire.number;
            }
          }
          if (result.freezer !== null) {
            this.FreezerNum = result.freezer.names;
            this.freezerState = result.freezer.state;
          }
          if (result.morgue !== null) {
            this.auditoriumNum = result.morgue.number;
            this.morgueState = result.morgue.state;
          }

          this.finalObj = result;
          // this.finalObj = result;
          setTimeout(() => {
            this.listLoading = false;
          }, 1.5 * 100);
        });
      } else {
        getFinalInfo(this.id).then((response) => {
          const result = JSON.parse(response.result);
          this.fff = result;
          console.log("result", result);
          let tempdata = this.filterArrayByEnd(result);
          result.product = tempdata.filteredArray;
          this.finishedProduct = tempdata.array2;
          // console.log("result", result);
          if (result.ashes !== null) {
            this.blockNum1 = result.ashes.names;
          }
          if (result.fire !== null) {
            if (result.fire.productId == 2) {
              this.buryNum1 = result.fire.number;
            } else {
              this.buryNum2 = result.fire.number;
            }
          }
          if (result.freezer !== null) {
            this.FreezerNum = result.freezer.names;
            this.freezerState = result.freezer.state;
          }
          if (result.morgue !== null) {
            this.auditoriumNum = result.morgue.number;
            this.morgueState = result.morgue.state;
          }

          this.finalObj = result;
          // this.finalObj = result;
          setTimeout(() => {
            this.listLoading = false;
          }, 1.5 * 100);
        });
      }

      getProduction({
        page: 1,
        rows: 100,
      }).then((response) => {
        const templist = JSON.parse(response.result).rows;
        templist.forEach((item) => {
          item.selected = false;
          item.overTime = false;
          item.count = 0;
        });
        this.service = templist;
        //替换or 增加没有的值，方便后面去解构提交
        this.service.forEach((item) => {
          this.finalObj.product.forEach((item2) => {
            if (item.names == item2.names) {
              item.selected = true;
              item.count = item2.count;
              item.lineId = item2.lineId;
              item.overTime = item2.overTime;
              item.price = item2.price;
              item.subsidy = item2.subsidyPrice;
              item.subsidyPrice = item2.subsidyPrice;
              item.total = item2.total;
            }
          });
        });
        let temparr = [];
        this.service.forEach((item) => {
          if (item.selected) {
            temparr.push(item);
          }
        });

        // 根据详情接口，在service数组里面增加对应的排号
        if (this.blockNum1) {
          const targetObject = this.service.find(
            (item) => item.productid === 12
          );
          targetObject.line = this.blockNum1;
        }
        if (this.buryNum1) {
          const targetObject = this.service.find(
            (item) => item.productid === 2
          );
          targetObject.line = this.buryNum1;
        }
        if (this.buryNum2) {
          const targetObject = this.service.find(
            (item) => item.productid === 3
          );
          targetObject.line = this.buryNum2;
        }
        if (this.FreezerNum) {
          const targetObject = this.service.find(
            (item) => item.productid === 4
          );
          targetObject.line = this.FreezerNum;
        }
        if (this.auditoriumNum) {
          const targetObject = this.service.find(
            (item) => item.productid === 5
          );
          targetObject.line = this.auditoriumNum;
        }

        console.log("temparr");
        this.service = temparr;
        this.dialogFormVisible = true;
      });
    },
    filterArrayByEnd(obj) {
      let array = obj.product;
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
      // let tempArray = [];
      // this.service.forEach((item) => {
      //   if (item.selected) {
      //     let tempObj = {
      //       productid: item.productid,
      //       names: item.names,
      //       price: item.price,
      //       subsidyPrice: item.subsidy,
      //       count: item.count,
      //       overTime: item.overTime,
      //       subsidy: item.subsidy == "" ? false : true,
      //     };
      //     if (item.productid == 4) {
      //       tempObj.lineId = this.Freezer;
      //     } else if (item.productid == 5) {
      //       tempObj.lineId = this.auditorium;
      //     } else if (item.productid == 12) {
      //       tempObj.lineId = this.blockid;
      //     }
      //     tempArray.push(tempObj);
      //   }
      // });
      // console.log("tempArray", tempArray);
      // const data = {
      //   finalOrderNo: this.finalObj.orderno,
      //   productDtos: tempArray,
      // };
      // updatefinalOrder(data, "put").then((response) => {
      //   console.log("response", response);
      //   this.dialogFormVisible = false;
      //   this.$message({
      //     message: "操作成功！",
      //     type: "success",
      //   });
      this.$router.push({ path: "/departed/index" });
      // });
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
      getProduction({ categoryId: "1" }).then((response) => {
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
    print() {
      const style =
        "@page {margin:10mm 10mm;   } " +
        "@media print {.print_table{width: 100%;}}";
      printJS({
        printable: "printBox", // 标签元素id
        type: "html",
        header: "",
        targetStyles: ["*"],
        styles: style,
      });
    },
    pay() {
      pay({
        finalOrderNo: this.finalObj.orderno,
      }).then(() => {
        this.$message({
          message: "操作成功！",
          type: "success",
        });
        this.$router.push({ path: "/departed/index" });
      });
    },
    // this.$print(this.$refs.print);
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
.btnCenter {
  text-align: center;
  margin: 20px;
}
.finish {
  margin-top: 200px;
}
table {
  border-collapse: collapse;
  border: 1px solid rgb(205, 190, 190);
  width: 100%;
  tr {
    width: 100%;
  }
  th,
  td {
    width: auto;
    border: 1px solid rgb(205, 190, 190);
    text-align: center;
    height: 30px;
  }
}
.info {
  margin-bottom: 20px;
}
thead {
  width: 100%;
  display: table-header-group; /* 这个属性使thead总是在新的page-break之后重新开始 */
}
</style>