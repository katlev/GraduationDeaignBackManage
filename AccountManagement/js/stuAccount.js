//管理员userId
let admiId = window.localStorage.getItem("admiId")
//管理员token
let  admiToken = window.localStorage.getItem("admiToken")
//当前学年
let semester = window.localStorage.getItem('semester')
//根路径
let rootPath = 'http://localhost:8080/katle'
let vm = new Vue({
    el:'#app',
    data:{
        currentPage:1,//当前页
        totals:0,//总条数
        expertDialog:false,//评阅专家弹窗
        admiNum:'',  //管理员学号
        admiName:'', //管理员姓名
        imgUrl:'',//用户头像
        searchValue:{searchNum:'',searchName:'',searchGrade:'',searchMajor:''}, //搜索项内容
        dialogAddVisible:false,//添加信息弹窗
        dialogEditVisible:false,//修改信息弹窗状态
        addStuInfo:{stuNum:'',stuName:'',stuPwd:'',stuGrade:'',stuDepartment:'',stuMajor:'',schoolYear:''},  //添加账号信息
        perStuInfo:{college:'',grade:'',major:'',password:'',username:'',usernum:''},//每个学生的信息
        studentsList:[
            {stuId:1,stuNum:"1700300103",stuName:"黄婷",stuPwd:"123456",stuGrade:"17003001",stuDepartment:"计算机与信息安全学院",stuMajor:"计算机科学与技术"} ,
        ],  //学生账号列表
        colleges:[
            {value:'机电工程学院',label:'机电工程学院',children: [{value:'机械设计制造',label: '机械设计制造'},{value: '机械电子工程',label: '机械电子工程'},{value: '电子封装技术',label: '电子封装技术'},{value: '车辆工程',label: '车辆工程'}]},
            {value:'信息与通信学院',label: '信息与通信学院',children: [{value: '通信工程',label: '通信工程'},{value: '电子信息工程',label: '电子信息工程'},{value: '电子科学与技术',label: '电子科学与技术'},{value: '微电子科学与工程',label: '微电子科学与工程'},{value: '导航工程',label: '导航工程'}]},
            {value:'计算机与信息安全学院',label:'计算机与信息安全学院',children:[{value:'计算机科学与技术',label:'计算机科学与技术'},{value:'计算机科学与技术(卓越)',label:'计算机科学与技术(卓越)'},{value:'软件工程',label: '软件工程'},{value:'物联网',label: '物联网'},{value: '信息安全',label: '信息安全'},{value: '智能科学与技术',label: '智能科学与技术'},{value: '信息对抗',label: '信息对抗'}]},
            {value:'艺术与设计学院',label:'艺术与设计学院',children: [{value: '产品设计',label: '产品设计'},{value: '视觉传达设计',label: '视觉传达设计'},{value: '环境设计',label: '环境设计'},{value: '服装与服饰设计',label: '服装与服饰设计'},{value: '动画设计',label: '动画设计'}]},
            {value:'商学院',label:'商学院',children: [{value: '会计学',label: '会计学'},{value: '财务管理',label: '财务管理'},{value: '金融工程',label: '金融工程'}]},
            {value:'外国语学院',label:'外国语学院',children: [{value: '英语专业',label: '英语专业'},{value: '日语专业',label: '日语专业'},{value: '汉语国际教育专业',label: '汉语国际教育专业'}]},
            {value:'数学与计算科学学院',label:'数学与计算科学学院',children: [{value: '数学与应用数学',label: '数学与应用数学'},{value: '数字经济',label: '数字经济'},{value: '应用统计学',label: '应用统计学'}]},
            {value:'电子工程与自动化学院',label:'电子工程与自动化学院',children: [{value: '测控技术与仪器',label: '测控技术与仪器'},{value: '自动化专业',label: '自动化专业'},{value: '光电信息科学与工程',label: '光电信息科学与工程'}]},
            {value:'法学院',label:'法学院',children: [{value: '法学',label: '法学'},{value: '知识产权',label: '知识产权'}]},
            {value:'材料科学与工程学院',label:'材料科学与工程学院',children: [{value: '材料科学与工程',label: '材料科学与工程'},{value: '材料成型机控制工程',label: '材料成型机控制工程'},{value: '高分子材料与工程',label: '高分子材料与工程'}]},
            {value:'生命与环境科学学院',label:'生命与环境科学学院',children: [{value: '环境工程',label: '环境工程'},{value: '生物工程',label: '生物工程'},{value: '生物医学工程',label: '生物医学工程'}]},
            {value:'建筑与交通工程学院',label:'建筑与交通工程学院',children: [{value: '交通工程',label: '交通工程'},{value: '土木工程',label: '土木工程'},{value: '建筑环境与设备工程',label: '建筑环境与设备工程'},{value: '建筑电气与智能化',label: '建筑电气与智能化'}]},
            {value:'马克思主义学院',label:'马克思主义学院',children: [{value: '马克思主义研究',label: '马克思主义研究'}]}
        ],
        value:'',//联动选择内容
        selectId:[] ,//勾选框列表内容
        userId :[], // 学生id
        options:[],//学年列表
        expertList:[],//评阅专家列表
    },
    mounted(){
        //学生账号列表
        let stuUrl = rootPath + '/getStuList?limit=20&page=1&userId=' + admiId +'&schoolYear=' + semester
        axios.get(stuUrl,{
            headers:{'Authorization': admiToken}
        }).then( res => {
            //console.log(res)
            this.studentsList = res.data.data
            this.totals = res.data.pageInfo.total
        })

        //用户个人信息
        let perUrl = rootPath + '/getUserInfo?userId=' + admiId
        axios.get(perUrl,{headers:{'Authorization': admiToken}}).then(res => {
            if(res.data.code === 200){
                this.admiName = res.data.data.username
                this.admiNum = res.data.data.usernum
                this.imgUrl = res.data.data.avatar
            }
        })

        //获取学年信息
        let semesterUrl = rootPath + '/getSemester'
        axios.get(semesterUrl,{headers:{'Authorization': admiToken}}).then(res => {
           // console.log(res)
            if(res.data.code === 200){
                let semesterList = res.data.data
                semesterList.forEach(item => {
                    let option = {label:'',value:''}
                    option.label = item.semesterValue
                    option.value = item.semesterValue
                    this.options.push(option)
                })
            }else{
                console.log(res)
            }

        })
    },
    methods:{
        //添加弹窗
        addStuCheck(){
            //console.log(this.value)
            let college = this.value[0]
            let major = this.value[1]
            let grade = this.addStuInfo.stuGrade
            let usernum = this.addStuInfo.stuNum
            let username = this.addStuInfo.stuName
            let password = this.addStuInfo.stuPwd
            //console.log(college,major,grade,username,usernum,password)

            if(this.value.length === 0 || grade.trim() === '' ||
                usernum.trim() === '' || username.trim() === '' || password.trim() === ''){
                alert("输入不为空！")
                return
            }

            let checkUsernum = /^\d{10}$/
            if(!checkUsernum.test(usernum)){
                alert('请输入正确格式的学号！')
                return
            }

            let checkGrade = /^\d{8}$/
            if(!checkGrade.test(grade)){
                alert('请输入正确格式的班级')
                return
            }

            let checkPassword = /^[0-9A-Za-z]{6,}$/
            if(!checkPassword.test(password)){
                alert('密码至少设置6位，可由数字和字母组成')
                return
            }

            let stuAddUrl = rootPath + '/addStudentAccount'
            let addData = new URLSearchParams()
            addData.append('college',college)
            addData.append('grade',grade)
            addData.append('major',major)
            addData.append('password',password)
            addData.append('schoolYear',semester)
            addData.append('username',username)
            addData.append('usernum',usernum)

            this.$confirm(`你确定要添加学生：${this.addStuInfo.stuNum + this.addStuInfo.stuName} 么`,'提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'info'
            }).then( () => {
                axios.post(stuAddUrl,addData,{
                    headers:{'Authorization' : admiToken}
                }).then(res => {
                    console.log(res)
                    if(res.data.code === 200){
                        this.$message({
                            type:'success',
                            message:'添加成功！'
                        })
                        setTimeout(()=>{
                            location.reload()
                        },1000)
                    }else{
                        this.$message({
                            type:'error',
                            message:res.data.message
                        })
                    }
                })
            }).catch(() => {
                this.$message({
                    type:'info',
                    message:'已取消添加！'
                })
            })
            this.dialogAddVisible = false
        },

        //列表按钮修改信息
        editItem(index,row){
            //console.log(index,row)
            this.dialogEditVisible = true

            this.perStuInfo = row

            let stuId = row.userId
            window.localStorage.setItem("stuId",stuId)
        },

        //弹窗修改
        editItemCheck(){
            let userId = window.localStorage.getItem("stuId")
            //console.log(this.perStuInfo)

            let college = this.perStuInfo.college
            let grade = this.perStuInfo.grade
            let major = this.perStuInfo.major
            let password = this.perStuInfo.password
            let username = this.perStuInfo.username
            let usernum = this.perStuInfo.usernum

            if(college === '' || grade === '' || major === '' ||
                password === '' || username === '' || usernum === ''){
                alert("输入不为空！")
                return
            }

            let checkUsernum = /^\d{10}$/
            if(!checkUsernum.test(usernum)){
                alert('请输入正确格式的学号！')
                return
            }

            let checkPassword = /^[0-9A-Za-z]{6,}$/
            if(!checkPassword.test(password)){
                alert('密码至少设置6位，可由数字和字母组成！')
                return
            }

            let checkGrade = /^\d{8}$/
            if(!checkGrade.test(grade)){
                alert('请输入正确格式的班级！')
                return
            }

            let stuData = new FormData()
            stuData.append('college',college)
            stuData.append('grade',grade)
            stuData.append('major',major)
            stuData.append('password',password)
            stuData.append('userId',userId)
            stuData.append('username',username)
            stuData.append('usernum',usernum)
            let stuUpdateUrl = rootPath + '/updateStuInfo'

            this.$confirm(`你确定要修改学生：${this.perStuInfo.usernum + this.perStuInfo.username} 的个人信息么`,'提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type:'info'
            }).then( () => {
                axios.put(stuUpdateUrl,stuData,{
                    headers: {'Authorization' : admiToken}
                }).then(res => {
                    //console.log(res)
                    if(res.data.code === 200){
                         this.$message({
                             type:'success',
                             message:'修改成功！'
                         })

                        setTimeout(() => {
                            location.reload()
                        },1000)
                    }
                })
            }).catch( () => {
                this.$message({
                    type:'info',
                    message:'已取消修改'
                })
            })

            this.dialogEditVisible = false

        },

        //列表勾选状态
        handleSelectionChange(val){
            this.selectId = val
        },

        //批量删除
        batchDelStu(){
           //console.log(this.selectId)
            this.selectId.forEach(item => {
                this.userId.push(item.userId)
            })

            let userIdData = this.userId
            let deleteUrl = rootPath + '/deleteStudent'
            if(userIdData.length === 0){
                this.$message({
                    type:'error',
                    message:'请选择你要删除的账号'
                })
            }

            this.$confirm("你确定要删除这些账号么？",'提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'warning'
            }).then(() => {
                axios({
                    method: 'delete',
                    url:deleteUrl,
                    headers:{'Authorization' : admiToken},
                    contentType:'application/json',
                    data:{
                        userId:userIdData
                    }
                }).then( res => {
                    console.log(res)
                    if(res.data.code === 200){
                        this.$message({
                            type:'success',
                            message:'删除成功！'
                        })

                        setTimeout(()=>{
                            location.reload()
                        },1000)
                    }else{
                        this.$message({
                            type:'error',
                            message:res.data.message
                        })
                    }
                })
            }).catch( () => {
                this.$message({
                    type:'info',
                    message:'已取消删除！'
                })
            })
        },

        //搜索
        stuSearch(){
          let searchUrl = rootPath + '/findStu?limit=20&page=1&userId=' + admiId + '&schoolYear=' + semester
            if(this.searchValue.searchGrade !== ''){
                searchUrl += '&grade=' + this.searchValue.searchGrade
            }
            if(this.searchValue.searchMajor !== ''){
                searchUrl += '&major=' + this.searchValue.searchMajor
            }
            if(this.searchValue.searchName !== ''){
                searchUrl += '&username=' + this.searchValue.searchName
            }
            if(this.searchValue.searchNum !== ''){
                searchUrl += '&usernum=' + this.searchValue.searchNum
            }

            axios.get(searchUrl,{headers:{'Authorization' : admiToken}}).then(res => {
                console.log(res)
                this.studentsList = res.data.data
                this.totals = res.data.pageInfo.total
            }).catch(error => {
                console.log("失败")
            })

        },
        //文件导入
        handleUploadFile(res,file){
            //console.log(res)
            //console.log(file)
            let formData = new FormData();
            formData.append('file',file.raw)
            formData.append('schoolYear',semester)

            let fileUrl = rootPath + '/uploadStudent'
            axios({
                method: 'post',
                url: fileUrl,
                headers: {'Authorization':admiToken},
                contentType: 'application/json',
                data: formData
            }).then(res => {
                console.log(res)
                if(res.data.code === 200){
                    this.$message({
                        type: 'success',
                        message: '账号导入成功'
                    })
                    setTimeout(() => {
                        location.reload()
                    },1000)
                }else{
                    this.$message({
                        type: 'info',
                        message: '账号导入失败'
                    })
                }
            }).catch(error => {
                console.log(error)
                this.$message({
                    type: 'info',
                    message:'请求失败'
                })
            })
        },
        //input框clear按钮
        clearBtn(){
            let stuUrl = rootPath + '/getStuList?limit=20&page=1&userId=' + admiId +'&schoolYear=' + semester
            axios.get(stuUrl,{
                headers:{'Authorization': admiToken}
            }).then( res => {
                //console.log(res)
                this.studentsList = res.data.data
                this.totals = res.data.pageInfo.total
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
            //学生账号列表
            let stuUrl = rootPath + '/getStuList?limit=20&page='+ val +'&userId=' + admiId +'&schoolYear=' + semester
            axios.get(stuUrl,{
                headers:{'Authorization': admiToken}
            }).then( res => {
                //console.log(res)
                this.studentsList = res.data.data
                this.totals = res.data.pageInfo.total
            })

        }
     }
 })
