import { CMS } from '../controller/cms';
import { boot } from 'quasar/wrappers';

export default boot(async ({ app }) => {
    const cms = new CMS(process.env.PUBLIC_API_URL as string);
    app.config.globalProperties.$cms = cms;
});