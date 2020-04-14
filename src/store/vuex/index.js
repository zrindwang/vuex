let Vue;
let forEach = (obj, callback) => {
    Object.keys(obj).forEach(key => {
        callback(key, obj[key])
    })
}
class Store {
    constructor(options) {
        // 获取用户 new 实例时传入的所有属性
        this.vm = new Vue({
            data: {
                state: options.state
            }
        });
        let getters = options.getters;//获取用户传入的getters
        this.getters = {}
        // 遍历对象的功能非常常用
        // Object.keys(getters).forEach(getterName=>{
        //     Object.defineProperty(this.getters,getterName,{
        //         get:()=>{
        //             return getters[getterName](this.state);
        //         }
        //     })
        // })
        //封装forEach
        forEach(getters, (getterName, value) => {
            Object.defineProperty(this.getters, getterName, {
                get: () => {
                    return value(this.state);
                }
            })
        })
        //将用户定义的mutation 放到 Store上 订阅 将函数订阅到一个数组中 发布 让数组中的函数一次执行
        let mutations = options.mutations;
        this.mutations = {};
        forEach(mutations,(mutationName,value)=>{
            this.mutations[mutationName] = (payload) => {//订阅
                value(this.state,payload)
            };
        });
        let actions = options.actions;
        this.actions = {};
        forEach(actions,(actionName,value) => {// 最后会做一个监控 看一下异步方法都 action中执行 不是在mutation中执行
            this.actions[actionName] = (payload) => {
                value(this,payload)
            }
        })
    }
    commit = (mutationName,payload) => { //es7 写法  这个里面this 永远指向当前Store的实例
        this.mutations[mutationName](payload);//发布
    }
    dispatch = (actionName,payload) => {
        this.actions[actionName](payload)
    }
    get state() {
        return this.vm.state
    }
  
}
const install = (_Vue) => { //vue构造函数
    Vue = _Vue; //Vue的构造函数
    //放到vue的原型上 false 因为默认会给所有实例增加
    //只从当前的根实例开始 所有实例的子组件才有$store
    Vue.mixin({//组件创建过程先父后子
        beforeCreate() {
            console.log('hello')
            //把父组件的store属性 放到每个组件的实例上
            if (this.$options.store) {//根实例
                this.$store = this.$options.store
            } else {
                this.$store = this.$parent && this.$parent.$store
            }
        }
    })//抽离公共逻辑 放一些方法

}

export default {
    Store,
    install
}