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
        graphicDialog: false,//信息统计弹窗
        totals:0,//总条数
        admiNum:'',    //用户账号
        admiName:'',   //用户名
        imgUrl:'',     //用户头像
        literatureList:[] , //文献综述列表
        searchValue:'' ,//搜索关键词
        graphicData:[],// 统计数据
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

        //获取文献综述
        let fileUrl = rootPath + '/getLiteratureFile?limit=20&page=1&schoolYear=' + semester + '&userId=' + admiId
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

                this.literatureList.push(obj)
            })
        })

        /*获取统计数据*/
        let graphicUrl = rootPath + '/literatureGraphic?adminId=' + admiId + '&schoolYear=' + semester
        axios.get(graphicUrl,{headers:{'Authorization': admiToken}}).then(res => {
            //console.log(res)
            this.graphicData.push(res.data.data.stuNum)
            this.graphicData.push(res.data.data.literatureNum)
            this.graphicData.push(res.data.data.unSubmit)

        })

    },
    methods:{
        //附件下载
        downloadFile(index,row){
            this.$confirm('确定下载该附件么？','提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'info'
            }).then(() => {
                let filePath = row.filePath
                window.open(filePath)
            })
        },
        //搜索按钮
        searchBtn(){
            let searchValue = this.searchValue

            let searchUrl = rootPath + '/searchLiteratureFile?limit=20&page=1&schoolYear=' + semester + '&searchValue=' + searchValue + '&userId=' + admiId
            axios.get(searchUrl,{headers:{'Authorization': admiToken}}).then(res => {
                //console.log(res)
                this.totals = res.data.pageInfo.total
                if(res.data.data.length === 0){
                    this.$message({
                        type:'info',
                        message:'没有搜到任何内容，请换个关键字试试'
                    })
                    this.literatureList = []
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
                    this.literatureList = arr
                }
            })
        },
        //信息统计弹窗按钮
        literatureGraphic(){
            this.graphicDialog = true
            //console.log(this.graphicData)
            let data = this.graphicData

            setTimeout(() => {
                let echartsMain = document.getElementById('echartsMain')
                let myChart = echarts.init(echartsMain)
                let color = ['#5470C6','#91CC75','#FAC858']
                let option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['学生人数', '提价人数','未交人数']
                    },
                    xAxis: {
                        type: 'category',
                        data: ['学生人数', '提交人数', '未交人数']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: data,
                        type: 'bar',
                        barWidth : 60,
                        itemStyle:{
                            color:function (p){
                                return color[p.dataIndex]
                            },
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
                };
                myChart.setOption(option)
            })

        },
        //input框clear按钮
        clearBtn(){
            let literatureArr = []
            let fileUrl = rootPath + '/getLiteratureFile?limit=20&page=1&schoolYear=' + semester + '&userId=' + admiId
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

                    literatureArr.push(obj)
                })
            })
            this.literatureList = literatureArr
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
            let fileUrl = rootPath + '/getLiteratureFile?limit=20&page=' + val + '&schoolYear=' + semester + '&userId=' + admiId
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
            this.literatureList = currArr
        }

    }
})