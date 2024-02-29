<template>
  <data-nexus ref="dataNexusRef">
    <child-component></child-component>
  </data-nexus>
</template>

<script setup>
import DataNexus from "~/package/DataNexus/src/DataNexus.vue";
import ChildComponent from "./ChildComponent.vue";
import { registerPlugin } from "~/package/DataNexus-vue3/src/mainBusPluginSystem"
import LogDataPlugin from  "./logDataPlugin"
import { ref,onMounted } from 'vue';



const dataNexusRef = ref(null);

// 假设你想在组件挂载后调用 loadBindingsFromJSON
onMounted(() => {
  // console.log(dataNexusRef.value.loadBindingsFromJSON())
  dataNexusRef.value.loadBindingsFromJSON('/demo.json');
  // 注册插件
  registerPlugin('myPlugin', LogDataPlugin);
});
</script>

<style scoped>

</style>
