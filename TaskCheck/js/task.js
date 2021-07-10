//管理员userId
let admiId = window.localStorage.getItem("admiId")
//管理员token
let  admiToken = window.localStorage.getItem("admiToken")
//当前学年
let semester = window.localStorage.getItem('semester')
//根路径
let rootPath = 'http://localhost:8080/katle'
var vm = new Vue({
    el:'#app',
    data:{
        currentPage:1, //当前页
        totals:0,//总条数
        outerVisible:false,//指定教师弹窗
        dialogFormVisible:false,//审核弹窗
        admiNum:'',    //用户账号
        admiName:'',   //用户名
        imgUrl:'',     //用户头像
        taskList:[],  //任务书列表
        teachList:[] ,// 教师名单
        taskDetail:{},  //任务书详情
        checks: [{
            value: '待审核',
            label: '待审核'
        }, {
            value: '审核通过',
            label: '审核通过'
        }, {
            value: '审核不通过',
            label: '审核不通过'
        }],
        state:'',
        searchValue:'', //搜索内容
        selectTask:[], //任务书勾选框
        selectTeach:[],//教师名单勾选框
        selectName:'',  //选择的教师名
        selectId:'',  //选择的教师id

    },
    mounted(){
        //用户个人信息
        let perUrl = rootPath + '/getUserInfo?userId=' + admiId
        axios.get(perUrl,{headers:{'Authorization': admiToken}}).then(res => {
            if(res.data.code === 200){
                this.admiName = res.data.data.username
                this.admiNum = res.data.data.usernum
                this.imgUrl = res.data.data.avatar
            }
        })

        //任务书列表获取
        let taskListUrl = rootPath + '/getTaskList?limit=20&page=1&schoolYear=' + semester  + '&userId=' + admiId
        axios.get(taskListUrl,{headers:{'Authorization': admiToken}}).then(res => {
            console.log(res)
            this.totals = res.data.pageInfo.total
            //this.taskList = res.data.data
            res.data.data.forEach(item => {
                 let obj = {position:'',taskCheck:'',taskCheckman:'',taskName:'',taskOpinion:'',taskPath:'',titleId:'',titleMajor:'',titleName:'',userId:'',username:''}
                 obj.position = item.position
                if(item.taskCheck === 0){
                    obj.taskCheck = '等待审核'
                }else if(item.taskCheck === 1){
                    obj.taskCheck = '审核通过'
                }else if(item.taskCheck === 2){
                    obj.taskCheck = '审核不通过'
                }
                obj.taskCheckman = item.taskCheckman
                obj.taskName = item.taskName
                obj.taskOpinion = item.taskOpinion
                obj.taskPath = item.taskPath
                obj.titleId = item.titleId
                obj.titleMajor = item.titleMajor
                obj.titleName = item.titleName
                obj.userId = item.userId
                obj.username = item.username

                this.taskList.push(obj)
            })
        })

        //教师名单获取
        let teachUrl = rootPath + '/getTeachName?schoolYear=' + semester + '&userId=' + admiId
        axios.get(teachUrl,{headers:{'Authorization': admiToken}}).then(res => {
            //console.log(res)
            this.teachList = res.data.data
        })

    },
    methods:{
        //列表勾选状态
        handleSelectionChange(val){
            //console.log(val)
            this.selectTask = val
        },
        //指定审核教师按钮
        selectCheckTeach(){
            if(this.selectTask.length === 0){
                this.$message({
                    type:'info',
                    message:'请至少选择一个题目'
                })
                return
            }
            this.selectTask.forEach(item => {
                if(item.taskCheckman != null){
                    this.$confirm(`题目：${item.titleName}已有指定审核教师，确定重新指定么`,'提示',{
                        confirmButtonText:'确定',
                        cancelButtonText:'取消'
                    }).then( res => {
                        return this.outerVisible = true
                    }).catch(error => {
                        return this.outerVisible = false
                    })
                }else{
                    return
                }
            })
            this.outerVisible = true

        },
        // 教师名单勾选框
        selectTeachName(val){
            //console.log(val)
            this.selectTeach = val
        },
        //确定选择教师名单按钮
        checkSelectTeach(){
            if(this.selectTeach.length === 0){
                this.$message({
                    type:'info',
                    message:'请至少选择一名教师'
                })
                return
            }
            if(this.selectTeach.length > 1){
                this.$message({
                    type:'info',
                    message:'最多选择一名教师'
                })
                return
            }

            this.selectName = this.selectTeach[0].username
            this.selectId = this.selectTeach[0].userId
        },
        //提交名单按钮
        submitInfo(){
           let teachId = this.selectId
           let teachName = this.selectName
           let idArr = []

           this.selectTask.forEach(item => {
               idArr.push(item.userId)
           })

            if(teachId === ''){
                this.$message({
                    type:'info',
                    message:'请先选择教师'
                })
                return
            }

            let selectUrl = rootPath + '/setTaskCheckMan'
            this.$confirm(`确定指定${teachName}审核这些题目么`,'提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type:'info'
            }).then(() => {
                axios({
                    method: 'post',
                    url: selectUrl,
                    headers:{'Authorization': admiToken},
                    data: {
                        id: idArr,
                        teachId: teachId
                    }
                }).then( res => {
                    console.log(res)
                    if(res.data.code === 200){
                        this.$message({
                            type:'info',
                            message:'指定成功'
                        })

                        this.outerVisible = false
                        setTimeout(() => {
                            location.reload()
                        },1000)
                    }else{
                        this.$message({
                            type:'info',
                            message:'指定失败'
                        })
                    }
                })
            })
        },
        //列表操作按钮
        checkItem(index,row){
            //console.log(index,row)
            this.taskDetail = row
            this.dialogFormVisible = true
        },
        //任务书详情弹窗中任务书文件下载
        readFile(){
            this.$confirm('确定下载任务书附件内容么？','提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'info'
            }).then(() => {
                let taskPath = this.taskDetail.taskPath
                window.open(taskPath)
            })
        },
        //任务书详情弹窗审核按钮
        checkTask(){
           //console.log(this.taskDetail)
            let userId = this.taskDetail.userId
            let taskCheck = this.taskDetail.taskCheck

            if(taskCheck.trim() === ''){
                this.$message({
                    type:'info',
                    message:'请选择审核状态'
                })
                return
            }

            let checkUrl = rootPath + '/checkTaskFile?checkValue=' + taskCheck + '&userId=' + userId
            axios.get(checkUrl,{headers:{'Authorization': admiToken}}).then(res => {
                //console.log(res)
                if(res.data.code === 200){
                    this.$message({
                        type:'info',
                        message:'提交成功'
                    })

                    this.dialogFormVisible = false

                    setTimeout(() => {
                        location.reload()
                    },1000)
                }
            })
        },
        //下载附件
        downLoadFile(index,row){
            //let taskName = row.taskName
            this.$confirm('确定要下载任务书附件么？','提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'info'
            }).then(() => {
                let taskPath = row.taskPath
                window.open(taskPath)
            })
        },
        //搜索按钮
        searchBtn(){
            let searchValue = this.searchValue
            if(searchValue.trim() === ''){
                this.$message({
                    type:'info',
                    message:'请输入搜索内容'
                })
                return
            }

            let searchUrl = rootPath + '/searchTask?checkTask=' + searchValue + '&limit=20&page=1&schoolYear=' + semester + '&userId=' + admiId
            axios.get(searchUrl,{headers:{'Authorization': admiToken}}).then(res => {
                console.log(res)
                if(res.data.data.length === 0){
                    this.$message({
                        type:'info',
                        message:'没有搜索相关内容'
                    })
                    this.taskList = []
                    return
                }
                let arr = []
                res.data.data.forEach(item => {
                    let obj = {position:'',taskCheck:'',taskCheckman:'',taskName:'',taskOpinion:'',taskPath:'',titleId:'',titleMajor:'',titleName:'',userId:'',username:''}
                    obj.position = item.position
                    if(item.taskCheck === 0){
                        obj.taskCheck = '等待审核'
                    }else if(item.taskCheck === 1){
                        obj.taskCheck = '审核通过'
                    }else if(item.taskCheck === 2){
                        obj.taskCheck = '审核不通过'
                    }
                    obj.taskCheckman = item.taskCheckman
                    obj.taskName = item.taskName
                    obj.taskOpinion = item.taskOpinion
                    obj.taskPath = item.taskPath
                    obj.titleId = item.titleId
                    obj.titleMajor = item.titleMajor
                    obj.titleName = item.titleName
                    obj.userId = item.userId
                    obj.username = item.username

                    arr.push(obj)
                })
                this.taskList = arr
                this.totals = res.data.pageInfo.total
            })
        },
        //input框clear按钮
        clearBtn(){
            let taskArr = []
            let taskListUrl = rootPath + '/getTaskList?limit=20&page=1&schoolYear=' + semester  + '&userId=' + admiId
            axios.get(taskListUrl,{headers:{'Authorization': admiToken}}).then(res => {
                console.log(res)
                this.totals = res.data.pageInfo.total
                //this.taskList = res.data.data
                res.data.data.forEach(item => {
                    let obj = {position:'',taskCheck:'',taskCheckman:'',taskName:'',taskOpinion:'',taskPath:'',titleId:'',titleMajor:'',titleName:'',userId:'',username:''}
                    obj.position = item.position
                    if(item.taskCheck === 0){
                        obj.taskCheck = '等待审核'
                    }else if(item.taskCheck === 1){
                        obj.taskCheck = '审核通过'
                    }else if(item.taskCheck === 2){
                        obj.taskCheck = '审核不通过'
                    }
                    obj.taskCheckman = item.taskCheckman
                    obj.taskName = item.taskName
                    obj.taskOpinion = item.taskOpinion
                    obj.taskPath = item.taskPath
                    obj.titleId = item.titleId
                    obj.titleMajor = item.titleMajor
                    obj.titleName = item.titleName
                    obj.userId = item.userId
                    obj.username = item.username

                    taskArr.push(obj)
                })
                this.taskList = taskArr
            })
        },

        //退出登录
        signOut(){
            let outUrl = rootPath + '/signOut'
            axios.get(outUrl,{headers:{'Authorization': admiToken}}).then(res => {
                if(res.data.code === 200){
                    location.href = '../Login/login.html'
                }else{
                    this.$message({
                        message:'退出失败',
                        type: 'info'
                    })
                }
            })

        },

        //分页
        handleCurrentChange(val){
            let currArr = []
            let taskListUrl = rootPath + '/getTaskList?limit=20&page=1&schoolYear=' + semester  + '&userId=' + admiId
            axios.get(taskListUrl,{headers:{'Authorization': admiToken}}).then(res => {
                console.log(res)
                this.totals = res.data.pageInfo.total
                //this.taskList = res.data.data
                res.data.data.forEach(item => {
                    let obj = {position:'',taskCheck:'',taskCheckman:'',taskName:'',taskOpinion:'',taskPath:'',titleId:'',titleMajor:'',titleName:'',userId:'',username:''}
                    obj.position = item.position
                    if(item.taskCheck === 0){
                        obj.taskCheck = '等待审核'
                    }else if(item.taskCheck === 1){
                        obj.taskCheck = '审核通过'
                    }else if(item.taskCheck === 2){
                        obj.taskCheck = '审核不通过'
                    }
                    obj.taskCheckman = item.taskCheckman
                    obj.taskName = item.taskName
                    obj.taskOpinion = item.taskOpinion
                    obj.taskPath = item.taskPath
                    obj.titleId = item.titleId
                    obj.titleMajor = item.titleMajor
                    obj.titleName = item.titleName
                    obj.userId = item.userId
                    obj.username = item.username

                    currArr.push(obj)
                })
            })
            this.taskList = currArr
        }

    }
})