$(function () {
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;
  var total = 0;

  // 定义参数
  var canshu = {
    pagenum: 1,
    pagesize: 5,
    cate_id: '',
    state: ''
  }
  // 1筛选区 获取所有的分类
  // 获取ajax
  $.ajax({
    method: "GET",
    url: "http://ajax.frontend.itheima.net/my/article/cates",
    // data: canshu,
    headers: {
      Authorization: localStorage.token
    },
    success: function (res) {
      if (res.status !== 0) return layer.msg(res.message)
      console.log(res);

      var listStr = template('tpl_type', res)
      $('#type_list').html(listStr)
      // renderPage(res.total)
      form.render()
    }
  })
  // 设置筛选事件
  $('#chooseOn').on('click', function (e) {
    e.preventDefault()
    // console.log($('[name=cate_id]').val());
    canshu.cate_id = $('[name=cate_id]').val()
    canshu.state = $('[name=state]').val()
    $.ajax({
      method: 'GET',
      url: 'http://ajax.frontend.itheima.net/my/article/list',
      data: canshu,
      headers: {
        Authorization: localStorage.token
      },
      success: function (res) {
        console.log(res);
        getList()
      }
    })
  })


  // 文章列表  获取文章列表
  // 2对列表时间进行编辑(过滤器)
  template.defaults.imports.dataFormat = function (a) {
    const dt = new Date(a);
    var y = dt.getFullYear();
    var m = buling(dt.getMonth() + 1);
    var d = buling(dt.getDate());
    var h = buling(dt.getHours());
    var mm = buling(dt.getMinutes());
    var s = buling(dt.getSeconds());
    return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s;
  }
  // 时间补零
  function buling(data) {
    return data = data < 10 ? '0' + data : data;
  }
  getList() //必须放在canshu下面,不然无法执行
  // 获取列表
  function getList() {
    $.ajax({
      method: "GET",
      url: "http://ajax.frontend.itheima.net/my/article/list",
      data: canshu,
      headers: {
        Authorization: localStorage.token
      },
      success: function (res) {
        if (res.status !== 0) return layer.msg(res.message)
        console.log(res);
        total = res.total
        console.log(total);
        var listStr = template('tpl_list', res)
        $('tbody').html(listStr)
        renderPage(res.total)
      }
    })

  }
  console.log(total);//因为total再次赋值是在封装函数中,优先执行console.log()此时还未赋值
  //先是 携带参数跳转(利用url 传值) 在目标页获取url(window.location.href) 获取url中的参数(找现成的处理函数)
  // 编辑事件
  var index = null;
  $('tbody').on('click', '#edit', function (e) {
    e.preventDefault()
    var index = layer.open({
      title: '添加文章分类',
      type: 1,
      area: '500px',
      btnAlign: 'c',
      content: $('#edit_article').html(),
      btn: ['确认修改', '取消'],
      // yes: function (index, layero) {
      //     //按钮【按钮一】的回调
      //     $.ajax({
      //         method: 'POST',
      //         url: 'http://ajax.frontend.itheima.net/my/article/addcates',
      //         headers: {
      //             Authorization: localStorage.token
      //         },
      //         data: $('#add_form').serialize(),
      //         success: function (res) {
      //             console.log(res);
      //             if (res.status !== 0) return layer.msg(res.message);
      //             layer.msg(res.message)
      //         }
      //     });
      //     // 渲染到页面
      //     getMsg()
      //     layer.close(index)
      // },
      // btn2: function (index, layero) {
      //     //按钮【按钮二】的回调
      //     // 点击清除内容  重置
      //     $('#add_form')[0].reset()
      //     return false //开启该代码可禁止点击该按钮关闭
      // }
    })
  })
  // 删除事件
  $('tbody').on('click', '#del', function (e) {
    var id = $(this).attr('data-id');
    var length = $('.del').length
    console.log($('.del').length); //此处不能用id身份证  唯一性 因为每个元素只能有一不同的id
    e.preventDefault()
    layer.confirm('确定要删除吗?小主', {
      icon: 3,
      title: '删除提示'
    }, function (ind) {
      //do something
      $.ajax({
        method: 'GET',
        url: 'http://ajax.frontend.itheima.net/my/article/delete/' + id,
        headers: {
          Authorization: localStorage.token
        },
        success: function (res) {
          // console.log(res);
          if (res.status !== 0) return layer.msg(res.message)
          // 成功则需要重新获取列表 
          // 判断一下页面是不是最后一项也删除了  如果删除了就要跳转至上一页
          if (length == 1) {
            canshu.pagenum = canshu.pagenum > 1 ? canshu.pagenum - 1 : 1
          }
          getList()
        }
      })
      layer.close(ind);
    });
  })
  // 3分页区
  function renderPage(total) {
    //执行一个laypage实例
    laypage.render({
      elem: 'page', //注意，这里的 test1 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      limits: [1,2, 3, 5, 10],
      limit: canshu.pagesize,
      first:'首页',
      last:'尾页',
      curr: canshu.pagenum, // 设置默认被选中的分页
      theme: '#c79',
      layout: ['count', 'limit','first', 'prev', 'page', 'next','last', 'refresh', 'skip'],
      jump: function (obj, first) {
        //obj包含了当前分页的所有参数，比如：
        console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
        console.log(obj.limit); //得到每页显示的条数
        canshu.pagenum = obj.curr
        canshu.pagesize = obj.limit
        // getList()
        //首次不执行
        // 开始就会自动调用first true 然后无限循环
        //  否则为false 若为false 则为正常 不会死循环
        if (!first) {
          getList()
        }
      }
    });
  }
})