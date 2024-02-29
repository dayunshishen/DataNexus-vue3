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


registerPlugin 方法
registerPlugin 是 DataNexus 组件的一个方法，用于注册自定义插件。这个方法允许您将额外的功能或逻辑动态地添加到 DataNexus 的实例中。

如何使用
要使用 registerPlugin 方法，您的插件对象需要包含一个 install 方法。此方法将在注册插件时被调用，并接收 DataNexus 实例作为参数。

以下是使用 registerPlugin 方法的基本步骤：

创建一个包含 install 方法的插件对象。
在 DataNexus 实例上调用 registerPlugin 方法，传递插件名称和插件对象。
示例
假设我们有一个名为 ExamplePlugin 的简单插件，它包含一个基本的安装方法。

```javascript
// ExamplePlugin.js
export default {
  install(dataNexusInstance) {
    // 在这里添加你的插件逻辑
    dataNexusInstance.exampleMethod = function() {
      console.log("ExamplePlugin 的方法被调用");
    };
  }
};
```
要在 DataNexus 组件中注册这个插件，请按照以下步骤操作：

```javascript
// 在你的 Vue 组件中
<template>
  <DataNexus ref="dataNexus">
    <!-- Your other components -->
  </DataNexus>
</template>

<script>
import { ref, onMounted } from 'vue';
import DataNexus from './DataNexus';
import ExamplePlugin from './ExamplePlugin';

export default {
  components: {
    DataNexus
  },
  setup() {
    const dataNexusRef = ref(null);

    onMounted(() => {
      if (dataNexusRef.value) {
        dataNexusRef.value.registerPlugin('ExamplePlugin', ExamplePlugin);
      }
    });

    return { dataNexusRef };
  }
};
```
在这个例子中，ExamplePlugin 将被安装到 DataNexus 实例中，您可以在任何可以访问到 DataNexus 实例的地方使用 exampleMethod 方法。

