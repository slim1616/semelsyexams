<template>
  <div id="app">
    <router-link class="link" to="/HelloWorld">mots</router-link>
    <router-link class="link" to="/classification">groupes de mots</router-link>
    <router-link class="link" to="/sortPhrase">classement</router-link>
    <router-link class="link" to="/selectText">select Text</router-link>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",

  data() {
    return {
      sentence: "This is a [test] sentence [test] for [demonstration] purposes",
    };
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.link {
  margin: 5px;
}
</style>
