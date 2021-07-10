
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
        dialogTitDetail:false,//详情弹窗
        outerVisible:false,
        admiNum:'',//管理员学号
        admiName:'',//管理员姓名
        titDetail:{},  //题目详情
        titleList:[],  //题目列表
        titleIdArr:[], //题目id
        selectTitle:[], //勾选题目列表
        stateOptions: [
            {value:"待审核",label:"待审核"},
            {value:"审核通过",label:"审核通过"},
            {value:"审核不通过",label:"审核不通过"}
        ],
        state:'', //状态选择器
        date:'', //日期选择器
        imgUrl:'',//用户头像
        teachName:'',  //选定教师姓名
        teachId:'',//选定教师id
        teachList:[] ,// 教师名单
        selectTeach:[],//勾选教师名单
        kindOptions:[
            {value:'工程设计',label:'工程设计'},
            {value: '工程技术研究',label: '工程技术研究'},
            {value: '软件开发',label: '软件开发'},
            {value: '实验研究',label: '实验研究'},
            {value: '理论研究',label: '理论研究'}
        ] ,//题目类型选择框
        sourceOptions:[
            {value:'实习单位课题',label:'实习单位课题'},
            {value: '教师收集的结合生产实际的课题',label: '教师收集的结合生产实际的课题'},
            {value: '教师自选课题',label: '教师自选课题'},
            {value: '教师科研课题',label: '教师科研课题'}
        ], //题目来源选择框
        modelOptions:[
            {value:'师生互选课题',label:'师生互选课题'}
        ],//选题形式选择框
    },
    mounted(){
        //题目列表获取
        let titleListUrl = rootPath + '/getTitleList?limit=20&page=1&userId=' + admiId + '&titleSemester=' + semester
        axios.get(titleListUrl,{
            headers:{'Authorization':admiToken
            }}).then(res => {
                //console.log(res)
                this.titleList = res.data.data
                this.totals = res.data.pageInfo.total
        })

        //用户个人信息
        let perUrl = rootPath + '/getUserInfo?userId=' + admiId
        axios.get(perUrl,{headers:{'Authorization': admiToken}}).then(res => {
            if(res.data.code === 200){
                this.admiNum = res.data.data.usernum
                this.admiName = res.data.data.username
                this.imgUrl = res.data.data.avatar
            }
        })

        //教师名单获取
        let teachUrl = rootPath + '/getTeachName?schoolYear=' + semester + '&userId=' + admiId
        axios.get(teachUrl,{headers:{'Authorization': admiToken}}).then(res => {
            console.log(res)
            this.teachList = res.data.data
        })

    },
    methods:{
        //日期格式化
        dateFormat(dateData){
            return moment(dateData).format('YYYY-MM-DD HH:mm:ss')
        },
        //题目详情
        updateMsgItem(index,row){
            this.dialogTitDetail = true
            //console.log(row)
            let titleId = row.titleId
            window.localStorage.setItem("titleId",titleId)

            let detailUrl = rootPath + '/getTitleDetail?titleId=' + titleId

            axios.get(detailUrl,{
                headers: {'Authorization':admiToken}
            }).then(res => {
                //console.log(res.data)
                if(res.data.code === 200){
                    this.titDetail = res.data.data
                }else{
                    this.$message({
                        message:res.data.message,
                        type:'error'
                    })
                }
            })
        },
        //修改题目信息
        updateTitleMsg(){
            let titleId = window.localStorage.getItem('titleId')
            let titleName = this.titDetail.titleName
            let titleKind = this.titDetail.titleKind
            let titleSource = this.titDetail.titleSource
            let titleModel = this.titDetail.titleModel
            let username = this.titDetail.username
            let position = this.titDetail.position
            let college = this.titDetail.college
            let titleYear = this.titDetail.titleYear
            let titleState = this.titDetail.titleState
            let titleMajor = this.titDetail.titleMajor
            let titleType = this.titDetail.titleType
            let titleComplete = this.titDetail.titleComplete
            let titleValue = this.titDetail.titleValue
            let titleRequire = this.titDetail.titleRequire
            let titleResult = this.titDetail.titleResult

            if (titleName.trim() === '' || titleKind.trim() === '' || titleSource.trim() === '' || titleModel.trim() === '' ||
            username.trim() === '' || position.trim() === '' || position.trim() === '' ||
            college.trim() === '' || titleYear.trim() === '' || titleState.trim() === '' ||
            titleMajor.trim() === '' || titleType.trim() === '' || titleComplete.trim === '' ||
            titleValue.trim() === '' || titleRequire.trim() === '' || titleResult.trim() === ''){
                alert('输入不能为空！')
                return
            }
            let updateUrl = rootPath + '/updateTitleMsg'
            axios({
                method: 'put',
                url: updateUrl,
                headers:{'Authorization': admiToken},
                contentType:'application/json',
                data:{
                    college: college,
                    position: position,
                    titleComplete: titleComplete,
                    titleId: titleId,
                    titleKind: titleKind,
                    titleMajor: titleMajor,
                    titleModel: titleModel,
                    titleName: titleName,
                    titleRequire: titleRequire,
                    titleResult: titleResult,
                    titleSource: titleSource,
                    titleState: titleState,
                    titleType: titleType,
                    titleValue: titleValue,
                    titleYear: titleYear,
                    username: username
                }
            }).then(res =>{
                console.log(res)
                if(res.data.code === 200){
                    this.$message({
                        type:'success',
                        message:'修改成功'
                    })
                    this.dialogTitDetail = true

                    setTimeout(()=>{
                        location.reload()
                    },1000)

                }else{
                    this.$message({
                        type: 'info',
                        message:'修改失败'
                    })
                }
            }).catch(error =>{
                console.log(error)
            } )
        },

        //选择框
        handleSelectionChange(val){
            console.log(val)
            this.selectTitle = val
        },
        //选择审核教师按钮
        chooseCheckTeach(){
            if(this.selectTitle.length === 0){
                this.$message({
                    type:'info',
                    message:'至少选择一个题目'
                })
                return
            }
            this.selectTitle.forEach(item => {
                if(item.checkTeach !== null){
                    this.$confirm(`题目:${item.titleName}已有指定审核教师，确定重新指定么`,'提示',{
                        confirmButtonText:'确定',
                        cancelButtonText:'取消'
                    }).then(res => {
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
        //教师名单选择框
        TeachSelectionChange(val){
            console.log(val)
            this.selectTeach = val
        },
        //教师选择按钮
        chooseTeachName(){
            //console.log(this.selectTeach.length)
            if(this.selectTeach.length === 0){
                this.$message({
                    type:'info',
                    message:'请选择一名教师',
                })
                return
            }
            if (this.selectTeach.length > 1){
                this.$message({
                    type:'info',
                    message:'最多选择一名教师'
                })
                return
            }

            this.teachName = this.selectTeach[0].username
            this.teachId = this.selectTeach[0].userId
        },
        //提交名单按钮
        submitTeachName(){
            let teachId = this.teachId
            let teachName = this.teachName
            let idArr = []
            this.selectTitle.forEach(item => {
                idArr.push(item.titleId)
            })
            if(teachId === ''){
                this.$message({
                    type:'info',
                    message:'请先选择教师'
                })
                return
            }
            let selectUrl = rootPath + '/setTitleCheckMan'
            this.$confirm(`确定指定${teachName}审核这些题目么`,'提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'info'
            }).then(() => {
                axios({
                    method:'post',
                    url:selectUrl,
                    headers:{'Authorization': admiToken},
                    contentType:'application/json',
                    data:{
                        id: idArr,
                        teachId: teachId
                    }
                }).then(res => {
                    console.log(res)
                    if(res.data.code === 200){
                        this.$message({
                            type:'success',
                            message:'指定成功'
                        })

                        setTimeout(() => {
                            location.reload();
                        },1000)
                    }else{
                        this.$message({
                            type:'info',
                            message:'指定失败'
                        })
                    }
                    this.outerVisible = false
                })
            }).catch(error =>{

            })
        },

        //题目搜索
        titleSearch(){
            let searchUrl = rootPath + '/findTitleList?limit=10&page=1'

            let state = this.state
            let date = this.date
            let semester = localStorage.getItem('semester')
            console.log(date)
            axios({
                method:'post',
                url:searchUrl,
                headers:{'Authorization':admiToken},
                contentType:'application/json',
                data:{
                    titleSemester: semester,
                    titleState:state,
                    titleYear:date,
                    userId:admiId
                }
            }).then(res => {
                console.log(res)
                if(res.data.data.length === 0){
                    this.$message({
                        message:'没有搜索到任何内容',
                        type:'warning'
                    })
                    this.titleList = []
                    return
                }
                this.titleList = res.data.data
                this.totals = res.data.pageInfo.total
            })

        },
        //input框clear按钮
        clearBtn(){
            let titleListUrl = rootPath + '/getTitleList?limit=20&page=1&userId=' + admiId + '&titleSemester=' + semester
            axios.get(titleListUrl,{
                headers:{'Authorization':admiToken
                }}).then(res => {
                //console.log(res)
                this.titleList = res.data.data
                this.totals = res.data.pageInfo.total
            })
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
            console.log(`当前页${val}`)
            let titleListUrl = rootPath + '/getTitleList?limit=20&page='+ val + '&userId=' + admiId + '&titleSemester=' + semester
            axios.get(titleListUrl,{
                headers:{'Authorization':admiToken
                }}).then(res => {
                //console.log(res)
                this.titleList = res.data.data
                this.totals = res.data.pageInfo.total
            })
        }
    }
})

