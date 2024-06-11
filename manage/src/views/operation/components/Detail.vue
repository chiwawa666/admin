<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <h3>逝者信息</h3>
      <el-form-item label="逝者姓名*">
        <el-input v-model="form.defunctUploadVo.defunctVo.realName" />
      </el-form-item>
      <el-form-item label="证件类型*">
        <el-select
          v-model="form.defunctUploadVo.defunctVo.cardType"
          placeholder="请选择"
        >
          <el-option
            v-for="item in idType"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="证件号码*">
        <el-input v-model="form.defunctUploadVo.defunctVo.idNumber" />
      </el-form-item>
      <el-form-item label="出生日期">
        <el-date-picker
          v-model="form.defunctUploadVo.defunctVo.birthday"
          type="date"
          format="yyyy-MM-dd"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="年龄">
        <el-input type="number" v-model="form.defunctUploadVo.defunctVo.age" />
      </el-form-item>
      <el-form-item label="性别">
        <el-select
          placeholder="请选择"
          v-model="form.defunctUploadVo.defunctVo.gender"
        >
          <el-option label="男" value="1" />
          <el-option label="女" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="民族">
        <el-input v-model="form.defunctUploadVo.defunctVo.group" />
      </el-form-item>
      <el-form-item label="证件地址">
        <el-input
          v-model="form.defunctUploadVo.defunctVo.permanentResidenceAddress"
        />
      </el-form-item>
      <el-form-item label="户籍地址">
        <el-input v-model="form.defunctUploadVo.defunctVo.address" />
      </el-form-item>
      <el-form-item label="逝者类型">
        <el-select
          v-model="form.defunctUploadVo.defunctVo.deathCause"
          placeholder="请选择"
        >
          <el-option
            v-for="item in deadType"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- upload 2 -->
      <el-form-item label="死亡地点">
        <el-input v-model="form.defunctUploadVo.defunctVo.deathAddress" />
      </el-form-item>
      <el-form-item label="死亡日期">
        <el-date-picker
          v-model="form.defunctUploadVo.defunctVo.deathDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="请选择"
        />
      </el-form-item>
      <h3>家属信息</h3>
      <el-form-item label="家属姓名*">
        <el-input v-model="form.defunctUploadVo.defunctFaVo.names" />
      </el-form-item>
      <el-form-item label="证件类型*">
        <el-select
          v-model="form.defunctUploadVo.defunctFaVo.cardType"
          placeholder="请选择"
        >
          <el-option
            v-for="item in idType"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="证件号码*">
        <el-input v-model="form.defunctUploadVo.defunctFaVo.idNumber" />
      </el-form-item>

      <el-form-item label="与逝者关系">
        <el-input v-model="form.defunctUploadVo.defunctFaVo.relationships" />
      </el-form-item>
      <el-form-item label="联系方式*">
        <el-input v-model="form.defunctUploadVo.defunctFaVo.phone" />
      </el-form-item>
      <!-- upload idCards-->
      <h3>预约信息</h3>
      <el-form-item label="接运时间*">
        <el-date-picker
          v-model="form.carTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="接运地点*">
        <el-input v-model="form.carAddress" />
      </el-form-item>
      <el-form-item label="门牌号*">
        <el-input v-model="form.carAddressDetail" />
      </el-form-item>

      <hr />
      <el-form-item>
        <el-button type="primary" size="mini" @click="updateAppointment">
          提交
        </el-button>
        <router-link to="/operation/index">
          <el-button size="mini"> 返回 </el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getProduction } from "@/api/funeral";
import { getAppointmentInfo, updateAppointment } from "@/api/appointment";

