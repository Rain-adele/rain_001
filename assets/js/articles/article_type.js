$(function () {

    var layer = layui.layer;
    var form = layui.form;
    // 获取文章类型列表
    getMsg()
    
    function getMsg() {
        $.ajax({
            method: 'GET',
            url: 'http://ajax.frontend.itheima.net/my/article/cates',
            headers: {
                Authorization: localStorage.token
            },
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg(res.message)
                // 模板引擎
                var tpl_str = template('tpl', res)
                $('tbody').html(tpl_str);
            }
        })
    }
    //拿到的index是一个重要的凭据，它是诸如layer.close(index)等方法的必传参数。

    // 给添加类别点击事件
    $('.titlebutton').on('click', function (e) {
        e.preventDefault();
        var index = layer.open({
            title: '添加文章分类',
            type: 1,
            area: '500px',
            btnAlign: 'c',
            content: $('#add_article').html(),
            btn: ['确认添加', '重置'],
            yes: function (index, layero) {
                //按钮【按钮一】的回调
                $.ajax({
                    method: 'POST',
                    url: 'http://ajax.frontend.itheima.net/my/article/addcates',
                    headers: {
                        Authorization: localStorage.token
                    },
                    data: $('#add_form').serialize(),
                    success: function (res) {
                        console.log(res);
                        if (res.status !== 0) return layer.msg(res.message);
                        layer.msg(res.message)
                    }
                });
                // 渲染到页面
                getMsg()
                layer.close(index)
            },
            btn2: function (index, layero) {
                //按钮【按钮二】的回调
                // 点击清除内容  重置
                $('#add_form')[0].reset()
                return false //开启该代码可禁止点击该按钮关闭
            }
        })
    })
    
    // 给操作中的编辑添加点击事件
    var index2 = null
    edit()
    function edit() {
        $('tbody').on('click', '#edit', function () {
            var id = $(this).attr('data_id');
            // 创建两个变量接收一下原来的内容
            var oldname='';
            var oldnick='';
            index2 = layer.open({
                title: '修改文章分类',
                type: 1,
                area: '500px',
                content: $('#edit_article').html()
            })
            // $("#reset-btn").on("click",function(){
            //     resetA()
            // })
            // 创建好了表单之后先让页面渲染上去
            $.ajax({
                method: 'GET',
                url: 'http://ajax.frontend.itheima.net/my/article/cates/' + id,
                headers: {
                    Authorization: localStorage.token
                },
                success: function (res) {
                    console.log(res);
                    oldname = res.data.name
                    oldnick = res.data.alias
                    if (res.status !== 0) return layer.msg(res.message);
                    // layer.msg(res.message)
                    form.val('edit_form', res.data)
                    
                }
            });
            // 创建两个变量接收一下原来的内容
                // 然后点击的时候获取变量的内容
            $("#reset-btn").on("click",function(){
                $('[name=name]').val(oldname)
                $('[name=alias]').val(oldnick)
            })
        })
      } 
    //确认修改按钮
    $('body').on('click', '#edit-btn', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: 'http://ajax.frontend.itheima.net/my/article/updatecate',
            headers: {
                Authorization: localStorage.token
            },
            data: $('#edit_form').serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                // layer.msg(res.message)
                // 更新之后重新渲染
                getMsg()
                layer.close(index2)
            }
        })
    })
    // 给操作中的删除添加点击事件
    $('tbody').on('click', '#del', function (e) {
        // console.log('del');
        e.preventDefault()
        var id = $(this).attr('data_id');
        layer.confirm('确认删除吗?', {icon: 3, title:'删除操作'}, function(index){
            $.ajax({
                method: 'GET',
                url:'http://ajax.frontend.itheima.net/my/article/deletecate/'+id,
                headers: {
                    Authorization: localStorage.token
                },
                success: function (res) {
                    console.log(res);
                    getMsg()
                }
            })
            layer.close(index);
          });
        
        
    })

})