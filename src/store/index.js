import Vue from 'vue'
import Vuex from './vuex'

Vue.use(Vuex)  //默认会执行当前插件的install方法
function logger(store){
  let preState = JSON.stringify(store.state)
  store.subscribe((mutation,newState)=>{
    console.log(preState);
    console.log(mutation);
    console.log(JSON.stringify(newState));
    preState = JSON.stringify(newState);
  })
}
function persists(store){
  let local = localStorage.getItem('VUEX:state');
  if(local){
    store.replaceState(JSON.parse(local));//会用local替换所有状态
  }
  store.subscribe((mutation,state)=>{
    //需要节流  throttle lodash
    let local = localStorage.setItem('VUEX:state',JSON.stringify(state));
    if(local){

    }
  })
}
//通过 Vue中的一个store 属性 创建一个store实例
let store = new Vuex.Store({
  plugins:[
    // logger
    // createLogger() // 每次提交 希望看到当前状态的变化
    //vue-persists 实现vuex的数据持久化
    persists

  ],
  modules:{
    a:{
      namespaced:true,
      state:{
        age:'a10',
      },
      mutations:{
        syncChange(){
          console.log('a-syncChange'); 
        }
      }
    },
    b:{
      namespaced:true,
      state:{
        age:'b100'
      },
      mutations:{
        syncChange(){
          console.log('b-syncChange'); 
        }
      },
      modules:{
        c:{
          namespaced:true,
          state:{
            age:'c100'
          },
          mutations:{
            syncChange(){
              console.log('c-syncChange'); 
            }
          }
        }
      }
    }
  },
  state: {//单一数据源
    age:10
  },
  strict:true,
  //更新状态的唯一方式就是通过mutations
  mutations: {//mutations更改状3态只能采用同步  严格模式不支持异步
    syncChange(state,payload){// 修改状态的方法 同步的更改
      state.age += payload
    }
  },
  getters:{
    myAge(state){//以前用vue中的计算属性
      return state.age + 20
    }
  },
  actions: { // 第一个参数是store
    asyncChange({commit},payload){
      setTimeout(() => {
        commit('syncChange',payload)
      }, 1000);
    }
  }
})
//就是将我们
store.registerModule('d',{
  state:{
    age:'d100'  
  }
})
export default store