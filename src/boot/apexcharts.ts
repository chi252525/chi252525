import { boot } from 'quasar/wrappers';
import VueApexCharts from 'vue3-apexcharts';

export default boot(({ app }) => {
  // Set i18n instance on app
  // eslint-disable-next-line vue/multi-word-component-names
  app.use(VueApexCharts);
});
