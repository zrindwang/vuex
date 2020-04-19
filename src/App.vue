<template>
  <div id="app">
    {{$store.state.a.age}}
    {{$store.state.b.age}}
    {{$store.state.b.c.age}}
    <button @click="$store.state.age = 100"></button>
    我的年龄 {{$store.getters.myAge}}
    <button @click="syncChange()">同步更改</button>
     <!-- <button @click="asyncChange()">异步更改</button> -->
  </div>
</template>

<script>


export default {
  name: 'app',
  methods:{
    syncChange(){
      this.$store.commit('syncChange',10)
    },
    asyncChange(){
      this.$store.dispatch('asyncChange',5)
    }
  }
}
</script>

<style>
</style>
