$(function () {
var layer = layui.layer;

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    // 为上传按钮绑定上传文件框事件
    $('#submit').on('click', function (e) {
        $('#file').click()
        file()


    })

    function file() {
        $('#file').on('change', function (e) {
            // 拿到选择的文件
            var file = e.target.files[0]
            // 创建一个文件对应的URL
            var newImgURL = URL.createObjectURL(file) 
            console.log(file)
            console.log(newImgURL);
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
            // var dataURL = $image
            //     .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            //         width: 100,
            //         height: 100
            //     })
            //     .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串    

        })
    }

    // 确定按钮绑定事件
    $('#certain').on('click',function () {
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png,image/jpg') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

            // 将头像上传到服务器
            $.ajax({
                method: 'POST',
                url: 'http://ajax.frontend.itheima.net/my/update/avatar',
                data:{avatar:dataURL},
                headers: {Authorization:localStorage.token},
                success:function(res){
                    if(res.status !== 0) return layer.msg(res.message);
                    layer.msg(res.message)
                    // 主页面刷新一下
                    window.parent.usermsg()
                }
            })
    })
})