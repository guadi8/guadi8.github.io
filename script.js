// DOM元素
const announcementModal = document.getElementById('announcementModal');
const closeModalBtn = document.getElementById('closeModal');
const agreeBtn = document.getElementById('agreeBtn');
const closeAdBtn = document.getElementById('closeAd');
const headerAd = document.querySelector('.header-ad');
const resourcesContainer = document.getElementById('resourcesContainer');
const loadingElement = document.getElementById('loading');
const errorMessageElement = document.getElementById('errorMessage');

// 页面加载时显示公告弹窗
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否已经同意过声明
    const hasAgreed = localStorage.getItem('hasAgreedToTerms');
    if (!hasAgreed) {
        announcementModal.style.display = 'flex';
    }
    
    // 加载资源数据
    loadResources();
});

// 从JSON文件加载资源数据
async function loadResources() {
    try {
        // 显示加载状态
        loadingElement.style.display = 'block';
        errorMessageElement.style.display = 'none';
        
        // 从同目录下的 data.json 文件获取数据
        const response = await fetch('./data.json');
        
        if (!response.ok) {
            throw new Error(`HTTP错误! 状态: ${response.status}`);
        }
        
        const resources = await response.json();
        
        // 隐藏加载状态
        loadingElement.style.display = 'none';
        
        // 渲染资源卡片
        renderResourceCards(resources);
    } catch (error) {
        console.error('加载资源失败:', error);
        
        // 隐藏加载状态，显示错误信息
        loadingElement.style.display = 'none';
        errorMessageElement.style.display = 'block';
        
        // 如果获取失败，使用备用数据
        const fallbackResources = getFallbackResources();
        renderResourceCards(fallbackResources);
    }
}

// 备用资源数据（当JSON文件加载失败时使用）
function getFallbackResources() {
    return [
        {
            id: 1,
            title: "Photoshop 2026 专业版",
            description: "Adobe Photoshop 2026 最新版本，功能全面升级，支持AI智能修图，包含全套插件和笔刷。",
            image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            downloadUrl: "https://example.com/download/photoshop2026"
        }
    ];
}

// 渲染资源卡片
function renderResourceCards(resources) {
    resourcesContainer.innerHTML = '';
    
    if (!resources || resources.length === 0) {
        resourcesContainer.innerHTML = '<div class="no-resources">暂无资源</div>';
        return;
    }
    
    resources.forEach(resource => {
        const card = document.createElement('div');
        card.className = 'resource-card';
        card.setAttribute('data-id', resource.id);
        
        // 构建图片部分
        let imageContent = '';
        if (resource.image) {
            imageContent = `<img src="${resource.image}" alt="${resource.title}" loading="lazy">`;
        } else {
            imageContent = `<div class="image-placeholder"><i class="fas fa-file-download"></i></div>`;
        }
        
        // 修改点：移除卡片底部的文件大小和分类信息
        card.innerHTML = `
            <div class="card-image">
                ${imageContent}
            </div>
            <div class="card-content">
                <h3 class="card-title">${resource.title}</h3>
                <p class="card-description">${resource.description}</p>
            </div>
        `;
        
        // 点击卡片直接在新窗口打开下载链接
        card.addEventListener('click', function() {
            window.open(resource.downloadUrl, '_blank');
        });
        
        resourcesContainer.appendChild(card);
    });
}

// 模拟下载功能
function simulateDownload(title, url) {
    // 创建模拟下载提示
    const downloadAlert = document.createElement('div');
    downloadAlert.innerHTML = `
        <div style="position:fixed; top:20px; right:20px; background:#2ecc71; color:white; padding:15px 20px; border-radius:8px; box-shadow:0 5px 15px rgba(0,0,0,0.2); z-index:1000; display:flex; align-items:center;">
            <i class="fas fa-download" style="margin-right:10px;"></i>
            <div>
                <div style="font-weight:bold;">开始下载: ${title}</div>
                <div style="font-size:0.9rem; opacity:0.9;">如果下载没有自动开始，请<a href="${url}" target="_blank" style="color:#f1c40f; text-decoration:underline; margin-left:5px;">点击这里</a></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(downloadAlert);
    
    // 3秒后移除提示
    setTimeout(() => {
        downloadAlert.remove();
    }, 3000);
    
    // 在实际项目中，这里可以添加真实的下载逻辑
    console.log(`开始下载: ${title}，URL: ${url}`);
    
    // 这里可以添加真实下载逻辑，例如：
    // window.open(url, '_blank');
}

// 关闭公告弹窗
closeModalBtn.addEventListener('click', function() {
    announcementModal.style.display = 'none';
});

// 同意声明按钮
agreeBtn.addEventListener('click', function() {
    // 保存用户同意状态到本地存储
    localStorage.setItem('hasAgreedToTerms', 'true');
    announcementModal.style.display = 'none';
});

// 关闭顶部广告按钮事件
closeAdBtn.addEventListener('click', function(e) {
    // 阻止事件冒泡，避免触发广告本身的点击事件
    e.stopPropagation();
    headerAd.style.display = 'none';
    // 调整主内容区域的上边距
    document.body.style.paddingTop = '20px';
});

// 新增功能：点击顶部广告跳转到新链接
headerAd.addEventListener('click', function(e) {
    // 防止点击关闭按钮时也触发广告跳转
    if (e.target === closeAdBtn || closeAdBtn.contains(e.target)) {
        return;
    }
    
    // 定义广告跳转的链接，这里可以修改为您需要的实际广告链接
    const adRedirectUrl = 'https://example.com/advertisement';
    
    // 在新窗口打开广告链接
    window.open(adRedirectUrl, '_blank');
    
    // 可选：添加广告点击统计逻辑
    console.log('顶部广告被点击，跳转到:', adRedirectUrl);
});

// 点击弹窗外部关闭弹窗
announcementModal.addEventListener('click', function(e) {
    if (e.target === announcementModal) {
        announcementModal.style.display = 'none';
    }
});

// 添加键盘事件支持
document.addEventListener('keydown', function(e) {
    // ESC键关闭弹窗
    if (e.key === 'Escape' && announcementModal.style.display === 'flex') {
        announcementModal.style.display = 'none';
    }
});
