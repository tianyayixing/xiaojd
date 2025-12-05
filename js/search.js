// 搜索功能脚本

// 搜索功能类
class SearchFunctionality {
    constructor() {
        this.init();
    }
    
    init() {
        // 初始化搜索框功能
        this.initSearchBox();
        
        // 初始化搜索结果页面
        this.initSearchResults();
    }
    
    // 搜索框功能
    initSearchBox() {
        const searchBox = document.querySelector('.search-box');
        const searchInput = document.querySelector('.search-input');
        const searchButton = document.querySelector('.search-button');
        
        if (!searchBox || !searchInput || !searchButton) return;
        
        // 热门搜索词
        const hotSearches = ['草莓蛋糕', '葡式蛋挞', '生日蛋糕', '节日礼盒', '下午茶套餐'];
        
        // 创建热门搜索词容器
        const hotSearchesContainer = document.createElement('div');
        hotSearchesContainer.className = 'hot-searches';
        hotSearchesContainer.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background-color: white;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 15px;
            box-shadow: var(--shadow-md);
            z-index: 1000;
            display: none;
        `;
        
        // 添加热门搜索词标题
        const hotTitle = document.createElement('div');
        hotTitle.textContent = '热门搜索：';
        hotTitle.style.cssText = `
            font-size: 12px;
            color: var(--text-light);
            margin-bottom: 10px;
            font-weight: 500;
        `;
        hotSearchesContainer.appendChild(hotTitle);
        
        // 添加热门搜索词列表
        const hotList = document.createElement('div');
        hotList.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        `;
        
        hotSearches.forEach(search => {
            const hotItem = document.createElement('a');
            hotItem.textContent = search;
            hotItem.href = `search-results.html?keyword=${encodeURIComponent(search)}`;
            hotItem.style.cssText = `
                font-size: 14px;
                color: var(--text-color);
                padding: 5px 12px;
                background-color: #F5F5F5;
                border-radius: 15px;
                transition: var(--transition);
                text-decoration: none;
            `;
            
            // 添加hover效果
            hotItem.addEventListener('mouseenter', () => {
                hotItem.style.backgroundColor = var(--primary-color);
                hotItem.style.color = var(--secondary-color);
            });
            
            hotItem.addEventListener('mouseleave', () => {
                hotItem.style.backgroundColor = '#F5F5F5';
                hotItem.style.color = 'var(--text-color)';
            });
            
            hotList.appendChild(hotItem);
        });
        
        hotSearchesContainer.appendChild(hotList);
        searchBox.appendChild(hotSearchesContainer);
        
        // 设置搜索框为相对定位
        searchBox.style.position = 'relative';
        
        // 搜索框聚焦时显示热门搜索
        searchInput.addEventListener('focus', () => {
            hotSearchesContainer.style.display = 'block';
        });
        
        // 搜索框失焦时隐藏热门搜索
        searchInput.addEventListener('blur', () => {
            // 使用setTimeout延迟隐藏，以便点击热门搜索词时能触发跳转
            setTimeout(() => {
                hotSearchesContainer.style.display = 'none';
            }, 200);
        });
        
        // 搜索按钮点击事件
        searchButton.addEventListener('click', () => {
            this.performSearch(searchInput.value);
        });
        
        // 搜索框回车事件
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(searchInput.value);
            }
        });
    }
    
    // 执行搜索
    performSearch(keyword) {
        if (!keyword || keyword.trim() === '') return;
        
        // 跳转到搜索结果页面
        const encodedKeyword = encodeURIComponent(keyword.trim());
        window.location.href = `search-results.html?keyword=${encodedKeyword}`;
    }
    
    // 初始化搜索结果页面
    initSearchResults() {
        // 检查是否是搜索结果页面
        const searchResultsPage = document.querySelector('.search-results');
        if (!searchResultsPage) return;
        
        // 获取URL中的搜索关键词
        const urlParams = new URLSearchParams(window.location.search);
        const keyword = urlParams.get('keyword');
        
        if (keyword) {
            // 更新搜索结果页面标题
            const resultsTitle = document.querySelector('.results-title');
            if (resultsTitle) {
                resultsTitle.textContent = `搜索结果：${decodeURIComponent(keyword)}`;
            }
            
            // 更新搜索框中的关键词
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.value = decodeURIComponent(keyword);
            }
            
            // 这里可以根据关键词过滤商品列表
            // 实际项目中可以根据关键词显示对应的商品卡片
            console.log('搜索关键词:', decodeURIComponent(keyword));
        }
    }
}

// 初始化搜索功能
document.addEventListener('DOMContentLoaded', function() {
    const searchFunctionality = new SearchFunctionality();
    
    // 将实例保存到window对象，方便调试
    window.searchFunctionality = searchFunctionality;
});
