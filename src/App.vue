<template>
  <div id="app">
    <sui-menu fixed inverted>
      <sui-container fluid>
        <router-link :to="{name: 'GridList'}" is="sui-menu-item" class="header">
          <sui-icon name="pencil alternate" class="logo" />
          &nbsp;&nbsp;StoryTime
        </router-link>
      </sui-container>
    </sui-menu>
    
    <sui-container class="main" fluid>
      <router-view/>
    </sui-container>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 60px;
  padding: 20px;
}
</style>
