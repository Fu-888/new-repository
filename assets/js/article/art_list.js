$(function () {
  const form = layui.form;
  const laypage = layui.laypage;
  // 定义一个查询的参数对象，将来请求数据的时候，
  // 需要将请求参数对象提交到服务器
  const q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '', // 文章的发布状态
  };

  //   获取数据
  const initTable = () => {
    $.ajax({
      type: 'GET',
      url: '/my/article/list',
      data: q,
      success(res) {
        // console.log(res);
        if (res.status !== 0) return layer.msg('获取文章列表失败');
        const str = template('tpl-table', res);
        $('tbody').html(str);
        //  / 调用渲染分页的方法
        renderPage(res.total);
      },
    });
  };
  initTable();

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);
    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());
    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());
    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
  };

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n;
  }

  // 初始化文章分类的方法
  const initCate = () => {
    $.ajax({
      type: 'GET',
      url: '/my/article/cates',
      success(res) {
        // console.log(res);
        if (res.status !== 0) return layer.msg('获取分类数据失败');
        const str = template('tpl-cate', res);
        $('[name=cate_id]').html(str);
        // 通过 layui 重新渲染表单区域的UI结构
        form.render();
      },
    });
  };
  initCate();

  //   提交事件 实现筛选的功能
  $('#form-search').submit((e) => {
    e.preventDefault();
    // 修改查询参数对象 q 中对应的属性值
    q.cate_id = $('[name=cate_id]').val();
    q.state = $('[name=state]').val();
    // 根据最新的筛选条件，重新渲染表格的数据
    initTable();
  });

  // 定义渲染分页的方法
  function renderPage(total) {
    // 调用 laypage.render() 方法来渲染分页的结构
    laypage.render({
      elem: 'pageBox', // 分页容器的 Id
      count: total, // 总数据条数
      limit: q.pagesize, // 每页显示几条数据
      curr: q.pagenum, // 设置默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10], // 每页展示多少条
      // 分页发生切换的时候，触发 jump 回调
      jump(obj, first) {
        console.log(obj);
        console.log(first);
        // 把最新的页码值，赋值到 q 这个查询参数对象中
        q.pagenum = obj.curr;
        q.pagesize = obj.limit;
        // 只有切换的时候,才能触发
        if (!first) initTable();
      },
    });
  }

  //   删除
  $('tbody').on('click', '.btn-delete', function () {
    // 获取删除按钮的个数
    let len = $('.btn-delete').length;
    console.log(len);
    const id = $(this).data('id');
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        type: 'get',
        url: '/my/article/delete/' + id,
        success(res) {
          console.log(res);
          if (res.status !== 0) return layer.msg('删除文章失败');

          if (len === 1) {
            // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
            // 页码值最小必须是 1
            // q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          initTable();
          layer.close(index);
        },
      });
    });
  });
});
