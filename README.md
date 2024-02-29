# DataNexus

DataNexus Vue 组件介绍
DataNexus 是一个 Vue 3 组件，旨在提供中央状态管理和事件广播功能。它允许在 Vue 应用中的不同组件间共享数据，处理加载状态和错误信息，并支持数据项到共享数据源的动态绑定。

特性

共享数据管理：实现多个组件之间的数据共享。
动态加载状态和错误处理：支持从外部JSON文件动态加载数据绑定配置，并处理加载中的状态和错误。
动态数据键管理：允许动态地管理数据键与共享数据源的绑定。
双向绑定支持：支持双向数据绑定，确保数据在组件间实时同步。
插件注册系统：支持自定义函数扩展，方便二次开发
动态表格管理：可视化配置表接口，表头，表参数，实现动态显示表格的功能（待开发）。


安装
将 DataNexus文件夹放置在您的 Vue.js 项目的 components 目录中。

/****快速开始指南*//

引入并注册组件
在您的 Vue 3 应用中引入并注册 DataNexus 组件。

 ```javascript
import { createApp } from 'vue';
import App from './App.vue';
import DataNexus from './components/DataNexus.vue';

const app = createApp(App);

app.component('DataNexus', DataNexus);

app.mount('#app');
 ```
在父组件中使用
在父组件的模板中，将 DataNexus 组件包裹在需要共享状态的子组件外。

 ```html
<template>
  <DataNexus>
    <!-- 子组件放置在这里 -->
  </DataNexus>
</template>
 ```
 
 
在子组件中使用
在子组件中，通过依赖注入使用 DataNexus 提供的方法。

 ```javascript
import { inject } from 'vue';

export default {
  setup() {
    const subscribeToDataChange = inject('subscribeToDataChange');
    const updateSharedData = inject('updateSharedData');

    subscribeToDataChange('MyComponent', 'myDataKey', (newValue) => {
      // 处理数据变化逻辑
    });

    updateSharedData('MyComponent', 'myDataKey', 'new value');

    // 其他逻辑...
  }
}
 ```
 
