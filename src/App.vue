<template>
  <div class="page">
    <ul class="navigation">
      <li><RouterLink to="/data-grids">DataGrids</RouterLink></li>
      <li><RouterLink to="/tree-view">TreeView</RouterLink></li>
      <li><RouterLink to="/components">Components</RouterLink></li>
    </ul>
    <div class="body">
      <RouterView />      
  </div>
</div>
</template>
<script>

import ruMessages from "devextreme/localization/messages/ru.json";
import { locale, loadMessages } from "devextreme/localization";

export default {
  components: {
  },
  methods: {
  },
  data() {
    return {      
    }
  },
  created() { 
    loadMessages(ruMessages); 
    locale(navigator.language);
  },
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
body {
  margin: 0;
  padding: 0;
  border: 0;
}
h1,
h2,
h3,
h4,
h5 {
  color: #555;
  padding: 3px 3px 3px 0;
  margin: 2px 0;
}
h1 {
  font-size: 24px;
}
h2 {
  font-size: 18px;
}
h3 {
  font-size: 16px;
}
h4 {
  font-size: 14px;
}
h5 {
  font-size: 12px;
  margin: 1px;
}

a {
  text-decoration: none;
  color: rgb(230, 109, 109);
}

a:hover {
  color: rgb(255, 160, 160);
}

.page {
  margin: 0;
  border: 0;
  padding: 5px;
}
.header {
  display: flex;
}

.body {
  text-align: left;
  flex: 1 1;
}
.page-container {
  display: flex;
  position: relative;
  height: calc(100vh - 110px);
  overflow: hidden;
}

ul.navigation {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #333333;
}

.navigation li {
  float: left;
}

.navigation li a {
  display: block;
  color: white;
  text-align: center;
  padding: 16px;
  text-decoration: none;
}

.navigation li a:hover {
  background-color: #111111;
}
</style>
