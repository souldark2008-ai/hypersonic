document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('#sidebar a');
  const sections = document.querySelectorAll('section, h1, h2, h3, div#ref-section');
  const backToTopBtn = document.getElementById('back-to-top');
  const progressBar = document.getElementById('progress-bar');
  
  // 1. 智能滚动监听 (IntersectionObserver)
  // 使用更精细的 rootMargin，聚焦于视口上部 30% 区域，符合阅读习惯
  const observerOptions = {
    root: null,
    rootMargin: '-10% 0px -70% 0px', 
    threshold: [0, 0.1]
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        // 部分 section 可能没 id，查找内部第一个 heading 的 id
        const targetId = id || entry.target.querySelector('h1, h2, h3')?.getAttribute('id');

        if (targetId) {
          updateActiveLink(targetId);
        }
      }
    });
  }, observerOptions);

  // 观察所有主要章节
  sections.forEach(section => {
    // 优先观察 section 标签，如果文档中主要是 h2/h3 则观察标题
    if (section.tagName === 'SECTION' || section.tagName === 'DIV') {
      observer.observe(section);
    } else if (section.tagName.startsWith('H') && !section.closest('section')) {
       // 如果标题不在 section 容器内（兼容旧结构），直接观察标题
       observer.observe(section);
    }
  });

  function updateActiveLink(id) {
    // 移除所有高亮
    navLinks.forEach(link => link.classList.remove('active'));
    
    // 查找目标链接
    const activeLink = document.querySelector(`#sidebar a[href="#${id}"]`);
    
    if (activeLink) {
      activeLink.classList.add('active');
      
      // 处理父级菜单高亮（如果当前激活的是二级菜单，父级也保持微亮）
      const parentLi = activeLink.closest('ul').closest('li');
      if (parentLi) {
        const parentLink = parentLi.querySelector('a');
        if (parentLink && parentLink !== activeLink) {
          parentLink.classList.add('active'); // 或者可以添加一个 'parent-active' 类做区分样式
        }
      }

      // 自动滚动侧边栏以保持可见
      activeLink.scrollIntoView({
        block: 'nearest',
        inline: 'center', // 移动端关键
        behavior: 'smooth'
      });
    }
  }

  // 2. 阅读进度条
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if(progressBar) {
      progressBar.style.width = scrolled + "%";
    }

    // 回到顶部按钮显示逻辑
    if (winScroll > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  // 3. 回到顶部点击
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // 4. 导航点击平滑滚动优化
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // 移动端点击后，计算 header 偏移量
        const offset = window.innerWidth < 768 ? 100 : 40;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
  
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
        
        // 立即手动设置 active 避免滚动延时
        updateActiveLink(targetId);
      }
    });
  });
});