动态加载数据绑定配置
您可以通过 loadBindingsFromJSON 方法从外部 JSON 文件加载数据绑定配置。

 ```javascript
<template>
  <DataNexus ref="DataNexusRef">
    <!-- 子组件放置在这里 -->
  </DataNexus>
</template>

<script setup>
  import { ref, onMounted } from 'vue';

  const DataNexusRef = ref(null);

  onMounted(() => {
  DataNexusRef.value.loadBindingsFromJSON('/path/to/config.json');
});
</script>
 ```
 
 
 文件格式  components代表组件名称列,bindings代表组件内对应的数据与共享数据的关系绑定
 {
   "components": {
     "card1": {
       "bindings": [
         { "key": "localData", "target": "overData" },
         { "key": "localData2", "target": "demoData" }
       ]
     },
     "card3": {
       "bindings": [
         { "key": "dddData", "target": "overData" },
         { "key": "cccData", "target": "demoData" }
       ]
     },
     "card4": {
       "bindings": [
         { "key": "card4Data", "target": "demoData" }
       ]
     },
     "cardMap": {
       "bindings": [
         { "key": "top5", "target": "overData" }
       ]
     }
   }
 
 
 
API 说明

subscribeToDataChange(componentName, key, callback): 注册一个回调函数以响应指定数据的变化。
```javascript
import { inject, onMounted } from 'vue';

export default {
  setup() {
    const subscribeToDataChange = inject('subscribeToDataChange');

    onMounted(() => {
      subscribeToDataChange('MyComponent', 'myDataKey', (newValue) => {
        // 处理数据变化逻辑
      });
    });
  }
}
```

updateSharedData(componentName, key, newValue): 更新共享数据并通知所有绑定的组件。
```javascript
import { inject, onMounted } from 'vue';

export default {
  setup() {
    const updateSharedData = inject('updateSharedData');

    onMounted(() => {
      updateSharedData('MyComponent', 'myDataKey', 'new value');
    });
  }
}
```

loadBindingsFromJSON(jsonURL): 从JSON URL加载数据绑定配置。
 ```html
<template>
  <DataNexus ref="dataNexusRef">
    <!-- 子组件放置在这里 -->
  </DataNexus>
</template>
 ```

```javascript
import { ref, onMounted } from 'vue';

const dataNexusRef = ref(null);

onMounted(() => {
  dataNexusRef.value.loadBindingsFromJSON('/path/to/config.json');
});
```

addSharedDataKey(componentName, dataKey, sharedKey, isTwoWay): 将组件的数据项绑定到共享数据源。
```javascript
import { inject, onMounted } from 'vue';

export default {
  setup() {
    const addSharedDataKey = inject('addSharedDataKey');

    onMounted(() => {
      addSharedDataKey('MyComponent', 'dataKey', 'sharedKey', true);
    });
  }
}
```

removeSharedDataKey(componentName, dataKey) 删除数据键的方法
```javascript
import { inject, onMounted } from 'vue';

export default {
  setup() {
    const removeSharedDataKey = inject('removeSharedDataKey');

    onMounted(() => {
      removeSharedDataKey('MyComponent', 'dataKey');
    });
  }
}
```

getSharedData(componentName, dataKey) 获取共享数据键的方法
```javascript
import { inject, onMounted } from 'vue';

export default {
  setup() {
    const getSharedData = inject('getSharedData');

    onMounted(() => {
      const data = getSharedData('MyComponent', 'dataKey');
      // 使用 data...
    });
  }
}
```


DataNexus 插件系统
DataNexus 组件通过 mainBusPluginSystem.js 提供了一个插件注册系统，允许开发者扩展 DataNexus 的功能。下面是如何使用这个系统的详细指南。

功能说明
setMainBusInstance: 将 DataNexus 实例设置为主总线实例，以便插件可以与之交互。
registerPlugin: 注册一个新插件。插件需要包含一个 install 方法，该方法在插件注册时被调用。

使用步骤


了解了，您想要的是关于如何在 DataNexus 组件中使用 registerPlugin 函数注册和使用插件的文档说明。我将根据这个需求重新编写文档部分。

DataNexus 插件系统
DataNexus 组件通过 mainBusPluginSystem.js 提供了一个插件注册系统，允许开发者扩展 DataNexus 的功能。下面是如何使用这个系统的详细指南。

功能说明
setMainBusInstance: 将 DataNexus 实例设置为主总线实例，以便插件可以与之交互。
registerPlugin: 注册一个新插件。插件需要包含一个 install 方法，该方法在插件注册时被调用。
使用步骤
步骤 1: 创建插件
创建一个符合要求的插件。该插件需要有一个 install 方法，该方法接收 DataNexus 实例和插件名称。

```javascript
// myPlugin.js
export default {
install(dataNexus, pluginName) {
// 在这里添加插件的逻辑
dataNexus.someMethod = () => {
console.log(`插件 ${pluginName} 的方法被调用`);
};
}
};
```
步骤 2: 注册插件
在应用初始化或适当的地方，使用 registerPlugin 方法注册您的插件。
 ```javascript
// main.js 或其他初始化脚本
import { registerPlugin } from './mainBusPluginSystem';
import myPlugin from './myPlugin';

// 假设 dataNexusInstance 已经是一个存在的 DataNexus 实例
registerPlugin('myPlugin', myPlugin);
```
步骤 3: 在组件中使用插件
一旦插件被注册，您就可以在 DataNexus 的任何子组件中使用插件提供的方法或属性。

 ```javascript
<template>
  <!-- 组件模板 -->
</template>

<script setup>
import { inject, onMounted } from 'vue';

const dataNexus = inject('dataNexus');

onMounted(() => {
  if (dataNexus && dataNexus.someMethod) {
    dataNexus.someMethod();
  }
});
</script>
```

