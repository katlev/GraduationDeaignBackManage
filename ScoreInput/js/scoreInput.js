//管理员userId
let admiId = window.localStorage.getItem("admiId")
//管理员token
let admiToken = window.localStorage.getItem("admiToken")
//当前学年
let semester = window.localStorage.getItem('semester')
//根路径
let rootPath = 'http://localhost:8080/katle'
var vm = new Vue({
    el:'#app',
    data:{
        currentPage:1,
        totals:0,//总条数
        graphicDialog: false,
        dialogScoreDetail:false,
        adminNum:'',  //管理员工号
        adminName:'',  //管理员姓名
        imgUrl:'',//用户头像
        inputValue:{inputPeople:'',inputScore:'',inputComment:''}, //成绩输入
        searchValue:'', //搜索框输入内容
        scoreList:[], //分数列表
        scoreDetail:{} ,//分数详情
        aGrade:0 ,//90~100分
        bGrade:0 ,//80~90分
        cGrade:0 ,//70~80分
        dGrade:0 ,//60~70分
        eGrade:0 ,//60分以下
    },
    mounted(){

        //学生成绩列表
        let scoreUrl = rootPath + '/getScoreList?limit=20&page=1&schoolYear=' + semester + '&userId=' + admiId

        axios.get(scoreUrl,{
            headers:{'Authorization' : admiToken}
        }).then( res => {
            console.log(res)
            this.scoreList = res.data.data
            this.totals = res.data.pageInfo.total
        })

        //个人信息
        let perUrl = rootPath + '/getUserInfo?userId=' + admiId
        axios.get(perUrl,{headers:{'Authorization': admiToken}}).then(res => {
            if(res.data.code === 200){
                //console.log(res)
                this.adminName = res.data.data.username
                this.adminNum = res.data.data.usernum
                this.imgUrl = res.data.data.avatar
            }
        }).catch(error =>{
            console.log(error)
        })

        //分数统计
        let graphicUrl = rootPath + '/scoreGraphic?adminId=' + admiId + '&schoolYear=' + semester
        axios.get(graphicUrl,{headers:{'Authorization': admiToken}}).then(res => {
            //console.log(res)
            this.aGrade = res.data.data.aGrade
            this.bGrade = res.data.data.bGrade
            this.cGrade = res.data.data.cGrade
            this.dGrade = res.data.data.dGrade
            this.eGrade = res.data.data.eGrade
        })

    },
    methods:{
        //文件导出
        exportFile(){
             this.$confirm('确定导出成绩表么？','提示',{
                 confirmButtonText:'确定',
                 cancelButtonText:'取消',
                 type:'warning'
             }).then(() => {
                 let exportUrl = rootPath + '/exportFile'
                 window.open(exportUrl)
             })
        },

        //分数统计
        scoreGraphic(){
            this.graphicDialog = true

            setTimeout(() => {
                let echartsMain = document.getElementById('echartsMain')
                let myChart = echarts.init(echartsMain)
                let option = {
                    tooltip: {
                        trigger: 'item'
                    },
                    series: [
                        {
                            name: '分数统计',
                            type: 'pie',
                            radius: '80%',
                            data: [
                                {value: this.aGrade, name: '90~100分'},
                                {value: this.bGrade, name: '80~90分'},
                                {value: this.cGrade, name: '70~80分'},
                                {value: this.dGrade, name: '60~70分'},
                                {value: this.eGrade, name: '60分以下'}
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
        //详情
        detailBtn(index,row){
            this.dialogScoreDetail = true
            console.log(row)
            this.scoreDetail = row


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
                        type:'info'
                    })
                }
            })
        },
        //分页
        handleCurrentChange(val){
            let scoreUrl = rootPath + '/getScoreList?limit=20&page=' + val + '&schoolYear=' + semester + '&userId=' + admiId

            axios.get(scoreUrl,{
                headers:{'Authorization' : admiToken}
            }).then( res => {
                console.log(res)
                this.scoreList = res.data.data
                this.totals = res.data.pageInfo.total
            })
        }

    },

})