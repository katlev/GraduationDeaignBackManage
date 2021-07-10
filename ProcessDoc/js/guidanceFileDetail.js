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
        guiDetailList:[],  //个人指导记录列表
        guiDetail:{}  ,  //指导记录详情
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

        //获取个人指导记录
        let userId = localStorage.getItem('stuGuidanceId')
        let detailUrl = rootPath + '/getGuiDetailList?limit=20&page=1&userId=' + userId
        axios.get(detailUrl,{headers:{'Authorization': admiToken}}).then(res => {
            //console.log(res)
            this.totals = res.data.pageInfo.total
            res.data.data.forEach(item => {
                let obj = {
                    guidanceCheck : '',
                    guidanceCheckman: '',
                    guidanceDate: '',
                    guidanceForm: '',
                    guidanceId: '',
                    guidanceName: '',
                    guidanceOpinion: '',
                    guidancePath: '',
                    guidanceValue: '',
                    teachName:'',
                    titleName:'',
                    userId:'',
                    username:'',
                }
                if(item.guidanceCheck === 0){
                    obj.guidanceCheck = '等待审核'
                }else if(item.guidanceCheck === 1){
                    obj.guidanceCheck = '审核通过'
                }else if(item.guidanceCheck === 2){
                    obj.guidanceCheck = '审核不通过'
                }
                obj.guidanceCheckman = item.guidanceCheckman
                obj.guidanceDate = item.guidanceDate
                obj.guidanceForm = item.guidanceForm
                obj.guidanceId = item.guidanceId
                obj.guidanceName = item.guidanceName
                obj.guidanceOpinion = item.guidanceOpinion
                obj.guidancePath = item.guidancePath
                obj.guidanceValue = item.guidanceValue
                obj.teachName = item.teachName
                obj.titleName = item.titleName
                obj.userId = item.userId
                obj.username = item.usernum + item.username

                this.guiDetailList.push(obj)
            })
        })
    },
    methods:{
        //指导记录详情模块
        guiDetailBtn(index,row){
            this.guiDetail = row
            //console.log(this.guiDetail)
            this.dialogFormVisible = true
        },
        //弹窗文件
        dialogFile(){
            this.$confirm('确定下载附件么？','提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'info'
            }).then(() => {
                let filePath = this.guiDetail.guidancePath
                window.open(filePath)
            })
        },
        //列表附件下载按钮
        downloadFile(index,row){
            this.$confirm('确定下载该附件么？','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type:'info'
            }).then(() => {
                let filePath = row.guidancePath
                //console.log(filePath)
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
            let userId = localStorage.getItem('stuGuidanceId')
            let detailUrl = rootPath + '/getGuiDetailList?limit=20&page=' + val + '&userId=' + userId
            axios.get(detailUrl,{headers:{'Authorization': admiToken}}).then(res => {
                //console.log(res)
                this.totals = res.data.pageInfo.total
                res.data.data.forEach(item => {
                    let obj = {
                        guidanceCheck : '',
                        guidanceCheckman: '',
                        guidanceDate: '',
                        guidanceForm: '',
                        guidanceId: '',
                        guidanceName: '',
                        guidanceOpinion: '',
                        guidancePath: '',
                        guidanceValue: '',
                        teachName:'',
                        titleName:'',
                        userId:'',
                        username:'',
                    }
                    if(item.guidanceCheck === 0){
                        obj.guidanceCheck = '等待审核'
                    }else if(item.guidanceCheck === 1){
                        obj.guidanceCheck = '审核通过'
                    }else if(item.guidanceCheck === 2){
                        obj.guidanceCheck = '审核不通过'
                    }
                    obj.guidanceCheckman = item.guidanceCheckman
                    obj.guidanceDate = item.guidanceDate
                    obj.guidanceForm = item.guidanceForm
                    obj.guidanceId = item.guidanceId
                    obj.guidanceName = item.guidanceName
                    obj.guidanceOpinion = item.guidanceOpinion
                    obj.guidancePath = item.guidancePath
                    obj.guidanceValue = item.guidanceValue
                    obj.teachName = item.teachName
                    obj.titleName = item.titleName
                    obj.userId = item.userId
                    obj.username = item.usernum + item.username

                    currArr.push(obj)
                })
            })
            this.guiDetailList = currArr
        }
    }
})