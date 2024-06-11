<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <h3>逝者信息</h3>
      <el-form-item label="逝者姓名">
        <el-input v-model="form.defunctUploadVo.defunctVo.realName" />
      </el-form-item>
      <el-form-item label="年龄">
        <el-input type="number" v-model="form.defunctUploadVo.defunctVo.age" />
      </el-form-item>
      <el-form-item label="出生日期">
        <el-date-picker
          v-model="form.defunctUploadVo.defunctVo.birthday"
          type="date"
          format="yyyy-MM-dd"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="证件类型">
        <el-input v-model="form.defunctUploadVo.defunctVo.cardType" />
      </el-form-item>
      <el-form-item label="证件号码">
        <el-input v-model="form.defunctUploadVo.defunctVo.idNumber" />
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
      <el-form-item label="死亡日期">
        <el-date-picker
          v-model="form.defunctUploadVo.defunctVo.deathTime"
          type="date"
          format="yyyy-MM-dd"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="死亡地点">
        <el-input v-model="form.defunctUploadVo.defunctVo.deathAddress" />
      </el-form-item>
      <el-form-item label="死亡原因">
        <el-input v-model="form.defunctUploadVo.defunctVo.deathCause" />
      </el-form-item>
      <el-form-item label="证件地址">
        <el-input
          v-model="form.defunctUploadVo.defunctVo.permanentResidenceAddress"
        />
      </el-form-item>
      <el-form-item label="详细地址">
        <el-input v-model="form.defunctUploadVo.defunctVo.address" />
      </el-form-item>
      <el-form-item label="民族">
        <el-input v-model="form.defunctUploadVo.defunctVo.group" />
      </el-form-item>
      <el-form-item label="骨灰意向">
        <el-input v-model="form.defunctUploadVo.defunctVo.boneash_record" />
      </el-form-item>
      <!-- upload  -->
      <el-form-item label="信息来源">
        <el-input v-model="form.defunctUploadVo.defunctVo.infoMark" />
      </el-form-item>
      <!-- upload 2 -->
      <el-form-item label="是否是救助对象">
        <el-select
          placeholder="请选择"
          v-model="form.defunctUploadVo.defunctVo.rescue"
        >
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </el-form-item>
      <!-- upload 2 -->
      <el-form-item label="死亡证明">
        <el-input v-model="form.defunctUploadVo.defunctVo.deathCertificate" />
      </el-form-item>

      <h3>代理人信息</h3>
      <el-form-item label="代办人姓名">
        <el-input v-model="form.defunctUploadVo.agentInfo.names" />
      </el-form-item>
      <el-form-item label="证件类型">
        <el-input v-model="form.defunctUploadVo.agentInfo.cardType" />
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input v-model="form.defunctUploadVo.agentInfo.idNumber" />
      </el-form-item>
      <el-form-item label="证件地址">
        <el-input v-model="form.defunctUploadVo.agentInfo.idCardAddress" />
      </el-form-item>
      <el-form-item label="与逝者关系">
        <el-input v-model="form.defunctUploadVo.agentInfo.relationships" />
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model="form.defunctUploadVo.agentInfo.phone" />
      </el-form-item>
      <!-- upload idCards-->

      <h3>家属信息</h3>
      <el-form-item label="家属姓名">
        <el-input v-model="form.defunctUploadVo.defunctFaVo.names" />
      </el-form-item>
      <el-form-item label="证件类型">
        <el-input v-model="form.defunctUploadVo.defunctFaVo.cardType" />
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input v-model="form.defunctUploadVo.defunctFaVo.idNumber" />
      </el-form-item>
      <el-form-item label="证件地址">
        <el-input v-model="form.defunctUploadVo.defunctFaVo.idCardAddress" />
      </el-form-item>
      <el-form-item label="与逝者关系">
        <el-input v-model="form.defunctUploadVo.defunctFaVo.relationships" />
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model="form.defunctUploadVo.defunctFaVo.phone" />
      </el-form-item>
      <!-- upload idCards-->
      <h3>预约信息</h3>
      <el-form-item label="接尸时间">
        <el-date-picker
          v-model="form.carTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="预约地址">
        <el-input v-model="form.carAddress" />
      </el-form-item>
      <el-form-item label="详细地址">
        <el-input v-model="form.carAddressDetail" />
      </el-form-item>
      <el-form-item label="产品选择">
        <el-select v-model="form.product" multiple placeholder="请选择">
          <el-option
            v-for="item in production"
            :key="item.productid"
            :label="item.names"
            :value="item.productid"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <hr />
      <el-form-item>
        <el-button type="primary" size="mini" @click="updateAppointment">
          提交
        </el-button>
        <router-link to="/funeral/index">
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
            age: 0,
            birthday: "1965-01-01",
            realName: "",
            cardType: "",
            idNumber: "",
            gender: 0,
            parlorid: 1,
            deathTime: "2024-04-19",
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
            familytype: 2,
            names: "",
            idCards: "",
            cardType: "",
            idNumber: "",
            idCardAddress: "",
            relationships: "",
            phone: "",
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
      production: [],
    };
  },
  created() {
    if (this.isEdit) {
      this.id = this.$route.params && this.$route.params.id;
      this.fetchData(this.id);
    }
    this.getProductionList();
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
    getProductionList() {
      getProduction().then((response) => {
        const result = JSON.parse(response.result);
        this.production = result.rows;
      });
    },
    updateAppointment() {
      console.log(this.form);
      // return;
      this.form.product = this.form.product.join(",");
      const method = this.isEdit ? "put" : "post";
      updateAppointment(this.form, method).then((response) => {
        console.log("response", response);
        this.$message({
          message: "操作成功！",
          type: "success",
        });
        this.$router.push({ path: "/funeral/index" });
      });
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

