// 获取用户的基本信息
function getUserInfo() {
  $.ajax({
    type: 'GET',
    url: '/my/userinfo',
    // headers: {
    //   Authorization: localStorage.getItem('token'),
    // },
    success(res) {
      // console.log(res);
      if (res.status !== 0) return layer.msg('获取用户信息失败');
      // layer.msg('获取用户信息成功');
      renderAvatar(res.data);
    },
  });
}

getUserInfo();

// 渲染数据
const renderAvatar = (user) => {
  // console.log(user);

  //获取名字
  let uname = user.nickname || user.username;
  // 渲染欢迎语
  $('#welcome').html(`欢迎 ${uname}`);

  if (user.user_pic !== null) {
    // 渲染图片
    $('.layui-nav-img').attr('src', user.user_pic);
    $('.text-avatar').hide();
  } else {
    // 渲染文本
    $('.layui-nav-img').hide();
    $('.text-avatar').html(uname[0].toUpperCase());
  }
};

// 退出
$('#btnout').on('click', function(){
    // console.log(11);
    layui.layer.confirm(
      '确定退出登录？',
      { icon: 3, title: '' },
      function () {
        // 清空本地存储里面的 token
        localStorage.removeItem('token');
        // 重新跳转到登录页面
        location.href = '/login.html';
      }
    );
});

function change(){
  $("#change").attr('class','layui-this').next().attr('class','')
}
