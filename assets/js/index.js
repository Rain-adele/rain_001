$(function () {
    usermsg()

    var layer = layui.layer;
    /* 渲染退出操作 */
    $('#exit').on('click', function () {
        // console.log('ok');
        layer.confirm('小主,确定忍心离开吗?', {
            icon: 3,
            title: '退出登录'
        }, function (index) {
            //do something
            // 跳转至登录页面
            location.href = '/login.html'
            // 删除存储的token
            localStorage.removeItem('token')
            // 自己关闭弹出框
            layer.close(index);
        });
    })

})

// 封装函数获取个人信息
function usermsg() {
    $.ajax({
        method: 'GET',
        url: 'http://ajax.frontend.itheima.net/my/userinfo',
        headers: {
            Authorization: localStorage.token
        },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
              }
            console.log(res);
            //  修改欢迎部分用户名
            var username = res.data.nickname || res.data.username;
            console.log(username);
            $('#welcome').html('Welcome&nbsp;' + username);
            $('#titlename').html(username);
            //  修改显示图片
            var user_pic = res.data.user_pic;
            // console.log(user_pic);
            var first = username[0].toUpperCase()
            // 根据user_pic的值是否为null
            if (user_pic == null) {
                $('.selfpic').hide();
                $('.wordpic').html(first).show()
            } else {
                $('.selfpic').attr('src', user_pic).show();
                $('.wordpic').hide()
            }
        }
    })
}