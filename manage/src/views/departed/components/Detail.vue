<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <h3>逝者信息</h3>
      <el-form-item label="逝者姓名*">
        <el-input v-model="form.defunctVo.realName" />
      </el-form-item>
      <el-form-item label="证件类型*">
        <el-select v-model="form.defunctVo.cardType" placeholder="请选择">
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
        <el-input v-model="form.defunctVo.idNumber" />
      </el-form-item>
      <el-form-item label="出生日期">
        <el-date-picker
          v-model="form.defunctVo.birthday"
          type="date"
          format="yyyy-MM-dd"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="年龄">
        <el-input type="number" v-model="form.defunctVo.age" />
      </el-form-item>
      <el-form-item label="性别">
        <el-select placeholder="请选择" v-model="form.defunctVo.gender">
          <el-option label="男" value="1" />
          <el-option label="女" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="民族">
        <el-input v-model="form.defunctVo.group" />
      </el-form-item>
      <el-form-item label="证件地址">
        <el-input v-model="form.defunctVo.permanentResidenceAddress" />
      </el-form-item>
      <el-form-item label="户籍地址">
        <el-input v-model="form.defunctVo.address" />
      </el-form-item>
      <el-form-item label="逝者类型">
        <el-select v-model="form.defunctVo.deathCause" placeholder="请选择">
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
        <el-input v-model="form.defunctVo.deathAddress" />
      </el-form-item>
      <el-form-item label="死亡日期">
        <el-date-picker
          v-model="form.defunctVo.deathTime"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="证件照片" style="margin-bottom: 30px">
        <Upload @uploadSuccess="getFileId" />
        <img :src="deImageUrl" alt="" class="imgLimit" />
      </el-form-item>
      <h3>家属信息</h3>
      <el-form-item label="家属姓名*">
        <el-input v-model="form.defunctFaVo.names" />
      </el-form-item>
      <el-form-item label="证件类型*">
        <el-select v-model="form.defunctFaVo.cardType" placeholder="请选择">
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
        <el-input v-model="form.defunctFaVo.idNumber" />
      </el-form-item>

      <el-form-item label="与逝者关系">
        <el-input v-model="form.defunctFaVo.relationships" />
      </el-form-item>
      <el-form-item label="联系方式*">
        <el-input v-model="form.defunctFaVo.phone" />
      </el-form-item>
      <el-form-item label="证件照片" style="margin-bottom: 30px">
        <Upload @uploadSuccess="getFileIdFa" />
        <img :src="faImageUrl" alt="" class="imgLimit" />
      </el-form-item>
      <h3>代办人</h3>
      <el-form-item label="代办人姓名">
        <el-input v-model="form.agentInfo.names" />
      </el-form-item>
      <el-form-item label="证件类型">
        <el-select v-model="form.agentInfo.cardType" placeholder="请选择">
          <el-option
            v-for="item in idType"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="证件号码">
        <el-input v-model="form.agentInfo.idNumber" />
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="form.agentInfo.phone" />
      </el-form-item>
      <h3>证明材料</h3>
      <el-form-item label="死亡证明" style="margin-bottom: 30px">
        <Upload @uploadSuccess="getFileIdDeathCer" />
        <img :src="deathCertificatePic" alt="" class="imgLimit" />
      </el-form-item>
      <el-form-item label="火化证明" style="margin-bottom: 30px">
        <Upload @uploadSuccess="getFileIdCremation" />
        <img :src="cremationPic" alt="" class="imgLimit" />
      </el-form-item>

      <h3>骨灰流向</h3>
      <el-form-item style="width: 50%">
        <el-radio-group v-model="radio">
          <el-radio :label="3">公墓</el-radio>
          <el-radio :label="6">生态墓</el-radio>
          <el-radio :label="9">骨灰暂存</el-radio>
          <el-radio :label="10">村级集中点</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="公墓" v-if="radio == 3">
        <el-select placeholder="请选择" v-model="cemetery">
          <el-option
            v-for="item in cemeteryList"
            :key="item.id"
            :label="item.cemeteryName"
            :value="item.cemeteryName"
          />
        </el-select>
      </el-form-item>

      <hr />
      <el-form-item class="btnLine">
        <el-button type="primary" size="mini" @click="update"> 提交 </el-button>
        <router-link to="/departed/index">
          <el-button size="mini"> 返回 </el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getPeopleDetail, updatePeopleDetail } from "@/api/people";
import { getCemeterys } from "@/api/cemetery";
import Upload from "@/components/Upload/SingleImage3";

