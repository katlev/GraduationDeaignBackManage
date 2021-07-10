//管理员userId
let admiId = window.localStorage.getItem('admiId')
//管理员token
let admiToken = window.localStorage.getItem('admiToken')
//当前学年
let semester = window.localStorage.getItem('semester')
//根路径
let rootPath = 'http://localhost:8080/katle'

var vm = new Vue({
    el:'#app',
    data:{
        currentPage:1,//当前页
        totals:0,//总条数
        dialogAddVisible:false,//添加弹窗
        dialogEditVisible:false,//编辑弹窗
        admiNum:'', //管理员学号
        admiName:'',//管理员姓名
        imgUrl:'',//用户头像
        addTeachInfo:{college:'',email:'',password:'',position:'',username:'',usernum:'',schoolYear:''}, //添加教师内容
        perTeachInfo:{}, //教师个人信息
        teachList:[],
        colleges:[
            {value:'机电工程学院',label:'机电工程学院'},
            {value:'信息与通信学院',label:'信息与通信学院'},
            {value:'计算机与信息安全学院',label:'计算机与信息安全学院'},
            {value:'艺术与设计学院',label:'艺术与设计学院'},
            {value:'商学院',label:'商学院'},
            {value:'外国语学院',label:'外国语学院'},
            {value:'数学与计算科学学院',label:'数学与计算科学学院'},
            {value:'电子工程与自动化学院',label:'电子工程与自动化学院'},
            {value: '法学院',label:'法学院'},
            {value: '材料科学与工程学院',label:'材料科学与工程学院'},
            {value:'生命与环境科学学院',label:'生命与环境科学学院'},
            {value:'建筑与交通工程学院',label:'建筑与交通工程学院'},
            {value:'马克思主义学院',label:'马克思主义学院'}
        ],
        selectId:[],//列表勾选框内容
        teachId:[],  //教师id
        searchValue:{searchNum:'',searchName:'',searchPosition:''},  //搜索项
    },
    mounted(){
        //教师账号列表
        let teachUrl = rootPath + '/getTeachList?limit=20&page=1&userId=' + admiId + '&schoolYear=' + semester
        axios.get(teachUrl,{headers:{'Authorization' : admiToken}}).then(res => {
            console.log(res)
            //this.teachList = res.data.data
            this.totals = res.data.pageInfo.total
            res.data.data.forEach(item => {
                let obj = {college:'',email:'',password:'',position:'',role:'',userId:'',username:'',usernum:''}
                obj.college = item.college
                obj.email = item.email
                obj.password = item.password
                obj.position = item.position
                obj.userId = item.userId
                obj.username = item.username
                obj.usernum = item.usernum
                if(item.role === 'teacher,expert'){
                    obj.role = '指导教师，评阅专家'
                }else if(item.role === 'teacher'){
                    obj.role = '指导教师'
                }
                this.teachList.push(obj)
            })
        } )

        //个人信息
        let perUrl = rootPath + '/getUserInfo?userId=' + admiId
        axios.get(perUrl,{headers:{'Authorization': admiToken}}).then(res => {
            if(res.data.code === 200){
                this.admiName = res.data.data.username
                this.admiNum = res.data.data.usernum
                this.imgUrl = res.data.data.avatar
            }
        })
    },
   methods:{
        //添加
       addStuCheck(){
           let college = this.addTeachInfo.college
           let email = this.addTeachInfo.email
           let password = this.addTeachInfo.password
           let position = this.addTeachInfo.position
           let username = this.addTeachInfo.username
           let usernum = this.addTeachInfo.usernum

           if(college.trim() === '' || email.trim() === '' || password.trim() === '' |
                position.trim() === '' || username.trim() === '' || usernum.trim() === ''){
               alert("输入不为空！")
               return
           }
           let checkEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
           if(!checkEmail.test(email)){
               alert('请输入正确格式的邮箱！')
               return
           }

           let checkUsernum = /^\d{10}$/
           if(!checkUsernum.test(usernum)){
               alert('请输入正确格式的教工号！')
               return
           }

           let checkPassword = /^[0-9A-Za-z]{6,}$/
           if(!checkPassword.test(password)){
               alert('密码至少设置6位，可由数字和字母组成')
               return
           }
           //console.log(checkEmail.test(email))

           let addTeachData = new FormData()
           addTeachData.append('college',college)
           addTeachData.append('email',email)
           addTeachData.append('password',password)
           addTeachData.append('position',position)
           addTeachData.append('schoolYear',semester)
           addTeachData.append('username',username)
           addTeachData.append('usernum',usernum)

           let addUrl = rootPath + '/addTeachAccount'
           this.$confirm(`你确定要添加教师：${usernum+username} 么`,'提示',{
               confirmButtonText:'确定',
               cancelButtonText:'取消',
               type:'info'
           }).then( () => {
               axios.post(addUrl,addTeachData,{
                   headers:{'Authorization' : admiToken}
               }).then( res => {
                   console.log(res)
                   if(res.data.code === 200){
                       this.$message({
                           type:'success',
                           message:'添加成功！'
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
           }).catch(()=> {
               this.$message({
                   type:'info',
                   message:'已取消添加！'
               })
           })

           this.dialogAddVisible = false
       },

        //编辑
       editItem(index,row){
           //console.log(index)
           this.dialogEditVisible = true
           this.perTeachInfo = row

           let titleId = row.userId
           window.localStorage.setItem("titleId",titleId)

       },

       //编辑弹窗确认按钮
       editItemCheck(){
           let titleId = window.localStorage.getItem("titleId")
           let updateTeachUrl = rootPath + '/updateTeachInfo'

           let college = this.perTeachInfo.college
           let email = this.perTeachInfo.email
           let password = this.perTeachInfo.password
           let position = this.perTeachInfo.position
           let username = this.perTeachInfo.username
           let usernum = this.perTeachInfo.usernum

           if(college === '' || email === '' || password === '' ||
                position === '' || username === '' || usernum === ''){
               alert('输入不为空！')
               return
           }

           let checkEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
           if(!checkEmail.test(email)){
               alert('请输入正确格式的邮箱！')
               return
           }

           let checkUsernum = /^\d{10}$/
           if(!checkUsernum.test(usernum)){
               alert('请输入正确格式的学号！')
               return
           }

           let checkPassword = /^[0-9A-Za-z]{6,}$/
           if(!checkPassword.test(password)){
               alert('密码至少设置6位，可由数字和字母组成')
               return
           }
           //console.log(college,email,password,position,usernum,username)

           let teachData = new FormData()
           teachData.append('college',college)
           teachData.append('email',email)
           teachData.append('password',password)
           teachData.append('position',position)
           teachData.append('userId',titleId)
           teachData.append('username',username)
           teachData.append('usernum',usernum)

           this.$confirm(`你确定要修改教师：${usernum+username} 的信息么？`,'提示',{
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type:'info'
           }).then( ()=>{
               axios.put(updateTeachUrl,teachData,{
                   headers: {'Authorization' : admiToken}
               }).then( res=> {
                   console.log(res)
                   if(res.data.code === 200){
                       this.$message({
                           type:'success',
                           message:'修改成功！'
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
       batchDeleteTeach(){
           this.selectId.forEach(item => {
               this.teachId.push(item.userId)
           })

           let teachIdData = this.teachId
           if(teachIdData.length === 0){
               this.$message({
                   type:'error',
                   message:'请选择你要删除的账号'
               })
               return
           }

           let deleteUrl = rootPath +  '/deleteStudent'

           this.$confirm('你确定要删除这些账号么？','提示',{
               confirmButtonText:'确定',
               cancelButtonText:'取消',
               type:'warning'
           }).then(() => {
               axios({
                   method: 'delete',
                   url:deleteUrl,
                   headers:{'Authorization' : admiToken},
                   contentType: 'application/json',
                   data:{
                       userId : teachIdData
                   }
               }).then( res => {
                   console.log(res)
                   if(res.data.code === 200){
                       this.$message({
                           type:'success',
                           message:'删除成功！'
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
           }).catch( () => {
               this.$message({
                   type:'info',
                   message:'已取消删除'
               })
           })

       },
       //指定评阅专家
       setExpert(){
           this.selectId.forEach(item => {
               this.teachId.push(item.userId)
           })

           let teachIdData = this.teachId
           if(teachIdData.length === 0){
               this.$message({
                   type:'error',
                   message:'请选择你要指定的教师'
               })
               return
           }

           let setRole = rootPath + '/setExpert'

           this.$confirm('确定指定这些教师为评阅专家么？','提示',{
               confirmButtonText:'确定',
               cancelButtonText:'取消',
               type:'warning'
           }).then(() => {
               axios({
                   method: 'put',
                   url: setRole,
                   headers:{'Authorization' : admiToken},
                   contentType: 'application/json',
                   data:{
                       userId : teachIdData
                   }
               }).then( res => {
                   console.log(res)
                   if(res.data.code === 200){
                       this.$message({
                           type:'success',
                           message:'设置成功！'
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
           }).catch( () => {
               this.$message({
                   type:'info',
                   message:'已取消设置'
               })
           })

       },
       //查询
       searchTeach(){
           let searchUrl = rootPath + '/findTeach?limit=10&page=1&userId=' + admiId + '&schoolYear=' + semester
           if(this.searchValue.searchPosition !== ''){
               searchUrl += '&position=' + this.searchValue.searchPosition
           }
           if(this.searchValue.searchName !== ''){
               searchUrl += '&username=' + this.searchValue.searchName
           }
           if(this.searchValue.searchNum !== ''){
               searchUrl += '&usernum=' + this.searchValue.searchNum
           }

           axios.get(searchUrl,{
               headers:{'Authorization' : admiToken}
           }).then( res => {
               this.teachList = res.data.data
               this.totals = res.data.pageInfo.total
           }).catch( error => {
               console.log(error.data.message)
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
                       type:'info'
                   })
               }
           })

       },
       //文件导入
       handleUploadFile(res,file){
           //console.log(file)
           let formData = new FormData()
           formData.append('file',file.raw)
           formData.append('schoolYear',semester)

           let fileUrl = rootPath + '/uploadTeach'
           axios({
               method: 'post',
               url: fileUrl,
               headers: {'Authorization': admiToken},
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
                   })
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
                   message: '请求失败'
               })
           })

       },
       //input框clear按钮
       clearBtn(){
           let teachUrl = rootPath + '/getTeachList?limit=20&page=1&userId=' + admiId + '&schoolYear=' + semester
           axios.get(teachUrl,{headers:{'Authorization' : admiToken}}).then(res => {
               console.log(res)
               //this.teachList = res.data.data
               this.totals = res.data.pageInfo.total
               res.data.data.forEach(item => {
                   let obj = {college:'',email:'',password:'',position:'',role:'',userId:'',username:'',usernum:''}
                   obj.college = item.college
                   obj.email = item.email
                   obj.password = item.password
                   obj.position = item.position
                   obj.userId = item.userId
                   obj.username = item.username
                   obj.usernum = item.usernum
                   if(item.role === 'teacher,expert'){
                       obj.role = '指导教师，评阅专家'
                   }else if(item.role === 'teacher'){
                       obj.role = '指导教师'
                   }
                   this.teachList.push(obj)
               })
           })
       },
       //分页
       handleCurrentChange(val){
           console.log(`当前页${val}`)
           let list = []
           let teachUrl = rootPath + '/getTeachList?limit=20&page=' + val + '&userId=' + admiId + '&schoolYear=' + semester
           axios.get(teachUrl,{headers:{'Authorization' : admiToken}}).then(res => {
               console.log(res)
               //this.teachList = res.data.data
               this.totals = res.data.pageInfo.total

               res.data.data.forEach(item => {
                   let obj = {college:'',email:'',password:'',position:'',role:'',userId:'',username:'',usernum:''}
                   obj.college = item.college
                   obj.email = item.email
                   obj.password = item.password
                   obj.position = item.position
                   obj.userId = item.userId
                   obj.username = item.username
                   obj.usernum = item.usernum
                   if(item.role === 'teacher,expert'){
                       obj.role = '指导教师，评阅专家'
                   }else if(item.role === 'teacher'){
                       obj.role = '指导教师'
                   }
                   list.push(obj)
               })
           } )
           this.teachList = list
       }
   }


})