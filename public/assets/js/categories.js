// 添加分类
var cArr = new Array;
//当添加分类的表单发生了提交行为时
$("#addCategory").on('submit', function () {
    // 获取用户在表单中输入的内容
    var formData = $(this).serialize();
    $.ajax({
        type: 'post',
        url: '/categories',
        data: formData,
        success: function (res) {
            //将获取到的数据添加到我们创建的新数组中
            cArr.push(res);
            // 渲染这个数组
            render(cArr)
        }
    })
    // 阻止点击提交按钮表单默认提交行为或者将提交按钮属性改为button
    return false;
})
// 展示分类
$.ajax({
    type: 'get',
    url: '/categories',
    success: function (res) {
        //用获取到的数据将新数组中的数据进行覆盖更新
        cArr = res;
        // 渲染这个数组
        render(cArr);
    }
})
//创建一个函数用来渲染页面
function render(arr) {
    var str = template('cTpl', {
        list: arr
    })
    $("tbody").html(str)
}

//给全选按钮添加改变事件
$('#checkall').on('click', function () {
    // 获取全选按钮的状态
    let flag = $(this).prop('checked');
    // 让每一个单选框的状态跟随全选框
    $('#userBox').find('input').prop('checked', flag);
    //判断复选框的状态
    if (flag) {
        $('#delsome').show()
    } else {
        $('#delsome').hide()
    }
});
// 给每一个单个的复选框添加点击事件
$('#userBox').on('click', 'input', function () {
    // 如果单个复选框选中的个数等于单选框总个数的话
    if ($('#userBox').find('input').length == $('#userBox input:checked').length) {
        // 将全选按钮的状态改为选中状态
        $('#checkall').prop('checked', true);
    } else {
        $('#checkall').prop('checked', false);
    }
    //设置批量删除按钮是否显示
    if ($('#userBox input:checked').length > 1) {
        $('#delsome').show()
    } else {
        $('#delsome').hide()
    }
})
//删除用户
$('tbody').on('click', '.del', function () {
    if (confirm('确定要删除吗?')) {
        //获取需要删除数据的id
        var id = $(this).attr('data-id');
        $.ajax({
            type: 'delete',
            url: '/categories/' + id,
            success: function (res) {
                var index = cArr.findIndex(item => item._id == id)
                cArr.splice(index, 1);
                render(cArr);
            }
        })
    }
})
// 给批量删除按钮注册点击事件 
$('.btn-sm').on('click', function () {
    var ids = [];
    // 想要获取被选中的元素的id属性值 
    var checkUser = $('tbody input:checked');
    // 对checkUser对象进行遍历
    checkUser.each(function (k, v) {
        //获取需要删除数据的id
        var id = v.parentNode.parentNode.children[3].getAttribute('data-id');
        // 将id放入数组中
        ids.push(id);
    });
    // return;
    // 发送ajax
    $.ajax({
        type: 'delete',
        // 将数字转换为我们需要的方式调用join方法将id之间用'-'分割开进行提交
        url: '/categories/' + ids.join('-'),
        success: function (res) {
            // res是这一个数组 数组里面放的被删除的元素 元素是一个对象 
            res.forEach(e => {
                var index = cArr.findIndex(item => item._id == e._id);
                // 调用splice()删除
                cArr.splice(index, 1);
                // 重新渲染
                render(cArr);
            })
        }
    })
});
// 编辑功能 
var cId;
$('tbody').on('click', '.edit', function () {
    //获取需要修改的数据的id
    cId = $(this).attr('data-id');
    // 将页面上的增加数据文案改为修改数据
    $('#addCategory > h2').text('修改分类');
    // 获取右边表格中的需要修改的数据
    var title = $(this).parents('tr').children().eq(1).text();
    var className = $(this).parents('tr').children().eq(2).text();
    // 将表格中的数据填入左侧的修改框中
    $('#title').val(title);
    $('#className').val(className);
    // 将添加数据按钮隐藏,将修改按钮显示出来
    $('#cAdd').hide();
    $('#cEdit').show();
});
// 给修改按钮添加点击事件
$('#cEdit').on('click', function () {
    // 将用户修改后的数据用serialize()方法修改为提交需要的格式
    var dataForm = $('#addCategory').serialize();
    // console.log(dataForm);
    $.ajax({
        type: 'put',
        url: '/categories/' + cId,
        data: dataForm,
        success: function (res) {
            var index = cArr.findIndex(item => item._id == cId);
            //   console.log(res);
            //   console.log(index);
            // 根据这个index找到数组的这个元素 将它的数据更新 
            cArr[index] = res;
            // 调用render方法 重新渲染页面 
            render(cArr);
            // 数据提交以后将左侧的文本框进行清空
            $('#title').val('');
            $('#className').val('');
            $('#cAdd').show();
            $('#cEdit').hide();
        }
    });
    // 阻止点击提交按钮表单默认提交行为或者将提交按钮属性改为button
    return false
});