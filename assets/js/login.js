$(function () {
  // 点击去注册账号让 登录框隐藏，注册框显示
  $('#link_reg').click(() => {
    $('.login-box').hide();
    $('.reg-box').show();
  });

  // 点击去登录,让注册框隐藏，登录框显示
  $('#link_login').click(() => {
    $('.reg-box').hide();
    $('.login-box').show();
  });

  //  从 Layui 中获取
  const form = layui.form;
  const layer = layui.layer;

  //   通过 form.verify() 方法自定义校验规则
  form.verify({
    //   自定义一个叫 pwd 的校验规则
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    repwd: (value) => {
      //    获取密码的val;
      const pwd = $('#form_reg  [name=password]').val();
      //   跟确认密码进行对比
      if (pwd !== value) return '两次密码不一致';
    },
  });

  //   地址
//   const baseURL = `http://www.liulongbin.top:3007`;
  //   表单提交事件
  $('#form_reg').on('submit', (e) => {
    //   阻止默认事件
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url:'/api/reguser',
      data: {
        username: $('#form_reg  [name=username]').val(),
        password: $('#form_reg  [name=password]').val(),
      },
      success(res) {
        //   console.log(res);
        // 判断是否成功
        if (res.status !== 0) return layer.msg('注册失败');
        layer.msg('注册成功!');
        //   让登录页面出现
        $('#link_login').click();
      },
    });
  });

  //   登陆
  $('#form_login').on('submit',function(e){
      e.preventDefault();
      $.ajax({
          type:'POST',
          url:'/api/login',
          data:$(this).serialize(),
          success(res){
            //   console.log(res);
              if (res.status!==0)return layer.msg('注册失败');
              localStorage.setItem('token',res.token);
              location.href='/index.html';
          }
      })
  });
  
});
