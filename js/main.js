// 全局脚本文件 - 模块化结构

// 定义全局应用对象
const App = {
    // 所有初始化函数的集合
    modules: [],
    
    // 注册模块
    registerModule: function(moduleFunction) {
        this.modules.push(moduleFunction);
    },
    
    // 初始化所有模块
    init: function() {
        this.modules.forEach(module => {
            try {
                module();
            } catch (error) {
                console.error('Error initializing module:', error);
            }
        });
    },
    
    // 工具函数
    utils: {
        // 平滑滚动到指定元素或ID
        smoothScroll: function(target, offset = 80) {
            const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
            if (!targetElement) return;
            
            window.scrollTo({
                top: targetElement.offsetTop - offset,
                behavior: 'smooth'
            });
        },
        
        // 检查元素是否在视口中
        isElementInViewport: function(element, threshold = 0.8) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top < window.innerHeight * threshold && 
                rect.bottom > 0
            );
        },
        
        // 防抖函数
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // 节流函数
        throttle: function(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    }
};

// 页面过渡与动画模块
function modulePageTransitions() {
    // 页面加载动画
    document.body.classList.add('page-transition');
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            App.utils.smoothScroll(targetId);
        });
    });
    
    // 滚动动画实现
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const checkFadeElements = App.utils.throttle(() => {
        fadeElements.forEach(element => {
            if (App.utils.isElementInViewport(element)) {
                element.classList.add('visible');
            }
        });
    }, 100);
    
    // 添加滚动事件监听器
    window.addEventListener('scroll', checkFadeElements);
    
    // 初始检查
    checkFadeElements();
}

// 注册模块
App.registerModule(modulePageTransitions);

// 移动端导航菜单模块
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
    
    // 点击菜单按钮切换菜单显示
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        
        // 切换图标
        const icon = menuToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // 点击遮罩层关闭菜单
    overlay.addEventListener('click', function() {
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // 恢复图标
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
    
    // 点击导航链接关闭菜单
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // 恢复图标
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}

// 注册模块
App.registerModule(initMobileMenu);



// 初始化搜索建议功能
function initSearchSuggestions() {
    const searchInput = document.getElementById('searchInput');
    const searchSuggestions = document.getElementById('searchSuggestions');
    let products = [];
    
    // 从products.json加载产品数据
    fetch('data/products.json')
        .then(response => response.json())
        .then(data => {
            // 提取所有产品
            data.categories.forEach(category => {
                products = products.concat(category.products);
            });
            products = products.concat(data.flash_sale);
            products = products.concat(data.new_products);
            
            // 去重
            products = products.filter((product, index, self) => 
                index === self.findIndex((p) => p.id === product.id)
            );
        })
        .catch(error => {
            console.error('Failed to load products data:', error);
        });
    
    // 监听搜索框输入事件
    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        
        // 清空搜索建议
        searchSuggestions.innerHTML = '';
        
        if (query.length === 0) {
            searchSuggestions.classList.remove('show');
            return;
        }
        
        // 过滤搜索建议
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query)
        );
        
        // 最多显示10个搜索建议
        const suggestionsToShow = filteredProducts.slice(0, 10);
        
        if (suggestionsToShow.length > 0) {
            // 创建搜索建议项
            suggestionsToShow.forEach(product => {
                const item = document.createElement('div');
                item.className = 'search-suggestion-item';
                item.innerHTML = `
                    <div class="suggestion-name">${product.name}</div>
                    <div class="suggestion-price">¥${product.price}</div>
                `;
                
                // 点击搜索建议填充到搜索框
                item.addEventListener('click', function() {
                    searchInput.value = product.name;
                    searchSuggestions.classList.remove('show');
                    // 可以在这里添加搜索提交逻辑
                });
                
                searchSuggestions.appendChild(item);
            });
            
            searchSuggestions.classList.add('show');
        } else {
            searchSuggestions.classList.remove('show');
        }
    });
    
    // 点击其他区域关闭搜索建议
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
            searchSuggestions.classList.remove('show');
        }
    });
}

