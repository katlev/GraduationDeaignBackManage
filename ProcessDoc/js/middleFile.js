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
        graphicDialog:false,//弹窗
        admiNum:'',    //用户账号
        admiName:'',   //用户名
        imgUrl:'',     //用户头像
        middleList:[] ,//中期检查列表
        searchValue:'',//查找关键字
        stuNum:0 ,//学生总人数
        middleNum:0 ,//提交人数
        unSubmit:0 ,//未提交人数
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

        //获取中期检查报告列表
        let fileUrl = rootPath + '/getMiddleFileList?limit=20&page=1&schoolYear=' + semester + '&userId=' + admiId
        axios.get(fileUrl,{headers:{'Authorization': admiToken}}).then(res => {
            //console.log(res)
            this.totals = res.data.pageInfo.total
            res.data.data.forEach(item => {
                let obj = {
                    fileCheck:'',
                    fileCheckman:'',
                    fileName:'',
                    fileOpinion:'',
                    filePath:'',
                    major:'',
                    teachName:'',
                    titleId:'',
                    titleName:'',
                    userId:'',
                    username:''
                }
                if(item.fileCheck === 0){
                    obj.fileCheck = '等待审核'
                }else if(item.fileCheck === 1){
                    obj.fileCheck = '审核通过'
                }else if(item.fileCheck === 2){
                    obj.fileCheck = '审核不通过'
                }

                obj.fileCheckman = item.fileCheckman
                obj.fileName = item.fileName
                obj.fileOpinion = item.fileOpinion
                obj.filePath = item.filePath
                obj.major = item.major
                obj.teachName = item.teachName
                obj.titleId = item.titleId
                obj.titleName = item.titleName
                obj.userId = item.userId
                obj.username = item.usernum + item.username

                this.middleList.push(obj)
            })
        })

        /*获取统计数据*/
        let graphicUrl = rootPath + '/middleGraphic?adminId=' + admiId + '&schoolYear=' + semester
        axios.get(graphicUrl,{headers:{'Authorization': admiToken}}).then(res =>{
            //console.log(res)
            this.stuNum = res.data.data.stuNum
            this.middleNum = res.data.data.middleNum
            this.unSubmit = res.data.data.unSubmit
        })
    },
    methods:{
        //附件下载
        downloadFile(index,row){
            //console.log(row)
            this.$confirm('确定下载中期检查附件么？','提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'info'
            }).then(() => {
                let filePath = row.filePath
                window.open(filePath)
            })
        },
        //搜索内容
        searchBtn(){
            let searchValue = this.searchValue

            let searchUrl = rootPath + '/searchMiddleFile?limit=20&page=1&schoolYear=' + semester + '&searchValue=' + searchValue + '&userId=' + admiId
            axios.get(searchUrl,{headers:{'Authorization': admiToken}}).then(res => {
                //console.log(res)
                this.totals = res.data.pageInfo.total
                if(res.data.data.length === 0){
                    this.$message({
                        type:'info',
                        message:'没有搜到任何内容，请换个关键字试试'
                    })
                    this.middleList = []
                }else{
                    let arr = []
                    res.data.data.forEach(item => {
                        let obj = {
                            fileCheck:'',
                            fileCheckman:'',
                            fileName:'',
                            fileOpinion:'',
                            filePath:'',
                            major:'',
                            teachName:'',
                            titleId:'',
                            titleName:'',
                            userId:'',
                            username:''
                        }
                        if(item.fileCheck === 0){
                            obj.fileCheck = '等待审核'
                        }else if(item.fileCheck === 1){
                            obj.fileCheck = '审核通过'
                        }else if(item.fileCheck === 2){
                            obj.fileCheck = '审核不通过'
                        }
                        obj.fileCheckman = item.fileCheckman
                        obj.fileName = item.fileName
                        obj.fileOpinion = item.fileOpinion
                        obj.filePath = item.filePath
                        obj.major = item.major
                        obj.teachName = item.teachName
                        obj.titleId = item.titleId
                        obj.titleName = item.titleName
                        obj.userId = item.userId
                        obj.username = item.usernum + item.username

                        arr.push(obj)
                    })
                    this.middleList = arr
                }
            })
        },
        //统计弹窗
        middleGraphicBtn(){
            this.graphicDialog = true

            let stuNum = this.stuNum
            let middleNum = this.middleNum
            let unSubmit = this.unSubmit

            setTimeout(() => {
                let echartsMain = document.getElementById("echartsMain")
                let myChart = echarts.init(echartsMain)

                let option = {
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        top: 'bottom',
                    },
                    series: [
                        {
                            name: '中期检提交情况',
                            type: 'pie',
                            radius: '80%',
                            data: [
                                {value: stuNum, name: '学生总人数'},
                                {value: middleNum, name: '提交人数'},
                                {value: unSubmit, name: '未提交人数'},
                            ],
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };

                myChart.setOption(option);
            })
        },
        //input框clear框
        clearBtn(){
            let middleArr = []
            let fileUrl = rootPath + '/getMiddleFileList?limit=20&page=1&schoolYear=' + semester + '&userId=' + admiId
            axios.get(fileUrl,{headers:{'Authorization': admiToken}}).then(res => {
                //console.log(res)
                this.totals = res.data.pageInfo.total
                res.data.data.forEach(item => {
                    let obj = {
                        fileCheck:'',
                        fileCheckman:'',
                        fileName:'',
                        fileOpinion:'',
                        filePath:'',
                        major:'',
                        teachName:'',
                        titleId:'',
                        titleName:'',
                        userId:'',
                        username:''
                    }
                    if(item.fileCheck === 0){
                        obj.fileCheck = '等待审核'
                    }else if(item.fileCheck === 1){
                        obj.fileCheck = '审核通过'
                    }else if(item.fileCheck === 2){
                        obj.fileCheck = '审核不通过'
                    }

                    obj.fileCheckman = item.fileCheckman
                    obj.fileName = item.fileName
                    obj.fileOpinion = item.fileOpinion
                    obj.filePath = item.filePath
                    obj.major = item.major
                    obj.teachName = item.teachName
                    obj.titleId = item.titleId
                    obj.titleName = item.titleName
                    obj.userId = item.userId
                    obj.username = item.usernum + item.username

                    middleArr.push(obj)
                })
            })
            this.middleList = middleArr

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
            let fileUrl = rootPath + '/getMiddleFileList?limit=20&page=' + val +'&schoolYear=' + semester + '&userId=' + admiId
            axios.get(fileUrl,{headers:{'Authorization': admiToken}}).then(res => {
                //console.log(res)
                this.totals = res.data.pageInfo.total
                res.data.data.forEach(item => {
                    let obj = {
                        fileCheck:'',
                        fileCheckman:'',
                        fileName:'',
                        fileOpinion:'',
                        filePath:'',
                        major:'',
                        teachName:'',
                        titleId:'',
                        titleName:'',
                        userId:'',
                        username:''
                    }
                    if(item.fileCheck === 0){
                        obj.fileCheck = '等待审核'
                    }else if(item.fileCheck === 1){
                        obj.fileCheck = '审核通过'
                    }else if(item.fileCheck === 2){
                        obj.fileCheck = '审核不通过'
                    }

                    obj.fileCheckman = item.fileCheckman
                    obj.fileName = item.fileName
                    obj.fileOpinion = item.fileOpinion
                    obj.filePath = item.filePath
                    obj.major = item.major
                    obj.teachName = item.teachName
                    obj.titleId = item.titleId
                    obj.titleName = item.titleName
                    obj.userId = item.userId
                    obj.username = item.usernum + item.username

                    currArr.push(obj)
                })
            })
            this.middleList = currArr
        }

    }
})