export default {
  name: "Detail",
  components: {
    Upload,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        defunctVo: {
          age: 0,
          birthday: "",
          realName: "",
          cardType: "",
          idNumber: "",
          gender: "0",
          parlorid: 1,
          deathTime: "",
          deathAddress: "",
          deathCause: "",
          permanentResidenceAddress: "",
          address: "",
          group: "",
          boneash_record: "",
          boneash_record_pic: "",
          infoMark: "",
          idCards: "",
          rescue: 0,
          residenceBooklet: "",
          deathCertificate: "",
        },
        agentInfo: {
          names: "",
          cardType: "",
          idNumber: "",
          phone: "",
        },
        defunctFaVo: {
          userid: 0,
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
      tempobj: {},
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
      cemeteryList: [],
      cemetery: "",
      temp: {},
      picid: 0,
      deadType: ["在家自然死亡", "医院自然死亡", "公安介入", "遗体运回"],
      id: "",
      tempRoute: {},
      deImageUrl: "", //逝者证件
      faImageUrl: "", //家属证件
      deathCertificatePic: "", //死亡证明
      cremationPic: "", //火化证明
      radio: 3,
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
    getFileId(order) {
      this.form.defunctVo.idCards = order;
      this.deImageUrl = "";
    },
    getFileIdFa(order) {
      this.form.defunctFaVo.idCards = order;
      this.faImageUrl = "";
    },
    getFileIdDeathCer(order) {
      this.form.defunctVo.deathCertificate = order;
      this.deathCertificatePic = "";
    },
    getFileIdCremation(order) {
      this.form.defunctVo.cremation = order;
      this.cremationPic = "";
    },
    onCancel() {
      this.$message({
        message: "cancel!",
        type: "warning",
      });
    },
    fetchData(id) {
      getCemeterys().then((response) => {
        this.cemeteryList = JSON.parse(response.result);
      });
      getPeopleDetail(id)
        .then((response) => {
          this.tempobj = JSON.parse(response.result);

          this.form = {
            defunctVo: {
              id: this.tempobj.id,
              age: this.tempobj.age,
              birthday: this.tempobj.birthTime,
              realName: this.tempobj.realName,
              cardType: this.tempobj.cardType,
              idNumber: this.tempobj.idNumber,
              gender: this.tempobj.gender,
              parlorid: 1,
              deathTime: this.tempobj.deathTime,
              deathAddress: this.tempobj.deathAddress,
              deathCause: this.tempobj.death_cause,
              permanentResidenceAddress: this.tempobj.permanentResidenceAddress,
              address: this.tempobj.address,
              group: this.tempobj.group,
              boneash_record: this.tempobj.boneash_record,
              boneash_record_pic: this.tempobj.boneashRecord.picurls,
              infoMark: this.tempobj.infoMark,
              idCards: this.tempobj.id_cards,
              residenceBooklet: this.tempobj.residence_booklet,
              deathCertificate: this.tempobj.death_certificate,
              cremation: this.tempobj.cremation,
              defunct_boneash_record: this.tempobj.boneashRecord.description,
              defunct_boneash_record_pic: this.tempobj.boneash_record,
            },
            defunctFaVo: {
              familyid: undefined,
              cardType: "",
              names: "",
              idCards: "",
              idNumber: "",
              idCardAddress: "",
              relationships: "",
              phone: "",
            },
            agentInfo: {
              familyid: undefined,
              names: "",
              cardType: "",
              idNumber: "",
              phone: "",
            },
          };
          if (this.tempobj.family) {
            this.form.defunctFaVo = this.tempobj.family;
          }
          if (this.tempobj.boneash) {
            let arr = this.tempobj.boneash.split("_");
            console.log("arr", arr);
            this.radio = Number(arr[0]);
            this.cemetery = arr[1];
          }
          if (this.tempobj.agent) {
            this.form.agentInfo = {
              id: this.tempobj.id,
              names: this.tempobj.agent.names,
              familyid: this.tempobj.agent.familyid,
              cardType: this.tempobj.agent.cardType,
              idNumber: this.tempobj.agent.idNumber,
              phone: this.tempobj.agent.phone,
            };
          }
          this.deImageUrl = this.tempobj.idCardPic
            ? this.tempobj.idCardPic[0]
            : "";
          this.faImageUrl = this.tempobj.family.picUrl
            ? this.tempobj.family.picUrl[0]
            : "";
          this.deathCertificatePic = this.tempobj.deathCertificatePic
            ? this.tempobj.deathCertificatePic[0]
            : "";
          this.cremationPic = this.tempobj.cremationPic
            ? this.tempobj.cremationPic[0]
            : "";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    update() {
      if (this.radio == 3) {
        this.form.defunctVo.boneash_record = this.radio + "_" + this.cemetery;
      } else {
        this.form.defunctVo.boneash_record = this.radio + "_ ";
      }
      //代办人校验
      if (this.form.agentInfo != undefined) {
        if (
          !this.form.agentInfo.names &&
          !this.form.agentInfo.cardType &&
          !this.form.agentInfo.idNumber &&
          !this.form.agentInfo.phone
        ) {
          this.form2 = this.deleteProperty(this.form, "agentInfo"); //删除后渲染出现问题
        } else {
          this.form2 = this.form;
        }
      } else {
        this.form2 = this.form;
      }
      //逝者检验
      if (
        !this.form2.defunctVo.realName ||
        !this.form2.defunctVo.cardType ||
        !this.form2.defunctVo.idNumber ||
        (this.form2.defunctVo.cardType == "内地居民身份证" &&
          !this.checkPsidno(this.form2.defunctVo.idNumber))
      ) {
        this.$message({
          message:
            "逝者信息不完整,逝者姓名、证件类型、证件号码为必填项，或者证件号码格式错误",
          type: "warning",
        });
        return;
      }

      //家属检验
      if (
        !this.form2.defunctFaVo.names ||
        !this.form2.defunctFaVo.cardType ||
        !this.form2.defunctFaVo.phone ||
        (this.form2.defunctFaVo.cardType == "内地居民身份证" &&
          !this.checkPsidno(this.form2.defunctFaVo.idNumber))
      ) {
        this.$message({
          message:
            "家属信息不完整,姓名、证件类型、证件号码,联系方式为必填项，或者证件号码格式错误",
          type: "warning",
        });
        return;
      }

      updatePeopleDetail(this.form2).then((response) => {
        console.log("response", response);
        this.$message({
          message: "操作成功",
          type: "success",
        });
        this.$router.push({
          path: "/departed/index",
        });
      });
    },
    deleteProperty(obj, prop) {
      let { [prop]: _, ...newObj } = obj;
      return newObj;
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
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
.imgLimit {
  width: 100px;
  margin-left: 20px;
}
.btnLine {
  width: 100%;

  margin-top: 20px;
  button {
    float: right;
    margin: 10px;
  }
}
</style>

