import { createStore } from 'vuex';

async function loadStores() {  
  const resourceModules = {};
  const modules = import.meta.glob('./modules/**/*.js', { eager: true });  
  for (const path in modules) {    
    resourceModules[modules[path].default.name] = modules[path].default;    
  }  

  return resourceModules;
};

const resourceModules = await loadStores();
const store = createStore({
  modules: resourceModules
});

export default store;
