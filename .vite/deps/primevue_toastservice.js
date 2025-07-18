import {
  EventBus
} from "./chunk-7IMIA7S2.js";
import "./chunk-7H3D676B.js";

// node_modules/primevue/toasteventbus/index.mjs
var ToastEventBus = EventBus();

// node_modules/primevue/usetoast/index.mjs
var PrimeVueToastSymbol = Symbol();

// node_modules/primevue/toastservice/index.mjs
var ToastService = {
  install: function install(app) {
    var ToastService2 = {
      add: function add(message) {
        ToastEventBus.emit("add", message);
      },
      remove: function remove(message) {
        ToastEventBus.emit("remove", message);
      },
      removeGroup: function removeGroup(group) {
        ToastEventBus.emit("remove-group", group);
      },
      removeAllGroups: function removeAllGroups() {
        ToastEventBus.emit("remove-all-groups");
      }
    };
    app.config.globalProperties.$toast = ToastService2;
    app.provide(PrimeVueToastSymbol, ToastService2);
  }
};
export {
  ToastService as default
};
//# sourceMappingURL=primevue_toastservice.js.map
