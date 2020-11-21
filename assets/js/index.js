$(function () {




    var layer = layui.layer;
    /* 渲染退出操作 */
    $('#exit').on('click', function () {
        // console.log('ok');
        layer.confirm('小主,确定忍心离开吗?', {
            icon: 3,
            title: '退出登录'
        }, function (index) {
            //do something

            layer.close(index);
        });
    })


















})