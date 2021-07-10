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
        dialogFormVisible:false,
        admiNum:'',    //用户账号
        admiName:'',   //用户名
        imgUrl:'',     //用户头像
        planDetailList:[], //个人进度计划列表
        planDetail:{}   ,//进度计划详情
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

        //个人进度计划
        let userId = localStorage.getItem("stuPlanId")
        let planUrl = rootPath + '/getGuiPlanList?limit=20&page=1&userId=' + userId
        axios.get(planUrl,{headers:{'Authorization': admiToken}}).then(res => {
            //console.log(res)
            this.totals = res.data.pageInfo.total
            res.data.data.forEach(item => {
                let obj = {
                    actualValue: '',
                    planCheck:'',
                    planCheckman:'',
                    planEnd:'',
                    planId:'',
                    planName:'',
                    planOPinion:'',
                    planPath:'',
                    planStart:'',
                    planValue:'',
                    teachName:'',
                    titleName:'',
                    userId:'',
                    username:''
                }
                if(item.planCheck === 0){
                    obj.planCheck = '等待审核'
                }else if(item.planCheck === 1){
                    obj.planCheck = '审核通过'
                }else if(item.planCheck === 2){
                    obj.planCheck = '审核不通过'
                }

                obj.actualValue = item.actualValue
                obj.planCheckman = item.planCheckman
                obj.planEnd = item.planEnd
                obj.planId = item.planId
                obj.planName = item.planName
                obj.planOpinion = item.planOpinion
                obj.planPath = item.planPath
                obj.planStart = item.planStart
                obj.planValue = item.planValue
                obj.teachName = item.teachName
                obj.titleName = item.titleName
                obj.userId = item.userId
                obj.username = item.usernum + item.username

                this.planDetailList.push(obj)
            })
        })

    },
    methods:{
        //查看进度计划详情
        planItemDetail(index,row){
            this.planDetail = row
            this.dialogFormVisible = true
            //console.log(this.planDetail)
        },
        //详情弹窗中附件下载
        dialogFile(){
            this.$confirm('确定要下载附件么？','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type:'info'
            }).then(() => {
                let filePath = this.planDetail.planPath
                //console.log(filePath)
                window.open(filePath)
            })

        },
        //列表附件下载按钮
        downloadFile(index,row){
            this.$confirm('确定要下载附件么？','提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'info'
            }).then(() => {
                let filePath = row.planPath
                window.open(filePath)
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
            let userId = localStorage.getItem("stuPlanId")
            let planUrl = rootPath + '/getGuiPlanList?limit=20&page=' + val + '&userId=' + userId
            axios.get(planUrl,{headers:{'Authorization': admiToken}}).then(res => {
                //console.log(res)
                this.totals = res.data.pageInfo.total
                res.data.data.forEach(item => {
                    let obj = {
                        actualValue: '',
                        planCheck:'',
                        planCheckman:'',
                        planEnd:'',
                        planId:'',
                        planName:'',
                        planOPinion:'',
                        planPath:'',
                        planStart:'',
                        planValue:'',
                        teachName:'',
                        titleName:'',
                        userId:'',
                        username:''
                    }
                    if(item.planCheck === 0){
                        obj.planCheck = '等待审核'
                    }else if(item.planCheck === 1){
                        obj.planCheck = '审核通过'
                    }else if(item.planCheck === 2){
                        obj.planCheck = '审核不通过'
                    }

                    obj.actualValue = item.actualValue
                    obj.planCheckman = item.planCheckman
                    obj.planEnd = item.planEnd
                    obj.planId = item.planId
                    obj.planName = item.planName
                    obj.planOpinion = item.planOpinion
                    obj.planPath = item.planPath
                    obj.planStart = item.planStart
                    obj.planValue = item.planValue
                    obj.teachName = item.teachName
                    obj.titleName = item.titleName
                    obj.userId = item.userId
                    obj.username = item.usernum + item.username

                    currArr.push(obj)
                })
            })
            this.planDetailList = currArr
        }

    }
})