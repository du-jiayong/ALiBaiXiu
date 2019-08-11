//创建一个新的数组用来操作元素
var userArr=new Array();
//声明一个全局变量存储用户点击了编辑按钮时数据的id;
var userId='';
 //将用户列表展示出来
$.ajax({
    type:'get',
    url:'/users',
    success:function(res){
        // console.log(res);
        //将获取到的数据放进数组中
        userArr=res;
        // 调用渲染页面的函数将数组中的数据渲染到页面上
        render(userArr);
    }
});
// 调用模板渲染页面
function render(arr){
    // 调用template将字符串进行拼接
    let content=template('userTpl',{
        list:arr
    })
    // console.log(arr);
    // 将拼接好的字符串放进tbody中
    $('tbody').html(content);
}
//添加用户
$('#addBtn').on('click',function(){
    // 发送添加用户的ajax请求
    $.ajax({
        type:'post',
        url:'/users',
        //serialize()是将表单中获取的数据转为字符串格式
        data:$('#userFrom').serialize(),
        success:function(response){
            userArr.push(response)
            render(userArr)
        }
    })
})
//用户头像上传
$('#avatar').on('change',function(){
    // 建立上传文件的函数
    var formData=new FormData();
    // 将用户选择的文件追加在formdata的avater属性上
    formData.append('avater',this.files[0]);
    // 发送添加用户上传头像的ajax请求
    $.ajax({
        type:'post',
        url:'/upload',
        data:formData,
        // 告诉ajax不要解析请求参数
        processData:false,
        //告诉ajax不要设置请求参数的类型
        contentType:false,
        success:function(response){
            // 实现头像预览功能
            $('#preview').attr('src',response[0].avater);
            // 将头像的路径放置在隐藏域中
            $('#hiddenAvatar').val(response[0].avater);
        }
    })
})
//用户编辑修改功能
// 通过事件绑定的方式为修改按钮添加点击事件
$('tbody').on('click','.edit',function(){
    // 当用户点击修改按钮时将页面上的添加用户文案改为修改用户
    $('#userFrom > h2').text('修改用户');
    // 获取每一条用户信息的tr标签
    var trObj=$(this).parents('tr');
    // 获取每条用户信息的头像路径
    var imgSrc=trObj.children(1).children('img').attr('src');
    //将图片路径写入隐藏域中
    $('#hiddenAvatar').val(imgSrc);
    // 如果这条用户信息有头像,就将图片预览在页面上
    if(imgSrc){
        $('#preview').attr('src',imgSrc);
        //如果没有就显示默认图片
    }else{
        $('#preview').attr('src','../assets/img/default.png');
    };
    // 将用户信息写入页面左侧的输入框内
    // 邮箱
    $('#email').val(trObj.children().eq(2).text());   
    //昵称 
    $('#nickName').val(trObj.children().eq(3).text()); 
    // 获取是否激活信息栏中的文本
    var ststus=trObj.children().eq(4).text();
    //若信息栏中的文本是激活时,就将激活的单选框默认为选定状态
    if(status=='激活'){
        $('#jh').prop('checked',true);
        // 若不是则反之
    }else{
        $('#wjh').prop('checked',true);        
    }
    // 与激活框同理
    var role=trObj.children().eq(5).text();
    if(status=='超级管理员'){
        $('#admin').prop('checked',true);
    }else{
        $('#normal').prop('checked',true);        
    }

    $('#addBtn').hide();
    $('#userEdit').show();
    // 用户点击了编辑按钮时将按钮父元素上自定义的id赋值给在上面定义好的全局变量中
    userId=$(this).parent().attr('data-id');
})
//当用户点击修改按钮时将用户修改后的数据保存起来
//为修改按钮绑定点击事件
$('#userEdit').on('click',function(){
    // 当用户点击了修改按钮时发送ajax请求
    $.ajax({
        url:'/users/'+userId,
        type:'put',
        data:$('#userFrom').serialize(),
        success:function(res){
            // 根据id在数组中寻找修改前的数据的索引号
            var index=userArr.findIndex(item=>{
                item._id==userId
            });
            // 将数组中的原数据覆盖
            userArr[index]=res;
            // 从新调用渲染函数对页面进行渲染
            render(userArr)
        }
    })

});

//删除用户
$('tbody').on('click','.del',function(){
    if(confirm('确定要删除吗?')){
        var id=$(this).parent().attr('data-id');
        $.ajax({
            type:'delete',
            url:'/users/'+id,
            success:function(res){
                var index=userArr.findIndex(item=>item._id==id)
                userArr.splice(index,1);
                render(userArr);
            }
        })
    }
})
//给全选按钮添加改变事件
$('#checkall').on('click',function(){
    // 获取全选按钮的状态
    let flag=$(this).prop('checked');
    console.log(flag);
    // 让每一个单选框的状态跟随全选框
    $('#userBox').find('input').prop('checked',flag);
    //判断复选框的状态
    if(flag){
        $('#delsome').show()
    }else{
        $('#delsome').hide()
    }
});
// 给每一个单个的复选框添加点击事件
$('#userBox').on('click','input',function(){
    // 如果单个复选框选中的个数等于单选框总个数的话
    if($('#userBox').find('input').length==$('#userBox input:checked').length){
        // 将全选按钮的状态改为选中状态
        $('#checkall').prop('checked',true);
    }else{
        $('#checkall').prop('checked',false);
    }
    if($('#userBox input:checked').length>1){
        $('#delsome').show()
    }else{
        $('#delsome').hide()
    }
})
//删除多个
$('#delsome').on('click',function(){
    var ids=[];
    var checkUser=$("tbody input:checked");
    checkUser.each(function(k,v){
        var id=v.parentNode.parentNode.children[6].getAttribute('data-id');
        ids.push(id);
    })
    console.log(ids);
    $.ajax({
        type:'delete',
        url:'/users/'+ids.join('-'),
        success:function(res){
            res.forEach(e=>{
                var index=userArr.findIndex(item=>item._id==e._id);
                userArr.splice(index,1);
                render(userArr);
            })
        }
    })
})
