import Vue from 'vue'
import Vuex from './vuex'

Vue.use(Vuex)  //默认会执行当前插件的install方法

//通过 Vue中的一个store 属性 创建一个store实例
let store = new Vuex.Store({
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