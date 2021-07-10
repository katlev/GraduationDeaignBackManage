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
        totals:0,// 总条数
        graphicDialog:false, //统计弹窗
        admiNum:'',    //用户账号
        admiName:'',   //用户名
        imgUrl:'',     //用户头像
        planList:[] ,//进度计划列表
        searchValue:'',//搜索关键词
        stuNum: 0,//总人数
        planNum:0 ,//提交数
        unSubmit: 0,//未交数
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

        //进度计划列表
        let planUrl = rootPath + '/getPlanFileList?limit=20&page=1&schoolYear=' + semester + '&userId=' + admiId
        axios.get(planUrl,{headers:{'Authorization': admiToken}}).then(res => {
            console.log(res)
            this.totals = res.data.pageInfo.total
            res.data.data.forEach(item => {
                let obj = {
                    count:'',
                    major:'',
                    teachName:'',
                    titleId:'',
                    titleName:'',
                    userId:'',
                    username:'',
                }
                obj.count = item.count
                obj.major = item.major
                obj.teachName = item.teachName
                obj.titleId = item.titleId
                obj.titleName = item.titleName
                obj.userId = item.userId
                obj.username = item.usernum + item.username

                this.planList.push(obj)
            })
        })

        //获取统计数据
        let graphicUrl = rootPath + '/planGraphic?adminId=' + admiId + '&schoolYear=' + semester
        axios.get(graphicUrl,{headers:{'Authorization': admiToken}}).then(res => {
            //console.log(res)
            this.stuNum = res.data.data.stuNum
            this.planNum = res.data.data.planNum
            this.unSubmit = res.data.data.unSubmit
        })
    },
    methods:{
        //搜索按钮
        searchBtn(){
            let searchValue = this.searchValue
            let searchUrl = rootPath + '/searchPlanFile?limit=20&page=1&schoolYear=' + semester + '&searchValue=' + searchValue + '&userId=' + admiId
            axios.get(searchUrl,{headers:{'Authorization': admiToken}}).then(res => {
                //console.log(res)
                this.totals = res.data.pageInfo.total
                if(res.data.data.length === 0){
                    this.$message({
                        type:'info',
                        message:'没有搜索到任何内容，请换个关键词试试'
                    })
                    this.planList = []
                }else{
                    let arr = []
                    res.data.data.forEach(item => {
                        let obj = {
                            count:'',
                            major:'',
                            teachName:'',
                            titleId:'',
                            titleName:'',
                            userId:'',
                            username:'',
                        }
                        obj.count = item.count
                        obj.major = item.major
                        obj.teachName = item.teachName
                        obj.titleId = item.titleId
                        obj.titleName = item.titleName
                        obj.userId = item.userId
                        obj.username = item.usernum + item.username

                        arr.push(obj)
                    })
                    this.planList = arr
                }
            })
        },
        //跳转到进度计划详情
        toPlanDetail(index,row){
            this.$confirm(`确定进入学生${row.username}个人进度计划详情页么？`,'提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                let userId = row.userId
                localStorage.setItem("stuPlanId",userId)
                location.href = 'planFileDetail.html?userId=' + userId
            })

        },
        //信息统计
        planGraphic(){
            this.graphicDialog = true

            let stuNum = this.stuNum
            let planNum = this.planNum
            let unSubmit = this.unSubmit

            let graphicData = []
            this.planList.forEach(item => {

                let data = {value:0,name:''}
                data.value = item.count
                data.name = item.username
                graphicData.push(data)
            })

            setTimeout(() => {
                let echartsMain = document.getElementById('echartsMain')
                let myChart = echarts.init(echartsMain)

                let option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                    },
                    legend: {
                        top: 'bottom',
                        data:['总人数','提交数','未交数']
                    },
                    series: [
                        {
                            name: '进度计划统计情况',
                            type: 'pie',
                            selectedMode: 'single',
                            radius: [0, '40%'],
                            label: {
                                position: 'inner',
                                fontSize: 14,
                            },
                            labelLine: {
                                show: false
                            },
                            data: [
                                {value: stuNum, name: '总人数'},
                                {value: planNum, name: '提交数'},
                                {value: unSubmit, name: '未交数', selected: true}
                            ]
                        },
                        {
                            name: '学生提交次数',
                            type: 'pie',
                            radius: ['60%', '80%'],
                            labelLine: {
                                length: 30,
                            },
                            data: graphicData
                        }
                    ]
                };
                myChart.setOption(option)
            })
        },
        //导出文件
        exportPlan(){
            this.$confirm('确定导出学生进度计划记录表？','提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'warning'
            }).then(() => {
                let exportUrl = rootPath + '/exportPlan?schoolYear=' + semester + '&userId=' + admiId
                window.open(exportUrl)
            })
        },
        //input框clear按钮
        clearBtn(){
            let planArr = []
            let planUrl = rootPath + '/getPlanFileList?limit=20&page=1&schoolYear=' + semester + '&userId=' + admiId
            axios.get(planUrl,{headers:{'Authorization': admiToken}}).then(res => {
                //console.log(res)
                this.totals = res.data.pageInfo.total
                res.data.data.forEach(item => {
                    let obj = {
                        count:'',
                        major:'',
                        teachName:'',
                        titleId:'',
                        titleName:'',
                        userId:'',
                        username:'',
                    }
                    obj.count = item.count
                    obj.major = item.major
                    obj.teachName = item.teachName
                    obj.titleId = item.titleId
                    obj.titleName = item.titleName
                    obj.userId = item.userId
                    obj.username = item.usernum + item.username

                    planArr.push(obj)
                })
            })
            this.planList = planArr
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
            let planUrl = rootPath + '/getPlanFileList?limit=20&page=' + val + '&schoolYear=' + semester + '&userId=' + admiId
            axios.get(planUrl,{headers:{'Authorization': admiToken}}).then(res => {
                //console.log(res)
                this.totals = res.data.pageInfo.total
                res.data.data.forEach(item => {
                    let obj = {
                        count:'',
                        major:'',
                        teachName:'',
                        titleId:'',
                        titleName:'',
                        userId:'',
                        username:'',
                    }
                    obj.count = item.count
                    obj.major = item.major
                    obj.teachName = item.teachName
                    obj.titleId = item.titleId
                    obj.titleName = item.titleName
                    obj.userId = item.userId
                    obj.username = item.usernum + item.username

                    currArr.push(obj)
                })
            })
            this.planList = currArr
        }
    }
})