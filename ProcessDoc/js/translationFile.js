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
        graphicDialog: false,//信息统计弹窗
        admiNum:'',    //用户账号
        admiName:'',   //用户名
        imgUrl:'',     //用户头像
        translationList:[] , //外文译文
        searchValue:'', //搜索关键字
        stuNum:0 ,//总人数
        translationNum:0,//提交人数
        unSubmit: 0,//未提交人数
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
        let fileUrl = rootPath + '/getTranslationFile?limit=20&page=1&schoolYear=' + semester + '&userId=' + admiId
        axios.get(fileUrl,{headers:{'Authorization': admiToken}}).then(res => {
            //console.log(res)
            this.totals = res.data.pageInfo.total
            res.data.data.forEach(item => {
                let obj = {
                    fileCheck: '',
                    fileCheckman: '',
                    fileName: '',
                    fileOpinion: '',
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

                this.translationList.push(obj)
            })
        })

        /*获取统计数据*/
        let graphicUrl = rootPath + '/translationGraphic?adminId=' + admiId +'&schoolYear=' + semester
        axios.get(graphicUrl,{headers:{'Authorization': admiToken}}).then(res => {
            //console.log(res)
            this.stuNum = res.data.data.stuNum
            this.translationNum = res.data.data.translationNum
            this.unSubmit = res.data.data.unSubmit
        })

    },
    methods:{
        //搜索按钮
        searchBtn(){
            let searchValue = this.searchValue

            let searchUrl = rootPath + '/searchTranslationFile?limit=20&page=1&schoolYear=' + semester + '&searchValue=' + searchValue + '&userId=' + admiId
            axios.get(searchUrl,{headers:{'Authorization': admiToken}}).then(res => {
                //console.log(res)
                this.totals = res.data.pageInfo.total
                if(res.data.data.length === 0){
                    this.$message({
                        type:'info',
                        message:'没有搜到任何内容，请换个关键字试试'
                    })
                    this.translationList = []
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
                    this.translationList = arr
                }
            })

        },
        //附件下载
        downloadFile(index,row){
            this.$confirm('确定要下载该附件么？','提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'info'
            }).then(() => {
                let filePath = row.filePath
                window.open(filePath)
            })
        },

        //信息统计弹窗
        translationGraphic(){
            this.graphicDialog = true
            let stuNum = this.stuNum
            let translationNum = this.translationNum
            let unSubmit = this.unSubmit
            setTimeout(() => {
                let echartsMain = document.getElementById('echartsMain');
                let myChart = echarts.init(echartsMain)

                let option = {
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        top: 'bottom'
                    },
                    series: [
                        {
                            name: '外文译文提交情况',
                            type: 'pie',
                            radius: ['50%', '80%'],
                            avoidLabelOverlap: false,
                            itemStyle: {
                                borderRadius: 10,
                                borderColor: '#fff',
                                borderWidth: 2
                            },
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: '40',
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: [
                                {value: stuNum, name: '总人数'},
                                {value: translationNum, name: '提交人数'},
                                {value: unSubmit, name: '未交人数'},
                            ]
                        }
                    ]
                };
                myChart.setOption(option)
            })

        },
        //input框clear按钮
        clearBtn(){
            let translationArr = []
            let fileUrl = rootPath + '/getTranslationFile?limit=20&page=1&schoolYear=' + semester + '&userId=' + admiId
            axios.get(fileUrl,{headers:{'Authorization': admiToken}}).then(res => {
                //console.log(res)
                this.totals = res.data.pageInfo.total
                res.data.data.forEach(item => {
                    let obj = {
                        fileCheck: '',
                        fileCheckman: '',
                        fileName: '',
                        fileOpinion: '',
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

                    translationArr.push(obj)
                })
            })
            this.translationList = translationArr
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
            let fileUrl = rootPath + '/getTranslationFile?limit=20&page='+ val +'&schoolYear=' + semester + '&userId=' + admiId
            axios.get(fileUrl,{headers:{'Authorization': admiToken}}).then(res => {
                //console.log(res)
                this.totals = res.data.pageInfo.total
                res.data.data.forEach(item => {
                    let obj = {
                        fileCheck: '',
                        fileCheckman: '',
                        fileName: '',
                        fileOpinion: '',
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
            this.translationList = currArr
        }

    }
})