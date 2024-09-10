import { boot } from 'quasar/wrappers';
import Vue3DraggableResizable from 'vue3-draggable-resizable';
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'; //default styles

export default boot(({ app }) => {
  app.component('Vue3DraggableResizable', Vue3DraggableResizable);
});
export { Vue3DraggableResizable };
