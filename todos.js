/**
 * Created by hanmiao on 2017/8/11.
 */
//1.添加任务：input输入框输入完成按下enter时，将其值添加到v-for数组中
// 2.删除任务：勾选复选框时，为li添加completed类，点击删除按钮时，找到对应的index，并从数组中删除
// 3.编辑任务:(1)双击label为当前li添加editing类。(2)失去焦点或entern时完成编辑；（3）按下esc取消编辑
// 4.数组存本地数据库，watch监控


var store={
    save:function(key,value){
        localStorage.setItem(key,JSON.stringify(value))
    },
    fetch:function (key) {
        return JSON.parse(localStorage.getItem(key))||[]
    }
};
var items = store.fetch("todoList");
var vm = new Vue({
    el:'.main',
    data:{
        items:items,
        todo:"",
        currentToDo:'',//记录正在编辑的那个li
        beforeEditTit:'',//记录li编辑之前的title
        currentHash:'all'//记录hash的改变
    },
    watch:{
      items:{
          handler: function(){
              store.save("todoList",items)
          },
          deep:true
      }
    },
    computed:{
        noCheckeLength:function () {
            return this.items.filter(function (item) {
                return !item.check
            }).length
        },
        filterItems:function () {
            var hashName=this.currentHash;
            if(hashName=='all'){
                return this.items;
            }else if(hashName=='unfinished'){
                return this.items.filter(function (item) {
                    return !item.check
                })
            }else if(hashName=='finished'){
                return this.items.filter(function (item) {
                    return item.check
                })
            }else {
                return this.items
            }
        }
    },
    methods:{
        addToDo:function(ev){//添加任务
            vm.items.push({
                title: vm.todo,
                check:false
            })
            vm.todo=""
        },
        deleteTo:function(todo){ //删除任务
            var index = this.items.indexOf(todo);
            this.items.splice(index,1);
        },
        editToDo:function (todo) {//编辑任务
            this.currentToDo=todo;
            this.beforeEditTit=todo.title;
        },
        editCompleted:function (todo) {//编辑完成
            this.currentToDo='';
        },
        cancleEdit:function (todo) {
            todo.title=this.beforeEditTit;
            this.currentToDo='';
        }
    }
})
Vue.directive('focus', {
    update: function(el, binding){
        if(binding.value){
            el.focus()
        }
    }
})


function watchHashChange() {
    hash=window.location.hash.slice(1);
    vm.currentHash=hash;
}
watchHashChange();
window.addEventListener('hashchange',watchHashChange);