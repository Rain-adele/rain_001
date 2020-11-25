$(function () {
    var form = layui.form;
    var layer = layui.layer;
    // 第一行
    var title = $('[name=title]').val();

    // 第二行
    type()
    // 直接调用文章分类
    function type() {
        $.ajax({
            method: 'GET',
            url: 'http://ajax.frontend.itheima.net/my/article/cates',
            headers: {
                Authorization: localStorage.token
            },
            success: function (res) {
                // console.log(res);
                var typeStr = template('tpl_type', res)
                // console.log(typeStr);
                $('#types').html(typeStr);
                form.render()

            }
        })
    }
    // 第三行
    // 初始化富文本编辑器
    initEditor()
    // 第四行
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为上传按钮绑定change事件
    $('#chooseimg').on('click', function (e) {
        // e.preventDefault()
        $('#file-upload').click();

    })
    // 对点击ipt文件上传设置点击事件获取上传的文件
    $('#file-upload').on('change', function (e) {
        // 拿到用户选择的文件    数组形式
        var file = e.target.files
        // console.log(file);
        // 根据选择的文件， 创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file[0])
        // console.log(newImgURL);
        // 先销毁旧的裁剪区域， 再重新设置图片路径， 之后再创建新的裁剪区域：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })
    var state = '已发布'
    // 当点击草稿事件
    $('#save').on('click', function () {
        state = '草稿'
    })
    // 第五行 发布
    $('form').on('submit', function (e) {
        e.preventDefault()
        // console.log('ok');
        var fd = new FormData($(this)[0])
        // console.log(fd);
        // 传入发布属性
        fd.append('state', state)
        // 4. 将裁剪后的图片， 输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                public(fd)
            })

    })
    // 上传新文章的
    function public(fd) {
            $.ajax({
                method: 'POST',
                url: 'http://ajax.frontend.itheima.net/my/article/add',
                headers: {Authorization: localStorage.token},
                data: fd,
                // 注意：如果向服务器提交的是 FormData 格式的数据，
                // 必须添加以下两个配置项
                contentType: false,
                processData: false,
                success: function (res) {
                    if(res.status !== 0) return layer.msg(res.message)
                    
                    layer.msg(res.message)
                    console.log(res);
                    // 上传成功之后跳转至列表页面
                    setTimeout(function(){
                    location.href="/article/article_list.html"
                    },1000)
                }
            })
    }















})