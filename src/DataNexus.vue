<template>
  <div>
    <slot></slot> <!-- 使用 slot 来插入子组件 -->
  </div>
</template>

<script>
  import { reactive, provide, onMounted, watch } from 'vue';
  export default {
    name: 'DataNexus',
    setup() {
      const sharedData = reactive({}); // 用于存储共享数据
      const updateCallbacks = reactive({});// 存储子组件的更新回调函数
      const sharedBindings = reactive({});// 用于存储数据项到共享数据源的绑定关系
      const plugins = reactive({});// 定义 plugins 对象

      // Define mainBusInstance
      let mainBusInstance = {
        sharedData,
        updateCallbacks,
        sharedBindings,
        plugins
        // Other properties or methods needed from mainBusPluginSystem.js
      };
      /**
       * 注册一个回调函数以响应指定数据的变化。
       * @param {String} componentName - 调用组件的名称。
       * @param {String} key - 监听的数据键。
       * @param {Function} callback - 当数据变化时将被调用的函数。
       */
      const subscribeToDataChange = (componentName, key, callback) => {
        if (!componentName) {
          console.error("Error: componentName must be provided for subscribeToDataChange.");
          return;
        }
        if (!callback || typeof callback !== 'function') {
          console.error("Invalid callback function");
          return;
        }
        const uniqueKey = `${componentName}_${key}`;
        if (updateCallbacks[uniqueKey]) {
          console.error(`Update callback for key '${uniqueKey}' already registered`);
          return;
        }
        updateCallbacks[uniqueKey] = callback;
        // 如果 sharedBindings 配置了 uniqueKey，设置观察者。
        if (sharedBindings[uniqueKey]) {
          // 设置一个观察者，用来观察特定绑定的变化。
          watch(() => sharedData[sharedBindings[uniqueKey]], callback, { immediate: false, deep: true });

          // 如果 sharedData 中已经有了当前值，立即使用当前值触发回调。
          if (Object.prototype.hasOwnProperty.call(sharedData, sharedBindings[uniqueKey])) {
            callback(sharedData[sharedBindings[uniqueKey]]);
          }
        } else {
          console.error(`未找到键 '${uniqueKey}' 的共享绑定`);
        }
      };
      /**
       * 更新共享数据并通知所有绑定的组件。
       * @param {String} componentName - 更新数据的组件名称。
       * @param {String} key - 更新的数据键。
       * @param {any} newValue - 新的数据值。
       */
      const updateSharedData = (componentName, key, newValue) => {
        const uniqueKey = `${componentName}_${key}`;
        let sharedKey;
        if (sharedBindings[uniqueKey]) {
          sharedKey = sharedBindings[uniqueKey];
          sharedData[sharedKey] = newValue;
        } else {
          sharedKey = key;
          sharedData[key] = newValue;
        }
        for (const itemKey in sharedBindings) {
          if (sharedBindings[itemKey] === sharedKey && updateCallbacks[itemKey]) {
            updateCallbacks[itemKey](newValue);
          }
        }
      };
      /**
       * 从JSON URL加载数据绑定配置。
       * @param {String} jsonURL - 配置文件的URL地址。
       */
      const loadBindingsFromJSON = async (jsonURL) => {
        try {
          const response = await fetch(jsonURL);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const contentType = response.headers.get('Content-Type');
          if (!contentType || !contentType.includes('application/json')) {
            console.error('Response Content-Type:', contentType); // 打印实际的 Content-Type
            throw new TypeError('Fetched data is not JSON!');
          }
          const data = await response.json();
          for (const componentName in data.components) {
            data.components[componentName].bindings.forEach(binding => {
              bindSharedData(componentName, binding.key, binding.target);
            });
          }
        } catch (error) {
          console.error("Error loading or parsing JSON:", error);
          // 可以考虑添加更多的错误信息，比如打印出 response 的内容等
        }
      };
      /**
       * 将组件的数据项绑定到共享数据源。      动态添加数据键的方法
       * @param {String} componentName - 组件名称。
       * @param {String} dataKey - 组件内部的数据键。
       * @param {String} sharedKey - 共享数据源的键。
       * @param {Boolean} isTwoWay - 是否为双向绑定。
       */
      const bindSharedData = (componentName, dataKey, sharedKey, isTwoWay) => {
        const uniqueKey = `${componentName}_${dataKey}`;
        sharedBindings[uniqueKey] = sharedKey;
        if (isTwoWay) {
          watch(() => sharedData[sharedKey], newValue => {
            for (const itemKey in sharedBindings) {
              if (sharedBindings[itemKey] === sharedKey && updateCallbacks[itemKey]) {
                updateCallbacks[itemKey](newValue);
              }
            }
          }, { immediate: true, deep: true });
        }
      };
      /**
       * 删除共享数据并通知所有绑定的组件。
       * @param {String} componentName - 更新数据的组件名称。
       * @param {String} dataKey - 更新的数据键。
       */
      const removeSharedDataKey = (componentName, dataKey) => {
        const uniqueKey = `${componentName}_${dataKey}`;
        if (sharedBindings[uniqueKey]) {
          const sharedKey = sharedBindings[uniqueKey];
          delete sharedBindings[uniqueKey];
          if (!Object.values(sharedBindings).includes(sharedKey)) {
            delete sharedData[sharedKey];
          }
        }
        if (updateCallbacks[uniqueKey]) {
          delete updateCallbacks[uniqueKey];
        }
      };
      /**
       * 获取共享数据。
       * @param {String} componentName - 更新数据的组件名称。
       * @param {String} dataKey - 更新的数据键。
       */
      const getSharedData = (componentName, dataKey) => {
        const uniqueKey = `${componentName}_${dataKey}`;
        if (sharedBindings[uniqueKey]) {
          const sharedKey = sharedBindings[uniqueKey];
          return sharedData[sharedKey];
        }
        return undefined;
      };
      /**
       * 注册插件。
       * @param {string} pluginName - 插件名称。
       * @param {object} plugin - 插件对象，必须包含一个名为 'install' 的方法。
       */
      const registerPlugin = (pluginName, plugin) => {
        if (!plugin.install || typeof plugin.install !== 'function') {
          console.error(`Plugin "${pluginName}" must include an 'install' method.`);
          return;
        }

        plugin.install(mainBusInstance, pluginName);
        console.log(`插件 ${pluginName} 安装成功.`);
      };

      provide('dataNexus', {
        sharedData,
        subscribeToDataChange,
        updateSharedData,
        loadBindingsFromJSON,
        bindSharedData,
        removeSharedDataKey,
        getSharedData,
        registerPlugin
      });

      onMounted(() => {
        mainBusInstance ={
          sharedData,
          subscribeToDataChange,
          updateSharedData,
          loadBindingsFromJSON,
          bindSharedData,
          removeSharedDataKey,
          getSharedData,
          registerPlugin
        };
      });

      return {
        sharedData,
        subscribeToDataChange,
        updateSharedData,
        loadBindingsFromJSON,
        bindSharedData,
        removeSharedDataKey,
        getSharedData,
        registerPlugin
      };
    },
  };
</script>

<style scoped>
</style>
