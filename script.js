document.addEventListener('DOMContentLoaded', function () {
  // 1. 滚动监听 (Scroll Spy)
  const sections = document.querySelectorAll('h1, h2, h3');
  const navLinks = document.querySelectorAll('#sidebar a');
  
  const observerOptions = {
    root: null,
    rootMargin: '-100px 0px -70% 0px', // 调整触发区域
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        if (id) {
          // 移除旧的 active 类
          navLinks.forEach(link => link.classList.remove('active'));
          // 给对应的链接添加 active 类
          const activeLink = document.querySelector(`#sidebar a[href="#${id}"]`);
          if (activeLink) {
            activeLink.classList.add('active');
            
            // 确保侧边栏滚动到当前高亮位置
            if(window.innerWidth > 900) { // 仅在桌面端自动滚动侧边栏
              activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
               // 移动端横向滚动
               activeLink.scrollIntoView({ inline: 'center', behavior: 'smooth' });
            }
          }
        }
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });

  // 2. 回到顶部按钮逻辑
  const backToTopBtn = document.getElementById('back-to-top');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // 3. 点击导航链接时的平滑处理
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // 移除所有激活状态并立即激活当前点击的（防止滚动延迟导致的高亮跳动）
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
});
