<template>
  <div id="app">
    <classification />
    <br />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld";
import classification from "./components/classementPhrase";
import sortPhrase from "./components/sortPhrase";

export default {
  name: "App",
  components: {
    HelloWorld,
    classification,
    sortPhrase,
  },
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
</style>
