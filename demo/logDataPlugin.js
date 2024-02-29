export function myPluginInstall(dataNexus, pluginName) {
  // 将功能或数据添加到 mainBus 的 sharedData
  dataNexus.sharedData[pluginName] = {
    doSomething: () => console.log("来自插件的操作！"),
  };
}

export default {
  install: myPluginInstall,
};
