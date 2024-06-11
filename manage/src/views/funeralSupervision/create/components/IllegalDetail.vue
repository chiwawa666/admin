<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="事项">
        <el-input v-model="form.content" />
      </el-form-item>
      <el-form-item label="经办人">
        <el-input v-model="form.people" />
      </el-form-item>
      <el-form-item label="属地">
        <el-select v-model="form.address" placeholder="please select your zone">
          <el-option
            v-for="(item, index) in address"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="监管部门">
        <el-select
          v-model="form.department"
          placeholder="please select your zone"
        >
          <el-option
            v-for="(item, index) in org"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="处置时间">
        <!-- <el-col :span="11"> -->
        <!-- <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="Pick a date"
            style="width: 100%"
          />
        </el-col>
        <el-col :span="2" class="line">-</el-col> -->
        <el-col :span="11">
          <el-date-picker
            v-model="form.time"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="Select date and time"
          />
        </el-col>
      </el-form-item>

      <el-form-item label="处置结果">
        <el-input v-model="form.result" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { illegalListDetail } from '@/api/funeralSupervision'

export default {
  name: 'IllegalDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        people: '',
        address: '',
        content: '',
        department: '',
        date: '',
        time: '',
        // time: "10:10:10",
        result: ''
      },
      address: [
        '繁昌区-孙村镇-水口村',
        '繁昌区-繁阳镇-团阳社区',
        '繁昌区-繁阳镇-新光社区',
        '繁昌区-繁阳镇-安定社区',
        '繁昌区-平铺镇-五华村',
        '繁昌区-平铺镇-寒塘村',
        '繁昌区-荻港镇-桃冲村',
        '繁昌区-荻港镇-鹊江村'
      ],
      org: [
        '发展和改革委员会',
        '教育局',
        '科学技术局',
        '民族事务委员会',
        '公安局',
        '监察局',
        '民政局',
        '司法局',
        '财政局',
        '人事局',
        '劳动和社会保障局',
        '国土资源和房产管理局',
        '建设委员会',
        '交通局',
        '农业委员会',
        '水利局',
        '林业局',
        '商务局',
        '文化局',
        '卫生局',
        '人口和计划生育委员会',
        '审计局',
        '环境保护局',
        '物价局',
        '城市规划局',
        '城市管理行政执法局',
        '外事办公室'
      ],
      id: '',
      tempRoute: {}
    }
  },
  created() {
    console.log(this.isEdit)
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    fetchData(id) {
      illegalListDetail(id)
        .then((response) => {
          this.postForm = response.data
          this.form = response.data
          const temp = response.data.time.split(' ')
          // this.form.date = temp[0];
          // this.form.time = temp[1];
          console.log(this.form.time)
          // just for test
          // this.postForm.title += `   Article Id:${this.postForm.id}`;
          // this.postForm.content_short += `   Article Id:${this.postForm.id}`;

          // set tagsview title
          // this.setTagsViewTitle();

          // set page title
          // this.setPageTitle();
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