export default {
  name: "Detail",
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        defunctUploadVo: {
          defunctVo: {
            age: "",
            birthday: "",
            realName: "",
            cardType: "",
            idNumber: "",
            gender: "",
            parlorid: 1,
            deathAddress: "",
            deathCause: "",
            permanentResidenceAddress: "",
            address: "",
            group: "",
            infoMark: "电话预约",
            idCards: "",
            residenceBooklet: "",
            deathCertificate: "",
          },

          defunctFaVo: {
            familytype: 1,
            names: "",
            idCards: "",
            cardType: "",
            idNumber: "",
            idCardAddress: "",
            relationships: "",
            phone: "",
          },
        },
        parlorid: 1,
        carTime: "2024-04-19 08:00:00",
        carAddress: "",
        carAddressDetail: "",
        product: "1",
        srcType: 1,
      },
      idType: [
        "内地居民身份证",
        "香港居民身份证",
        "澳门居民身份证",
        "台湾居民身份证",
        "护照",
        "军官证",
        "士兵证",
        "其他有效国籍旅行证件",
        "其他",
      ],
      deadType: ["在家自然死亡", "医院自然死亡", "公安介入", "遗体运回"],
      production: [],
    };
  },
  created() {
    if (this.isEdit) {
      this.id = this.$route.params && this.$route.params.id;
      this.fetchData(this.id);
    }
    this.tempRoute = Object.assign({}, this.$route);
  },
  methods: {
    onSubmit() {
      this.$message("submit!");
    },
    onCancel() {
      this.$message({
        message: "cancel!",
        type: "warning",
      });
    },
    fetchData(id) {
      getAppointmentInfo(id)
        .then((response) => {
          console.log("res", JSON.parse(response.result));
          // this.postForm = response.data;
          this.form = response.data;
          // let temp = response.data.time.split(" ");
          // this.form.date = temp[0];
          // this.form.time = temp[1];
          // console.log(this.form.time);
          // just for test
          // this.postForm.title += `   Article Id:${this.postForm.id}`;
          // this.postForm.content_short += `   Article Id:${this.postForm.id}`;
          // set tagsview title
          // this.setTagsViewTitle();
          // set page title
          // this.setPageTitle();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    updateAppointment() {
      console.log(this.form);
      // return;
      if (
        this.form.defunctUploadVo.defunctVo.realName == "" ||
        this.form.defunctUploadVo.defunctVo.idNumber == "" ||
        this.form.defunctUploadVo.defunctVo.cardType == ""
      ) {
        this.$message({
          message: "逝者信息未完整！姓名、证件类型、证件号码不能为空",
          type: "warning",
        });
        return;
      } else if (
        this.form.defunctUploadVo.defunctFaVo.names == "" ||
        this.form.defunctUploadVo.defunctFaVo.idNumber == "" ||
        this.form.defunctUploadVo.defunctFaVo.cardType == "" ||
        this.form.defunctUploadVo.defunctFaVo.phone == ""
      ) {
        this.$message({
          message: "家属信息未完整！姓名、证件类型、证件号码、联系方式不能为空",
          type: "warning",
        });
      } else if (
        this.form.carTime == "" ||
        this.form.carAddress == "" ||
        this.form.carAddressDetail == ""
      ) {
        this.$message({
          message: "家属信息未完整！姓名、证件类型、证件号码、联系方式不能为空",
          type: "warning",
        });
      }
      if (
        !this.checkPsidno(this.form.defunctUploadVo.defunctFaVo.idNumber) ||
        !this.checkPsidno(this.form.defunctUploadVo.defunctVo.idNumber)
      ) {
        this.$message({
          message: "证件号码不合法",
          type: "warning",
        });
        return;
      }
      const method = this.isEdit ? "put" : "post";
      updateAppointment(this.form, method).then((response) => {
        console.log("response", response);
        this.$message({
          message: "操作成功！",
          type: "success",
        });
        this.$router.push({ path: "/operation/index" });
      });
    },

    /**
     * @description : 校验证件号码是否合规（18位、15位）
     * @param        {String|Number} value
     * @return       {Boolean} true-合规 false-不合规
     */
    checkPsidno(value) {
      const psidno = String(value);
      // 1.校验证件号码格式和长度
      const regPsidno =
        /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[X])$)$/;
      if (!regPsidno.test(psidno)) {
        return false;
      }
      // 2.校验前两位的省份编码是否正确
      const province = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外",
      };
      if (!province[Number(psidno.slice(0, 2))]) {
        return false;
      }
      // 3.校验出生日期
      if (psidno.length === 15) {
        // 15位号码 省（2位）市（2位）县（2位）年（2位）月（2位）日（2位）校验码（3位）
        const reg = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
        const arrSplit = psidno.match(reg);
        // 15位号码在年份前补 19 或 20
        const year =
          Number(arrSplit[2].charAt(0)) > 0
            ? "19" + arrSplit[2]
            : "20" + arrSplit[2];
        const month = arrSplit[3];
        const day = arrSplit[4];
        if (!validateBirthday(year, month, day)) {
          return false;
        }
      } else if (psidno.length === 18) {
        // 18位号码 省（2位）市（2位）县（2位）年（4位）月（2位）日（2位）校验码（4位）
        const reg = new RegExp(
          /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/
        );
        const arrSplit = psidno.match(reg);
        const year = arrSplit[2];
        const month = arrSplit[3];
        const day = arrSplit[4];
        if (!validateBirthday(year, month, day)) {
          return false;
        }
      } else {
        return false;
      }
      // 校验出生日期是否合理
      function validateBirthday(year, month, day) {
        year = Number(year); // 年
        month = Number(month); // 月
        day = Number(day); // 日
        const nowTime = new Date().getTime(); // 当前时间戳
        const birthTime = new Date(`${year}-${month}-${day}`).getTime(); // 获取出生日期的时间戳
        // 不能是明天出生的吧
        if (birthTime > nowTime) {
          return false;
        }
        // 一般人活不到150岁吧
        const nowYear = new Date().getFullYear();
        if (nowYear - year > 150) {
          return false;
        }
        // 不能是13月出生的吧
        if (month < 1 || month > 12) {
          return false;
        }
        // 不能是2月30号、4月31号、5月32号出生的吧
        const date = new Date(year, month, 0); // 获取当月的最后一天
        if (day < 1 || day > date.getDate()) {
          return false;
        }
        return true;
      }
      // 4.18位号码校验生成的校验码
      if (psidno.length === 18) {
        const Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; // 加权因子
        const parity = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"]; // 校验码
        let sum = 0;
        for (let i = 0; i < 17; i++) {
          sum += Number(psidno.charAt(i)) * Wi[i];
        }
        if (parity[sum % 11] !== psidno[17]) {
          return false;
        }
      }
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.line {
  text-align: center;
}
.el-form-item {
  display: inline-block;
  width: 25%;
  .el-select {
    width: 100%;
  }
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}

//@upload
.avatar-uploader {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>

