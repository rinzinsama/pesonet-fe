import Vue from "vue";
import VueRouter from "vue-router";

Plugin.popover = ({
  icon,
  title,
  content,
  buttons,
  onOpenBefore = null,
  onContentReady = null,
  columnClass = "col-md-4",
  onClose = null,
  autoClose = false,
}) => {
  return $.confirm({
    title,
    content,
    theme: "material",
    icon,
    type: "red",
    buttons,
    onContentReady,
    onOpenBefore,
    columnClass,
    onClose,
    autoClose,
  });
};

Plugin.install = (Vue) => {
  Vue.prototype.$popover = Plugin.popover;
};

Vue.use(Plugin);

export default Plugin;
