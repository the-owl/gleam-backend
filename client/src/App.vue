<template>
  <div id='app'>
    <header>
      <img class='logo' src='./assets/logo.png' />
    </header>
    <main>
      <appointments-table />
    </main>
  </div>
</template>

<script>
import AppointmentsTable from './components/AppointmentsTable'

export default {
  name: 'App',
  components: {
    AppointmentsTable
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app header {
  align-items: center;
  background: linear-gradient(-90deg, #ccd8e6, rgb(78, 142, 216));
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  padding: 10px 20px;
  width: 100%;
}

#app header .logo {
  width: 100px;
}

#app main {
  margin: 0 auto;
  max-width: 1200px;
  padding-top: 25px;
}
</style>
