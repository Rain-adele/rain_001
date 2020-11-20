$(function () {

    // 点击a 转换登录注册页面
    $('#goreg').on('click', function () {
        $('.login').hide();
        $('.reg').show();
    })
    $('#gologin').on('click', function () {
        $('.login').show();
        $('.reg').hide();
    })


    // 注册时密码一致
    var layer = layui.layer;
    var form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samepwd: function (value) {
            // 拿到密码框中的内容和确认密码做判断
            var pwd = $('.regpwd').val()
            if (value !== pwd) return '两次输入的密码不一致耶'
        }
    })



    // 注册账号事件
    var timer = null;
    $('.btn-reg').on('click', function (e) {
        e.preventDefault();
        var username = $('.reg .regname').val();
        var password = $('.reg .regpwd').val();
        $.ajax({
            type: 'POST',
            url: 'http://ajax.frontend.itheima.net/api/reguser',
            data: {
                username,
                password
            },
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg(res.message);
                // 注册成功则跳转至登录页面
                timer = setTimeout(function () {
                    $('#gologin').click()
                }, 1000)

            }
        })

    })

    // 登录提交事件
    $('.btn-login').on('click', function (e) {
        e.preventDefault();
        var username = $('.login .regname').val();
        var password = $('.login .regpwd').val();
        $.ajax({
            type: 'POST',
            url: 'http://ajax.frontend.itheima.net/api/login',
            data: {
                username,
                password
            },
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg(res.message);
                // 登录成功则跳转至首页页面
                timer = setTimeout(function () {
                    localStorage.setItem("token", res.token);
                    location.href = '/index.html';
                }, 1000)
            }
        })
    })
























})