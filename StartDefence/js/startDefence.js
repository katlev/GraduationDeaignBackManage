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
        dialogAddGroup:false, //创建分组名单
        teachListDialog:false,//教师名单内层弹窗
        studentListDialog:false,//学生名单内层弹窗
        currentPage:1,
        totals:0,//总条数
        admiNum:'',    //用户账号
        admiName:'',   //用户名
        imgUrl:'',     //用户头像
        defenceList:[],   //答辩组列表
        addForm:{
            defName:'',
            defPlace:'',
            defTime:'',
            defDate:'',
            defTeachers:'',
            defStudent:'',
            principal:''//答辩组负责人
        }, //添加答辩组表单
        teachList:[] ,// 教师名单
        studentList:[] ,//学生名单
        selectTeach:[],//选择的教师名单
        selectStudent:[],//选择的学生名单
        searchValue:'',//搜索关键词
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

        //获取开题答辩分组列表
        let startListUrl = rootPath + '/getOpenList?adminId=' + admiId + '&limit=20&page=1&schoolYear=' + semester
        axios.get(startListUrl,{headers:{'Authorization':admiToken}}).then(res => {
            //console.log(res)
            this.totals = res.data.pageInfo.total
            res.data.data.forEach(item => {
                let obj = {defenceId:'',defenceName:'',defencePlace:'',defenceDate:'',defenceTeachs:'',defenceStudents:'',defenceLeader:'',}
                obj.defenceId = item.defenceId
                obj.defenceName = item.defenceName
                obj.defencePlace = item.defencePlace
                obj.defenceDate = item.defenceDate + ',' + item.defenceTime
                obj.defenceTeachs = item.defenceTeachs
                obj.defenceStudents = item.defenceStudents
                obj.defenceLeader = item.defenceLeader
                this.defenceList.push(obj)
            })
        })

        //教师名单获取
        let teachUrl = rootPath + '/getTeachName?schoolYear=' + semester + '&userId=' + admiId
        axios.get(teachUrl,{headers:{'Authorization': admiToken}}).then(res => {
            //console.log(res)
            this.teachList = res.data.data
        })

        //学生名单获取
        let stuUrl = rootPath + '/getStuName?schoolYear=' + semester + '&userId=' + admiId
        axios.get(stuUrl,{headers:{'Authorization': admiToken}}).then(res => {
            console.log(res)
            res.data.data.forEach(item => {
                let obj = {userId:'',usernum:'',username:'',major:'',college:''}
                obj.userId = item.userId
                obj.usernum = item.usernum
                obj.username = item.username
                obj.major = item.major
                obj.college = item.college
                this.studentList.push(obj)
            })
        })

    },
    methods:{
        //选择教师勾选框
        handleSelectionTeach(val){
            console.log(val)
            this.selectTeach = val
        },
        //选择教师名单确认按钮
        selectTeachList(){
           if(this.selectTeach.length === 0){
               this.$message({
                   type:'info',
                   message:'请选择教师'
               })
               return
           }
           if(this.selectTeach.length > 4){
               this.$message({
                   type:'info',
                   message:'每个开题答辩组最多选择四名教师'
               })
               return
           }

           let teachName = ''
            this.selectTeach.forEach(item => {
                teachName += item.username + '  '
            })
            //console.log(teachName)
            this.addForm.defTeachers = teachName
            this.teachListDialog = false
        },
        //选择学生勾选框
        handleSelectionStudent(val){
            console.log(val)
            this.selectStudent = val
        },
        //选择学生名单确认按钮
        selectStuList(){
           if(this.selectStudent.length === 0){
               this.$message({
                   type:'info',
                   message:'请选择学生名单'
               })
               return
           }
           if(this.selectStudent.length > 20){
               this.$message({
                   type:'info',
                   message:'每个分组最多选择20名学生'
               })
               return
           }

           let studentName = ''
            this.selectStudent.forEach(item => {
                studentName += item.username + '  '
            })
            this.addForm.defStudent = studentName
            this.studentListDialog = false
        },
        //提交创建分组表单按钮
        submitForm(){
            let defenceName = this.addForm.defName
            let defencePlace = this.addForm.defPlace
            let defenceTime = this.addForm.defTime
            let defenceDate = this.addForm.defDate
            let defenceTeachs = this.addForm.defTeachers
            let defenceStudents = this.addForm.defStudent
            let defenceLeader = this.addForm.principal

            if(defenceName.trim() === ''){
                this.$message({
                    type:'info',
                    message:'请输入答辩分组名'
                })
                return
            }
            if(defencePlace.trim() === ''){
                this.$message({
                    type:'info',
                    message:'请选择答辩地点'
                })
                return
            }
            if(defenceTime === ''){
                this.$message({
                    type:'info',
                    message:'请选择答辩时间'
                })
                return
            }
            if(defenceDate === ''){
                this.$message({
                    type:'info',
                    message:'请输入答辩日期'
                })
                return
            }
            if(defenceTeachs.trim() === ''){
                this.$message({
                    type:'info',
                    message:'请选择参编教师名单'
                })
                return
            }
            if(defenceStudents.trim() === ''){
                this.$message({
                    type:'info',
                    message:'请选择参辩学生名单'
                })
                return
            }

            if(defenceLeader.trim() === ''){
                this.$message({
                    type:'info',
                    message:'请输入该组答辩组长姓名'
                })
                return
            }
            //console.log(defenceName,defencePlace,defenceTime,defenceDate,defenceTeachs,defenceStudents,defenceLeader)
            let addUrl = rootPath + '/addOpenDefence'
            this.$confirm(`确定添加${defenceName}这一开题答辩分组么`,'提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'info'
            }).then(() => {
                axios({
                    method:'post',
                    url: addUrl,
                    headers:{'Authorization': admiToken},
                    contentType:'application/json',
                    data:{
                        adminId: admiId,
                        defenceDate: defenceDate,
                        defenceLeader: defenceLeader,
                        defenceName: defenceName,
                        defencePlace: defencePlace,
                        defenceStudents: defenceStudents,
                        defenceTeachs: defenceTeachs,
                        defenceTime: defenceTime,
                        defenceYear: semester
                    }
                }).then(res => {
                    console.log(res)
                    if(res.data.code === 200){
                        this.$message({
                            type:'success',
                            message:'创建成功'
                        })

                        setTimeout(() => {
                            location.reload()
                        },1000)
                    }else{
                        this.$message({
                            type:'info',
                            message:'创建失败'
                        })
                    }
                })
            })
            this.dialogAddVisible = false
        },
        //文件导入
        fileUpload(res,file){
            let formData = new FormData()
            formData.append('adminId',admiId)
            formData.append('file',file.raw)
            formData.append('schoolYear',semester)

            let uploadUrl = rootPath + '/batchImport'

            axios({
                method:'post',
                url: uploadUrl,
                headers:{'Authorization': admiToken},
                contentType: 'application/json',
                data: formData
            }).then( res => {
                console.log(res)
                if(res.data.code === 200){
                    this.$message({
                        type:'success',
                        message:'导入成功'
                    })

                    setTimeout(() => {
                        location.reload()
                    },1000)
                }else{
                    this.$message({
                        type:'info',
                        message:'导入失败'
                    })
                }
            })
        },
        //答辩分组搜索
        openDefenceSearch(){
            let searchValue = this.searchValue

            let searchUrl = rootPath + '/searchOpenDefence?adminId=' + admiId + '&limit=20&page=1&schoolYear=' + semester + '&searchValue=' + searchValue
            axios.get(searchUrl,{headers:{'Authorization': admiToken}}).then(res => {
                console.log(res)
                if(res.data.data.length === 0){
                    this.$message({
                        type:'info',
                        message:'没有搜到任何内容，请换个关键词'
                    })
                    this.defenceList = []
                    return
                }
                let arr = []
                res.data.data.forEach(item => {
                    let obj = {defenceId:'',defenceName:'',defencePlace:'',defenceDate:'',defenceTeachs:'',defenceStudents:'',defenceLeader:'',}
                    obj.defenceId = item.defenceId
                    obj.defenceName = item.defenceName
                    obj.defencePlace = item.defencePlace
                    obj.defenceDate = item.defenceDate + ',' + item.defenceTime
                    obj.defenceTeachs = item.defenceTeachs
                    obj.defenceStudents = item.defenceStudents
                    obj.defenceLeader = item.defenceLeader
                    arr.push(obj)
                })
                this.defenceList = arr
                this.totals = res.data.pageInfo.total
            })
        },
        //input框clear按钮
        clearBtn(){
            let groupArr = []
            let startListUrl = rootPath + '/getOpenList?adminId=' + admiId + '&limit=20&page=1&schoolYear=' + semester
            axios.get(startListUrl,{headers:{'Authorization':admiToken}}).then(res => {
                //console.log(res)
                this.totals = res.data.pageInfo.total
                res.data.data.forEach(item => {
                    let obj = {defenceId:'',defenceName:'',defencePlace:'',defenceDate:'',defenceTeachs:'',defenceStudents:'',defenceLeader:'',}
                    obj.defenceId = item.defenceId
                    obj.defenceName = item.defenceName
                    obj.defencePlace = item.defencePlace
                    obj.defenceDate = item.defenceDate + ',' + item.defenceTime
                    obj.defenceTeachs = item.defenceTeachs
                    obj.defenceStudents = item.defenceStudents
                    obj.defenceLeader = item.defenceLeader
                    groupArr.push(obj)
                })
            })
            this.defenceList = groupArr
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
            let startListUrl = rootPath + '/getOpenList?adminId=' + admiId + '&limit=20&page=' + val + '&schoolYear=' + semester
            axios.get(startListUrl,{headers:{'Authorization':admiToken}}).then(res => {
                //console.log(res)
                this.totals = res.data.pageInfo.total
                res.data.data.forEach(item => {
                    let obj = {defenceId:'',defenceName:'',defencePlace:'',defenceDate:'',defenceTeachs:'',defenceStudents:'',defenceLeader:'',}
                    obj.defenceId = item.defenceId
                    obj.defenceName = item.defenceName
                    obj.defencePlace = item.defencePlace
                    obj.defenceDate = item.defenceDate + ',' + item.defenceTime
                    obj.defenceTeachs = item.defenceTeachs
                    obj.defenceStudents = item.defenceStudents
                    obj.defenceLeader = item.defenceLeader
                    currArr.push(obj)
                })
            })
            this.defenceList = currArr
        }
    }
})