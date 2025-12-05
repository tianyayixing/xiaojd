// Banner轮播脚本

// Banner轮播类
class BannerCarousel {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;
        
        this.slider = this.container.querySelector('.banner-slider');
        this.slides = this.container.querySelectorAll('.banner-item');
        this.prevArrow = this.container.querySelector('.banner-arrow.prev');
        this.nextArrow = this.container.querySelector('.banner-arrow.next');
        this.indicators = this.container.querySelector('.banner-indicators');
        
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5秒自动切换
        
        this.init();
    }
    
    init() {
        // 创建指示器
        this.createIndicators();
        
        // 初始化轮播位置
        this.updateSliderPosition();
        
        // 初始化指示器状态
        this.updateIndicators();
        
        // 绑定事件
        this.bindEvents();
        
        // 启动自动播放
        this.startAutoPlay();
    }
    
    // 创建指示器
    createIndicators() {
        if (!this.indicators) return;
        
        this.indicators.innerHTML = '';
        
        for (let i = 0; i < this.totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'banner-indicator';
            indicator.dataset.index = i;
            
            // 添加点击事件
            indicator.addEventListener('click', () => {
                this.goToSlide(i);
            });
            
            this.indicators.appendChild(indicator);
        }
        
        // 获取所有指示器元素
        this.indicatorItems = this.container.querySelectorAll('.banner-indicator');
    }
    
    // 更新轮播位置
    updateSliderPosition() {
        if (!this.slider) return;
        
        const slideWidth = 100; // 百分比
        const newPosition = -this.currentIndex * slideWidth;
        this.slider.style.transform = `translateX(${newPosition}%)`;
    }
    
    // 更新指示器状态
    updateIndicators() {
        if (!this.indicatorItems) return;
        
        this.indicatorItems.forEach((indicator, index) => {
            if (index === this.currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    // 绑定事件
    bindEvents() {
        // 箭头点击事件
        if (this.prevArrow) {
            this.prevArrow.addEventListener('click', () => {
                this.prevSlide();
            });
        }
        
        if (this.nextArrow) {
            this.nextArrow.addEventListener('click', () => {
                this.nextSlide();
            });
        }
        
        // 鼠标悬停时停止自动播放
        this.container.addEventListener('mouseenter', () => {
            this.stopAutoPlay();
        });
        
        // 鼠标离开时恢复自动播放
        this.container.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });
    }
    
    // 上一张
    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.updateSliderPosition();
        this.updateIndicators();
    }
    
    // 下一张
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        this.updateSliderPosition();
        this.updateIndicators();
    }
    
    // 跳转到指定幻灯片
    goToSlide(index) {
        this.currentIndex = index;
        this.updateSliderPosition();
        this.updateIndicators();
    }
    
    // 启动自动播放
    startAutoPlay() {
        this.stopAutoPlay(); // 先停止已有定时器
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    // 停止自动播放
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// 初始化Banner轮播
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否存在Banner容器
    const bannerContainer = document.querySelector('.banner');
    if (bannerContainer) {
        // 创建Banner轮播实例
        const bannerCarousel = new BannerCarousel('.banner');
        
        // 将实例保存到window对象，方便调试
        window.bannerCarousel = bannerCarousel;
    }
});
