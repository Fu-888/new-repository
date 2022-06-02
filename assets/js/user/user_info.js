$(function () {
  const form = layui.form;
  // 自定义校验规则
  form.verify({
    nickname: (val) => {
      if (val.length > 6) return alert('昵称长度必须在 1 ~ 6 个字符之间！');
    },
  });

  // 初始化用户信息
  const getUserInfo = () => {
    $.ajax({
      type: 'GET',
      url: '/my/userinfo',
      success(res) {
        if (res.status !== 0) return layui.msg('获取用户信息失败！');
        // console.log(res);
        // 调用 form.val() 方法为表单赋值
        form.val('formUserInfo', res.data);
      },
    });
  };
  getUserInfo();

  // 重置表单数据
  $('#btnSeset').click((e) => {
    e.preventDefault();
    // 重置初始化用户信息
    getUserInfo();
  });

  // 更新用户数据
  $('.layui-form').submit(function (e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success(res) {
        console.log(res);
        if (res.status !== 0) return layer.msg('更新用户信息失败！');
        // 调用父页面渲染函数
        window.parent.getUserInfo();
      },
    });
  });
  
});
