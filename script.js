/*
  此脚本用于处理导航栏交互，突出显示当前激活的导航链接。
*/

document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('#sidebar a');
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
});