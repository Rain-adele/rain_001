$(function () {
  getmsg()
  var layer = layui.layer;
  var form = layui.form;


  function getmsg() {
    $.ajax({
      method: 'GET',
      url: 'http://ajax.frontend.itheima.net/my/userinfo',
      headers: {
        Authorization: localStorage.token
      },
      success: function (res) {
        console.log(res);
        // 获取用户名,然后不可选中readonly
        // var username = res.data.nickname || res.data.username;
        // $('#usersname').val(username);
        form.val('formUserInfo', res.data)
      }
    })
  }



  // 提交修改用户个人信息事件
  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    var obj = $('.layui-form').serialize()
    console.log(obj);
    $.ajax({
      method: 'POST',
      url: 'http://ajax.frontend.itheima.net/my/userinfo',
      data: obj,
      headers: {
        Authorization: localStorage.token
      },
      success: function (res) {
        console.log(res);
        if (res.status !== 0) return layer.msg(res.message);

        layer.msg(res.message)
        // 将修改成功的昵称渲染到index页面
        console.log(window.parent);
        window.parent.usermsg()
      }
    })

  })




})