let Vue;
let forEach = (obj, callback) => {
    Object.keys(obj).forEach(key => {
        callback(key, obj[key])
    })
}
class ModuleCollection{
    constructor(options){
        //深度遍历所有的子模块都遍历一遍
        this.register([],options)
    }
    register(path,rootModule){
        let rawModule = {
            _raw:rootModule,
            _children:{},
            state:rootModule.state
        }
        if(!this.root){
            this.root = rawModule
        }else{
            let parentModule = path.slice(0,-1).reduce((root,current)=>{
                return root._children[current];
            },this.root)
            parentModule._children[path[path.length-1]] = rawModule
        }
        if(rootModule.modules){
            forEach(rootModule.modules,(moduleName,module)=>{
                // 将a模块进行注册  [a] , a 模块的定义
                //将 b 模块进行注册 [b] , b 模块的定义
                //将 c 模块进行注册 [b,c] , c 模块的定义
                this.register(path.concat(moduleName),module)

            })
        }                                                                                                                                                                                                                                                                                                                                                          
    }   
}
class Store {
    constructor(options) {
        // 获取用户 new 实例时传入的所有属性
        this.vm = new Vue({
            data: {
                state: options.state
            }
        });
        // let getters = options.getters;//获取用户传入的getters
        this.getters = {};
        this.mutations = {};
        this.actions = {};

        //我需要将用户传入的数据进行格式化操作

        this.modules = new ModuleCollection(options);
        console.log(this.modules);
        
    

        // 遍历对象的功能非常常用
        // Object.keys(getters).forEach(getterName=>{
        //     Object.defineProperty(this.getters,getterName,{
        //         get:()=>{
        //             return getters[getterName](this.state);
        //         }
        //     })
        // })
        //封装forEach
        // forEach(getters, (getterName, value) => {
        //     Object.defineProperty(this.getters, getterName, {
        //         get: () => {
        //             return value(this.state);
        //         }
        //     })
        // })
        //将用户定义的mutation 放到 Store上 订阅 将函数订阅到一个数组中 发布 让数组中的函数一次执行
        // let mutations = options.mutations;
       
        // forEach(mutations,(mutationName,value)=>{
        //     this.mutations[mutationName] = (payload) => {//订阅
        //         value(this.state,payload)
        //     };
        // });
        // let actions = options.actions;
        
        // forEach(actions,(actionName,value) => {// 最后会做一个监控 看一下异步方法都 action中执行 不是在mutation中执行
        //     this.actions[actionName] = (payload) => {
        //         value(this,payload)
        //     }
        // })
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