// 搜索建议功能模块
App.registerModule(initSearchSuggestions);

// 平滑滚动功能（已被modulePageTransitions替代）
// function initSmoothScroll() {
//     // 为所有锚点链接添加平滑滚动
//     document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//         anchor.addEventListener('click', function (e) {
//             e.preventDefault();
//             
//             const targetId = this.getAttribute('href');
//             const targetElement = document.querySelector(targetId);
//             
//             if (targetElement) {
//                 targetElement.scrollIntoView({
//                     behavior: 'smooth',
//                     block: 'start'
//                 });
//             }
//         });
//     });
// }

// 页面加载动画
function initPageLoadAnimation() {
    // 添加页面加载完成后的动画效果
    const body = document.body;
    body.classList.add('loaded');
    
    // 为元素添加淡入效果
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // 监听滚动事件，实现元素进入视口时的淡入效果
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// 收藏按钮功能模块
function initFavoriteButton() {
    const favoriteButtons = document.querySelectorAll('.btn-favorite');
    
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
            
            // 可以添加收藏成功的提示
            const isActive = this.classList.contains('active');
            const message = isActive ? '已收藏' : '已取消收藏';
            
            // 简单的提示效果
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = message;
            tooltip.style.cssText = `
                position: absolute;
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 16px;
                border-radius: 4px;
                font-size: 14px;
                z-index: 1000;
                transform: translate(-50%, -120%);
                left: 50%;
                top: 0;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            this.style.position = 'relative';
            this.appendChild(tooltip);
            
            // 显示提示
            setTimeout(() => {
                tooltip.style.opacity = '1';
            }, 100);
            
            // 隐藏并移除提示
            setTimeout(() => {
                tooltip.style.opacity = '0';
                setTimeout(() => {
                    tooltip.remove();
                }, 300);
            }, 1500);
        });
    });
}

// 注册模块
App.registerModule(initFavoriteButton);

// 回到顶部按钮功能模块
function initBackToTop() {
    // 创建回到顶部按钮
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: var(--secondary-color);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(backToTopBtn);
    
    // 监听滚动事件，控制按钮显示/隐藏
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // 点击按钮回到顶部
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 注册模块
App.registerModule(initBackToTop);

// 初始化所有模块
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        App.init();
    });
} else {
    // 页面已经加载完成，直接初始化
    App.init();
}

// 处理联系客服按钮
function initContactButtons() {
    const contactButtons = document.querySelectorAll('.btn-contact, .btn-consult');
    
    contactButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 平滑滚动到页面底部的联系方式区域
            const contactSection = document.querySelector('.contact-section');
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                // 如果没有联系方式区域，滚动到页面底部
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 联系按钮功能模块
App.registerModule(initContactButtons);

// 图片懒加载功能
function initLazyLoading() {
    // 检查浏览器是否支持IntersectionObserver
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    // 替换图片src为data-src
                    if (image.dataset.src) {
                        image.src = image.dataset.src;
                        image.classList.remove('lazy-loading');
                        image.classList.add('lazy-loaded');
                    }
                    // 停止观察已加载的图片
                    imageObserver.unobserve(image);
                }
            });
        });
        
        // 观察所有带有lazy-loading类的图片
        const lazyImages = document.querySelectorAll('.lazy-loading');
        lazyImages.forEach(image => {
            imageObserver.observe(image);
        });
    } else {
        // 不支持IntersectionObserver的浏览器，直接加载所有图片
        const lazyImages = document.querySelectorAll('.lazy-loading');
        lazyImages.forEach(image => {
            if (image.dataset.src) {
                image.src = image.dataset.src;
                image.classList.remove('lazy-loading');
                image.classList.add('lazy-loaded');
            }
        });
    }
}

// 懒加载功能模块
App.registerModule(initLazyLoading);
