// mainBusPluginSystem.js
let mainBusInstance = null;

export function setMainBusInstance(instance) {
  mainBusInstance = instance;
}

export function registerPlugin(pluginName, plugin) {
  if (!mainBusInstance) {
    console.error('MainBus instance has not been created yet.');
    return;
  }

  if (!plugin.install || typeof plugin.install !== 'function') {
    console.error(`Plugin "${pluginName}" must include an 'install' method.`);
    return;
  }

  plugin.install(mainBusInstance, pluginName);
  console.log(`插件 ${pluginName} 安装成功111`);
}
