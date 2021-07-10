//管理员userId
let admiId = localStorage.getItem("admiId")
//管理员token
let admiToken = localStorage.getItem("admiToken")
//学期年份
let semester = localStorage.getItem("semester")

var rootPath = 'http://localhost:8080/katle'

var vm = new Vue({
    el:'#app',
    data:{
        currentPage:1,//当前页
        totals:0,//总条数
        expertDialog:false,
        admiNum:'',//管理员学号
        admiName:'',//管理员姓名
        imgUrl:'',//用户头像
        titleList:[], //选题列表
        expertList:[] ,//评阅专家列表
        selectStu:[],//选择学生
        selectExpert:[],//选择的评阅专家
        expertName:'',//选择的评阅专家
        expertId:'',//选择的评阅专家id
        searchValue:'' ,//搜索关键字
    } ,
    mounted(){
        //用户个人信息
        let perUrl = rootPath + '/getUserInfo?userId=' + admiId
        axios.get(perUrl,{headers:{'Authorization': admiToken}}).then(res => {
            if(res.data.code === 200){
                this.admiNum = res.data.data.usernum
                this.admiName = res.data.data.username
                this.imgUrl = res.data.data.avatar
            }
        })

        //获取选题列表
        let chooseUrl = rootPath + '/getChooseTitleList?limit=20&page=1&schoolYear=' + semester + '&userId=' + admiId
        axios.get(chooseUrl,{headers:{'Authorization': admiToken}}).then(res => {
            console.log(res)
            this.totals = res.data.pageInfo.total
            res.data.data.forEach(item => {
                let obj = {expertMan:'',state:'',teachName:'',titleMajor:'',titleName:'',titleId:'',userId:'',username:''}
                obj.expertMan = item.expertMan
                obj.state = item.state
                obj.teachName = item.teachName
                obj.titleMajor = item.titleMajor
                obj.titleName = item.titleName
                obj.titleId = item.titleId
                obj.userId = item.userId
                obj.username = item.usernum + item.username

                this.titleList.push(obj)
            })
        })

        //获取评阅专家名单
        let expertUrl = rootPath + '/getExpertList?schoolYear=' + semester + '&userId=' + admiId
        axios.get(expertUrl,{headers:{'Authorization': admiToken}}).then(res => {
            //console.log(res)
            res.data.data.forEach(item => {
                let obj = {college:'',position:'',userId:'',usernum:'',username:''}
                obj.college = item.college
                obj.position = item.position
                obj.userId = item.userId
                obj.usernum = item.usernum
                obj.username = item.username

                this.expertList.push(obj)
            })
        })
    },
    methods:{
        //当题目选择框发生改变时的回调
        handleSelectionChange(val){
            this.selectStu = val
        },

        //分配评阅专家
        distributionExpert(){
            if(this.selectStu.length === 0){
                this.$message({
                    type:'info',
                    message:'至少选择一名学生'
                })
                return
            }

            this.selectStu.forEach(item => {
                if(item.expertMan !== null){
                    this.$confirm(`题目：${item.titleName}已分配评阅专家，确定重新分配么`,'提示',{
                        confirmButtonText:'确定',
                        cancelButtonText:'取消',
                        type:'info'
                    }).then(res => {
                        return this.expertDialog = true
                    }).catch(error => {
                        return this.expertDialog = false
                    })
                }else{
                    return
                }

            })
            this.expertDialog = true

        },

        //评阅专家名单选择
        expertSelectionChange(val){
            this.selectExpert = val
        },

        //选择按钮
        chooseExpert(){
            if(this.selectExpert.length === 0){
                this.$message({
                    type:'info',
                    message:'请选择一位评阅专家'
                })
                return
            }
            if(this.selectExpert.length > 1){
                this.$message({
                    type:'info',
                    message:'最多选择一位评阅专家'
                })
                return
            }

            this.expertName = this.selectExpert[0].username
            this.expertId = this.selectExpert[0].userId

        },

        //提交名单按钮
        submitExpert(){
            let expertId = this.expertId
            let expertName = this.expertName
            let idArr = []
            this.selectStu.forEach(item => {
                idArr.push(item.userId)
            })
            if(expertId === ''){
                this.$message({
                    type:'info',
                    message:'请先选择评阅专家'
                })
                return
            }
            let selectUrl = rootPath + '/setStuToExpert'
            this.$confirm(`确定分配${expertName}作为评阅专家评阅这些学生的过程文档么？`,'提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type:'info'
            }).then(res => {
                axios({
                    method:'post',
                    url: selectUrl,
                    headers:{'Authorization': admiToken},
                    contentType:'application/json',
                    data:{
                        id: idArr,
                        teachId: expertId
                    }
                }).then(res => {
                    //console.log(res)
                    if(res.data.code === 200){
                        this.$message({
                            type:'success',
                            message:'分配成功'
                        })
                        setTimeout(() => {
                            location.reload()
                        },1000)
                    }else{
                        this.$message({
                            type:'info',
                            message:'分配失败'
                        })
                    }
                    this.expertDialog = false
                })
            })

        },

        //搜索按钮
        searchBtn(){
            let searchValue = this.searchValue
            let searchUrl = rootPath + '/searchChooseTitle?limit=20&page=1&schoolYear=' + semester + '&searchValue=' + searchValue + '&userId=' + admiId
            axios.get(searchUrl,{headers:{'Authorization': admiToken}}).then(res => {
                console.log(res)
                if(res.data.data.length === 0){
                    this.$message({
                        type:'info',
                        message:'没有搜索到任何内容，请换个关键词试试'
                    })
                    this.titleList = []
                }else{
                    let arr = []
                    res.data.data.forEach(item => {
                        let obj = {expertMan:'',state:'',teachName:'',titleMajor:'',titleName:'',titleId:'',userId:'',username:''}
                        obj.expertMan = item.expertMan
                        obj.state = item.state
                        obj.teachName = item.teachName
                        obj.titleMajor = item.titleMajor
                        obj.titleName = item.titleName
                        obj.titleId = item.titleId
                        obj.userId = item.userId
                        obj.username = item.usernum + item.username

                        arr.push(obj)
                    })
                    this.titleList = arr
                    this.totals = res.data.pageInfo.total
                }
            })

        },
        //input框clear按钮
        clearBtn(){
            let arr = []
            let chooseUrl = rootPath + '/getChooseTitleList?limit=20&page=1&schoolYear=' + semester + '&userId=' + admiId
            axios.get(chooseUrl,{headers:{'Authorization': admiToken}}).then(res => {
                console.log(res)
                this.totals = res.data.pageInfo.total
                res.data.data.forEach(item => {
                    let obj = {expertMan:'',state:'',teachName:'',titleMajor:'',titleName:'',titleId:'',userId:'',username:''}
                    obj.expertMan = item.expertMan
                    obj.state = item.state
                    obj.teachName = item.teachName
                    obj.titleMajor = item.titleMajor
                    obj.titleName = item.titleName
                    obj.titleId = item.titleId
                    obj.userId = item.userId
                    obj.username = item.usernum + item.username

                    arr.push(obj)
                })
            })
            this.titleList = arr
        },
        //退出登录
        signOut(){
            let outUrl = rootPath + '/signOut'
            axios.get(outUrl,{headers:{'Authorization': admiToken}}).then(res => {
                console.log(res)
                if(res.data.code === 200){
                    location.href = '../Login/login.html'
                }else{
                    this.$message({
                        message:'退出失败',
                        type:'info'
                    })
                }
            })
        },

        //分页
        handleCurrentChange(val){
            let currArr = []
            let chooseUrl = rootPath + '/getChooseTitleList?limit=20&page=' + val + '&schoolYear=' + semester + '&userId=' + admiId
            axios.get(chooseUrl,{headers:{'Authorization': admiToken}}).then(res => {
                console.log(res)
                this.totals = res.data.pageInfo.total
                res.data.data.forEach(item => {
                    let obj = {expertMan:'',state:'',teachName:'',titleMajor:'',titleName:'',titleId:'',userId:'',username:''}
                    obj.expertMan = item.expertMan
                    obj.state = item.state
                    obj.teachName = item.teachName
                    obj.titleMajor = item.titleMajor
                    obj.titleName = item.titleName
                    obj.titleId = item.titleId
                    obj.userId = item.userId
                    obj.username = item.usernum + item.username

                    currArr.push(obj)
                })
            })
            this.titleList = currArr
        }
    }
})