import { createApp } from 'vue'
import App from './App.vue'
import store from './store';
import router from './router';

import Icon from '@/components/RN/Icon.vue';
// import resize from 'vue-element-resize-detector'

//RN-Style
import '@/assets/RN-yellow.css';

//devextreme
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.softblue.compact.css';

const app = createApp(App)

app.component('Icon', Icon);

app.use(store)
// app.use(resize)

async function start() {
    /*await store.dispatch("loadConfigSettings");
    await store.dispatch("loadSystem");
    await store.dispatch("loadObjects", {isDictionary: true});*/
  
    // const pages = store.getters.getPages;
    // for(let page of pages) {
    //     const action = store.getters.getActionById(page.LoadActionId);
    //     const route = {
    //         path: page.Path,
    //         name: page.Name,
    //         icon: page.IconName,
    //         component: () => import(/*  webpackChunkName: "pages" */'./pages/' + page.Name + '.vue'), 
    //         meta: {
    //             title: page.Title,
    //             layout: 'main-layout',
    //             action,
    //         }
    //     };
    //     router.addRoute(route);
    // }
  
    app.use(router);
  
    app.mount('#app')
  
    // router.isReady().then(() => {
    //   console.log({router})
    //   app.mount('#app')
    // }).catch((error) => {
    //   console.log({error})
    // })
  }
  
  start();


