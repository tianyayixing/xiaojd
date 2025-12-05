// 商品详情页脚本

// 商品详情类
class ProductDetail {
    constructor() {
        this.init();
    }
    
    init() {
        // 初始化商品图片轮播
        this.initProductCarousel();
        
        // 初始化规格选择功能
        this.initSpecSelection();
        
        // 初始化详情标签切换
        this.initDescriptionTabs();
    }
    
    // 商品图片轮播
    initProductCarousel() {
        const mainImage = document.querySelector('.product-main-image img');
        const thumbnails = document.querySelectorAll('.product-thumbnail');
        
        if (!mainImage || !thumbnails.length) return;
        
        thumbnails.forEach((thumbnail, index) => {
            // 为缩略图添加点击事件
            thumbnail.addEventListener('click', () => {
                // 更新主图
                const thumbnailImage = thumbnail.querySelector('img');
                if (thumbnailImage && thumbnailImage.src) {
                    mainImage.src = thumbnailImage.src;
                }
                
                // 更新缩略图选中状态
                thumbnails.forEach((thumb, i) => {
                    if (i === index) {
                        thumb.classList.add('active');
                    } else {
                        thumb.classList.remove('active');
                    }
                });
            });
            
            // 默认激活第一张缩略图
            if (index === 0) {
                thumbnail.classList.add('active');
            }
        });
    }
    
    // 规格选择功能
    initSpecSelection() {
        const specOptions = document.querySelectorAll('.spec-option');
        const priceElement = document.querySelector('.price-main');
        
        if (!specOptions.length || !priceElement) return;
        
        // 商品价格数据（模拟）
        const productPrices = {
            // 尺寸价格映射
            'size-6': 168,
            'size-8': 228,
            'size-10': 298,
            'size-12': 368,
            // 甜度价格映射（假设不同甜度有不同价格）
            'sweetness-normal': 0,
            'sweetness-less': 10,
            'sweetness-none': 20
        };
        
        // 当前选中的规格
        let currentSpecs = {
            size: 'size-6',
            sweetness: 'sweetness-normal'
        };
        
        // 更新价格函数
        const updatePrice = () => {
            // 计算总价格
            const sizePrice = productPrices[currentSpecs.size] || 0;
            const sweetnessPrice = productPrices[currentSpecs.sweetness] || 0;
            const totalPrice = sizePrice + sweetnessPrice;
            
            // 更新价格显示
            priceElement.textContent = `¥${totalPrice}`;
        };
        
        // 为规格选项添加点击事件
        specOptions.forEach(option => {
            option.addEventListener('click', () => {
                const specGroup = option.closest('.spec-group');
                if (!specGroup) return;
                
                const specType = specGroup.dataset.type || 'size';
                const specValue = option.dataset.value;
                
                // 更新当前选中的规格
                if (specValue) {
                    currentSpecs[specType] = specValue;
                }
                
                // 移除同组其他选项的选中状态
                const groupOptions = specGroup.querySelectorAll('.spec-option');
                groupOptions.forEach(opt => {
                    opt.classList.remove('active');
                });
                
                // 添加当前选项的选中状态
                option.classList.add('active');
                
                // 更新价格
                updatePrice();
            });
        });
        
        // 初始化价格
        updatePrice();
    }
    
    // 详情标签切换
    initDescriptionTabs() {
        const tabs = document.querySelectorAll('.description-tab');
        const tabContents = document.querySelectorAll('.tab-content');
        
        if (!tabs.length || !tabContents.length) return;
        
        tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                // 更新标签选中状态
                tabs.forEach((t, i) => {
                    if (i === index) {
                        t.classList.add('active');
                    } else {
                        t.classList.remove('active');
                    }
                });
                
                // 更新内容显示
                tabContents.forEach((content, i) => {
                    if (i === index) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
            
            // 默认激活第一个标签
            if (index === 0) {
                tab.classList.add('active');
                if (tabContents[index]) {
                    tabContents[index].classList.add('active');
                }
            }
        });
    }
}

// 初始化商品详情页
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否是商品详情页
    const productDetailPage = document.querySelector('.product-detail');
    if (productDetailPage) {
        // 创建商品详情实例
        const productDetail = new ProductDetail();
        
        // 将实例保存到window对象，方便调试
        window.productDetail = productDetail;
    }
});

// 商品列表页筛选和排序功能
function initFilterSort() {
    const filterItems = document.querySelectorAll('.filter-item');
    const sortItems = document.querySelectorAll('.sort-item');
    
    // 筛选功能
    filterItems.forEach(item => {
        item.addEventListener('click', function() {
            // 切换选中状态
            this.classList.toggle('active');
            
            // 这里可以添加筛选逻辑
            // 例如：获取所有选中的筛选条件，然后过滤商品列表
            const selectedFilters = document.querySelectorAll('.filter-item.active');
            const filterValues = Array.from(selectedFilters).map(item => item.dataset.filter);
            
            console.log('选中的筛选条件:', filterValues);
            
            // 模拟筛选效果
            // 实际项目中可以根据筛选条件显示/隐藏商品卡片
        });
    });
    
    // 排序功能
    sortItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除其他排序项的选中状态
            sortItems.forEach(sortItem => {
                sortItem.classList.remove('active');
            });
            
            // 添加当前排序项的选中状态
            this.classList.add('active');
            
            // 获取排序类型
            const sortType = this.dataset.sort || 'default';
            
            console.log('排序类型:', sortType);
            
            // 模拟排序效果
            // 实际项目中可以根据排序类型重新排列商品卡片
            // 例如：按价格从低到高排序、按销量排序等
        });
    });
}

// 初始化筛选和排序功能
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFilterSort);
} else {
    initFilterSort();
}
