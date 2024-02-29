<template>
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
    <el-form-item label="共享数据1" >
      <el-input v-model="formInline.user" placeholder="Approved by" clearable  @change="handleUserChange"/>
    </el-form-item>
    <el-form-item label="共享数据2" >
      <el-select
        v-model="formInline.region"
        placeholder="Activity zone"
        clearable
        @change="handleLocalDataChange"
      >
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script  setup>
import { inject, reactive, onMounted } from 'vue';

// 使用 inject 获取 DataNexus 提供的方法
const dataNexus = inject('dataNexus');
const formInline = reactive({
  user: '',
  region: '',
});

onMounted(() => {
  dataNexus.subscribeToDataChange('ChildComponent', 'user', userDataUpdated);
  dataNexus.subscribeToDataChange('ChildComponent', 'region', regionDataUpdated);
});


const handleUserChange = (newValue) => {
  dataNexus.updateSharedData('ChildComponent', 'user', newValue);
  console.log(dataNexus);
  dataNexus.sharedData.myPlugin.doSomething();//第三方扩展函数
};
const handleLocalDataChange = (newValue) => {
  dataNexus.updateSharedData('ChildComponent', 'region', newValue);
};

function userDataUpdated(newValue) {
  formInline.user = newValue;
}

function regionDataUpdated(newValue) {
  formInline.region = newValue;
}
</script>

<style>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>
