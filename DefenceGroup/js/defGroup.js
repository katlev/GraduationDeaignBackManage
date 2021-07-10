//管理员userId
let adminId = window.localStorage.getItem("admiId")
//管理员token
let adminToken = window.localStorage.getItem("admiToken")
//当前学年
let semester = window.localStorage.getItem('semester')
//根路径
let rootPath = 'http://localhost:8080/katle'
new Vue({
    el:'#app',
    data(){
        return {
            currentPage:1,
            totals:0,//总条数
            createGroupDia: false,  //创建分组弹窗
            adminName:'',//管理员姓名
            adminNum:'',//管理员学号
            imgUrl:'',//用户头像
            // 创建分组表单内容
            groupForm:{defName:'',defDate:'',defTime:'',defPlace:'',defTeach:'',defStudents:'',principal:''},
            groupList:[],  //折叠面板内容
            teachListDialog:false, //内层弹窗，教师名单
            studentListDialog:false,//学生名单内层弹窗
            teachList:[] ,// 教师名单
            studentList:[],  //学生名单
            selectTeach:[],//选择的教师名单
            selectStudents:[],//选择的学生名单
            searchValue:'',//搜索内容
        }
    },
    mounted(){
        //答辩分组列表
        let groupUrl = rootPath + '/getDefenceGroup?adminId=' + adminId + '&limit=20&page=1&schoolYear=' + semester
        axios.get(groupUrl,{
            headers: {'Authorization' : adminToken}
        }).then(res =>{
            console.log(res)
            //this.groupList = res.data.data
            this.totals = res.data.pageInfo.total
            res.data.data.forEach(item => {
                let obj = {defenceId:0,defenceName:'',defencePlace:'',defenceStudents: '',defenceTeachs:'',defenceDate:'',defenceLeader:''}
                obj.defenceId = item.defenceId
                obj.defenceName = item.defenceName
                obj.defencePlace = item.defencePlace
                obj.defenceTeachs = item.defenceTeachs
                obj.defenceStudents = item.defenceStudents
                obj.defenceDate = item.defenceDate + ',' + item.defenceTime
                obj.defenceLeader = item.defenceLeader
                this.groupList.push(obj)
            })
            //console.log(this.groupList)
        })

        //用户个人信息
        let perUrl = rootPath + '/getUserInfo?userId=' + adminId
        axios.get(perUrl,{headers:{'Authorization': adminToken}}).then(res => {
            if(res.data.code === 200){
                this.adminName = res.data.data.username
                this.adminNum = res.data.data.usernum
                this.imgUrl = res.data.data.avatar
            }
        }).catch(error => {
            console.log(error)
        })

        //教师名单获取
        let teachUrl = rootPath + '/getTeachName?schoolYear=' + semester + '&userId=' + adminId
        axios.get(teachUrl,{headers:{'Authorization': adminToken}}).then(res => {
            //console.log(res)
            this.teachList = res.data.data
        })

        //学生名单获取
        let stuUrl = rootPath + '/getStuName?schoolYear=' + semester + '&userId=' + adminId
        axios.get(stuUrl,{headers:{'Authorization': adminToken}}).then(res => {
            //console.log(res)
            //this.studentList = res.data.data
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
        //教师名单勾选框
        handleSelectionTeach(val){
            this.selectTeach = val
        },
        //选择教师名单确认按钮
        selectTeachBtn(){
            if(this.selectTeach.length === 0){
                this.$message({
                    type:'info',
                    message:'请选择教师名单'
                })
                return
            }
            if(this.selectTeach.length > 4){
                this.$message({
                    type:'info',
                    message:'每个答辩组最多选择4名教师'
                })
                return
            }

            let teachName = ''
            this.selectTeach.forEach(item => {
                teachName += item.username + ' '
            })

            this.groupForm.defTeach = teachName
            this.teachListDialog = false

        },
        //学生名单勾选框
        handleSelectionStudent(val){
            this.selectStudents = val
        },
        //学生名单确认按钮
        selectStudentBtn(){
             if(this.selectStudents.length === 0){
                 this.$message({
                     type:'info',
                     message:'请选择学生名单'
                 })
                 return
             }
             if(this.selectStudents.length > 7){
                 this.$message({
                     type:'info',
                     message:'每个分组最多选择7名学生'
                 })
                 return
             }

             let studentName = ''
            this.selectStudents.forEach(item => {
                studentName += item.username + ' '
            })
            this.groupForm.defStudents = studentName
            this.studentListDialog = false
        },
        //创建分组
        createGroup(){
            let defenceName = this.groupForm.defName
            let defencePlace = this.groupForm.defPlace
            let defenceStudents = this.groupForm.defStudents
            let defenceTeachs = this.groupForm.defTeach
            let defenceDate = this.groupForm.defDate
            let defenceTime = this.groupForm.defTime
            let defenceLeader = this.groupForm.principal
            //console.log(defenceDate,defenceTime)

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
                    message:'请输入答辩地点'
                })
                return
            }
            if(defenceDate === ''){
                this.$message({
                    type:'info',
                    message:'请选择答辩时间'
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
            if(defenceTeachs.trim() === ''){
                this.$message({
                    type:'info',
                    message:'请选择参辩教师名单'
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

            let addUrl = rootPath + '/addDefence'

            this.$confirm(`你确定要创建${defenceName}分组么？`,'提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'info'
            }).then(() => {
                axios({
                    method:'post',
                    url:addUrl,
                    headers:{'Authorization' : adminToken},
                    contentType:'application/json',
                    data:{
                        adminId: adminId,
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
                            message:'创建成功！'
                        })

                        setTimeout(() => {
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
                    message:'已取消创建！'
                })
            })

            this.createGroupDia = false
        },
        //文件导入
        fileUpload(res,file){
            let formData = new FormData()
            formData.append('adminId',adminId)
            formData.append('file',file.raw)
            formData.append('schoolYear',semester)

            let uploadUrl = rootPath + '/importDefenceFile'

            axios({
                method:'post',
                url:uploadUrl,
                headers:{'Authorization': adminToken},
                contentType: 'application/json',
                data: formData
            }).then(res => {
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
        //答辩分组搜索按钮
        searchBtn(){
            let searchValue = this.searchValue

            let searchUrl = rootPath + '/searchDefence?adminId=' + adminId + '&limit=20&page=1&schoolYear=' + semester + '&searchValue=' + searchValue
            axios.get(searchUrl,{headers:{'Authorization': adminToken}}).then(res => {
                //console.log(res)
                this.totals = res.data.pageInfo.total
                if(res.data.data.length === 0){
                    this.$message({
                        type:'info',
                        message:'没有搜到任何内容，请换个关键字'
                    })
                    this.groupList = []
                    return
                }
                let arr = []
                res.data.data.forEach(item => {
                    let obj = {defenceId:0,defenceName:'',defencePlace:'',defenceStudents: '',defenceTeachs:'',defenceDate:''}
                    obj.defenceId = item.defenceId
                    obj.defenceName = item.defenceName
                    obj.defencePlace = item.defencePlace
                    obj.defenceTeachs = item.defenceTeachs
                    obj.defenceStudents = item.defenceStudents
                    obj.defenceDate = item.defenceDate + ',' + item.defenceTime
                    arr.push(obj)
                })
                this.groupList = arr
            })
        },
        //input框clear按钮
        clearBtn(){
            let defenceArr = []
            let groupUrl = rootPath + '/getDefenceGroup?adminId=' + adminId + '&limit=20&page=1&schoolYear=' + semester
            axios.get(groupUrl,{
                headers: {'Authorization' : adminToken}
            }).then(res =>{
                console.log(res)
                //this.groupList = res.data.data
                this.totals = res.data.pageInfo.total
                res.data.data.forEach(item => {
                    let obj = {defenceId:0,defenceName:'',defencePlace:'',defenceStudents: '',defenceTeachs:'',defenceDate:'',defenceLeader:''}
                    obj.defenceId = item.defenceId
                    obj.defenceName = item.defenceName
                    obj.defencePlace = item.defencePlace
                    obj.defenceTeachs = item.defenceTeachs
                    obj.defenceStudents = item.defenceStudents
                    obj.defenceDate = item.defenceDate + ',' + item.defenceTime
                    obj.defenceLeader = item.defenceLeader
                    defenceArr.push(obj)
                })
            })
            this.groupList = defenceArr
        },
        //退出登录
        signOut(){
            let outUrl = rootPath + '/signOut'
            axios.get(outUrl,{headers:{'Authorization': adminToken}}).then(res => {
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
            let currArr = []
            let groupUrl = rootPath + '/getDefenceGroup?adminId=' + adminId + '&limit=20&page=' + val + '&schoolYear=' + semester
            axios.get(groupUrl,{
                headers: {'Authorization' : adminToken}
            }).then(res =>{
                //console.log(res)
                //this.groupList = res.data.data
                this.totals = res.data.pageInfo.total
                res.data.data.forEach(item => {
                    let obj = {defenceId:0,defenceName:'',defencePlace:'',defenceStudents: '',defenceTeachs:'',defenceDate:''}
                    obj.defenceId = item.defenceId
                    obj.defenceName = item.defenceName
                    obj.defencePlace = item.defencePlace
                    obj.defenceTeachs = item.defenceTeachs
                    obj.defenceStudents = item.defenceStudents
                    obj.defenceDate = item.defenceDate + ',' + item.defenceTime
                    currArr.push(obj)
                })
            })
            this.groupList = currArr
        }
    }

})

