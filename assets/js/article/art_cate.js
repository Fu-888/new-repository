$(function () {
  // 获取 渲染数据
  const initArtCateList = () => {
    $.ajax({
      type: 'GET',
      url: '/my/article/cates',
      success(res) {
        // console.log(res);
        // 模板
        const str = template('tpl-table', res);
        $('tbody').empty().html(str);
      },
    });
  };
  initArtCateList();

  // 添加类别
  let index = null;
  $('#btnAddCate').click(function () {
    index = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html(),
    });
    // console.log($('#dialog-add').html());
  });

  // 通过代理监听 submit 事件
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success(res) {
        console.log(res);
        if (res.status !== 0) return layer.msg('新增分类失败!');
        layer.msg('新增分类成功!');
        initArtCateList();
        // 关闭弹出层
        layer.close(index);
      },
    });
  });

  // 通过代理方式，为 btn-edit 按钮绑定点击事件
  let indexEdit = null;
  $('tbody').on('click', '.btn-edit', function () {
    // 弹出修改文章分类的弹窗
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html(),
    });

    //// 发起请求获取对应分类的数据
    const id = $(this).attr('data-id');
    $.ajax({
      type: 'GET',
      url: '/my/article/cates/' + id,
      success(res) {
        console.log(res);
        layui.form.val('form-edit', res.data);
      },
    });
  });

  //// 更新文章分类
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success(res) {
        console.log(res);
        if (res.status !== 0) return layui.msg('更新分类数据失败');
        //   渲染
        initArtCateList();
        // 关闭弹出层
        layer.close(indexEdit);
      },
    });
  });

  // 删除
  $('tbody').on('click', '.btn-delete', function () {
    const id = $(this).data('id');
    // console.log(id);
    // 提示用户是否删除
    layer.confirm('确定删除吗？', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        type: 'GET',
        url: '/my/article/deletecate/' + id,
        success(res) {
          // console.log(res);
          if (res.status !== 0) return layer.msg('删除分类失败！');
          initArtCateList();
          layer.close(index);
        },
      });
    });
  });
});
