$('#resetBtn').on('submit',function(){
    // if($("#old").val()==''){
    //     alert('请输入旧密码');
    //     return false;       
    // }
    //  if($("#password").val()==''){
    //     alert('请输入新密码');
    //     return false;       
    // } 
    // if($("#confirm").val()==''){
    //     alert('请再次输入新密码')
    // return false;       
    // }
    // 获取表单提交的数据并转换为我们需要的格式
    var formData=$(this).serialize();
    $.ajax({
        url:'/users/password',
        type:'put',
        data:formData,
        success:function(){
            location.href='/admin/login.html'
        }
    })
    return false;
})