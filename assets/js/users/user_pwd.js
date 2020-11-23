$(function () {
  var form = layui.form
  var layer = layui.layer;
 
  form.verify({
    // 设置密码长度
    pwd: [
      /^[\S]{6,12}$/
      ,'密码必须6到12位，且不能出现空格'
    ],
    // 设置确认密码与新密码相同
    samepwd: function(value){
      if(value !== $('#newpwd').val()) return '两次密码不同,请重新输入'
    },
    // 设置原密码与新密码相同
    newpwd: function(value){
      if(value === $('#oldpwd').val()) return '修改密码不可与原密码相同,请重新输入'
    }
  })

  // 提交点击事件
  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: 'http://ajax.frontend.itheima.net/my/updatepwd',
      data: $(this).serialize(),
      headers: {
        Authorization: localStorage.token
      },
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layui.layer.msg(res.message);
        }
        layui.layer.msg(res.message)
        setTimeout((function () {
          window.parent.location.href='/login.html'
          localStorage.removeItem('token')
          }),1000)
        // 重置表单
        $('.layui-form')[0].reset()
      }
    })
  })


})