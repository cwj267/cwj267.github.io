// 安全的JSON解析函数
    function safeJSONParse(str, defaultValue) {
      try {
        return JSON.parse(str);
      } catch (e) {
        console.warn('JSON解析失败，使用默认值:', e);
        return defaultValue;
      }
    }
    
    // 全局变量定义
    let loadedChapters = []; // 用于跟踪已加载的章节索引
    
    // 初始化
    
    // 动态更新状态栏主题色以匹配网页背景色
    function updateStatusBarThemeColor() {
      // 获取当前的背景色
      const rootStyle = getComputedStyle(document.documentElement);
      const backgroundColor = rootStyle.getPropertyValue('--background-color').trim() || '#ffffff';
      
      // 更新Android状态栏颜色
      let themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (themeColorMeta) {
        themeColorMeta.content = backgroundColor;
      }
      
      // 更新Windows Mobile设备状态栏颜色
      let msAppNavButtonColorMeta = document.querySelector('meta[name="msapplication-navbutton-color"]');
      if (msAppNavButtonColorMeta) {
        msAppNavButtonColorMeta.content = backgroundColor;
      }
      
      // 根据背景色明暗度调整iOS状态栏文字样式
      let appleStatusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
      if (appleStatusBarMeta) {
        // 计算颜色的亮度（0-255）
        const brightness = calculateColorBrightness(backgroundColor);
        
        // 如果背景色较暗，使用亮色文字
        if (brightness < 128) {
          appleStatusBarMeta.content = 'light-content';
        } else {
          // 如果背景色较亮，使用深色文字
          appleStatusBarMeta.content = 'dark-content';
        }
      }
    }
    
    // 计算颜色亮度（用于确定是否需要切换状态栏文字颜色）
    function calculateColorBrightness(color) {
      // 移除#号
      color = color.replace('#', '');
      
      // 解析RGB值
      let r, g, b;
      if (color.length === 3) {
        // 简写形式 #RGB -> #RRGGBB
        r = parseInt(color.charAt(0) + color.charAt(0), 16);
        g = parseInt(color.charAt(1) + color.charAt(1), 16);
        b = parseInt(color.charAt(2) + color.charAt(2), 16);
      } else {
        r = parseInt(color.substring(0, 2), 16);
        g = parseInt(color.substring(2, 4), 16);
        b = parseInt(color.substring(4, 6), 16);
      }
      
      // 计算亮度（0-255）
      // 使用加权平均公式：0.299*R + 0.587*G + 0.114*B
      return (r * 299 + g * 587 + b * 114) / 1000;
    }
    
    // 初始化时更新状态栏颜色和确保分页区可见
    document.addEventListener('DOMContentLoaded', function() {
      updateStatusBarThemeColor();
      
      // 页面加载完成后的初始化
    });
    
    // 监听主题变化（如果你的应用有主题切换功能）
    
    // 注意：renderChapter函数的增强代码已移至函数定义之后
    // 注意：这里假设存在某种主题切换事件，你需要根据实际代码进行调整
    // 例如，如果有切换深色模式的函数，可以在该函数中调用updateStatusBarThemeColor()

// === NEXT SCRIPT ===

// 统一弹窗变量系统
    window.ModalSystem = {
      // 存储当前打开的弹窗
      currentModals: [],
      
      // 创建弹窗的统一函数
      createModal: function(options) {
        // 默认配置
        const defaultOptions = {
          id: 'modal-' + Date.now(),
          title: '对话框',
          content: '',
          large: false, // 是否为大弹窗
          buttons: [],
          onClose: null,
          closeOnOverlayClick: true
        };
        
        // 合并配置
        const config = Object.assign({}, defaultOptions, options);
        
        // 检查是否已存在相同ID的弹窗，如果有则移除
      const existingModal = document.getElementById(config.id);
      const existingOverlay = document.getElementById(config.id + '-overlay');

      if (existingModal) existingModal.remove();
      if (existingOverlay) existingOverlay.remove();


        
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.id = config.id + '-overlay';
        overlay.className = 'modal-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.zIndex = '9999';
        overlay.style.backgroundColor = 'var(--shadow-color)';
        overlay.style.backdropFilter = 'blur(4px)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s ease';
        
        // 创建弹窗容器
        const dialog = document.createElement('div');
        dialog.id = config.id;
        dialog.className = 'modal-dialog' + (config.large ? ' large' : '');
        
        // 创建头部
        const header = document.createElement('div');
        header.className = 'modal-header';
        
        const title = document.createElement('div');
        title.className = 'modal-title';
        title.textContent = config.title;
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close';
        closeBtn.innerHTML = '×';
        closeBtn.onclick = () => this.closeModal(config.id);
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        // 创建内容区域
        const content = document.createElement('div');
        content.className = 'modal-content';
        content.innerHTML = config.content;
        
        // 创建底部按钮区域
        const actions = document.createElement('div');
        actions.className = 'modal-actions buttons-' + Math.min(config.buttons.length, 4);
        
        // 添加按钮
        config.buttons.forEach(btn => {
          if (btn.show === false) return; // 如果按钮设置为不显示，则跳过
          
          const button = document.createElement('button');
          button.className = 'modal-btn' + (btn.type ? ' ' + btn.type : ' secondary');
          button.textContent = btn.text;
          button.onclick = () => {
            if (btn.onClick) btn.onClick();
            if (btn.close !== false) this.closeModal(config.id);
          };
          actions.appendChild(button);
        });
        
        // 组装弹窗
        dialog.appendChild(header);
        dialog.appendChild(content);
        dialog.appendChild(actions);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        
        // 记录当前弹窗
        this.currentModals.push({
          id: config.id,
          onClose: config.onClose,
          overlay: overlay,
          dialog: dialog
        });
        
        // 添加点击遮罩关闭的事件
        if (config.closeOnOverlayClick) {
          overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
              this.closeModal(config.id);
            }
          });
        }
        
        // 为弹窗添加CSS动画类
        setTimeout(() => {
          overlay.style.opacity = '1';
          dialog.classList.add('show');
          // 如果有自定义的onOpen回调，执行它
          if (config.onOpen) {
            config.onOpen();
          }
        }, 10);
        
        return config.id;
      },
      
      // 关闭弹窗的统一函数
      closeModal: function(id) {
        const modalIndex = this.currentModals.findIndex(modal => modal.id === id);
        if (modalIndex === -1) return;
        
        const modal = this.currentModals[modalIndex];
        
        // 执行关闭回调
        if (modal.onClose) {
          modal.onClose();
        }
        
        // 移除弹窗元素
        if (modal.overlay && modal.overlay.parentNode) {
          modal.overlay.parentNode.removeChild(modal.overlay);
        }
        
        // 从记录中移除
        this.currentModals.splice(modalIndex, 1);
      },
      
      // 关闭所有弹窗
      closeAllModals: function() {
        const modalsToClose = [...this.currentModals];
        modalsToClose.forEach(modal => {
          this.closeModal(modal.id);
        });
      },
      
      // 获取弹窗DOM元素
      getModal: function(id) {
        const modal = this.currentModals.find(m => m.id === id);
        return modal ? modal.dialog : null;
      },
      
      // 检查弹窗是否存在
      hasModal: function(id) {
        return this.currentModals.some(modal => modal.id === id);
      }
    };
    
    // 全局变量
    let volData = [];
    let flatChapters = [];
    let currentIndex = 0;
    let currentMode = 'reading'; // reading, search
    let currentFunctionTab = 'function';
    let currentFileId = ''; // 全局唯一文件标识
    
    // 搜索相关全局变量
    let searchResults = {}; // 统一使用对象形式
    let currentSearchKeyword = '';
    let currentSearchIndex = 0;
    let originalChapterContents = []; // 存储原始章节内容，用于高亮重置
    let isSearching = false; // 搜索状态标志
    let searchAbortController = null; // 搜索取消控制器
    
    // 主题和颜色设置相关变量
    let textColor = '#000000'; // 文字颜色
    let backgroundColor = '#ffffff'; // 背景颜色
    let accentColor = '#0c8ce9'; // 功能色（主题色）
    
    // 全局渲染变量对象 - 统一管理所有渲染相关的设置
    window.renderVariables = {
      // 渲染控制标志
      lastRerenderReason: '', // 记录上次渲染的原因，用于控制特殊渲染流程
      // 基础设置
      fontSize: 22, // 正文字号，默认22px（常规）
      lineHeight: 1.6, // 行间距，默认标准(1.6)
      paragraphSpacing: 0, // 段落间距，默认值为0em（无间距）
      fontFamily: '', // 字体，默认空字符串
      fontWeight: 400, // 字重，默认400（Regular）
      // 页边距设置
      contentMargins: {
        left: 32, // 左侧边距，单位px
        right: 32, // 右侧边距，单位px
        top: 20, // 顶部边距，单位px
        bottom: 76 // 底部边距，单位px
      },
      
      // 笔记功能相关设置
      notes: {}, // 笔记存储对象，以fileId为键
      notesEnabled: true, // 笔记功能开关
      
      // 主题设置
      currentTheme: 'light', // 当前主题，默认浅色主题
      textColor: '#000000', // 文字颜色
      backgroundColor: '#ffffff', // 背景颜色
      accentColor: '#0c8ce9', // 功能色（主题色）
      
      // 高亮设置
      isDialogHighlightEnabled: false, // 对话高亮开关，默认关闭
      dialogHighlightColor: '#999999', // 对话高亮背景色，默认灰色
      dialogHighlightType: 'underline', // 对话高亮类型（'background'或'underline'）
      dialogHighlightFontColor: 'yellow', // 对话高亮字体颜色，默认与背景色相同
      dialogPrefix: '“', // 对话前符号
      dialogSuffix: '”', // 对话后符号

      isNameHighlightEnabled: false, // 人名高亮开关状态，默认关闭
      
      // 搜索模式设置
      isInSearchMode: false, // 是否处于搜索模式
      
      // 人名相关数据
      currentNames: [], // 当前要高亮的人名列表
      disabledNames: [], // 被禁用的人名列表
      globalNameColorMap: {}, // 全局人名颜色映射
      nameGroups: { group1: { color: '#1976d2', names: [] } }, // 默认人名分组
      
      // 自动翻页设置
      isSeamlessScrollingEnabled: false, // 自动上下翻页开关，默认关闭
      
      // 翻页模式设置
      isTraditionalPageTurningEnabled: true, // 左右翻页开关，默认开启
      
      // 文本格式设置
      isPeriodLineBreakEnabled: false // 句号换行开关，默认关闭
    };
    
    // 行间距预设配置
    window.lineHeightPresets = {
      compact: 1.4,
      standard: 1.6,
      comfortable: 1.8,
      spacious: 2.0
    };
    
    // 段落间距预设配置 - 使用em单位（1em = 当前字体大小）
    window.paragraphSpacingPresets = {
      '0': 0,    // 无间距
      '1': 1,    // 紧凑间距
      '1.5': 1.5, // 标准间距（阅读推荐值）
      '2': 2,    // 宽松间距
      'auto': 'auto' // 自动（根据字体大小自动调整）
    };
    
    // 从renderVariables中解构常用变量到局部作用域
    let { fontSize, fontFamily, lineHeight, paragraphSpacing, isDialogHighlightEnabled, dialogHighlightColor, 
isNameHighlightEnabled, isInSearchMode, currentNames, disabledNames, globalNameColorMap, currentTheme, notesEnabled, isSeamlessScrollingEnabled, isTraditionalPageTurningEnabled } = window.renderVariables;
    
    // 更新局部变量以同步渲染变量系统的函数
    function updateLocalRenderVariables() {
      ({ fontSize, fontFamily, lineHeight, paragraphSpacing, isDialogHighlightEnabled, dialogHighlightColor, 
isNameHighlightEnabled, isInSearchMode, currentNames, disabledNames, globalNameColorMap, currentTheme, notesEnabled,
        textColor, backgroundColor, accentColor, isSeamlessScrollingEnabled, isTraditionalPageTurningEnabled, contentMargins } = window.renderVariables);
        
      // 确保对话高亮颜色的CSS变量在每次更新局部变量时也被更新
      // 直接使用window.renderVariables中的值，确保获取最新设置
      const currentDialogHighlightColor = window.renderVariables.dialogHighlightColor || '#999999';
      if (currentDialogHighlightColor.startsWith('#')) {
        // 自定义颜色，直接使用
        document.documentElement.style.setProperty('--dialog-highlight-color', currentDialogHighlightColor);
      } else {
        // 预设颜色，使用对应的CSS变量
        document.documentElement.style.setProperty('--dialog-highlight-color', `var(--dialog-highlight-${currentDialogHighlightColor})`);
      }
    }
    
    // 性能优化：缓存和防抖
    let searchCache = new Map(); // 搜索结果缓存
    let renderCache = new Map(); // 渲染结果缓存
    let searchDebounceTimer = null;
    let lastSearchTime = 0;
    const SEARCH_DEBOUNCE_DELAY = 200; // 搜索防抖延迟（优化：从300ms减少到200ms）
    const CACHE_EXPIRE_TIME = 5 * 60 * 1000; // 缓存过期时间5分钟
    const MAX_CACHE_SIZE = 50; // 限制缓存大小
    const SEARCH_RESULTS_PER_PAGE = 30; // 每页显示结果数量减少到30，减少单次渲染压力
    const MAX_CHAPTERS_LOADED = 2; // 最多加载章节数
    let scrollDebounceTimer = null; // 滚动事件防抖定时器
    const SCROLL_DEBOUNCE_DELAY = 100; // 滚动防抖延迟

    // DOM元素
    const appContainer = document.getElementById('appContainer');
    const fileInput = document.getElementById('fileInput');
    const sidebarLeft = document.getElementById('sidebarLeft');
    const sidebarRight = document.getElementById('sidebarRight');
    const navDirectory = document.getElementById('navDirectory');
    const navMore = document.getElementById('navMore');
    const navReading = document.getElementById('navReading');
    const navSearch = document.getElementById('navSearch');
    const chapterTitle = document.getElementById('chapterTitle');
    const chapterNumber = document.getElementById('chapterNumber');
    // 全局的章节内容容器变量，使用let允许重新赋值
    let chapterContent = document.getElementById('chapterContent');
    const chapterCounter = document.getElementById('chapterCounter');
    const progressPercent = document.getElementById('progressPercent');
    const progressText = document.getElementById('progressText');
    const progressBar = document.getElementById('progressBar');
    const directoryList = document.getElementById('directoryList');
    const functionContent = document.getElementById('functionContent');

    // 文件名与更换文件
    let currentFileName = '';
    const fileInfo = document.getElementById('fileInfo');
    const fileNameSpan = document.getElementById('fileName');
    
    // IndexedDB数据库配置
    const DB_NAME = 'ReaderDB';
    const DB_VERSION = 1;
    const STORE_NAME = 'fileContents';
    
    // 打开IndexedDB数据库
    function openDB() {
      // 首先检查浏览器是否支持IndexedDB
      if (!('indexedDB' in window)) {
        console.warn('浏览器不支持IndexedDB，将使用localStorage作为后备方案');
        // 返回一个模拟的Promise，让调用者可以优雅地降级处理
        return Promise.reject(new Error('浏览器不支持IndexedDB'));
      }
      
      return new Promise((resolve, reject) => {
        try {
          const request = indexedDB.open(DB_NAME, DB_VERSION);
          
          request.onupgradeneeded = function(event) {
            try {
              const db = event.target.result;
              console.log('数据库升级中，当前版本:', event.oldVersion, '目标版本:', event.newVersion);
              
              // 处理不同版本的升级
              if (event.oldVersion < 1) {
                // 创建存储对象，存储文件内容
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                  const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                  // 为常用查询创建索引
                  store.createIndex('timestamp', 'timestamp', { unique: false });
                  console.log('成功创建存储对象和索引');
                }
              }
              
              // 如果需要升级数据库版本，可以在这里添加新的升级逻辑
              // 例如：if (event.oldVersion < 2) { ... }
            } catch (upgradeError) {
              console.error('数据库升级失败:', upgradeError);
              // 升级失败不应该导致整个操作失败，可以继续使用旧版本
            }
          };
          
          request.onsuccess = function(event) {
            const db = event.target.result;
            
            // 添加版本检查和兼容性处理
            console.log('成功打开IndexedDB数据库，当前版本:', db.version);
            
            // 确保数据库不会在使用过程中被意外关闭
            db.addEventListener('close', () => {
              console.warn('IndexedDB数据库连接已关闭');
            });
            
            resolve(db);
          };
          
          request.onerror = function(event) {
            const error = event.target.error;
            console.error('打开IndexedDB失败:', error.name, error.message);
            
            // 针对常见错误类型提供更具体的错误信息
            let errorMessage = '无法打开数据库';
            if (error.name === 'QuotaExceededError') {
              errorMessage = '存储空间不足，请清理浏览器缓存';
            } else if (error.name === 'SecurityError') {
              errorMessage = '安全限制阻止访问数据库';
            }
            
            reject(new Error(errorMessage + ': ' + (error.message || error.name)));
          };
          
          request.onblocked = function() {
            console.warn('数据库操作被阻塞，可能有其他标签页打开了同一数据库');
            reject(new Error('数据库操作被阻塞，请关闭其他阅读标签页后重试'));
          };
        } catch (e) {
          console.error('创建IndexedDB请求失败:', e);
          reject(new Error('初始化数据库失败: ' + e.message));
        }
      });
    }
    
    // 向IndexedDB存储文件内容
    function saveFileToIndexedDB(fileId, fileContent) {
      return openDB().then(db => {
        return new Promise((resolve, reject) => {
          const transaction = db.transaction([STORE_NAME], 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          
          const request = store.put({
            id: fileId,
            content: fileContent,
            timestamp: new Date().getTime()
          });
          
          request.onsuccess = function() {
            resolve();
          };
          
          request.onerror = function(event) {
            console.error('保存文件到IndexedDB失败:', event.target.error);
            reject(event.target.error);
          };
        });
      });
    }
    
    // 从IndexedDB读取文件内容
    function loadFileFromIndexedDB(fileId) {
      // 验证输入参数
      if (!fileId || typeof fileId !== 'string') {
        return Promise.reject(new Error('无效的文件ID'));
      }
      
      console.log('尝试从IndexedDB加载文件:', fileId);
      
      return openDB().then(db => {
        return new Promise((resolve, reject) => {
          try {
            // 检查数据库是否有效且未关闭
            if (!db || db.closed) {
              throw new Error('数据库连接无效或已关闭');
            }
            
            // 检查存储对象是否存在
            if (!db.objectStoreNames.contains(STORE_NAME)) {
              console.warn(`存储对象 ${STORE_NAME} 不存在`);
              resolve(null); // 文件不存在
              return;
            }
            
            // 创建事务并获取存储
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            
            // 监听事务完成和错误
            transaction.oncomplete = function() {
              console.log('事务完成');
            };
            
            transaction.onerror = function(event) {
              console.error('事务错误:', event.target.error);
              reject(new Error('数据访问事务失败'));
            };
            
            // 尝试获取文件
            const request = store.get(fileId);
            
            request.onsuccess = function(event) {
              if (event.target.result) {
                const fileData = event.target.result;
                console.log('成功从IndexedDB加载文件内容');
                
                // 验证文件内容是否完整
                if (!fileData.content || (typeof fileData.content === 'object' && fileData.content.byteLength === 0)) {
                  console.warn('缓存文件内容为空或无效');
                  resolve(null); // 返回null以便上层可以处理
                } else {
                  resolve(fileData.content);
                }
              } else {
                console.warn('文件不存在于IndexedDB中:', fileId);
                resolve(null); // 文件不存在
              }
            };
            
            request.onerror = function(event) {
              const error = event.target.error;
              console.error('从IndexedDB加载文件失败:', error.name, error.message);
              
              // 提供更友好的错误信息
              let errorMessage = '加载文件失败';
              if (error.name === 'QuotaExceededError') {
                errorMessage = '存储空间不足';
              } else if (error.name === 'SecurityError') {
                errorMessage = '安全限制阻止访问';
              }
              
              reject(new Error(errorMessage + ': ' + (error.message || error.name)));
            };
          } catch (e) {
            console.error('处理IndexedDB请求时发生异常:', e);
            reject(new Error('数据处理错误: ' + e.message));
          }
        });
      }).catch(error => {
        console.error('打开数据库失败:', error);
        
        // 当IndexedDB失败时，尝试从localStorage获取作为后备方案
        console.log('尝试从localStorage作为后备方案加载文件');
        try {
          const localStorageKey = 'file_content_' + fileId;
          const content = localStorage.getItem(localStorageKey);
          
          if (content) {
            console.log('成功从localStorage获取后备数据');
            return Promise.resolve(content);
          }
        } catch (localStorageError) {
          console.error('访问localStorage失败:', localStorageError);
        }
        
        // 后备方案也失败，返回null而不是直接拒绝，让上层逻辑可以继续处理
        console.log('所有缓存方案均失败，返回null');
        return Promise.resolve(null);
      });
    }
    
    // 从IndexedDB删除文件内容
    function deleteFileFromIndexedDB(fileId) {
      return openDB().then(db => {
        return new Promise((resolve, reject) => {
          const transaction = db.transaction([STORE_NAME], 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          
          const request = store.delete(fileId);
          
          request.onsuccess = function() {
            resolve();
          };
          
          request.onerror = function(event) {
            console.error('从IndexedDB删除文件失败:', event.target.error);
            reject(event.target.error);
          };
        });
      });
    }
    
    // 清除所有IndexedDB中的文件
    function clearAllIndexedDBFiles() {
      return openDB().then(db => {
        return new Promise((resolve, reject) => {
          const transaction = db.transaction([STORE_NAME], 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          
          const request = store.clear();
          
          request.onsuccess = function() {
            resolve();
          };
          
          request.onerror = function(event) {
            console.error('清除IndexedDB文件失败:', event.target.error);
            reject(event.target.error);
          };
        });
      });
    }
    function showFileInfo(name) {
      currentFileName = name;
      fileNameSpan.textContent = name;
      fileInfo.style.display = 'flex';
    }
    // 移除了旧的reuploadFile函数，使用switchToBooksPage代替

    // 文件上传处理（更新书名显示）
    fileInput.addEventListener('change', handleFileUpload);
    
    // 等待DOM加载完成后再添加事件监听器
    document.addEventListener('DOMContentLoaded', function() {
      // 拖拽事件处理 - 现在绑定到书籍页面
      const booksPage = document.getElementById('booksPage');
      if (booksPage) {
        booksPage.addEventListener('dragover', handleDragOver);
        booksPage.addEventListener('dragleave', handleDragLeave);
        booksPage.addEventListener('drop', handleFileDrop);
      }
      
      // 批量导入功能已整合到添加书籍按钮中，不再需要独立的批量导入按钮和事件监听
      
      // 搜索功能事件监听
      const bookSearchInput = document.getElementById('bookSearch');
      if (bookSearchInput) {
        bookSearchInput.addEventListener('input', handleBookSearch);
      }
    });
    
    // 处理书籍搜索
    function handleBookSearch(e) {
      const searchTerm = e.target.value.toLowerCase().trim();
      const booksGrid = document.getElementById('booksGrid');
      const noBooksMessage = document.getElementById('noBooksMessage');
      
      if (!booksGrid) return;
      
      // 如果没有搜索词，重新加载完整的书架
      if (!searchTerm) {
        loadBooksPage();
        return;
      }
      
      // 获取所有书籍信息
      const recentFiles = JSON.parse(localStorage.getItem('reader_recent_files') || '[]');
      
      // 过滤匹配的书籍
      const filteredBooks = recentFiles.filter(book => 
        book.name?.toLowerCase().includes(searchTerm) || 
        (book.title?.toLowerCase() || '').includes(searchTerm)
      );
      
      // 清空现有网格内容
      booksGrid.innerHTML = '';
      
      // 如果有匹配的书籍，显示它们
      if (filteredBooks.length > 0) {
        booksGrid.style.display = 'grid';
        noBooksMessage.style.display = 'none';
        
        // 创建并添加书籍卡片
        filteredBooks.forEach(bookInfo => {
          const bookCard = createBookCard(bookInfo);
          booksGrid.appendChild(bookCard);
        });
      } else {
        // 没有匹配的书籍，显示空状态
        booksGrid.style.display = 'none';
        noBooksMessage.style.display = 'block';
        noBooksMessage.textContent = `没有找到匹配"${searchTerm}"的书籍`;
      }
    }
    
    // 批量文件上传处理
    function handleBatchFileUpload(e) {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      
      showToast(`开始批量导入 ${files.length} 个文件`, 'info');
      
      // 处理每个文件
      let processedCount = 0;
      let successCount = 0;
      let errorCount = 0;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        processFileForCacheOnly(file)
          .then(() => {
            successCount++;
          })
          .catch((error) => {
            console.error(`文件 ${file.name} 处理失败:`, error);
            errorCount++;
          })
          .finally(() => {
            processedCount++;
            
            // 显示处理进度
            showToast(`已处理 ${processedCount}/${files.length} 个文件`, 'info');
            
            // 所有文件处理完成
            if (processedCount === files.length) {
              setTimeout(() => {
                showToast(`批量导入完成: 成功 ${successCount} 个, 失败 ${errorCount} 个`, 'success');
                // 刷新书架
                loadBooksPage();
              }, 500);
            }
          });
      }
    }
    
    // 仅缓存文件到书架，不打开阅读
    async function processFileForCacheOnly(file) {
      return new Promise(async (resolve, reject) => {
        try {
          // 为文件创建唯一标识
          const fileId = file.name + '_' + file.size + '_' + file.lastModified;
          
          // 检查文件是否已存在
          const recentFiles = JSON.parse(localStorage.getItem('reader_recent_files') || '[]');
          if (recentFiles.some(f => f.id === fileId)) {
            console.log(`文件 ${file.name} 已存在于书架中`);
            resolve();
            return;
          }
          
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);
          
          reader.onload = async function(e) {
            try {
              const buffer = e.target.result;
              const uint8Array = new Uint8Array(buffer);
              
              // 编码检测
              const sampleSize = Math.min(uint8Array.length, 20000);
              const sample = uint8Array.subarray(0, sampleSize);
              let binaryString = "";
              for (let i = 0; i < sample.length; i++) {
                binaryString += String.fromCharCode(sample[i]);
              }
              
              const detected = jschardet.detect(binaryString);
              let encoding = detected.encoding || 'utf-8';
              
              if (encoding.toLowerCase() === 'gb2312' || encoding.toLowerCase() === 'ascii') {
                encoding = 'gb18030';
              }
              
              // 解码文件内容
              const decoder = new TextDecoder(encoding);
              const text = decoder.decode(uint8Array);
              
              // 简单解析检查（不进行完整解析以提高速度）
              let title = file.name.replace(/\.txt$/, '');
              let chapterCount = 0;
              
              // 简单统计章节数（基于常见章节标记）
              const chapterRegex = /第[\s\d一二三四五六七八九十百千]+[章节卷集]/g;
              const matches = text.match(chapterRegex);
              if (matches) {
                chapterCount = matches.length;
              } else {
                chapterCount = 1; // 默认1章
              }
              
              // 保存到IndexedDB
              await saveFileToIndexedDB(fileId, text);
              
              // 解析文件内容获取准确章节数
              const vols = parseText(text);
              const flatChapters = flatten(vols);
              const accurateChapterCount = flatChapters.length;
              
              // 添加到最近文件列表
              const fileInfo = {
                id: fileId,
                name: file.name,
                size: file.size,
                lastModified: file.lastModified,
                lastRead: new Date().getTime(),
                chapterCount: accurateChapterCount,
                title: title,
                encoding: encoding
              };
              
              // 添加到列表开头
              recentFiles.unshift(fileInfo);
              localStorage.setItem('reader_recent_files', JSON.stringify(recentFiles));
              
              console.log(`文件 ${file.name} 已成功缓存到书架`);
              resolve();
            } catch (error) {
              console.error(`文件 ${file.name} 处理失败:`, error);
              reject(error);
            }
          };
          
          reader.onerror = function() {
            reject(new Error(`无法读取文件 ${file.name}`));
          };
        } catch (error) {
          reject(error);
        }
      });
    }

    function handleFileUpload(e) {
      const files = e.target.files;
      if (files && files.length > 0) {
        if (files.length === 1) {
          processFile(files[0]);
        } else {
          // 批量处理文件
          showToast(`开始批量导入 ${files.length} 个文件`, 'info');
          let processedCount = 0;
          let successCount = 0;
          let errorCount = 0;
          
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            processFileForCacheOnly(file)
              .then(() => {
                successCount++;
              })
              .catch((error) => {
                console.error(`文件 ${file.name} 处理失败:`, error);
                errorCount++;
              })
              .finally(() => {
                processedCount++;
                
                // 显示处理进度
                showToast(`已处理 ${processedCount}/${files.length} 个文件`, 'info');
                
                // 所有文件处理完成
                if (processedCount === files.length) {
                  setTimeout(() => {
                    showToast(`批量导入完成: 成功 ${successCount} 个, 失败 ${errorCount} 个`, 'success');
                    // 刷新书架
                    loadBooksPage();
                  }, 500);
                }
              });
          }
        }
      }
    }

    // 拖拽悬浮效果处理
    function handleDragOver(e) {
      e.preventDefault();
      const booksPage = e.target.closest('#booksPage');
      if (booksPage) {
        booksPage.classList.add('drag-over');
      }
    }

    function handleDragLeave(e) {
      e.preventDefault();
      const booksPage = e.target.closest('#booksPage');
      if (booksPage && (!e.relatedTarget || !booksPage.contains(e.relatedTarget))) {
        booksPage.classList.remove('drag-over');
      }
    }

    function handleFileDrop(e) {
      e.preventDefault();
      const booksPage = e.target.closest('#booksPage');
      if (booksPage) {
        booksPage.classList.remove('drag-over');
      }
      
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        if (files.length === 1) {
          processFile(files[0]);
        } else {
          // 批量处理文件
          showToast(`开始批量导入 ${files.length} 个文件`, 'info');
          let processedCount = 0;
          let successCount = 0;
          let errorCount = 0;
          
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
              processFileForCacheOnly(file)
                .then(() => {
                  successCount++;
                })
                .catch((error) => {
                  console.error(`文件 ${file.name} 处理失败:`, error);
                  errorCount++;
                })
                .finally(() => {
                  processedCount++;
                  
                  // 显示处理进度
                  showToast(`已处理 ${processedCount}/${files.length} 个文件`, 'info');
                  
                  // 所有文件处理完成
                  if (processedCount === files.length) {
                    setTimeout(() => {
                      showToast(`批量导入完成: 成功 ${successCount} 个, 失败 ${errorCount} 个`, 'success');
                      // 刷新书架
                      loadBooksPage();
                    }, 500);
                  }
                });
            } else {
              processedCount++;
              errorCount++;
              
              // 所有文件处理完成
              if (processedCount === files.length) {
                setTimeout(() => {
                  showToast(`批量导入完成: 成功 ${successCount} 个, 失败 ${errorCount} 个`, 'success');
                  // 刷新书架
                  loadBooksPage();
                }, 500);
              }
            }
          }
        }
      }
    }

    // 保存阅读进度和设置
    function saveProgress() {
      if (!volData || !currentFileId) return;
      
      // 计算章节总数
      let chapterCount = 0;
      if (volData && volData.length > 0) {
        volData.forEach(vol => {
          if (vol.chapters) {
            chapterCount += vol.chapters.length;
          }
        });
      }
      
      // 从renderVariables对象获取需要保存的数据
      const { 
        fontSize, lineHeight, paragraphSpacing, fontFamily, contentMargins, 
        isNameHighlightEnabled, disabledNames, currentNames, nameGroups, 
        currentTheme, isTraditionalPageTurningEnabled, isSeamlessScrollingEnabled,
        isPeriodLineBreakEnabled, fontWeight
      } = window.renderVariables;
      
      // 确保nameGroups是有效的数据结构，并过滤掉空数据以减少缓存大小
      const safeNameGroups = nameGroups && typeof nameGroups === 'object' ? 
        // 过滤掉空的nameGroups，减少缓存大小
        Object.keys(nameGroups).reduce((acc, groupId) => {
          const group = nameGroups[groupId];
          if (group && group.names && Array.isArray(group.names) && group.names.length > 0) {
            acc[groupId] = { color: group.color || '#1976d2', names: group.names };
          }
          return acc;
        }, {}) : 
        { group1: { color: '#1976d2', names: [] } };
      
      // 过滤掉空的currentNames
      const safeCurrentNames = Array.isArray(currentNames) ? currentNames.filter(name => name && name.trim() !== '') : [];
      
      // 对段落间距进行范围限制，确保保存的值在合理范围内
      const safeParagraphSpacing = Math.min(Math.max(paragraphSpacing || 0, 0), 3);
      
      const progressData = {
        currentIndex: currentIndex,
        currentTheme: currentTheme,
        fontSize: fontSize || 18,
        lineHeight: lineHeight || 1.6,
        paragraphSpacing: safeParagraphSpacing,
        fontFamily: fontFamily || 'default',
        fontWeight: fontWeight || 400,
        contentMargins: contentMargins || { left: 32, right: 32, top: 20, bottom: 76 }, // 保存页边距设置
        disabledNames: disabledNames || [],
        nameGroups: safeNameGroups,
        currentNames: safeCurrentNames,
        isNameHighlightEnabled: isNameHighlightEnabled !== undefined ? isNameHighlightEnabled : true,
        isTraditionalPageTurningEnabled: isTraditionalPageTurningEnabled !== undefined ? isTraditionalPageTurningEnabled : false,
        isSeamlessScrollingEnabled: isSeamlessScrollingEnabled !== undefined ? isSeamlessScrollingEnabled : true,
        isPeriodLineBreakEnabled: isPeriodLineBreakEnabled !== undefined ? isPeriodLineBreakEnabled : false,
        chapterCount: chapterCount, // 保存章节总数
        fileName: currentFileName // 保存文件名
      };
      
      localStorage.setItem('reader_progress_' + currentFileId, JSON.stringify(progressData));
    }
    
    // 保存当前文件信息，用于页面刷新后自动加载
    function saveCurrentFileInfo() {
      if (!currentFileId || !currentFileName || !volData) return;
      
      // 保存文件信息但不保存完整内容以节省空间
      const fileInfo = {
        id: currentFileId,
        name: currentFileName,
        savedAt: new Date().getTime()
      };
      
      localStorage.setItem('reader_last_file', JSON.stringify(fileInfo));
      
      // 尝试保存最近打开的文件列表
      try {
        let recentFiles = JSON.parse(localStorage.getItem('reader_recent_files') || '[]');
        // 移除已存在的相同文件
        recentFiles = recentFiles.filter(file => file.id !== currentFileId);
        // 添加到开头
        recentFiles.unshift(fileInfo);
        // 移除数量限制，保存所有文件
        localStorage.setItem('reader_recent_files', JSON.stringify(recentFiles));
      } catch (e) {
        console.error('保存最近文件列表失败:', e);
      }
    }

    // 加载阅读进度和设置
    function loadProgress(fileId) {
      const progressData = localStorage.getItem('reader_progress_' + fileId);
      if (progressData) {
        try {
          const data = JSON.parse(progressData);
          currentIndex = data.currentIndex || 0;
          currentTheme = (data.currentTheme === 'sepia') ? 'light' : (data.currentTheme || 'light');
          
          // 将所有设置更新到renderVariables对象
          window.renderVariables = {
            ...window.renderVariables,
            currentTheme: (data.currentTheme === 'sepia') ? 'light' : (data.currentTheme || 'light'),
            fontSize: data.fontSize || 18,
            lineHeight: data.lineHeight || 1.6,
            // 确保段落间距有合理的默认值和范围限制
            paragraphSpacing: Math.min(Math.max(data.paragraphSpacing || 0, 0), 3),
            fontFamily: data.fontFamily || 'default',
            fontWeight: Math.min(Math.max(data.fontWeight || 400, 100), 900),
            contentMargins: data.contentMargins || { left: 32, right: 32, top: 20, bottom: 76 }, // 加载页边距设置
            disabledNames: data.disabledNames || [],
            
            // 加载人名高亮配置，确保数据结构正确
            nameGroups: data.nameGroups ? 
              Array.isArray(data.nameGroups) ? 
                // 如果是数组格式，转换为对象格式
                data.nameGroups.reduce((acc, group, index) => {
                  const groupId = `group${index + 1}`;
                  acc[groupId] = {
                    color: group.color || '#1976d2',
                    names: group.names || []
                  };
                  return acc;
                }, {}) : 
                // 已经是对象格式，直接使用
                data.nameGroups : 
              // 默认值
              { group1: { color: '#1976d2', names: [] } },
            
            currentNames: data.currentNames && Array.isArray(data.currentNames) ? data.currentNames : [],
            isNameHighlightEnabled: data.isNameHighlightEnabled !== undefined ? data.isNameHighlightEnabled : true,
            dialogPrefix: data.dialogPrefix || '“',
            dialogSuffix: data.dialogSuffix || '”',
            isTraditionalPageTurningEnabled: data.isTraditionalPageTurningEnabled !== undefined ? data.isTraditionalPageTurningEnabled : false,
            isSeamlessScrollingEnabled: data.isSeamlessScrollingEnabled !== undefined ? data.isSeamlessScrollingEnabled : true,
            isPeriodLineBreakEnabled: data.isPeriodLineBreakEnabled !== undefined ? data.isPeriodLineBreakEnabled : false
            // 注意：对话高亮颜色相关设置现在是全局的，不从文件特定设置加载
          };
          
          // 更新局部变量的解构赋值，确保使用最新的renderVariables值
          ({ fontSize, lineHeight, paragraphSpacing, fontFamily, isDialogHighlightEnabled, dialogHighlightColor, 
             dialogPrefix, dialogSuffix, isNameHighlightEnabled, isInSearchMode, currentNames, disabledNames, globalNameColorMap, currentTheme,
             isTraditionalPageTurningEnabled, isSeamlessScrollingEnabled } = window.renderVariables);
          
          // 应用主题
          document.documentElement.setAttribute('data-theme', currentTheme);
          
          // 应用当前的字体和行间距设置
          applyCurrentFontSettings();
          
          // 应用页边距设置
          applyContentMarginsToDOM();
          
          // 应用段落间距设置
          applyParagraphSpacingToDOM(window.renderVariables.paragraphSpacing);
          
          return true;
        } catch (e) {
          console.error('加载进度数据失败:', e);
        }
      }
      return false;
    }
    
    // 切换到书籍页面
    function switchToBooksPage() {
      const booksPage = document.getElementById('booksPage');
      const importCheckPage = document.getElementById('importCheckPage');
      const bookDetailPage = document.getElementById('bookDetailPage');
      
      // 关闭所有侧边栏（使用全局变量）
      if (sidebarLeft) {
        sidebarLeft.classList.remove('show', 'fullscreen');
      }
      if (sidebarRight) {
        sidebarRight.classList.remove('show', 'fullscreen');
      }
      
      // 清理导入状态
      currentImportingBook = null;
      currentDetailBook = null;
      
      // 隐藏所有其他页面
      if (importCheckPage) importCheckPage.style.display = 'none';
      if (bookDetailPage) bookDetailPage.style.display = 'none';
      if (appContainer) appContainer.style.display = 'none';
      
      // 显示书架页面
      if (booksPage) {
        booksPage.style.display = 'flex';
        loadBooksPage();
      } else {
        console.warn('Required page elements not found, cannot switch to books page.');
      }
    }
    
    // 打开文件选择对话框 (支持批量选择)
    function openFileSelector() {
      document.getElementById('fileInput').click();
    }
    
    // 从缓存加载文件信息和内容
    async function loadCachedFile(fileId, fileName) {
      // 设置当前文件信息
      currentFileId = fileId;
      currentFileName = fileName;
      
      // 初始化统计数据（如果不存在）
      initBookStatistics(fileId);
      
      // 记录访问
      recordBookAccess(fileId);
      
      // 显示当前文件名（不包含后缀）
      const fileNameElement = document.getElementById('currentFileName');
      if (fileNameElement && currentFileName) {
        const nameWithoutExtension = currentFileName.split('.').slice(0, -1).join('.');
        fileNameElement.textContent = nameWithoutExtension;
      }
      
      try {
        // 先加载保存的进度和设置（即使文件内容不在缓存中也应该加载设置）
        try {
          loadProgress(fileId);
        } catch (progressError) {
          console.error('加载进度设置失败:', progressError);
          // 继续执行，不因进度加载失败而中断整个流程
        }
        
        let fileContent = null;
        let loadMethod = '';
        
        // 1. 先尝试从IndexedDB加载文件内容
        try {
          fileContent = await loadFileFromIndexedDB(fileId);
          if (fileContent) {
            console.log('从IndexedDB成功加载文件内容');
            loadMethod = 'IndexedDB';
          }
        } catch (e) {
          console.error('从IndexedDB加载文件失败:', e);
          // 添加更详细的错误信息
          showToast('IndexedDB读取失败: ' + (e.name || '未知错误'), 'error');
        }
        
        // 2. 如果IndexedDB没有，再尝试从localStorage加载作为后备
        if (!fileContent) {
          try {
            // 检查localStorage是否可用
            if (typeof localStorage !== 'undefined') {
              fileContent = localStorage.getItem('reader_file_content_' + fileId);
              if (fileContent) {
                console.log('从localStorage成功加载文件内容');
                loadMethod = 'localStorage';
              }
            } else {
              console.warn('localStorage不可用');
            }
          } catch (e) {
            console.error('从localStorage加载文件失败:', e);
            showToast('localStorage读取失败: ' + (e.name || '未知错误'), 'error');
          }
        }
        
        if (fileContent) {
          try {
            // 解析文件内容
            volData = parseText(fileContent);
            
            // 扁平化章节数据
            flatChapters = flatten(volData);
            
            // 隐藏书籍页，显示阅读器
            document.getElementById('booksPage').style.display = 'none';
            appContainer.style.display = 'flex';
            
            // 关闭所有侧边栏并恢复内容显示
            if (sidebarLeft) {
              sidebarLeft.classList.remove('show', 'fullscreen');
            }
            if (sidebarRight) {
              sidebarRight.classList.remove('show', 'fullscreen');
            }
            // 移除移动端隐藏类
            const readingArea = document.querySelector('.reading-area');
            const searchContainer = document.querySelector('.search-main-container');
            if (readingArea) readingArea.classList.remove('hide-mobile');
            if (searchContainer) searchContainer.classList.remove('hide-mobile');
            
            // 强制应用当前的渲染变量
            updateLocalRenderVariables();
            applyCurrentFontSettings();
            
            // 初始化界面
            resetDirectoryLoading(); // 重置目录加载状态
            renderDirectory();
            renderChapter();
            renderFunctionContent();
            updateProgress();
            updateChapterJumpUI();
            showBookTitle(fileName);
            
            // 默认隐藏导航和底部翻页
            if (window.hideNav) window.hideNav();
            
            // 显示加载成功提示，包含加载方式
            showToast('成功加载缓存文件(' + loadMethod + ')：' + fileName, 'success');
            
            // 重新初始化UI元素
            setTimeout(() => {
              initializeUIElements();
              chapterContent = enhanceAutoPaging();
              // 再次确保应用字体设置
              applyCurrentFontSettings();
              // 重新绑定章节内容点击事件（因为enhanceAutoPaging会克隆元素）
              if (window.bindChapterContentClick) window.bindChapterContentClick();
            }, 100);
            
            return;
          } catch (parseError) {
            console.error('解析文件内容失败:', parseError);
            showToast('文件内容解析失败，可能已损坏', 'error');
          }
        } else {
          console.log('缓存中没有找到文件内容，可能是缓存已清除或尚未缓存');
        }
      } catch (e) {
        console.error('从缓存加载文件内容失败:', e);
        showToast('加载缓存文件时发生错误: ' + e.message, 'error');
      }
      
      // 如果缓存的文件内容不可用，提示用户重新选择文件，但保留已加载的设置
      showToast('无法打开缓存文件，文件内容可能已损坏或丢失，请重新选择原文件', 'warning');
      
      // 重置全局变量
      volData = [];
      flatChapters = [];
      currentIndex = 0;
      
      // 隐藏书籍页，但不隐藏appContainer以保持UI状态
      document.getElementById('booksPage').style.display = 'none';
      
      // 打开文件选择对话框
      try {
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
          fileInput.value = '';
          fileInput.click();
        } else {
          console.warn('文件选择框元素未找到');
          alert('请手动选择文件以继续阅读');
        }
      } catch (inputError) {
        console.error('打开文件选择框失败:', inputError);
        alert('无法打开文件选择框，请手动打开文件');
      }
    }
    
    // 加载书籍页面内容
    function loadBooksPage() {
      const booksGrid = document.getElementById('booksGrid');
      const noBooksMessage = document.getElementById('noBooksMessage');
      
      // 清空现有内容
      booksGrid.innerHTML = '';
      
      try {
        const recentFiles = JSON.parse(localStorage.getItem('reader_recent_files') || '[]');
        
        // 无论是否有书籍，都显示书籍网格
        booksGrid.style.display = 'grid';
        noBooksMessage.style.display = 'none';
        
        // 如果有书籍，添加书籍卡片，不做数量限制
        if (recentFiles.length > 0) {
          // 为每个文件创建书籍卡片，不做数量限制
          recentFiles.forEach(file => {
            const bookCard = createBookCard(file);
            booksGrid.appendChild(bookCard);
          });
        }
        
        // 添加一个"添加书籍"卡片在所有书籍的后面
        const addBookCard = document.createElement('div');
        addBookCard.className = 'book-card add-book-card';
        addBookCard.innerHTML = `
          <div class="add-book-content">
            <div class="add-book-text">添加书籍</div>
            <div class="add-book-subtext">点击或拖拽文件到此处</div>
          </div>
        `;
        addBookCard.addEventListener('click', openFileSelector);
        booksGrid.appendChild(addBookCard);
      } catch (e) {
        console.error('加载书籍列表失败:', e);
        booksGrid.style.display = 'grid';
        noBooksMessage.style.display = 'none';
        
        // 出错时只显示添加书籍卡片
        const addBookCard = document.createElement('div');
        addBookCard.className = 'book-card add-book-card';
        addBookCard.innerHTML = `
          <div class="add-book-content">
            <div class="add-book-text">添加书籍</div>
            <div class="add-book-subtext">点击或拖拽文件到此处</div>
          </div>
        `;
        addBookCard.addEventListener('click', openFileSelector);
        booksGrid.appendChild(addBookCard);
      }
      
      // 加载缓存信息
      (async () => {
        await loadCacheInfo();
      })();
    }
    
    // 加载缓存信息
    async function loadCacheInfo() {
      try {
        // 计算localStorage使用情况（更准确的方法）
        let localStorageUsage = 0;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          const value = localStorage.getItem(key);
          // 使用Blob计算更准确的字节大小
          localStorageUsage += new Blob([key + value]).size;
        }
        
        // 获取IndexedDB缓存信息
        let indexedDBUsage = 0;
        try {
          const dbInfo = await getIndexedDBInfo();
          indexedDBUsage = dbInfo.rawSize; // 使用原始字节大小
        } catch (error) {
          console.error('获取IndexedDB缓存信息失败:', error);
        }
        
        // 计算总缓存大小
        const totalCacheUsage = localStorageUsage + indexedDBUsage;
        
        // 改进的格式化缓存大小函数
        function formatCacheSize(bytes) {
          if (bytes < 1024) {
            return bytes + ' B';
          } else if (bytes < 1024 * 1024) {
            // 对于KB级别，保留1位小数
            const kbSize = bytes / 1024;
            return kbSize.toFixed(1) + ' KB';
          } else {
            // 对于MB级别，保留2位小数
            const mbSize = bytes / (1024 * 1024);
            return mbSize.toFixed(2) + ' MB';
          }
        }
        
        // 获取已缓存文件数量
        const recentFiles = JSON.parse(localStorage.getItem('reader_recent_files') || '[]');
        const fileCount = recentFiles.length;
        
        // 更新缓存信息显示，包含更详细的数据
        const cacheInfoElement = document.getElementById('booksCacheInfo');
        cacheInfoElement.innerHTML = ` ${formatCacheSize(totalCacheUsage)}  / ${fileCount}本`;
      } catch (e) {
        console.error('加载缓存信息失败:', e);
        const cacheInfoElement = document.getElementById('booksCacheInfo');
        cacheInfoElement.innerHTML = '缓存信息加载失败';
      }
    }
    
    // 初始化拖放功能
    function initDragAndDrop() {
      // 确保DOM元素已加载
      setTimeout(() => {
        const booksPage = document.getElementById('booksPage');
        
        if (booksPage) {
          // 阻止默认拖放行为
          ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            booksPage.addEventListener(eventName, preventDefaults, false);
          });
          
          function preventDefaults(e) {
            e.preventDefault();
            // 移除e.stopPropagation()，允许事件冒泡，避免影响功能按钮点击
          }
          
          // 添加拖拽样式
          ['dragenter', 'dragover'].forEach(eventName => {
            booksPage.addEventListener(eventName, highlight, false);
          });
          
          ['dragleave', 'drop'].forEach(eventName => {
            booksPage.addEventListener(eventName, unhighlight, false);
          });
          
          function highlight() {
            booksPage.classList.add('drag-over');
          }
          
          function unhighlight() {
            booksPage.classList.remove('drag-over');
          }
          
          // 处理文件拖放
          booksPage.addEventListener('drop', handleDrop, false);
          
          function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files.length > 0) {
              handleFiles(files);
            }
          }
        } else {
          console.warn('Books page element not found, drag and drop functionality will not be initialized.');
        }
      }, 100);
    }
    
    // 创建书籍卡片
    function createBookCard(fileInfo) {
      const card = document.createElement('div');
      card.className = 'book-card';
      card.dataset.fileId = fileInfo.id;
      
      // 获取书籍的缓存信息
      const progressData = localStorage.getItem('reader_progress_' + fileInfo.id);
      let chapterCount = 0;
      let nameCount = 0;
      let readChapters = 0;
      let totalChapters = 0;
      
      if (progressData) {
        try {
          const data = JSON.parse(progressData);
          // 获取保存的章节数
          totalChapters = data.chapterCount || 0;
          
          // 计算已阅读章节数
          if (data.currentIndex !== undefined && data.chapterCount !== undefined) {
            readChapters = Math.ceil((data.currentIndex + 1) / (data.chapterCount / 100));
          }
          
          // 统计人名数，添加安全检查确保nameGroups和currentNames是可迭代的数组
          if (data.nameGroups && Array.isArray(data.nameGroups)) {
            for (const group of data.nameGroups) {
              if (group && group.names && Array.isArray(group.names)) {
                nameCount += group.names.length;
              }
            }
          }
          if (data.currentNames && Array.isArray(data.currentNames)) {
            nameCount += data.currentNames.length;
          }
        } catch (e) {
          console.error('解析书籍进度数据失败:', e);
        }
      }
      
      // 格式化日期
      const date = new Date(fileInfo.savedAt);
      const formattedDate = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      
      // 隐藏文件名中的.txt后缀
      let displayName = fileInfo.name;
      if (displayName.toLowerCase().endsWith('.txt')) {
        displayName = displayName.substring(0, displayName.length - 4);
      }
      
      // 计算阅读进度页数（使用currentIndex直接作为页数）
      let readPages = '0';
      if (progressData) {
        try {
          const data = JSON.parse(progressData);
          readPages = data.currentIndex !== undefined ? (data.currentIndex + 1).toString() : '0';
        } catch (e) {
          console.error('解析阅读页数失败:', e);
        }
      }
      
      // 设置卡片内容 - 添加详情按钮
      card.innerHTML = `
        <div class="book-card-header">
          ${escapeHTML(displayName)}
        </div>
        <div class="book-info">
          <div class="book-info-item">
            <span>章节数：<strong>${readPages}/${totalChapters || '未知'}</strong></span>
          </div>
          <div class="book-info-item">
            <span>人名数：<strong>${nameCount}</strong></span>
          </div>
        </div>
        <div class="book-last-read">${formattedDate}</div>
        <div class="book-card-actions">
          <button class="book-detail-btn" onclick="event.stopPropagation(); switchToBookDetailPage(${JSON.stringify(fileInfo).replace(/"/g, '&quot;')})">详情</button>
          <button class="book-read-btn" onclick="event.stopPropagation(); openBookDirectly('${fileInfo.id}', '${fileInfo.name}')">阅读</button>
        </div>
      `;
      
      // 添加点击事件 - 默认进入详情页
      card.addEventListener('click', function() {
        switchToBookDetailPage(fileInfo);
      });
      
      return card;
    }
    
    // 直接打开书籍阅读
    function openBookDirectly(fileId, fileName) {
      // 如果长按菜单存在，先关闭它
      const longPressMenu = document.getElementById('longPressMenu');
      if (longPressMenu) {
        longPressMenu.remove();
      }
      
      // 关闭所有侧边栏并恢复内容显示
      if (sidebarLeft) {
        sidebarLeft.classList.remove('show', 'fullscreen');
      }
      if (sidebarRight) {
        sidebarRight.classList.remove('show', 'fullscreen');
      }
      // 移除移动端隐藏类
      const readingArea = document.querySelector('.reading-area');
      const searchContainer = document.querySelector('.search-main-container');
      if (readingArea) readingArea.classList.remove('hide-mobile');
      if (searchContainer) searchContainer.classList.remove('hide-mobile');
      
      // 隐藏书籍页，显示主阅读器
      const booksPage = document.getElementById('booksPage');
      const bookDetailPage = document.getElementById('bookDetailPage');
      if (bookDetailPage) bookDetailPage.style.display = 'none';
      booksPage.style.display = 'none';
      appContainer.style.display = 'flex';
      
      // 直接加载缓存的文件信息，不需要重新选择文件
      loadCachedFile(fileId, fileName);
    }
    
    // 显示长按菜单
    function showLongPressMenu(event, fileId) {
      // 移除已存在的菜单
      const existingMenu = document.getElementById('longPressMenu');
      if (existingMenu) {
        existingMenu.remove();
      }
      
      // 创建长按菜单
      const menu = document.createElement('div');
      menu.id = 'longPressMenu';
      menu.className = 'long-press-menu';
      
      // 设置菜单样式
      menu.innerHTML = `
        <style>
          .long-press-menu {
            position: fixed;
            background-color: var(--background-color);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 8px 0;
            z-index: 1000;
            min-width: 160px;
          }
          
          .long-press-menu-item {
            display: block;
            width: 100%;
            padding: 12px 16px;
            border: none;
            background: none;
            text-align: left;
            cursor: pointer;
            color: var(--text-color);
            font-size: 14px;
            transition: background-color 0.2s ease;
          }
          
          .long-press-menu-item:hover {
            background-color: var(--accent-color);
            color: white;
          }
          
          .long-press-menu-divider {
            height: 1px;
            background-color: var(--border-color);
            margin: 4px 0;
          }
        </style>
        <button class="long-press-menu-item" onclick="deleteBook('${fileId}')">删除书籍</button>
        <button class="long-press-menu-item" onclick="manageBookCache('${fileId}')">缓存管理</button>
      `;
      
      // 设置菜单位置
      const x = event.clientX || (event.touches && event.touches[0].clientX) || 0;
      const y = event.clientY || (event.touches && event.touches[0].clientY) || 0;
      
      menu.style.left = x + 'px';
      menu.style.top = y + 'px';
      
      // 添加到页面
      document.body.appendChild(menu);
      
      // 点击其他区域关闭菜单
      document.addEventListener('click', function closeMenu(e) {
        if (!menu.contains(e.target)) {
          menu.remove();
          document.removeEventListener('click', closeMenu);
        }
      });
    }
    
    // 删除书籍
    function deleteBook(fileId) {
      if (confirm('确定要删除这本书吗？')) {
        // 从IndexedDB删除文件
        deleteFileFromIndexedDB(fileId).then(() => {
          // 从localStorage删除进度信息
          localStorage.removeItem('reader_progress_' + fileId);
          
          // 从最近文件列表中删除
          const recentFiles = JSON.parse(localStorage.getItem('reader_recent_files') || '[]');
          const updatedFiles = recentFiles.filter(file => file.id !== fileId);
          localStorage.setItem('reader_recent_files', JSON.stringify(updatedFiles));
          
          // 刷新书架
          renderBookshelf();
          
          // 关闭菜单
          const menu = document.getElementById('longPressMenu');
          if (menu) {
            menu.remove();
          }
          
          showToast('书籍删除成功');
        }).catch(error => {
          console.error('删除书籍失败:', error);
          showToast('删除书籍失败', 'error');
        });
      }
    }
    
    // 管理书籍缓存
    function manageBookCache(fileId) {
      // 这里可以实现针对单个书籍的缓存管理，
      // 目前先打开全局缓存管理对话框
      openCacheManagementDialog();
      
      // 关闭菜单
      const menu = document.getElementById('longPressMenu');
      if (menu) {
        menu.remove();
      }
    }
    
    // 尝试自动加载上次打开的文件
    function tryAutoLoadLastFile() {
      try {
        const recentFiles = JSON.parse(localStorage.getItem('reader_recent_files') || '[]');
        
        // 无论是否有缓存文件，都显示书籍页面
        switchToBooksPage();
        
        // 初始化拖放功能
        initDragAndDrop();
      } catch (e) {
        console.error('自动加载上次文件失败:', e);
        // 出错时也显示书籍页面
        switchToBooksPage();
        
        // 初始化拖放功能
        initDragAndDrop();
      }
    }
    
    // 打开缓存目录
    function openCacheDirectory() {
      // 在浏览器环境中，我们无法直接打开系统文件夹
      // 但是我们可以提供一些信息，告诉用户如何找到缓存
      showToast('在浏览器环境中无法直接打开系统文件夹。本地缓存存储在浏览器的IndexedDB中。', 'info', 5000);
    }

    // 重置设置到默认值
    function resetSettings() {
      if (confirm('确定要重置所有设置吗？这将清除所有保存的进度和设置。')) {
        // 清除localStorage中的所有阅读器数据
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('reader_')) {
            localStorage.removeItem(key);
          }
        });
        
        // 重置设置到默认值 - 更新渲染变量系统
        window.renderVariables = {
          // 基础设置
          fontSize: 18,
          lineHeight: 1.6,
          paragraphSpacing: 1.5, // 使用固定的1.5em作为默认值（阅读推荐值）
          fontFamily: 'default',
          // 页边距设置
          contentMargins: {
            left: 32,
            right: 32,
            top: 20,
            bottom: 76
          },
          currentTheme: 'light',
          textColor: '#000000',
          backgroundColor: '#ffffff',
          accentColor: '#0c8ce9',
          
          // 高亮设置
        isDialogHighlightEnabled: false,
  
        dialogHighlightColor: '#999999', // 默认灰色
        dialogHighlightType: 'background', // 对话高亮类型（'background'或'underline'）
          isNameHighlightEnabled: false,
          
          // 搜索模式设置
          isInSearchMode: false,
          
          // 人名相关数据
          currentNames: [],
          disabledNames: [],
          globalNameColorMap: {},
          nameGroups: { group1: { color: '#1976d2', names: [] } }
        };
        
        // 重置其他必要的全局变量
        currentIndex = 0;
        
        // 更新局部变量以同步渲染变量系统
        updateLocalRenderVariables();
        
        // 应用默认主题
        const currentTheme = window.renderVariables.currentTheme;
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        // 重新渲染界面
        renderChapter();
        renderDirectory();
        renderFunctionContent();
        updateProgress();
        
        showToast('设置已重置为默认值', 'success');
      }
    }

    function processFile(file) {
      // 为文件创建唯一标识
      currentFileId = file.name + '_' + file.size + '_' + file.lastModified;
      
      // 显示加载提示
      showToast('正在识别文件格式和编码...', 'info');
      
      const reader = new FileReader();
      
      // 关键：必须读取为 ArrayBuffer (二进制)，不能直接 readAsText
      reader.readAsArrayBuffer(file);
      
      reader.onload = async function(e) {
        try {
          const buffer = e.target.result;
          const uint8Array = new Uint8Array(buffer);
          
          // 1. 使用 jschardet 检测编码 (取前 20KB 采样检测，提高速度)
          // TXT文件如果很大，检测整个文件会很慢，通常检测头部即可
          const sampleSize = Math.min(uint8Array.length, 20000);
          const sample = uint8Array.subarray(0, sampleSize);
          
          // 将 Uint8Array 转为二进制作符串供 jschardet 检测
          let binaryString = "";
          for (let i = 0; i < sample.length; i++) {
            binaryString += String.fromCharCode(sample[i]);
          }
          
          const detected = jschardet.detect(binaryString);
          let encoding = detected.encoding || 'utf-8';
          let confidence = detected.confidence || 0;
          
          // 修正一些常见的识别偏差
          if (encoding.toLowerCase() === 'gb2312' || encoding.toLowerCase() === 'ascii') {
            encoding = 'gb18030'; // 强制使用更大的中文集
          }
          
          // 显示编码检测结果
          const encodingMsg = `检测到编码: ${encoding} (置信度: ${parseInt(confidence * 100)}%)`;
          console.log(encodingMsg);
          
          // 2. 使用 TextDecoder 进行解码
          try {
            const decoder = new TextDecoder(encoding);
            const text = decoder.decode(uint8Array);
            
            // 3. 二次检查解码结果是否有问题
            if (hasEncodingErrors(text)) {
              // 如果解码结果仍有问题，尝试其他常见编码
              const fallbackEncodings = ['utf-8', 'gb18030', 'big5', 'iso-8859-1'];
              let fallbackSuccess = false;
              
              for (let fallbackEncoding of fallbackEncodings) {
                if (fallbackEncoding.toLowerCase() === encoding.toLowerCase()) continue;
                
                try {
                  const fallbackDecoder = new TextDecoder(fallbackEncoding);
                  const fallbackText = fallbackDecoder.decode(uint8Array);
                  
                  if (!hasEncodingErrors(fallbackText)) {
                    text = fallbackText;
                    encoding = fallbackEncoding;
                    confidence = 0.9; // 手动设置高置信度
                    fallbackSuccess = true;
                    showToast(`使用备用编码 ${encoding} 成功解码`, 'success');
                    break;
                  }
                } catch (fallbackError) {
                  console.warn(`备用编码 ${fallbackEncoding} 解码失败:`, fallbackError);
                }
              }
              
              if (!fallbackSuccess) {
                throw new Error('所有尝试的编码都无法正确解码文件');
              }
            } else {
              // 编码识别成功
              showToast(`编码识别成功: ${encoding}`, 'success');
            }
            
            // 4. 解析文本并继续处理
            volData = parseText(text);
            continueProcessingFile(text, file);
            
          } catch (decodeError) {
            console.error('解码失败:', decodeError);
            showToast(`文件编码识别失败: ${decodeError.message}`, 'error');
          }
        } catch (error) {
          console.error('文件处理错误:', error);
          showToast(`文件处理失败: ${error.message}`, 'error');
        }
      };
      
      reader.onerror = function(err) {
        console.error('文件读取错误:', err);
        showToast('文件读取失败，请检查文件是否被占用或损坏', 'error');
      };
    }
    
    // 检查文本是否有编码错误
    function hasEncodingErrors(text) {
      // 检查是否有大量连续的乱码字符
      const garbledPattern = /[\ufffd]{3,}/;
      // 检查是否有明显不符合中文文本的字符分布
      const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
      const totalChars = text.length;
      // 如果中文字符占比过低，可能是编码错误
      if (totalChars > 100 && chineseChars.length / totalChars < 0.2) {
        return true;
      }
      return garbledPattern.test(text);
    }
    
    // 继续处理文件的公共逻辑
    function continueProcessingFile(text, file) {
      try {
          
          // 使用IndexedDB缓存所有大小的文件内容
          try {
            saveFileToIndexedDB(currentFileId, text).then(() => {
              console.log('文件内容已缓存到IndexedDB，文件大小：' + (file.size / 1024 / 1024).toFixed(2) + 'MB');
            }).catch((e) => {
              console.warn('IndexedDB缓存失败:', e);
              showToast('文件缓存失败，但不影响阅读体验', 'warning');
            });
            console.log('文件内容已缓存到IndexedDB，文件大小：' + (file.size / 1024 / 1024).toFixed(2) + 'MB');
          } catch (e) {
            console.warn('IndexedDB缓存失败:', e);
            showToast('文件缓存失败，但不影响阅读体验', 'warning');
          }
          
          // 确保volData不为空
          if (!volData || volData.length === 0) {
            throw new Error('解析结果为空');
          }
          
          // 扁平化章节数据
          flatChapters = flatten(volData);
          
          // 确保flatChapters不为空
          if (!flatChapters || flatChapters.length === 0) {
            throw new Error('没有找到章节内容');
          }
          
          // 尝试加载保存的进度
          if (!loadProgress(currentFileId)) {
            currentIndex = 0;
            // 对于新文件，初始化人名高亮设置
            if (!window.renderVariables) {
              window.renderVariables = {};
            }
            window.renderVariables.nameGroups = { group1: { color: '#1976d2', names: [] } };
            currentNames = [];
            isNameHighlightEnabled = false;
          }
          
          // 关闭所有侧边栏并恢复内容显示
          if (sidebarLeft) {
            sidebarLeft.classList.remove('show', 'fullscreen');
          }
          if (sidebarRight) {
            sidebarRight.classList.remove('show', 'fullscreen');
          }
          // 移除移动端隐藏类
          const readingArea = document.querySelector('.reading-area');
          const searchContainer = document.querySelector('.search-main-container');
          if (readingArea) readingArea.classList.remove('hide-mobile');
          if (searchContainer) searchContainer.classList.remove('hide-mobile');
          
          // 切换界面 - 明确设置样式
          appContainer.style.display = 'flex';
          document.getElementById('booksPage').style.display = 'none';
          
          // 初始化界面
          renderDirectory();
          renderChapter();
          renderFunctionContent();
          updateProgress();
          updateChapterJumpUI(); // 文件加载后初始化输入框
          showBookTitle(file.name); // 文件加载后显示文件名
          
          // 默认隐藏导航和底部翻页
          if (window.hideNav) window.hideNav();
          
          // 显示解析结果统计
          showToast(`成功解析：共${volData.length}卷，${flatChapters.length}章`, 'success');
          
          // 重新初始化UI元素（确保DOM元素存在）
          setTimeout(() => {
            initializeUIElements();
            // 在内容渲染后再应用自动翻页优化
            // 使用返回值确保全局变量被正确更新
            chapterContent = enhanceAutoPaging();
            // 重新绑定章节内容点击事件（因为enhanceAutoPaging会克隆元素）
            if (window.bindChapterContentClick) window.bindChapterContentClick();
          }, 100);
          
          // 保存文件信息，包括章节数
          currentFileName = file.name;
          saveCurrentFileInfo();
          
          // 保存进度，包括章节数
          saveProgress();
        } catch (error) {
          console.error('文件解析错误:', error);
          showToast('文件解析错误: ' + error.message, 'error');
          
          // 即使解析出错，也尝试显示内容
          try {
            // 创建一个默认卷和章节
            volData = [{ volTitle: '全文', chapters: [{ title: '全文内容', content: text }] }];
            flatChapters = flatten(volData);
            currentIndex = 0;
            
            // 关闭所有侧边栏并恢复内容显示
            if (sidebarLeft) {
              sidebarLeft.classList.remove('show', 'fullscreen');
            }
            if (sidebarRight) {
              sidebarRight.classList.remove('show', 'fullscreen');
            }
            // 移除移动端隐藏类
            const readingArea = document.querySelector('.reading-area');
            const searchContainer = document.querySelector('.search-main-container');
            if (readingArea) readingArea.classList.remove('hide-mobile');
            if (searchContainer) searchContainer.classList.remove('hide-mobile');
            
            // 显示阅读器 - 明确设置样式
            appContainer.style.display = 'flex';
            document.getElementById('booksPage').style.display = 'none';
            
            // 初始化和渲染
            resetDirectoryLoading(); // 重置目录加载状态
            renderDirectory();
            renderChapter();
            renderFunctionContent();
            updateProgress();
            updateChapterJumpUI();
            showBookTitle(file.name);
            
            // 默认隐藏导航和底部翻页
            if (window.hideNav) window.hideNav();
          } catch (fallbackError) {
            console.error('回退处理失败:', fallbackError);
          }
        }
      }

    // 中文数字转阿拉伯数字映射表
    const chineseNumbers = {
      '零': 0,
      '一': 1,
      '二': 2,
      '三': 3,
      '四': 4,
      '五': 5,
      '六': 6,
      '七': 7,
      '八': 8,
      '九': 9,
      '十': 10,
      '百': 100,
      '千': 1000,
      '万': 10000,
      '亿': 100000000
    };

    // 文本解析 - 融合V0.3.11版本灵活识别优势
    function parseText(text) {
      // 采用更灵活的分隔符，参考V0.3.11版本的实现
      // 使用多种分隔符组合，包括空行和分隔线，提高目录识别准确性
      const rawParts = text.split(/\n\n|\n[-]{3,}\n|\n[=]{3,}\n|\n[*]{3,}\n|\n[—]{3,}\n|\n[_]{3,}\n|[-]{12,}|[=]{12,}|[*]{12,}|[—]{12,}|[_]{12,}/).map(p => p.trim()).filter(p => p.length > 0);
      let vols = [];
      let currentVol = null;
      
      // 用于检测章节标题重复的映射表
      const chapterTitleMap = new Map();
      // 用于存储前言内容
      let prefaceContent = [];
      let hasFoundFirstChapter = false;

      // 定义卷和章的正则表达式模式 - 融合V0.3.11的灵活性
      const volPatterns = [
        /[第]([零一二三四五六七八九十百千万亿]+)[卷集]/,
        /([一二三四五六七八九十百千万亿]+)[卷集]/,
        /[卷集]([一二三四五六七八九十百千万亿]+)/,
        /[卷集]([0-9]+)/,
        /[第]([0-9]+)[卷集]/,
        /第[ ]*([0-9]+)[ ]*卷/,
        /第[ ]*([0-9]+)[ ]*集/,
      ];
      
      // 严格的章节标题匹配，避免误识别正文中的内容
      const chapterPatterns = [
        // 要求行首匹配，避免误识别正文中的内容
        /^[第]\s*([零一二三四五六七八九十百千万亿两]+)\s*[章节回][\s：:。]/,
        /^[第]\s*([0-9]+)\s*[章节回][\s：:。]/,
        /^第[ ]*([0-9]+)[ ]*章[\s：:。]/,
        /^第[ ]*([0-9]+)[ ]*节[\s：:。]/,
        /^第[ ]*([0-9]+)[ ]*回[\s：:。]/,
        // 阿拉伯数字+回/章格式，要求行首匹配
        /^[0-9]+[章回][\s：:。]/,
        // 符号格式，要求行首匹配
        /^【([0-9]+)】[\s：:。]?$/,
        /^【([一二三四五六七八九十百千万亿两]+)】[\s：:。]?$/,
        /^「([0-9]+)」[\s：:。]?$/,
        /^「([一二三四五六七八九十百千万亿两]+)」[\s：:。]?$/,
        /^（([0-9]+)）[\s：:。]?$/,
        /^（([一二三四五六七八九十百千万亿两]+)）[\s：:。]?$/,
        /^\[([0-9]+)\][\s：:。]?$/,
        /^\[([一二三四五六七八九十百千万亿两]+)\][\s：:。]?$/,
        /^\{([0-9]+)\}[\s：:。]?$/,
        /^\{([一二三四五六七八九十百千万亿两]+)\}[\s：:。]?$/,
        // 增加更多常见章节格式，要求行首匹配
        /^[第]\s*([零一二三四五六七八九十百千万亿两]+)\s*[章节回]/,
        /^[第]\s*([0-9]+)\s*[章节回]/
      ];

      // 初始化默认卷
      currentVol = { volTitle: '无卷', chapters: [] };
      vols.push(currentVol);

      // 优化：如果没有通过分隔符分割出内容，尝试直接处理整个文本
      if (rawParts.length === 0) {
        rawParts.push(text);
      }

      // 1. 首先扫描整个文本，找出所有章节标题和它们的内容
      rawParts.forEach(part => {
        // 保留原始的行结构，包括空行
        const originalLines = part.split('\n');
        // 确保至少有一些内容
        if (originalLines.length > 0) {
          let currentChapter = null;
          let currentChapterContent = [];
          
          // 直接遍历原始行，保留空行信息
          originalLines.forEach(originalLine => {
            // 处理当前行用于识别章节标题
            const trimmedLine = originalLine.trim();
            let isVolTitle = false;
            let isChapterTitle = false;
            
              // 检查是否是卷标题 (支持多种格式)
            if (trimmedLine) { // 只有非空行才可能是卷标题
              // 更宽松的匹配策略，提高卷识别率
              if (trimmedLine.length < 50) { // 卷标题通常不会太长
                for (const pattern of volPatterns) {
                  if (pattern.test(trimmedLine)) {
                    isVolTitle = true;
                    break;
                  }
                }
              }
            }
            
            // 检查是否是章节标题 (支持多种格式)
            if (trimmedLine && !isVolTitle) { // 只有非空行且不是卷标题才可能是章节标题
              // 更宽松的章节标题匹配，增加标题长度检查提高准确性
              if (trimmedLine.length < 100) { // 章节标题通常不会太长
                for (const pattern of chapterPatterns) {
                  if (pattern.test(trimmedLine)) {
                    isChapterTitle = true;
                    break;
                  }
                }
              }
            }
            
            // 使用外部定义的extractFullChapterTitle函数
            
            // 处理卷标题
            if (isVolTitle) {
              // 如果当前有未完成的章节，先保存
              if (currentChapter) {
                currentChapter.content = currentChapterContent.join('\n');
                currentVol.chapters.push(currentChapter);
                chapterTitleMap.set(currentChapter.title, currentChapter);
              }
              
              // 创建新卷
              currentVol = { volTitle: trimmedLine, chapters: [] };
              vols.push(currentVol);
              currentChapter = null;
              currentChapterContent = [];
              
              // 卷标题之后的内容不应再视为前言
              if (!hasFoundFirstChapter) {
                hasFoundFirstChapter = true;
              }
            }
            // 处理章节标题
            else if (isChapterTitle) {
              // 标记已经找到了第一个章节
              if (!hasFoundFirstChapter) {
                hasFoundFirstChapter = true;
              }
              
              // 如果当前有未完成的章节，先保存
              if (currentChapter) {
                currentChapter.content = currentChapterContent.join('\n');
                
                // 处理章节标题重复的情况：只保留有内容的章节
                if (chapterTitleMap.has(currentChapter.title)) {
                  const existingChapter = chapterTitleMap.get(currentChapter.title);
                  // 如果现有章节为空内容，而当前章节有内容，则替换
                  if (!existingChapter.content.trim() && currentChapter.content.trim()) {
                    // 从卷中移除空内容的章节
                    const index = currentVol.chapters.findIndex(c => c.title === currentChapter.title);
                    if (index > -1) {
                      currentVol.chapters.splice(index, 1);
                    }
                    // 添加有内容的章节
                    currentVol.chapters.push(currentChapter);
                    chapterTitleMap.set(currentChapter.title, currentChapter);
                  }
                } else {
                  currentVol.chapters.push(currentChapter);
                  chapterTitleMap.set(currentChapter.title, currentChapter);
                }
              }
              
              // 创建新章节，直接使用原始的完整行作为标题
              // 不使用extractFullChapterTitle函数，避免标题被截断或修改
              currentChapter = { title: trimmedLine, content: '' };
              currentChapterContent = [];
              // 确保内容数组被重置，避免内容交叉污染
              currentChapterContent.length = 0;
            }
            // 处理正文内容 - 保留原始行（包括空行）
            else {
              if (!hasFoundFirstChapter) {
                // 第一章之前的内容作为前言 - 保留原始行格式
                prefaceContent.push(originalLine);
              } else if (currentChapter) {
                // 章节内容中保留原始行格式（包括空行）
                currentChapterContent.push(originalLine);
              }
            }
          });
          
          // 保存最后一个章节
          if (currentChapter) {
            currentChapter.content = currentChapterContent.join('\n');
            
            // 处理章节标题重复的情况
            if (chapterTitleMap.has(currentChapter.title)) {
              const existingChapter = chapterTitleMap.get(currentChapter.title);
              if (!existingChapter.content.trim() && currentChapter.content.trim()) {
                const index = currentVol.chapters.findIndex(c => c.title === currentChapter.title);
                if (index > -1) {
                  currentVol.chapters.splice(index, 1);
                }
                currentVol.chapters.push(currentChapter);
                chapterTitleMap.set(currentChapter.title, currentChapter);
              }
            } else {
              currentVol.chapters.push(currentChapter);
              chapterTitleMap.set(currentChapter.title, currentChapter);
            }
          }
        }
      });

      // 2. 添加前言章节（如果有前言内容）
      if (prefaceContent.length > 0) {
        const prefaceChapter = { title: '前言', content: prefaceContent.join('\n'), isPreface: true };
        // 将前言章节添加到第一卷的最前面
        if (vols.length > 0 && vols[0].chapters) {
          vols[0].chapters.unshift(prefaceChapter);
        }
      }

      // 3. 清理：移除空卷和无效章节
      vols = vols.filter(vol => {
        // 过滤掉没有内容的章节
        vol.chapters = vol.chapters.filter(chapter => {
          // 前言章节即使没有内容也保留
          if (chapter.isPreface) return true;
          // 普通章节需要有内容或者标题
          return chapter.content.trim() !== '' || chapter.title.trim() !== '';
        });
        return vol.chapters.length > 0;
      });
      
      // 确保至少有一个卷和一个章节
      if (vols.length === 0) {
        const defaultVol = { volTitle: '无卷', chapters: [] };
        defaultVol.chapters.push({ title: '无标题章节', content: text });
        vols.push(defaultVol);
      } else {
        // 确保每个卷至少有一个章节
        vols.forEach(vol => {
          if (vol.chapters.length === 0) {
            vol.chapters.push({ title: '无标题章节', content: '' });
          }
        });
      }

      console.log('解析完成：', vols.length, '卷，', vols.reduce((sum, vol) => sum + vol.chapters.length, 0), '章');
      return vols;
    }

    // 提取完整章节标题的辅助函数 - 移到外部，避免重复定义
    function extractFullChapterTitle(line, patterns) {
      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match) {
          // 返回完整的匹配部分，而不仅仅是捕获组
          return match[0];
        }
      }
      return null;
    }

    // 从内容中提取章节标题 - 简化版
    function extractChapterTitleFromContent(lines) {
      // 检查前3行，避免过多匹配
      for (let i = 0; i < Math.min(lines.length, 3); i++) {
        const line = lines[i];
        // 直接检查是否匹配章节模式，不使用extractFullChapterTitle函数
        // 避免修改原始标题
        for (const pattern of chapterPatterns) {
          if (pattern.test(line)) {
            return line;
          }
        }
      }
      return null;
    }

    function flatten(vols) {
      const allChapters = vols.flatMap(vol => vol.chapters);
      
      // 为所有章节添加序号，确保前言章节的序号为0
      let index = 0;
      
      // 先检查是否有前言章节
      const hasPreface = allChapters.some(chapter => chapter.isPreface);
      
      // 如果有前言章节，先处理前言章节（序号0），然后再处理其他章节从1开始
      return allChapters.map(chapter => {
        if (chapter.isPreface) {
          // 前言章节始终为序号0
          chapter.index = 0;
        } else {
          // 普通章节从1开始编号，如果有前言章节则从1开始
          chapter.index = hasPreface ? index + 1 : index;
          index++;
        }
        return chapter;
      });
    }

    // 导航交互
    function toggleDirectory() {
      if (isMobile()) {
        // 移动端：关闭更多栏，切换目录栏
        sidebarRight.classList.remove('show', 'fullscreen');
        sidebarLeft.classList.toggle('show');
        sidebarLeft.classList.toggle('fullscreen');
        // 隐藏所有主内容区域
        const readingArea = document.querySelector('.reading-area');
        const searchContainer = document.querySelector('.search-main-container');
        if (readingArea) readingArea.classList.toggle('hide-mobile', sidebarLeft.classList.contains('show'));
        if (searchContainer) searchContainer.classList.toggle('hide-mobile', sidebarLeft.classList.contains('show'));
      } else {
        // 电脑端：可以同时显示目录和更多栏
        sidebarLeft.classList.toggle('show');
        navDirectory.classList.toggle('active');
        // 不关闭更多栏，允许同时显示
      }
      
      // 如果目录被打开，则滚动到当前章节
      if (sidebarLeft.classList.contains('show')) {
        // 使用setTimeout确保DOM更新后再滚动
        setTimeout(() => {
          scrollToCurrentChapter();
        }, 100);
      }
    }

    function toggleMore() {
      if (isMobile()) {
        // 移动端：关闭目录栏，切换更多栏
        sidebarLeft.classList.remove('show', 'fullscreen');
        sidebarRight.classList.toggle('show');
        sidebarRight.classList.toggle('fullscreen');
        // 隐藏所有主内容区域
        const readingArea = document.querySelector('.reading-area');
        const searchContainer = document.querySelector('.search-main-container');
        if (readingArea) readingArea.classList.toggle('hide-mobile', sidebarRight.classList.contains('show'));
        if (searchContainer) searchContainer.classList.toggle('hide-mobile', sidebarRight.classList.contains('show'));
      } else {
        // 电脑端：可以同时显示目录和更多栏
        sidebarRight.classList.toggle('show');
        navMore.classList.toggle('active');
        // 不关闭目录栏，允许同时显示
      }
    }

    // 书名显示与更换按钮UI修正
    function showBookTitle(name) {
      document.getElementById('bookTitle').textContent = name.replace(/\.[^.]+$/, '');
    }

    // 顶部导航交互修正
    function switchToReading() {
      currentMode = 'reading';
      navReading.classList.add('active');
      navSearch.classList.remove('active');
      navDirectory.classList.remove('active');
      navMore.classList.remove('active');
      
      // 显示阅读区域
      const readingArea = document.querySelector('.reading-area');
      readingArea.style.display = 'flex';
      
      // 隐藏搜索页
      const searchContainer = document.querySelector('.search-main-container');
      if (searchContainer) {
        searchContainer.style.display = 'none';
        searchContainer.classList.remove('show'); // 移除show类
      }
      
      // 关闭搜索引导（但保持关键词高亮）
      closeSearchGuide();
      
      // 重置搜索状态
      resetSearchState();
      
      // 移动端关闭侧栏，恢复阅读页显示
      if (isMobile()) {
        closeAllSidebars();
        // 确保阅读页显示，搜索页隐藏
        if (readingArea) readingArea.classList.remove('hide-mobile');
        if (searchContainer) {
          searchContainer.classList.add('hide-mobile');
          searchContainer.classList.remove('show');
        }
      }
      
      if (window.innerWidth <= 768) {
        const sidebarLeft = document.querySelector('.sidebar-left');
        if (sidebarLeft && sidebarLeft.classList.contains('show')) {
          sidebarLeft.classList.remove('show');
        }
      }
      
      // 关闭所有侧边栏
      closeAllSidebars();
      
      // 重新渲染章节内容，确保阅读页不为空
      renderChapter();
      
      // 移除自动滚动到顶部的代码，保持用户阅读位置
    }
    
    // 切换到阅读模式但保持菜单栏打开
    function switchToReadingKeepMenu() {
      currentMode = 'reading';
      navReading.classList.add('active');
      navSearch.classList.remove('active');
      navDirectory.classList.remove('active');
      // 不关闭navMore菜单
      // navMore.classList.remove('active');
      
      // 显示阅读区域
      const readingArea = document.querySelector('.reading-area');
      readingArea.style.display = 'flex';
      
      // 隐藏搜索页
      const searchContainer = document.querySelector('.search-main-container');
      if (searchContainer) {
        searchContainer.style.display = 'none';
        searchContainer.classList.remove('show'); // 移除show类
      }
      
      // 关闭搜索引导（但保持关键词高亮）
      closeSearchGuide();
      
      // 重置搜索状态
      resetSearchState();
      
      // 移动端关闭侧栏，恢复阅读页显示
      if (isMobile()) {
        closeAllSidebars();
        // 确保阅读页显示，搜索页隐藏
        if (readingArea) readingArea.classList.remove('hide-mobile');
        if (searchContainer) {
          searchContainer.classList.add('hide-mobile');
          searchContainer.classList.remove('show');
        }
      }
      
      // 在窄页面时确保只显示一个页面
      // 重新渲染章节内容，确保阅读页不为空
      renderChapter();
      
      if (window.innerWidth <= 768) {
        const sidebarLeft = document.querySelector('.sidebar-left');
        if (sidebarLeft && sidebarLeft.classList.contains('show')) {
          sidebarLeft.classList.remove('show');
        }
      }
      
      // 仅在必要时滚动到顶部，避免从目录菜单切换回阅读菜单时滚动位置丢失
      const sidebarLeft = document.querySelector('.sidebar-left');
      const isFromDirectory = sidebarLeft && sidebarLeft.classList.contains('show');
      
      if (!isFromDirectory) { // 只有不是从目录菜单切换回来时，才滚动到顶部
        setTimeout(() => {
          if (chapterContent) {
            // 设置滚动恢复标志为true
            isScrollingRestored = true;
            
            // 滚动到顶部
            chapterContent.scrollTop = 0;
            chapterContent.scrollLeft = 0;
            
            // 200ms后重置标志，确保滚动恢复完成后再允许自动加载
            setTimeout(() => {
              isScrollingRestored = false;
            }, 200);
          }
        }, 100);
      } else {
        // 如果是从目录切换回来，确保isScrollingRestored标志正确设置，避免影响后续滚动
        isScrollingRestored = false;
      }
    }

    function switchToSearch() {
      currentMode = 'search';
      navSearch.classList.add('active');
      navReading.classList.remove('active');
      navDirectory.classList.remove('active');
      navMore.classList.remove('active');
      
      // 隐藏阅读区域
      const readingArea = document.querySelector('.reading-area');
      if (readingArea) readingArea.style.display = 'none';
      
      // 显示或创建搜索容器
      let searchContainer = document.querySelector('.search-main-container');
      if (!searchContainer) {
        renderSearchPage();
        searchContainer = document.querySelector('.search-main-container');
      }
      
      // 强制显示搜索容器
      searchContainer.style.display = 'flex';
      searchContainer.style.zIndex = '10';
      searchContainer.classList.remove('hide-mobile');
      searchContainer.classList.add('show');
      
      // 移动端关闭侧栏，恢复搜索页显示
      if (isMobile()) {
        closeAllSidebars();
        // 确保搜索页显示，阅读页隐藏
        if (searchContainer) {
          searchContainer.classList.remove('hide-mobile');
          searchContainer.classList.add('show');
        }
        if (readingArea) readingArea.style.display = 'none';
      }
      
      // 搜索事件绑定已在renderSearchPage函数中完成
      
      // 强制刷新搜索容器
      if (searchContainer) {
        searchContainer.offsetHeight; // 触发重绘
        searchContainer.style.display = 'flex';
      }
      
      // 在窄页面时确保只显示一个页面
      if (window.innerWidth <= 768) {
        const sidebarLeft = document.querySelector('.sidebar-left');
        if (sidebarLeft && sidebarLeft.classList.contains('show')) {
          sidebarLeft.classList.remove('show');
        }
      }
      
      // 重置搜索状态，确保每次进入搜索页面都是干净的状态
      resetSearchState();
    }

    // 简化的tab切换函数（保持兼容性，但实际上不再需要tab切换）
    function switchFunctionTab() {
      // 由于不再需要tab切换，这个函数保持空实现以避免报错
      renderFunctionContent();
    }

    // 目录加载相关全局变量 - 已简化为一次性加载
    
    // 重置目录加载状态
    function resetDirectoryLoading() {
      // 重置目录加载状态
      console.log('重置目录加载状态');
      // 可以在这里添加目录加载相关的重置逻辑
      // 例如：设置加载状态标志、清理加载指示器等
    }
    
    // 目录渲染 - 恢复为一次性加载所有章节
    function renderDirectory() {
      // 使用 DocumentFragment 优化DOM操作
      const fragment = document.createDocumentFragment();
      
      // 遍历卷
      volData.forEach((vol, volIndex) => {
        // 创建卷标题
        const volumeTitle = document.createElement('div');
        volumeTitle.className = 'volume-title';
        volumeTitle.textContent = vol.volTitle;
        fragment.appendChild(volumeTitle);

        // 章节列表
        vol.chapters.forEach((chap, chapIndex) => {
          const chapterItem = document.createElement('div');
          chapterItem.className = 'chapter-item';
          chapterItem.style.display = 'flex';
          chapterItem.style.justifyContent = 'space-between';
          chapterItem.style.alignItems = 'center';
          
          // 创建章节标题文本节点
          const titleSpan = document.createTextNode(chap.title);
          chapterItem.appendChild(titleSpan);
          
          // 获取章节索引
          const flatIndex = flatChapters.indexOf(chap);
          
          // 创建序号元素
          const numberSpan = document.createElement('span');
          // 检查是否是前言章节，如果是则显示序号0，否则显示章节索引
          numberSpan.textContent = chap.isPreface ? 0 : flatIndex;
          numberSpan.style.fontSize = '12px';
          numberSpan.style.marginLeft = '8px';
          numberSpan.style.color = '#aaa';
          chapterItem.appendChild(numberSpan);
          if (flatIndex === currentIndex) {
            chapterItem.classList.add('current');
          }
          
          // 使用事件委托优化事件绑定
          chapterItem.addEventListener('click', () => {
            currentIndex = flatIndex;
            // 确保只显示一个章节内容，清除所有已加载的章节
            loadedChapters = [];
            // 清空章节容器，确保只显示当前章节
            chapterContent.innerHTML = '';
            // 设置章节切换标志，确保从顶部开始显示
            isChapterSwitching = true;
            renderChapter();
            renderDirectory();
            updateProgress();
            renderFunctionContent();
            updateChapterJumpUI();
            // 移动端目录遮挡时自动切换
            if (isMobile() && sidebarLeft.classList.contains('fullscreen')) {
              closeAllSidebars();
              switchToReading();
            }
            // 目录点击跳转时正文滚动条即时置顶
            chapterContent.scrollTop = 0;
            // 强制重绘确保立即生效
            chapterContent.offsetHeight;
          });
          
          fragment.appendChild(chapterItem);
        });
      });
      
      // 一次性更新DOM
      directoryList.innerHTML = '';
      directoryList.appendChild(fragment);
      
      // 确保回到当前章节按钮存在并添加到目录
      ensureBackToCurrentButton();
      
      // 初始化目录滚动检测和按钮事件
      setupBackToCurrentButtonLogic();
    }
    
    // 移除加载更多章节相关函数
    
    // 确保回到当前章节按钮存在
    function ensureBackToCurrentButton() {
      let backToCurrentBtn = document.getElementById('backToCurrentBtn');
      
      // 获取侧边栏容器
      const sidebarLeft = document.querySelector('.sidebar-left');
      
      // 如果按钮不存在，则创建并添加到侧边栏容器
      if (!backToCurrentBtn) {
        backToCurrentBtn = document.createElement('button');
        backToCurrentBtn.id = 'backToCurrentBtn';
        backToCurrentBtn.className = 'back-to-current-btn';
        backToCurrentBtn.textContent = '回到当前章节';
        if (sidebarLeft) {
          sidebarLeft.appendChild(backToCurrentBtn);
        }
      } else {
        // 如果按钮存在但不在侧边栏中，则移到侧边栏
        if (backToCurrentBtn.parentNode !== sidebarLeft && sidebarLeft) {
          sidebarLeft.appendChild(backToCurrentBtn);
        }
      }
      
      return backToCurrentBtn;
    }
    
    // 设置回到当前章节按钮的滚动检测和点击事件
    function setupBackToCurrentButtonLogic() {
      const backToCurrentBtn = document.getElementById('backToCurrentBtn');
      
      if (!backToCurrentBtn) {
        console.error('回到当前章节按钮不存在');
        return;
      }
      
      // 清除已存在的滚动事件监听器
      directoryList.removeEventListener('scroll', checkAndUpdateBackToCurrentButton);
      
      // 添加滚动事件监听器
      directoryList.addEventListener('scroll', checkAndUpdateBackToCurrentButton);
      
      // 清除已存在的点击事件
      const newBackToCurrentBtn = backToCurrentBtn.cloneNode(true);
      backToCurrentBtn.parentNode.replaceChild(newBackToCurrentBtn, backToCurrentBtn);
      
      // 为新按钮添加点击事件
      newBackToCurrentBtn.addEventListener('click', function() {
        scrollToCurrentChapter();
      });
      
      // 初始化时检查一次
      checkAndUpdateBackToCurrentButton();
    }
    
    // 检查并更新回到当前章节按钮的显示状态
    function checkAndUpdateBackToCurrentButton() {
      // 在目录页未打开时，无需监听回到当前章节按钮状态
      if (!sidebarLeft.classList.contains('show')) {
        const backToCurrentBtn = document.getElementById('backToCurrentBtn');
        if (backToCurrentBtn) {
          backToCurrentBtn.style.display = 'none';
        }
        return;
      }
      
      // 如果正在滚动到当前章节，则不进行状态检查，避免重复判断
      if (directoryList.getAttribute('data-scrolling-to-current') === 'true') {
        return;
      }
      
      const backToCurrentBtn = document.getElementById('backToCurrentBtn');
      const currentChapterElement = directoryList.querySelector('.chapter-item.current');
      
      if (!currentChapterElement || !backToCurrentBtn) {
        if (backToCurrentBtn) {
          backToCurrentBtn.style.display = 'none';
        }
        return;
      }
      
      try {
        // 获取目录容器的滚动位置和尺寸
        const containerHeight = directoryList.clientHeight;
        const containerScrollTop = directoryList.scrollTop;
        
        // 获取当前章节元素的位置和尺寸
        const chapterTop = currentChapterElement.offsetTop;
        const chapterHeight = currentChapterElement.offsetHeight;
        const chapterBottom = chapterTop + chapterHeight;
        
        // 检查当前章节是否在可视区域内
        // 添加一些缓冲区域，使体验更流畅
        const buffer = 50;
        // 修正可见性检测逻辑
        const isVisible = chapterTop + buffer >= containerScrollTop && 
                          chapterBottom - buffer <= containerScrollTop + containerHeight;
        
        // 根据检查结果显示或隐藏按钮
        if (isVisible) {
          backToCurrentBtn.style.display = 'none';
        } else {
          backToCurrentBtn.style.display = 'flex';
          // 确保按钮在最上层
          backToCurrentBtn.style.zIndex = '1000';
        }
        
      } catch (error) {
        console.error('检查当前章节可见性时出错:', error);
        // 出错时也尝试显示按钮，确保功能可用
        backToCurrentBtn.style.display = 'flex';
      }
    }
    
    // 滚动到当前章节
    function scrollToCurrentChapter() {
      const currentChapterElement = directoryList.querySelector('.chapter-item.current');
      
      if (currentChapterElement) {
        try {
          // 获取当前章节的高度
          const chapterHeight = currentChapterElement.offsetHeight;
          
          // 计算滚动位置，增加章节高度的偏移量以确保当前章节完全可见
          // 留出50px顶部空间，并减去一个章节高度，确保整个当前章节都在视图中
          const scrollPosition = currentChapterElement.offsetTop - 50 - chapterHeight;
          
          // 标记正在滚动，避免滚动过程中重复检查按钮状态
          directoryList.setAttribute('data-scrolling-to-current', 'true');
          
          // 平滑滚动到当前章节
          directoryList.scrollTo({
            top: Math.max(0, scrollPosition), // 确保不会滚动到负数位置
            behavior: 'smooth'
          });
          
          // 滚动完成后隐藏按钮并清除滚动标记
          setTimeout(() => {
            const backToCurrentBtn = document.getElementById('backToCurrentBtn');
            if (backToCurrentBtn) {
              backToCurrentBtn.style.display = 'none';
            }
            // 清除滚动标记
            directoryList.removeAttribute('data-scrolling-to-current');
          }, 1000);
          
        } catch (error) {
          console.error('滚动到当前章节时出错:', error);
          
          // 降级方案：直接跳转，同样增加章节高度的偏移量
          const chapterHeight = currentChapterElement.offsetHeight;
          directoryList.scrollTop = Math.max(0, currentChapterElement.offsetTop - 50 - chapterHeight);
          
          // 直接隐藏按钮
          const backToCurrentBtn = document.getElementById('backToCurrentBtn');
          if (backToCurrentBtn) {
            backToCurrentBtn.style.display = 'none';
          }
        }
      }
    }

    // 关键词高亮函数 - 修改为在搜索模式下临时关闭其他高亮，关键词使用主题色，当前停留关键词添加对话高亮背景色
    function highlightKeywords(text, keyword, targetPosition = -1) {
      if (!keyword || !keyword.trim()) {
        return text;
      }
      
      // 如果没有指定目标位置，则高亮所有关键词（使用主题色文字）
      if (targetPosition === -1) {
        const regex = new RegExp(escapeRegExp(keyword), 'gi');
        return text.replace(regex, `<span class="highlight-keyword" style="color: var(--accent-color); font-weight: bold;">$&</span>`);
      }
      
      // 如果指定了目标位置，为当前停留的关键词添加对话高亮背景色
      const regex = new RegExp(escapeRegExp(keyword), 'gi');
      let match;
      let result = text;
      let offset = 0;
      
      while ((match = regex.exec(text)) !== null) {
        const matchStart = match.index;
        const matchEnd = matchStart + match[0].length;
        
        // 检查这个匹配是否在目标位置附近
        if (matchStart <= targetPosition && targetPosition <= matchEnd) {
          // 这是当前停留的关键词，使用主题色文字
          const beforeMatch = result.substring(0, matchStart + offset);
          const afterMatch = result.substring(matchEnd + offset);
          result = beforeMatch + 
                   `<span class="highlight-keyword" style="color: var(--accent-color); font-weight: bold;">${match[0]}</span>` + 
                   afterMatch;
          offset += `<span class="highlight-keyword" style="color: var(--accent-color); font-weight: bold;">${match[0]}</span>`.length - match[0].length;
          break; // 只高亮当前停留的关键词
        } else {
          // 其他关键词只使用主题色文字
          const beforeMatch = result.substring(0, matchStart + offset);
          const afterMatch = result.substring(matchEnd + offset);
          result = beforeMatch + 
                   `<span class="highlight-keyword" style="color: var(--accent-color); font-weight: bold;">${match[0]}</span>` + 
                   afterMatch;
          offset += `<span class="highlight-keyword" style="color: var(--accent-color); font-weight: bold;">${match[0]}</span>`.length - match[0].length;
        }
      }
      
      return result;
    }

    // 渲染章节内容函数 - 统一使用渲染变量管理
    function renderChapterContent() {
      if (currentIndex < 0 || currentIndex >= flatChapters.length) return;
      const chapter = flatChapters[currentIndex];
      
      // 检查是否需要渲染（避免不必要的渲染）
      if (window.lastRenderedChapterIndex === currentIndex && !window.forceRerender) {
        console.log('跳过渲染，当前章节已渲染');
        return;
      }
      window.lastRenderedChapterIndex = currentIndex;
      window.forceRerender = false;
      
      const startTime = performance.now();
      
      // 获取左右翻页状态
      const isTraditionalTurning = window.renderVariables.isTraditionalPageTurningEnabled;
      
      // 在左右翻页模式下，清除已加载的其他章节
      if (isTraditionalTurning) {
        // 清除章节缓存
        loadedChapters = [];
        // 清除章节容器中除了当前正在渲染的内容外的所有元素
        chapterContent.innerHTML = '';
      }
      
      // 更新输入框值
      const jumpInput = chapterCounter.querySelector('#chapterJumpInput');
      if (jumpInput) {
        // 检查当前章节是否是前言章节
        const currentChapter = flatChapters[currentIndex];
        // 前言章节显示为0，其他章节显示为章节索引
        jumpInput.value = currentChapter && currentChapter.isPreface ? 0 : currentIndex;
      }
      
      // 使用 DocumentFragment 优化DOM操作
      const fragment = document.createDocumentFragment();
      
      // 创建标题
      const titleDiv = document.createElement('div');
      titleDiv.className = 'chapter-main-title';
      titleDiv.id = 'chapterTitle';
      titleDiv.textContent = chapter.title;
      fragment.appendChild(titleDiv);
      
      // 处理段落内容 - 保留空行版本
      // 使用\n分割以保留所有空行，确保标题和正文之间的空行不会导致内容丢失
      let paragraphs = chapter.content.split(/\n/);
      
      // 如果启用了句号换行功能，则在句号处分割文本为多个段落，但不分割对话中的句号
      if (window.renderVariables.isPeriodLineBreakEnabled) {
        const newParagraphs = [];
        paragraphs.forEach(para => {
          if (para.trim()) {
            // 获取对话的前后符号
            const dialogPrefix = window.renderVariables.dialogPrefix || '“';
            const dialogSuffix = window.renderVariables.dialogSuffix || '”';
            
            // 用于跟踪是否在对话内部
            let inDialog = false;
            let currentPara = '';
            
            // 逐个字符处理，确保所有句号和句号后带引号的情况都能正确换行
            for (let i = 0; i < para.length; i++) {
              const char = para[i];
              currentPara += char;
              
              // 检查对话开始符号
              if (char === dialogPrefix) {
                inDialog = true;
              }
              // 检查对话结束符号
              else if (char === dialogSuffix) {
                inDialog = false;
              }
              // 如果遇到句号且不在对话中，进行分割
              else if (char === '。' && !inDialog) {
                // 检查句号后是否有引号
                if (i + 1 < para.length && para[i + 1] === '”') {
                  // 保留当前字符和下一个引号字符
                  currentPara += para[i + 1];
                  i++; // 跳过下一个字符
                }
                
                // 将当前段落添加到新段落数组中
                if (currentPara.trim()) {
                  newParagraphs.push(currentPara);
                }
                
                // 重置当前段落，不保留任何空格
                currentPara = '';
                
                // 跳过句号后的所有空格
                while (i + 1 < para.length && para[i + 1] === ' ') {
                  i++;
                }
              }
            }
            
            // 添加最后一个段落（如果有剩余文本）
            if (currentPara.trim()) {
              newParagraphs.push(currentPara);
            }
          } else {
            // 保留空行
            newParagraphs.push(para);
          }
        });
        // 确保不会丢失任何内容，只在有新段落时替换
        if (newParagraphs.length > 0) {
          paragraphs = newParagraphs;
        }
      }
      
      // 输出段落信息用于调试
      console.log(`原始段落数: ${paragraphs.length}`);
      console.log('分割后的段落示例:', JSON.stringify(paragraphs.slice(0, 10)));
      
      // 为了确保所有段落都能被正确处理，添加一个简单的计数器来跟踪处理情况
      let processedParagraphs = 0;
      // 跟踪连续空行数量
      let consecutiveEmptyLines = 0;
      let totalEmptyLines = 0;
      
      // 获取当前渲染变量配置 - 避免使用解构，确保每次访问都获取最新值
      // 注意：这里不再解构，而是在需要时直接访问window.renderVariables
      
      // 预计算高亮所需数据
      const needsSearchHighlight = window.renderVariables.isInSearchMode && currentSearchKeyword && currentSearchKeyword.trim();
      const searchPositions = needsSearchHighlight && searchResultsData && searchResultsData[currentIndex] && searchResultsData[currentIndex].positions;
      
      // 提升到全局作用域以便其他函数访问
      // 初始化对话正则表达式
      function initDialogRegex() {
        const prefix = window.renderVariables.dialogPrefix || '“';
        const suffix = window.renderVariables.dialogSuffix || '”';
        
        // 转义特殊字符以用于正则表达式
        const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const escapedSuffix = suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // 创建正则表达式
        window.dialogRegex = new RegExp(`${escapedPrefix}([^${escapedSuffix}]*)${escapedSuffix}`, 'g');
      }
      
      // 初始化
      initDialogRegex();
      
      paragraphs.forEach((paragraph, index) => {
        const pDiv = document.createElement('div');
        pDiv.className = 'content-paragraph';
        pDiv.setAttribute('data-paragraph-index', index);
        
        // 应用当前的字体大小设置，确保人名高亮不会改变字号
        pDiv.style.fontSize = window.renderVariables.fontSize + 'px';
        
        // 处理空行段落 - 完全不渲染空行
        const trimmedParagraph = paragraph.trim();
        if (trimmedParagraph.length === 0) {
          // 增加连续空行和总空行计数（仅用于自动滚动功能）
          consecutiveEmptyLines++;
          totalEmptyLines++;
          // 不将空行添加到DOM中，实现完全不渲染
          return;
        } else {
          // 重置连续空行计数
          consecutiveEmptyLines = 0;
        }
        
        // 检查段落是否只包含符号（如半角符号、圆角符号等）
        // 优化正则表达式，使其更准确地匹配各类符号，并使用try-catch确保不会因正则问题导致渲染失败
        try {
          // 使用更准确的符号匹配正则表达式，包含常见的中英文标点符号、特殊符号
          const symbolsRegex = /^[\s,.，。、！!？?；;：:“”'"()（）【】\[\]{}《》<>\-—_=+～~`·^……\|\\/\*\&\%\$\#\@\!\^\*\(\)\[\]\{\}\~\`\|\\]+$/;
          const hasOnlySymbols = symbolsRegex.test(trimmedParagraph);
          
          if (hasOnlySymbols) {
            // 对于只包含符号的行，使用与普通段落相同的渲染方式，确保一致性
            // 使用textContent避免HTML解析问题
            pDiv.textContent = paragraph;
            fragment.appendChild(pDiv);
            processedParagraphs++;
            return;
          }
        } catch (e) {
          console.error('符号检测出错:', e);
          // 出错时继续正常处理，不中断渲染流程
        }
        
        // 避免不必要的变量创建
        let text = paragraph;
        
        // 当启用句号换行功能时，去除文本中的所有空格
        if (window.renderVariables.isPeriodLineBreakEnabled) {
          text = text.replace(/\s/g, '');
        }
        
        // 应用对话高亮（引号内内容）
        if (window.renderVariables.isDialogHighlightEnabled) {
          try {
            // 直接从window.renderVariables获取最新的颜色值，确保章节切换时保持用户修改后的颜色
            const currentDialogColor = window.renderVariables.dialogHighlightColor || '#999999';
            
            // 设置CSS变量 - 正确处理自定义颜色
            if (currentDialogColor.startsWith('#')) {
              // 自定义颜色，直接使用
              document.documentElement.style.setProperty('--dialog-highlight-color', currentDialogColor);
            } else {
              // 预设颜色，使用对应的CSS变量
              document.documentElement.style.setProperty('--dialog-highlight-color', `var(--dialog-highlight-${currentDialogColor})`);
            }
            
            // 使用当前选择的高亮类型
            const highlightType = window.renderVariables.dialogHighlightType || 'underline';
            const prefix = window.renderVariables.dialogPrefix || '“';
            const suffix = window.renderVariables.dialogSuffix || '”';
            // 检查是否启用字体高亮
            const isFontHighlightEnabled = window.renderVariables.isDialogFontHighlightEnabled || false;
            text = text.replace(window.dialogRegex, function(match, content) {
              // 只在下划线模式下且启用字体高亮时添加font-highlight类
              const classes = highlightType === 'underline' && isFontHighlightEnabled 
                ? 'highlight-dialog ' + highlightType + ' font-highlight' 
                : 'highlight-dialog ' + highlightType;
              return prefix + '<span class="' + classes + '">' + escapeHTML(content) + '</span>' + suffix;
            });
          } catch (e) {
            console.error('对话高亮处理出错:', e);
            // 出错时保持原始文本不变
          }
        }
        
        // 应用人名高亮
        if (window.renderVariables.isNameHighlightEnabled && window.renderVariables.currentNames.length > 0) {
          try {
            text = highlightNamesInText(text);
          } catch (e) {
            console.error('人名高亮处理出错:', e);
            // 出错时保持原始文本不变
          }
        }
        
        // 如果在搜索模式下，高亮关键词 - 优化计算逻辑
        if (needsSearchHighlight) {
          try {
            if (searchPositions) {
              // 在搜索引导模式下，只高亮当前位置的关键词
              const targetPosition = searchPositions[currentSearchIndex] || 0;
              
              // 优化：提前计算段落位置范围
              let paragraphStartPos = 0;
              for (let i = 0; i < index; i++) {
                paragraphStartPos += paragraphs[i].length + 1; // +1 for newline
              }
              const paragraphEndPos = paragraphStartPos + paragraph.length;
              
              // 如果目标位置在当前段落内，则高亮该位置的关键词
              if (targetPosition >= paragraphStartPos && targetPosition <= paragraphEndPos) {
                const localPosition = targetPosition - paragraphStartPos;
                text = highlightKeywords(text, currentSearchKeyword, localPosition);
              }
            } else {
              // 如果没有位置信息，则高亮所有关键词
              text = highlightKeywords(text, currentSearchKeyword);
            }
          } catch (e) {
            console.error('搜索高亮处理出错:', e);
            // 出错时保持原始文本不变
          }
        }
        
        // 确保即使出错也能显示内容
        pDiv.innerHTML = text || escapeHTML(paragraph);
        fragment.appendChild(pDiv);
        processedParagraphs++;
      });
      
      // 添加章节间留白
      const chapterSpacing = document.createElement('div');
      chapterSpacing.className = 'chapter-spacing';
      chapterSpacing.style.height = '100px'; // 100px的留白
      fragment.appendChild(chapterSpacing);
      
      // 检查是否有段落被处理
      console.log(`处理的段落总数: ${processedParagraphs}, 原始段落总数: ${paragraphs.length}`);
      console.log(`总空行数量: ${totalEmptyLines}, 连续空行最大数: ${consecutiveEmptyLines}`);
      
      // 添加额外的调试信息，检查最后几个节点
      if (fragment.childNodes.length > 0) {
        const lastNodesCount = Math.min(5, fragment.childNodes.length);
        const lastNodes = Array.from(fragment.childNodes).slice(-lastNodesCount);
        console.log(`最后${lastNodesCount}个节点内容:`, 
                    lastNodes.map(node => node.textContent || node.innerHTML).join(', '));
      }
      
      // 批量更新DOM
      chapterContent.innerHTML = '';
      chapterContent.appendChild(fragment);
      
      // 检查DOM更新后是否所有节点都被正确添加
      console.log('DOM更新后总节点数:', chapterContent.childNodes.length);
      console.log('章节内容容器scrollHeight:', chapterContent.scrollHeight);
      
      // 安全性增强：自动滚动到第一个非空行内容，确保用户能看到正文
      // 特别是在标题和正文之间有空行的情况下
      requestAnimationFrame(() => {
        // 查找第一个非空行的段落元素
        const firstNonEmptyParagraph = chapterContent.querySelector('.content-paragraph:not(.empty-line)');
        // 只有当文档开头有较多连续空行且不是章节切换时才自动滚动
        // 这样可以避免轻微内容格式问题导致的不必要滚动，同时保证章节切换时从顶部开始
        // 新增条件：如果是因为人名高亮更新而重新渲染，则不自动滚动
        if (firstNonEmptyParagraph && consecutiveEmptyLines > 3 && !isChapterSwitching && 
            window.renderVariables.lastRerenderReason !== 'nameHighlight' && 
            !window.renderVariables.isNameHighlightUpdateInProgress) {
          console.log('检测到连续多行空行，自动滚动到第一个非空段落');
          // 使用平滑滚动到第一个非空段落
          firstNonEmptyParagraph.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (isChapterSwitching) {
          // 章节切换标志由renderChapter函数控制，这里不再重置
          // 确保保持顶部显示
        }
      });
      
      // 应用字体大小设置 - 优化：减少重绘，并确保覆盖其他样式
      // 在人名高亮更新期间跳过字体大小设置，避免布局变化导致滚动位置问题
      if (!window.renderVariables.isNameHighlightUpdateInProgress) {
        chapterContent.style.setProperty('--font-size', window.renderVariables.fontSize + 'px', 'important');
        chapterContent.style.fontSize = window.renderVariables.fontSize + 'px';
        
        // 统一应用行间距和段落间距设置
        applyLineHeightToDOM(window.renderVariables.lineHeight);
        applyParagraphSpacingToDOM(window.renderVariables.paragraphSpacing);
      }
      
      // 减少不必要的DOM查询
      if (window.renderVariables.isInSearchMode && currentSearchKeyword && currentSearchKeyword.trim() && 
          window.renderVariables.lastRerenderReason !== 'nameHighlight' && 
          !window.renderVariables.isNameHighlightUpdateInProgress) {
        // 使用requestAnimationFrame优化滚动
        requestAnimationFrame(() => {
          scrollToFirstHighlightedKeyword();
        });
      }
      
      // 性能监控
      const renderTime = performance.now() - startTime;
      console.log(`章节渲染完成，耗时: ${renderTime.toFixed(2)}ms`);
      
      // 仅在不是因为人名高亮更新而重新渲染时应用字体设置
      // 这样可以防止人名高亮更新时刷新用户的阅读设置
      if (window.renderVariables.lastRerenderReason !== 'nameHighlight' && !window.renderVariables.isNameHighlightUpdateInProgress) {
        // 应用当前字体设置，确保所有渲染完成后字体大小正确
        applyCurrentFontSettings();
      }
      
      // 先不重置渲染原因标志，确保后续逻辑能够正确判断
      // 延迟重置，确保所有可能的滚动逻辑都已执行
      setTimeout(() => {
        window.renderVariables.lastRerenderReason = '';
      }, 100);
      
      // 定期检查内存使用
      if (Math.random() < 0.1) { // 10%概率执行内存检查
        if (performance.memory) {
          const used = performance.memory.usedJSHeapSize / 1024 / 1024;
          const total = performance.memory.totalJSHeapSize / 1024 / 1024;
          console.log(`内存使用: ${used.toFixed(2)}MB / ${total.toFixed(2)}MB`);
        }
      }
    }

    // 滚动到第一个高亮关键词 - 性能优化版
    let scrollToKeywordDebounceTimer = null;
    function scrollToFirstHighlightedKeyword() {
      // 检查是否正在进行人名高亮更新，如果是则不执行滚动
      if (window.renderVariables.isNameHighlightUpdateInProgress) {
        return;
      }
      
      // 添加防抖处理，避免短时间内重复调用
      if (scrollToKeywordDebounceTimer) {
        clearTimeout(scrollToKeywordDebounceTimer);
      }
      
      scrollToKeywordDebounceTimer = setTimeout(() => {
        // 再次检查，确保在延迟期间没有开始人名高亮更新
        if (window.renderVariables.isNameHighlightUpdateInProgress) {
          return;
        }
        
        const startTime = performance.now();
        
        // 使用getElementById代替querySelector提升性能（如果可能的话）
        // 这里保留querySelector以兼容现有代码
        const firstHighlight = document.querySelector('.highlight-keyword');
        
        if (firstHighlight) {
          // 使用requestAnimationFrame优化滚动和样式更改
          requestAnimationFrame(() => {
            try {
              firstHighlight.scrollIntoView({
                behavior: 'instant',
                block: 'center'
              });
              
              // 添加额外的视觉强调 - 使用CSS变量而非硬编码颜色
              const highlightColor = 'rgba(12, 140, 233, 0.1)';
              firstHighlight.style.background = highlightColor;
              
              // 避免嵌套的setTimeout，使用requestAnimationFrame链
              let fadeSteps = 20;
              let currentStep = 0;
              
              function fadeOutHighlight() {
                if (currentStep < fadeSteps) {
                  const opacity = (fadeSteps - currentStep) / fadeSteps;
                  firstHighlight.style.background = `rgba(12, 140, 233, ${opacity * 0.1})`;
                  currentStep++;
                  requestAnimationFrame(fadeOutHighlight);
                } else {
                  // 完全清除样式
                  firstHighlight.style.background = '';
                }
              }
              
              // 延迟200ms后开始淡出
              setTimeout(() => {
                requestAnimationFrame(fadeOutHighlight);
              }, 200);
              
              // 性能监控
              const scrollTime = performance.now() - startTime;
              console.log(`滚动到高亮关键词完成，耗时: ${scrollTime.toFixed(2)}ms`);
            } catch (error) {
              console.error('滚动到高亮关键词时出错:', error);
            }
          });
        }
      }, 50); // 防抖延迟50ms
    }

    // 全局标志：指示当前是否正在进行章节切换
    let isChapterSwitching = false;
    
    // 全局标志：指示当前是否正在恢复滚动位置
    let isScrollingRestored = false;
    
    // 性能优化：章节渲染（保持兼容性）
    function renderChapter() {
      // 设置章节切换标志
      isChapterSwitching = true;
      // 设置渲染原因标志
      window.renderVariables.lastRerenderReason = 'chapterSwitch';
      // 设置强制渲染标志，确保即使章节索引没变也会重新渲染
      window.forceRerender = true;
      // 无论在什么翻页模式下，都只显示当前章节内容
      loadedChapters = [];
      // 清空章节容器
      chapterContent.innerHTML = '';
      renderChapterContent();
      
      // 根据当前的自动翻页和左右翻页设置来正确显示/隐藏分页区
      const chapterFooter = document.querySelector('.chapter-footer');
      if (chapterFooter) {
        const isSeamlessScrollingEnabled = window.renderVariables.isSeamlessScrollingEnabled;
        const isTraditionalPageTurningEnabled = window.renderVariables.isTraditionalPageTurningEnabled;
        
        // 优先检查左右翻页设置，如果开启则显示分页区
        // 否则根据自动翻页设置决定：自动翻页开启时隐藏，关闭时显示
        // 注意：这里只控制是否应该存在分页区，不覆盖hidden类的显示/隐藏逻辑
        // 使用CSS类来控制，避免直接设置style.display覆盖hidden类
        const shouldShowFooter = isTraditionalPageTurningEnabled || !isSeamlessScrollingEnabled;
        if (!shouldShowFooter) {
          chapterFooter.classList.add('footer-disabled');
        } else {
          chapterFooter.classList.remove('footer-disabled');
        }
      }
      
      // 延迟重置章节切换标志，确保渲染完成
      setTimeout(() => {
        isChapterSwitching = false;
      }, 100);
    }
    
    // 切换句号换行功能
    function togglePeriodLineBreak() {
      // 切换状态
      window.renderVariables.isPeriodLineBreakEnabled = !window.renderVariables.isPeriodLineBreakEnabled;
      
      // 立即并明确地更新所有相关的开关按钮UI状态
      updatePeriodLineBreakToggleUI();
      
      // 保存设置
      saveProgress();
      
      // 重新渲染章节内容以应用更改
      window.forceRerender = true;
      renderChapterContent();
    }
    
    // 专门用于更新句号换行开关UI的函数
    function updatePeriodLineBreakToggleUI() {
      // 查找所有可能包含开关的function-item
      const functionItems = document.querySelectorAll('.function-item');
      let found = false;
      
      for (const item of functionItems) {
        const title = item.querySelector('.function-title');
        if (title && title.textContent && title.textContent.includes('句号换行')) {
          const toggleSwitch = item.querySelector('.toggle-switch');
          if (toggleSwitch) {
            // 强制更新开关状态
            if (window.renderVariables.isPeriodLineBreakEnabled) {
              toggleSwitch.classList.remove('off');
              // 立即应用样式变化，避免移动端延迟
              toggleSwitch.offsetHeight; // 触发重绘
            } else {
              toggleSwitch.classList.add('off');
              // 立即应用样式变化，避免移动端延迟
              toggleSwitch.offsetHeight; // 触发重绘
            }
            found = true;
          }
        }
      }
      
      // 如果没有找到，尝试通过其他方式查找
      if (!found) {
        const toggleSwitches = document.querySelectorAll('.toggle-switch');
        for (const switchEl of toggleSwitches) {
          const parentItem = switchEl.closest('.function-item');
          if (parentItem) {
            const title = parentItem.querySelector('.function-title');
            if (title && title.textContent && title.textContent.includes('句号换行')) {
              if (window.renderVariables.isPeriodLineBreakEnabled) {
                switchEl.classList.remove('off');
              } else {
                switchEl.classList.add('off');
              }
              break;
            }
          }
        }
      }
    }
    
    // renderChapter函数正常工作，不需要增强处理

    // 渲染功能面板
    function renderFunctionContent() {
      // 在sidebar-right中添加tab栏，确保它在functionContent上方
      const sidebarRight = document.getElementById('sidebarRight');
      
      // 确保updatePeriodLineBreakToggleUI函数存在
      if (typeof updatePeriodLineBreakToggleUI !== 'function') {
        // 如果函数不存在，定义一个简化版本
        window.updatePeriodLineBreakToggleUI = function() {
          const functionItems = document.querySelectorAll('.function-item');
          for (const item of functionItems) {
            const title = item.querySelector('.function-title');
            if (title && title.textContent && title.textContent.includes('句号换行')) {
              const toggleSwitch = item.querySelector('.toggle-switch');
              if (toggleSwitch) {
                toggleSwitch.classList.toggle('off', !window.renderVariables.isPeriodLineBreakEnabled);
              }
            }
          }
        };
      }
      
      // 检查是否已经有tab栏，如果没有则添加
      if (!sidebarRight.querySelector('.function-tabs')) {
        const tabsHtml = `
          <div class="function-tabs">
            <div class="function-tab active" id="tabSettings" onclick="switchFunctionTab('settings')">
              功能设置
            </div>
            <div class="function-tab" id="tabNotes" onclick="switchFunctionTab('notes')">
              笔记管理
            </div>
          </div>
        `;
        
        // 将tab栏插入到functionContent之前
        sidebarRight.insertAdjacentHTML('afterbegin', tabsHtml);
      }
      
      // 默认显示功能设置tab
      renderSettingsTab();
    }
    
    // 切换功能tab
    function switchFunctionTab(tab) {
      // 更新tab样式
      document.getElementById('tabSettings').classList.remove('active');
      document.getElementById('tabNotes').classList.remove('active');
      document.getElementById('tab' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add('active');
      
      // 渲染对应tab内容
      if (tab === 'settings') {
        renderSettingsTab();
      } else if (tab === 'notes') {
        renderNotesTab();
      }
    }
    
    // 渲染功能设置tab
    function renderSettingsTab() {
      // 定义SVG图标
      const icons = {
        person: createSvgIcon('M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z', 'currentColor', 'none', 0),
        dialog: createSvgIcon('M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z', 'currentColor', 'none', 0),
        scroll: createSvgIcon('M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z', 'currentColor', 'none', 0),
        page: createSvgIcon('M6 2C4.9 2 4 2.9 4 4v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z', 'currentColor', 'none', 0),
        period: createSvgIcon('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z', 'currentColor', 'none', 0),
        fontSize: createSvgIcon('M9.93 13.5h4.14L12 7.98zM20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4.05 16.5l-1.14-3H9.17l-1.12 3H5.96l5.11-13h1.86l5.11 13h-2.09z', 'currentColor', 'none', 0),
        fontWeight: createSvgIcon('M3 17h18v2H3v-2zm0-7h18v5H3v-5zm0-4h18v2H3V6z', 'currentColor', 'none', 0),
        lineHeight: createSvgIcon('M3 5h18v2H3V5zm0 8h18v2H3v-2zm0 4h12v2H3v-2zm0-8h12v2H3V9z', 'currentColor', 'none', 0),
        paragraph: createSvgIcon('M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z', 'currentColor', 'none', 0),
        margin: createSvgIcon('M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z', 'currentColor', 'none', 0),
        theme: createSvgIcon('M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z', 'currentColor', 'none', 0),
        sync: createSvgIcon('M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z', 'currentColor', 'none', 0)
      };
      
      functionContent.innerHTML = `
        <div class="volume-title">功能</div>
        
        <div class="function-item" onclick="openNameDialog()">
          <div class="function-info">
            <div class="function-title"><i class="function-icon">${icons.person}</i>人名高亮</div>
            <div class="function-desc">自定义关键词高亮</div>
          </div>
          <div class="toggle-switch ${window.renderVariables.isNameHighlightEnabled ? '' : 'off'}" onclick="(function(e) { e.stopPropagation(); toggleNameHighlightMaster(); })(event)">
            <div class="toggle-slider"></div>
          </div>
        </div>
        <div class="function-item" onclick="openDialogHighlightDialog()">
          <div class="function-info">
            <div class="function-title"><i class="function-icon">${icons.dialog}</i>对话高亮</div>
            <div class="function-desc">高亮引号内的对话内容</div>
          </div>
          <div class="toggle-switch ${window.renderVariables.isDialogHighlightEnabled ? '' : 'off'}" onclick="(function(e) { e.stopPropagation(); toggleDialogHighlight(); })(event)">
            <div class="toggle-slider"></div>
          </div>
        </div>
        
        <div class="function-item">
          <div class="function-info">
            <div class="function-title"><i class="function-icon">${window.renderVariables.isSeamlessScrollingEnabled ? icons.scroll : icons.page}</i>${window.renderVariables.isSeamlessScrollingEnabled ? '滚动翻页' : '默认翻页'}</div>
            <div class="function-desc">滚动底部自动加载页面（可双击切换）</div>
          </div>
          <div class="toggle-switch ${window.renderVariables.isSeamlessScrollingEnabled ? '' : 'off'}" onclick="(function(e) { e.stopPropagation(); toggleScrollingMode(); })(event)">
            <div class="toggle-slider"></div>
          </div>
        </div>
        
        <div class="function-item">
          <div class="function-info">
            <div class="function-title"><i class="function-icon">${icons.period}</i>句号换行</div>
            <div class="function-desc">有句号的地方自动换段落行</div>
          </div>
          <div class="toggle-switch ${window.renderVariables.isPeriodLineBreakEnabled ? '' : 'off'}" onclick="(function(e) { e.stopPropagation(); togglePeriodLineBreak(); })(event)">
            <div class="toggle-slider"></div>
          </div>
        </div>
        
        <div class="function-divider"></div>
        
        <div class="volume-title">设置</div>
        
        <div class="function-item" onclick="openFontSizeDialog()">
          <div class="function-info">
            <div class="function-title"><i class="function-icon">${icons.fontSize}</i>正文字号</div>
            <div class="function-desc">调整阅读字体大小</div>
          </div>
          <span class="function-arrow">&#8250;</span>
        </div>
        <div class="function-item" onclick="openFontWeightDialog()">
          <div class="function-info">
            <div class="function-title"><i class="function-icon">${icons.fontWeight}</i>字体字重</div>
            <div class="function-desc">调整阅读字体粗细</div>
          </div>
          <span class="function-arrow">&#8250;</span>
        </div>
        <div class="function-item" onclick="openLineHeightDialog()">
          <div class="function-info">
            <div class="function-title"><i class="function-icon">${icons.lineHeight}</i>行间距</div>
            <div class="function-desc">调整段落行距</div>
          </div>
          <span class="function-arrow">&#8250;</span>
        </div>
        <div class="function-item" onclick="openParagraphSpacingDialog()">
          <div class="function-info">
            <div class="function-title"><i class="function-icon">${icons.paragraph}</i>段落间距</div>
            <div class="function-desc">调整段落之间的间距</div>
          </div>
          <span class="function-arrow">&#8250;</span>
        </div>
        <div class="function-item" onclick="openMarginSettingsDialog()">
          <div class="function-info">
            <div class="function-title"><i class="function-icon">${icons.margin}</i>页边距设置</div>
            <div class="function-desc">调整阅读区域两侧的间距</div>
          </div>
          <span class="function-arrow">&#8250;</span>
        </div>
        <div class="function-divider"></div>
        
        <div class="volume-title">系统</div>
        
        <div class="function-item" onclick="openThemeDialog()">
          <div class="function-info">
            <div class="function-title"><i class="function-icon">${icons.theme}</i>主题设置</div>
            <div class="function-desc">自定义界面主题和颜色</div>
          </div>
          <span class="function-arrow">&#8250;</span>
        </div>
        
        <div class="function-item" onclick="openImportExportSettings()">
          <div class="function-info">
            <div class="function-title"><i class="function-icon">${icons.sync}</i>书籍数据同步</div>
            <div class="function-desc">不同设备 相同书籍 进度同步</div>
          </div>
          <span class="function-arrow">&#8250;</span>
        </div>
        

        
      `;
      
      // 延迟一点时间确保DOM已完全更新，然后更新开关状态
      setTimeout(() => {
        if (typeof updatePeriodLineBreakToggleUI === 'function') {
          updatePeriodLineBreakToggleUI();
        } else if (typeof window.updatePeriodLineBreakToggleUI === 'function') {
          window.updatePeriodLineBreakToggleUI();
        }
      }, 50);
    }
    
    // 搜索关键词变量
    let currentNoteSearchKeyword = '';
    
    // 渲染笔记管理tab
    function renderNotesTab() {
      // 定义笔记页图标
      const noteIcons = {
        add: createSvgIcon('M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z', 'white', 'none', 0)
      };
      
      functionContent.innerHTML = `
        <div class="notes-header" style="display: flex; flex-direction: column; gap: 12px; padding: 12px 16px; border-bottom: 1px solid var(--border-color);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div class="notes-status" style="font-size: 13px; color: var(--secondary-text-color);">我的笔记: <span id="notesProgress">0/0</span></div>
            <div style="display: flex; gap: 8px;">
              <button class="notes-import-btn" onclick="importNotes()" title="粘贴板导入" style="
                display: flex;
                align-items: center;
                justify-content: center;
                height: 32px;
                padding: 0 12px;
                background: transparent;
                border: 1px solid var(--border-color);
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                color: var(--secondary-text-color);
                transition: all 0.2s;
              ">导入</button>
              <button class="notes-export-btn" onclick="exportNotes()" title="复制到粘贴板" style="
                display: flex;
                align-items: center;
                justify-content: center;
                height: 32px;
                padding: 0 12px;
                background: transparent;
                border: 1px solid var(--border-color);
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                color: var(--secondary-text-color);
                transition: all 0.2s;
              ">复制</button>
              <button class="notes-add-btn" onclick="addNewNote()" title="新增笔记" style="
                display: flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
                padding: 0;
                background: var(--accent-color);
                border: none;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.2s;
              ">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              </button>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <input type="text" id="notesSearchInput" placeholder="搜索笔记标题或内容..." style="
              flex: 1;
              height: 32px;
              padding: 0 12px;
              background: rgba(255, 255, 255, 0.05);
              border: 1px solid var(--border-color);
              border-radius: 4px;
              color: var(--text-color);
              font-size: 13px;
              outline: none;
              transition: border-color 0.2s;
            " oninput="handleNotesSearch(this.value)">
          </div>
        </div>
        
        <div class="notes-tabs" style="display: flex; margin: 0 16px 12px; border-radius: 6px; overflow: hidden; background-color: rgba(0,0,0,0.1);">
          <button class="notes-tab" id="tabAll" onclick="switchNoteTab('all')" style="flex: 1; padding: 6px 8px; text-align: center; background: none; border: none; color: var(--secondary-text-color); cursor: pointer; font-size: 12px;">全部</button>
          <button class="notes-tab" id="tabInProgress" onclick="switchNoteTab('inProgress')" style="flex: 1; padding: 6px 8px; text-align: center; background: none; border: none; color: var(--secondary-text-color); cursor: pointer; font-size: 12px;">进行中</button>
          <button class="notes-tab" id="tabCompleted" onclick="switchNoteTab('completed')" style="flex: 1; padding: 6px 8px; text-align: center; background: none; border: none; color: var(--secondary-text-color); cursor: pointer; font-size: 12px;">已完成</button>
        </div>
        
        <div class="notes-list" id="notesList" style="height: calc(100vh - 220px); overflow-y: auto; padding: 0 16px; max-width: 100%; box-sizing: border-box;">
          <style>
            /* 滚动条样式 */
            .notes-list::-webkit-scrollbar {
              width: 6px;
            }
            
            .notes-list::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.05);
              border-radius: 3px;
            }
            
            .notes-list::-webkit-scrollbar-thumb {
              background: var(--border-color);
              border-radius: 3px;
              transition: background 0.2s;
            }
            
            .notes-list::-webkit-scrollbar-thumb:hover {
              background: var(--accent-color);
              opacity: 0.8;
            }
            
            /* 无笔记提示样式 */
            .no-notes-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 60px 20px;
              color: var(--secondary-text-color);
              text-align: center;
              min-height: 250px;
              background: rgba(255, 255, 255, 0.03);
              border-radius: 12px;
              margin: 20px;
            }
            
            .no-notes-container > div:first-child {
              font-size: 48px;
              margin-bottom: 16px;
              opacity: 0.5;
            }
            
            .no-notes-container > div:nth-child(2) {
              font-size: 16px;
              font-weight: 600;
              color: var(--text-color);
              margin-bottom: 8px;
            }
            
            .no-notes-container > div:last-child {
              font-size: 14px;
              color: var(--secondary-text-color);
              line-height: 1.5;
            }
            
            /* 笔记卡片样式 */
            .note-card {
              padding: 16px 20px;
              margin-bottom: 12px;
              border-bottom: 1px solid rgba(255, 255, 255, 0.05);
              width: 100%;
              display: flex;
              flex-direction: column;
              gap: 12px;
              box-sizing: border-box;
            }
            
            /* 移除最后一个卡片的底部边框 - 已不需要，因为现在有间距和背景 */
            .note-card:last-child {
              /* 保持统一间距 */
            }
            
            .note-card:hover {
              background-color: rgba(40, 40, 40, 0.8);
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
              border-color: rgba(99, 102, 241, 0.3);
            }
            
            /* 笔记内容样式 */
            .note-card-content {
              width: 100%;
              word-wrap: break-word;
              overflow-wrap: break-word;
            }
            
            .note-card-title {
              font-size: 18px;
              font-weight: 600;
              color: var(--text-color);
              margin-bottom: 8px;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              -webkit-box-orient: vertical;
              line-height: 1.4;
              word-wrap: break-word;
            }
            
            /* 增强已完成笔记样式区分 */
            .note-card-title {
              transition: all 0.3s ease;
            }
            
            .note-card-title.note-completed {
              text-decoration: line-through 2px;
              opacity: 0.6;
              font-weight: 500;
              color: var(--disabled-text-color, #888);
            }
            
            /* 未完成笔记强调样式 */
            .note-card:not(.note-completed) .note-card-title {
              color: var(--text-color);
              font-weight: 600;
            }
            
            .note-card-text {
              font-size: 14px;
              color: var(--secondary-text-color);
              line-height: 1.5;
              word-wrap: break-word;
              overflow-wrap: break-word;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 4;
              line-clamp: 4;
              -webkit-box-orient: vertical;
            }
            
            /* 笔记底部操作区域 */
            .note-card-footer {
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;
              padding-top: 12px;
              border-top: 1px solid rgba(255, 255, 255, 0.05);
            }
            
            .note-card-footer-left {
              display: flex;
              align-items: center;
              gap: 10px;
            }
            
            .note-task-checkbox {
              width: 18px;
              height: 18px;
              cursor: pointer;
              border-radius: 4px;
              border: 2px solid var(--accent-color);
              background: transparent;
              transition: all 0.2s;
            }
            
            .note-task-checkbox:hover {
              border-color: rgba(99, 102, 241, 0.8);
            }
            
            .note-task-checkbox:checked {
              background: var(--accent-color);
            }
            
            .note-checkbox-label {
              font-size: 12px;
              color: var(--secondary-text-color);
            }
            
            .note-card-time {
              font-size: 12px;
              color: var(--secondary-text-color);
              opacity: 0.6;
              font-style: italic;
              margin-left: auto;
            }
            
            .note-card-actions {
              display: flex;
              align-items: center;
              gap: 10px;
              justify-content: flex-end;
              margin-left: 16px;
            }
            
            /* 按钮样式 */
            .note-card-btn {
              flex: 1;
              padding: 8px 16px;
              border: none;
              border-radius: 8px;
              font-size: 12px;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s;
              text-align: center;
              box-sizing: border-box;
            }
            
            .note-card-btn.edit {
              background: var(--accent-color);
              color: white;
            }
            
            .note-card-btn.edit:hover {
              background: rgba(99, 102, 241, 0.9);
              transform: scale(1.05);
            }
            
            .note-card-btn.delete {
              background: rgba(244, 67, 54, 0.2);
              color: #f44336;
              border: 1px solid rgba(244, 67, 54, 0.4);
            }
            
            .note-card-btn.delete:hover {
              background: rgba(244, 67, 54, 0.3);
              border-color: rgba(244, 67, 54, 0.6);
              transform: scale(1.05);
            }
            
            /* 已完成笔记样式 */
            .note-completed-marker {
              display: none;
            }
            
            /* 笔记卡片背景颜色变量 */
            .note-card {
              --card-background: var(--background-color);
            }
            
            /* 优化笔记完成样式 */
            .note-card-title.note-completed {
              text-decoration: line-through;
              opacity: 0.6;
              font-weight: 500;
            }
            
            /* 错误颜色变量（如果未定义） */
            :root {
              --error-color: #ff4444;
            }
            
            /* 添加笔记按钮悬停效果 */
            .notes-add-btn:hover {
              border-color: var(--accent-color);
              color: var(--accent-color);
              transform: scale(1.1);
            }
          </style>
          
          <!-- 笔记列表将通过JS动态生成 -->
          <div class="no-notes-container">
            <div style="font-size: 48px; margin-bottom: 16px; opacity: 0.6;">📝</div>
            <div style="margin-bottom: 8px; font-size: 16px; font-weight: 500; color: var(--text-color);">暂无笔记</div>
            <div style="font-size: 14px; color: var(--secondary-text-color);">点击添加笔记开始记录</div>
          </div>
        </div>
      `;
      
      // 初始化笔记统计数据
      updateNotesProgress();
      
      // 确保默认选中"全部"tab并显示所有笔记
      switchNoteTab('all');
    }

    // 显示阅读器介绍
    function showReaderIntro() {
      ModalSystem.createModal({
        id: 'readerIntroDialog',
        title: '阅读器介绍',
        content: `
          <div style="padding: 16px;">
            <div style="margin-bottom: 20px;">
              <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 18px; font-weight: 600;">简介</h3>
              <p style="margin-bottom: 10px; line-height: 1.6;">这是一款功能强大的电子书阅读器，专为提升阅读体验而设计。支持多种文本格式，提供丰富的自定义选项，让您可以按照自己的喜好调整阅读环境。</p>
            </div>
            <div>
              <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 18px; font-weight: 600;">版本信息</h3>
              <p style="margin-bottom: 0; line-height: 1.6;">当前版本：V0.3.9</p>
            </div>
          </div>
          <style>
            /* 关于阅读器的UI优化样式 */
            .about-section {
              margin-bottom: 25px;
              padding: 15px;
              background-color: var(--background-color);
              border-radius: 8px;
              transition: all 0.3s ease;
            }
            .about-section:hover {
              background-color: var(--nav-hover);
            }
            .about-section-title {
              margin-top: 0;
              margin-bottom: 15px;
              font-size: 18px;
              font-weight: 600;
              color: var(--accent-color);
              border-bottom: 2px solid var(--border-color);
              padding-bottom: 8px;
            }
            .about-table {
              width: 100%;
              border-collapse: collapse;
            }
            .about-table .table-label {
              width: 120px;
              padding: 8px 0;
              font-weight: 600;
              color: var(--text-color);
              vertical-align: top;
            }
            .about-table .table-content {
              padding: 8px 0;
              color: var(--text-color);
              line-height: 1.6;
            }
          </style>
        `,
        buttons: [
          {
            text: '关闭',
            onClick: function() {
              ModalSystem.closeModal('readerIntroDialog');
            }
          }
        ],
        closeOnOverlayClick: true
      });
    }
    
    // 显示阅读器功能
    function showReaderFeatures() {
      ModalSystem.createModal({
        id: 'readerFeaturesDialog',
        title: '阅读器功能',
        content: `
          <div style="padding: 16px;">
            <div class="feature-item">
              <h3 class="feature-title">人名高亮</h3>
              <p class="feature-description">自动识别并高亮文本中的人物名称，帮助您在阅读过程中更好地跟踪角色。支持自定义高亮颜色和开关设置。</p>
            </div>
            <div class="feature-item">
              <h3 class="feature-title">对话高亮</h3>
              <p class="feature-description">智能识别并高亮文本中的对话内容，使对话部分更加突出，提升阅读体验。支持自定义高亮样式。</p>
            </div>
            <div class="feature-item">
              <h3 class="feature-title">笔记管理</h3>
              <p class="feature-description">支持划选文本添加个人笔记，并可对笔记进行编辑、删除和查看等操作，方便您记录阅读心得。</p>
            </div>
          </div>
          <style>
            .feature-item {
              margin-bottom: 20px;
              padding: 15px;
              background-color: var(--background-color);
              border-radius: 8px;
              transition: all 0.3s ease;
            }
            .feature-item:hover {
              background-color: var(--nav-hover);
            }
            .feature-title {
              margin-top: 0;
              margin-bottom: 10px;
              font-size: 18px;
              font-weight: 600;
              color: var(--accent-color);
            }
            .feature-description {
              margin-bottom: 0;
              line-height: 1.6;
              color: var(--text-color);
            }
          </style>
        `,
        buttons: [
          {
            text: '关闭',
            onClick: function() {
              ModalSystem.closeModal('readerFeaturesDialog');
            }
          }
        ],
        closeOnOverlayClick: true
      });
    }
    
    // 显示使用帮助
    function showReaderHelp() {
      ModalSystem.createModal({
        id: 'readerHelpDialog',
        title: '使用帮助',
        content: `
          <div style="padding: 16px;">
            <div class="help-item">
              <h3 class="help-title">设置</h3>
              <p class="help-description">点击侧边栏中的各个设置项，您可以自定义字体大小、行间距、主题颜色等，打造属于您的个性化阅读环境。</p>
            </div>

          </div>
          <style>
            .help-item {
              margin-bottom: 20px;
              padding: 15px;
              background-color: rgba(0, 0, 0, 0.02);
              border-radius: 8px;
              transition: all 0.3s ease;
            }
            .help-item:hover {
              background-color: rgba(0, 0, 0, 0.04);
            }
            .help-title {
              margin-top: 0;
              margin-bottom: 10px;
              font-size: 18px;
              font-weight: 600;
              color: var(--accent-color);
            }
            .help-description {
              margin-bottom: 15px;
              line-height: 1.6;
              color: var(--text-color);
            }
            .experience-btn {
              padding: 10px 20px;
              background-color: var(--accent-color);
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 500;
              transition: all 0.3s ease;
            }
            .experience-btn:hover {
              background-color: var(--hover-color);
              transform: translateY(-1px);
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            .experience-btn:active {
              transform: translateY(0);
            }
          </style>
        `,
        buttons: [
          {
            text: '关闭',
            onClick: function() {
              ModalSystem.closeModal('readerHelpDialog');
            }
          }
        ],
        onOpen: function() {
          // 无需额外操作
        }
        ,
        closeOnOverlayClick: true
      });
    }
    
    // 显示关于阅读器的综合信息

    
    // 获取对话高亮内容
    function getDialogHighlights() {
      if (currentIndex < 0 || currentIndex >= flatChapters.length) return '';
      const chapter = flatChapters[currentIndex];
      if (!window.renderVariables.isDialogHighlightEnabled) {
        return '<div class="dialog-item">对话高亮已关闭</div>';
      }
      const matches = [];
      const paragraphs = chapter.content.split(/\n+/);
      paragraphs.forEach(paragraph => {
        let m;
        // 只匹配中文引号
        const zhReg = /"([^"]+)"/g;
        while ((m = zhReg.exec(paragraph)) !== null) {
          matches.push(m[1]);
        }
      });
      if (matches.length === 0) {
        return '<div class="dialog-item">当前章节没有对话内容</div>';
      }
      return matches.map(content =>
        `<div class="dialog-item">${escapeHTML(content)}</div>`
      ).join('');
    }

    // 更新进度
    function updateProgress() {
      if (flatChapters.length === 0) return;
      
      const progress = ((currentIndex + 1) / flatChapters.length) * 100;
      progressPercent.textContent = Math.round(progress) + '%';
      progressBar.style.width = progress + '%';
      
      // 计算字数（简化计算）
      const totalChars = flatChapters.reduce((sum, chap) => sum + chap.content.length, 0);
      const currentChars = flatChapters.slice(0, currentIndex + 1).reduce((sum, chap) => sum + chap.content.length, 0);
      progressText.textContent = `${currentChars} / ${totalChars}字`;
    }
    
    // 处理进度条点击和拖动事件
    function initProgressBarClick() {
      const progressBar = document.querySelector('.progress-bar');
      const progressFill = document.querySelector('.progress-fill');
      const progressTooltip = document.querySelector('.progress-tooltip');
      
      if (!progressBar || !progressFill || !progressTooltip) return;
      
      let isDragging = false;
      let initialProgress = 0;
      
      // 更新进度条显示和提示信息
      function updateProgressVisuals(progressPercentage) {
        const percent = Math.round(progressPercentage * 100);
        progressFill.style.width = progressPercentage * 100 + '%';
        progressTooltip.textContent = percent + '%';
        
        // 更新提示位置
        progressTooltip.style.left = progressPercentage * 100 + '%';
        progressTooltip.style.transform = 'translateX(-50%)';
      }
      
      // 处理进度计算和章节跳转
      function handleProgressChange(progressPercentage) {
        const targetIndex = Math.floor(progressPercentage * flatChapters.length);
        const clampedIndex = Math.max(0, Math.min(targetIndex, flatChapters.length - 1));
        
        // 如果点击位置对应的是当前章节，则不执行任何操作
        if (clampedIndex === currentIndex) return;
        
        // 更新当前章节索引
        currentIndex = clampedIndex;
        
        // 更新UI
        renderChapter();
        renderDirectory();
        updateProgress();
        renderFunctionContent();
        updateChapterJumpUI();
        
        // 滚动到目录中的当前章节
        scrollToCurrentChapter();
        
        // 保存进度
        saveProgress();
      }
      
      // 点击事件
      progressBar.addEventListener('click', function(e) {
        if (flatChapters.length === 0 || isDragging) return;
        
        const rect = this.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const progressPercentage = clickPosition / rect.width;
        
        handleProgressChange(progressPercentage);
      });
      
      // 鼠标按下事件
      progressBar.addEventListener('mousedown', function(e) {
        if (flatChapters.length === 0) return;
        
        e.preventDefault();
        isDragging = true;
        progressBar.classList.add('dragging');
        
        const rect = this.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        initialProgress = clickPosition / rect.width;
        
        updateProgressVisuals(initialProgress);
      });
      
      // 鼠标移动事件
      document.addEventListener('mousemove', function(e) {
        if (!isDragging || flatChapters.length === 0) return;
        
        const rect = progressBar.getBoundingClientRect();
        let mousePosition = e.clientX - rect.left;
        
        // 限制在进度条范围内
        mousePosition = Math.max(0, Math.min(mousePosition, rect.width));
        
        const progressPercentage = mousePosition / rect.width;
        updateProgressVisuals(progressPercentage);
      });
      
      // 鼠标松开事件
      document.addEventListener('mouseup', function() {
        if (!isDragging || flatChapters.length === 0) return;
        
        isDragging = false;
        progressBar.classList.remove('dragging');
        
        const rect = progressBar.getBoundingClientRect();
        const currentWidth = parseFloat(progressFill.style.width) / 100;
        
        handleProgressChange(currentWidth);
      });
      
      // 鼠标离开页面事件
      document.addEventListener('mouseleave', function() {
        if (!isDragging || flatChapters.length === 0) return;
        
        isDragging = false;
        progressBar.classList.remove('dragging');
        
        // 恢复到原来的进度
        updateProgress();
      });
      
      // 移动端触摸支持
      progressBar.addEventListener('touchstart', function(e) {
        if (flatChapters.length === 0) return;
        
        e.preventDefault();
        isDragging = true;
        progressBar.classList.add('dragging');
        
        const rect = this.getBoundingClientRect();
        const touch = e.touches[0];
        const touchPosition = touch.clientX - rect.left;
        initialProgress = touchPosition / rect.width;
        
        updateProgressVisuals(initialProgress);
      });
      
      document.addEventListener('touchmove', function(e) {
        if (!isDragging || flatChapters.length === 0) return;
        
        e.preventDefault();
        
        const rect = progressBar.getBoundingClientRect();
        const touch = e.touches[0];
        let touchPosition = touch.clientX - rect.left;
        
        // 限制在进度条范围内
        touchPosition = Math.max(0, Math.min(touchPosition, rect.width));
        
        const progressPercentage = touchPosition / rect.width;
        updateProgressVisuals(progressPercentage);
      });
      
      document.addEventListener('touchend', function() {
        if (!isDragging || flatChapters.length === 0) return;
        
        isDragging = false;
        progressBar.classList.remove('dragging');
        
        const rect = progressBar.getBoundingClientRect();
        const currentWidth = parseFloat(progressFill.style.width) / 100;
        
        handleProgressChange(currentWidth);
      });
    }
    
    // 初始化进度条点击功能（需要在DOM加载完成后调用）
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(initProgressBarClick, 100);
    });

    // 章节导航
    function goPrev() {
      if (currentIndex > 0) {
        currentIndex--;
        renderChapter();
        renderDirectory();
        updateProgress();
        renderFunctionContent();
        updateChapterJumpUI(); // 上一章/下一章按钮同步输入框
        // 即时置顶，取消动画
        chapterContent.scrollTop = 0;
        // 强制重绘确保立即生效
        chapterContent.offsetHeight;
      }
    }

    function goNext() {
      if (currentIndex < flatChapters.length - 1) {
        currentIndex++;
        renderChapter();
        renderDirectory();
        updateProgress();
        renderFunctionContent();
        updateChapterJumpUI(); // 上一章/下一章按钮同步输入框
        // 即时置顶，取消动画
        chapterContent.scrollTop = 0;
        // 强制重绘确保立即生效
        chapterContent.offsetHeight;
      }
    }

    // 手动显示回到当前章节按钮 - 增强版
    function manuallyShowBackToCurrentBtn() {
      ensureBackToCurrentButton(); // 确保按钮存在
      const backToCurrentBtn = document.getElementById('backToCurrentBtn');
      if (backToCurrentBtn) {
        backToCurrentBtn.style.display = 'flex';
        backToCurrentBtn.style.zIndex = '1000'; // 确保在最上层
        console.log('已手动显示回到当前章节按钮');
      }
    }

    // 手动隐藏回到当前章节按钮 - 增强版
    function manuallyHideBackToCurrentBtn() {
      const backToCurrentBtn = document.getElementById('backToCurrentBtn');
      if (backToCurrentBtn) {
        backToCurrentBtn.style.display = 'none';
        console.log('已手动隐藏回到当前章节按钮');
      }
    }

    // 章节跳转功能
    const chapterJumpInput = document.getElementById('chapterJumpInput');
    const chapterJumpBtn = document.getElementById('chapterJumpBtn');

    function updateChapterJumpUI() {
      // 检查当前章节是否是前言章节
      const currentChapter = flatChapters[currentIndex];
      // 前言章节显示为0，其他章节显示为章节索引
      chapterJumpInput.value = currentChapter && currentChapter.isPreface ? 0 : currentIndex;
    }

    chapterJumpBtn.onclick = function() {
      const val = parseInt(chapterJumpInput.value);
      // 前言章节序号是0，其他章节从0开始计数
      if (isNaN(val) || val < 0 || val >= flatChapters.length) {
        // 计算最小和最大有效值
        const minVal = 0;
        const maxVal = flatChapters.length - 1;
        showToast('请输入有效的章节号（' + minVal + '~' + maxVal + '）', 'warning');
        updateChapterJumpUI();
        return;
      }
      
      // 直接使用输入的值作为索引
      currentIndex = val;
      renderChapter();
      renderDirectory();
      updateProgress();
      renderFunctionContent();
      updateChapterJumpUI();
      switchToReading(); // 切回阅读模式
      chapterContent.scrollTop = 0;
      updateChapterJumpUI();
      // 跳转后正文滚动条即时置顶
      chapterContent.scrollTop = 0;
      // 强制重绘确保立即生效
      chapterContent.offsetHeight;
    };
    // 新增：回车键快捷跳转，移动端自动失焦关闭键盘
    chapterJumpInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        chapterJumpBtn.click();
        if (isMobileDevice()) {
          chapterJumpInput.blur(); // 关闭键盘
        }
      }
    });

    // ===== 移动端键盘适配 =====
    let originalFooterStyle = '';
    let keyboardUp = false;
    let lastWindowHeight = window.innerHeight;
    let keyboardTimer = null;

    function isMobileDevice() {
      return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.innerWidth <= 600;
    }

    // 输入框聚焦时，监听resize，调整footer位置
    chapterJumpInput.addEventListener('focus', function() {
      if (!isMobileDevice()) return;
      // 记录初始高度时，排除浏览器工具栏
      lastWindowHeight = Math.max(window.innerHeight, document.documentElement.clientHeight);
      document.body.classList.add('keyboard-lock');
      const footer = document.querySelector('.chapter-footer');
      footer.classList.add('keyboard-up');
      // 延迟调整，确保键盘完全弹出 - 改为即时滚动
      setTimeout(() => {
        chapterJumpInput.scrollIntoView({behavior: 'instant', block: 'nearest'});
      }, 100); // 减少延迟时间
      window.addEventListener('resize', handleKeyboardResize, false);
    });

    chapterJumpInput.addEventListener('blur', function() {
      if (!isMobileDevice()) return;
      document.body.classList.remove('keyboard-lock');
      const footer = document.querySelector('.chapter-footer');
      footer.classList.remove('keyboard-up');
      footer.style.bottom = '';
      window.removeEventListener('resize', handleKeyboardResize, false);
      // 隐藏遮罩
      let mask = document.getElementById('keyboardMask');
      if (mask) mask.style.display = 'none';
      let topMask = document.getElementById('keyboardTopMask');
      if (topMask) topMask.style.display = 'none';
    });

    function handleKeyboardResize() {
      if (!isMobileDevice()) return;
      const footer = document.querySelector('.chapter-footer');
      const windowHeightDiff = lastWindowHeight - window.innerHeight;
      // 过滤异常值（排除浏览器工具栏高度影响）
      // 键盘高度通常在200-400px之间（根据设备）
      if (windowHeightDiff > 80 && windowHeightDiff < window.innerHeight * 0.6) {
        // 计算实际键盘高度（减去底部安全区域，避免iOS底部黑条影响）
        const safeAreaBottom = getSafeAreaBottom();
        const actualKeyboardHeight = windowHeightDiff - safeAreaBottom;
        // 关键修正：除以设备像素比（解决2倍高度问题）
        const dpr = window.devicePixelRatio || 1;
        const minHeight = 20; // 最小偏移量，可根据需要调整
        const adjustedHeight = Math.max(Math.round(actualKeyboardHeight / dpr), minHeight);
        footer.style.bottom = adjustedHeight + 'px';
        // ====== 遮罩处理 ======
        let mask = document.getElementById('keyboardMask');
        if (!mask) {
          mask = document.createElement('div');
          mask.id = 'keyboardMask';
          mask.className = 'keyboard-mask';
          document.body.appendChild(mask);
        }
        mask.style.height = adjustedHeight + 'px';
        mask.style.display = adjustedHeight > 0 ? 'block' : 'none';
        // 顶部黑色遮罩
        let topMask = document.getElementById('keyboardTopMask');
        if (!topMask) {
          topMask = document.createElement('div');
          topMask.id = 'keyboardTopMask';
          topMask.className = 'keyboard-top-mask';
          document.body.appendChild(topMask);
        }
        // footer距离顶部的高度 = window.innerHeight - adjustedHeight - footer高度
        const footerHeight = footer.offsetHeight || 56;
        const topMaskHeight = window.innerHeight - adjustedHeight - footerHeight;
        topMask.style.height = (topMaskHeight > 0 ? topMaskHeight : 0) + 'px';
        topMask.style.display = topMaskHeight > 0 ? 'block' : 'none';
      } else if (windowHeightDiff < 50) {
        // 键盘收起
        footer.style.bottom = '';
        let mask = document.getElementById('keyboardMask');
        if (mask) mask.style.display = 'none';
        let topMask = document.getElementById('keyboardTopMask');
        if (topMask) topMask.style.display = 'none';
      }
    }

    // 获取底部安全区域高度 - 适配所有移动设备
    function getSafeAreaBottom() {
      // 优先使用CSS变量获取安全区域高度
      const safeArea = getComputedStyle(document.documentElement).getPropertyValue('safe-area-inset-bottom');
      const safeAreaValue = parseInt(safeArea) || 0;
      
      // 为Android和其他设备提供合理的默认值
      if (safeAreaValue === 0 && isMobileDevice()) {
        // 对于没有报告安全区域的移动设备，提供一个默认值
        return 16; // 默认16px作为底部间距
      }
      
      return safeAreaValue;
      return 0;
    }

    // 点击空白处自动失焦
    document.addEventListener('touchstart', function(e) {
      if (!isMobileDevice()) return;
      if (!chapterJumpInput.contains(e.target) && document.activeElement === chapterJumpInput) {
        chapterJumpInput.blur();
      }
    }, {passive:true});

    // 禁止页面滚动（body.keyboard-lock）
    // 已通过body.keyboard-lock样式实现

    // 输入框显示时自动聚焦
    function autoFocusJumpInput() {
      if (isMobileDevice()) {
        setTimeout(() => chapterJumpInput.focus(), 200);
      }
    }
    // 可在章节切换后自动聚焦
    // autoFocusJumpInput(); // 如需自动聚焦可取消注释



    // 增量更新人名高亮 - 直接在现有DOM上操作，避免完全重新渲染
    function incrementallyUpdateNameHighlights() {
      const chapterContent = document.getElementById('chapterContent');
      if (!chapterContent) return;
      
      // 如果存在保存的阅读位置，则使用它，否则使用当前位置
      const savedScrollPosition = window.nameHighlightScrollPosition !== undefined ? window.nameHighlightScrollPosition : chapterContent.scrollTop;
      
      // 保存当前视口中最突出的元素作为位置参考点
      let positionReferenceElement = null;
      const visibleParagraphs = chapterContent.querySelectorAll('.content-paragraph');
      
      for (let i = 0; i < visibleParagraphs.length; i++) {
        const rect = visibleParagraphs[i].getBoundingClientRect();
        // 找到视口中最居中的段落作为参考
        if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
          positionReferenceElement = visibleParagraphs[i];
          break;
        }
      }
      
      // 只处理内容段落
      const paragraphs = chapterContent.querySelectorAll('.content-paragraph');
      
      // 准备一个数组存储需要更新的段落信息
      const updates = [];
      
      // 批量收集所有更新信息，避免频繁DOM操作
      paragraphs.forEach(paragraph => {
        // 获取清理后的内容（移除现有的人名高亮，但保留其他HTML结构）
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = paragraph.innerHTML;
        const existingNameHighlights = tempDiv.querySelectorAll('.highlight-name');
        existingNameHighlights.forEach(highlight => {
          const textNode = document.createTextNode(highlight.textContent);
          highlight.parentNode.replaceChild(textNode, highlight);
        });
        
        // 使用innerHTML来保留对话高亮等其他HTML结构
        let cleanContent = tempDiv.innerHTML;
        
        // 准备新的内容
        let newContent = cleanContent;
        if (window.renderVariables.isNameHighlightEnabled && window.renderVariables.currentNames.length > 0) {
          try {
            // 创建临时div来处理包含HTML的内容
            const contentDiv = document.createElement('div');
            contentDiv.innerHTML = cleanContent;
            
            // 处理每个文本节点
            const processNode = (node) => {
              if (node.nodeType === Node.TEXT_NODE) {
                const highlightedText = highlightNamesInText(node.textContent);
                if (highlightedText !== node.textContent) {
                  const fragment = document.createDocumentFragment();
                  const temp = document.createElement('div');
                  temp.innerHTML = highlightedText;
                  while (temp.firstChild) {
                    fragment.appendChild(temp.firstChild);
                  }
                  node.parentNode.replaceChild(fragment, node);
                }
              } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
                // 只处理非脚本和样式元素，并且跳过对话高亮元素，避免重复处理
                if (!node.classList.contains('highlight-dialog')) {
                  let child = node.firstChild;
                  while (child) {
                    const nextChild = child.nextSibling;
                    processNode(child);
                    child = nextChild;
                  }
                }
              }
            };
            
            processNode(contentDiv);
            newContent = contentDiv.innerHTML;
          } catch (e) {
            console.error('人名高亮处理出错:', e);
            // 出错时保持原始内容不变
          }
        }
        
        // 保存需要更新的信息
        updates.push({ paragraph, newContent });
      });
      
      // 使用requestAnimationFrame确保DOM操作的效率和滚动位置的稳定性
      requestAnimationFrame(() => {
        // 批量应用所有更新
        updates.forEach(({ paragraph, newContent }) => {
          paragraph.innerHTML = newContent;
        });
        
        // 确保在DOM完全更新后恢复滚动位置
        setTimeout(() => {
          // 优先使用元素引用方式恢复位置
          if (positionReferenceElement) {
            try {
              // 使用scrollIntoView保持视觉位置
              positionReferenceElement.scrollIntoView({ behavior: 'auto', block: 'center' });
            } catch (e) {
              // 如果引用元素方法失败，回退到使用保存的scrollTop
              chapterContent.scrollTop = savedScrollPosition;
            }
          } else {
            // 直接使用保存的滚动位置
            chapterContent.scrollTop = savedScrollPosition;
          }
          
          // 清理保存的位置，避免影响后续操作
          window.nameHighlightScrollPosition = undefined;
        }, 150);
      });
    }
    
    // 切换整个人名高亮功能的总开关
    function toggleNameHighlightMaster() {
      // 从渲染变量系统获取并更新状态
      window.renderVariables.isNameHighlightEnabled = !window.renderVariables.isNameHighlightEnabled;
      const isNameHighlightEnabled = window.renderVariables.isNameHighlightEnabled;
      
      // 更新局部变量以同步渲染变量系统
      updateLocalRenderVariables();
      
      // 设置全局标志，表明正在进行人名高亮更新
      window.renderVariables.isNameHighlightUpdateInProgress = true;
      window.renderVariables.lastRerenderReason = 'nameHighlight';
      
      renderFunctionContent();
      
      // 使用增量更新方法，避免完全重新渲染DOM
      incrementallyUpdateNameHighlights();
      
      showToast(`人名高亮已${isNameHighlightEnabled ? '启用' : '关闭'}`, 'success');
      
      // 保存设置
      if (currentFileId) {
        saveProgress();
      }
      
      // 渲染完成后，延迟清除临时标志
      setTimeout(() => {
        window.renderVariables.isNameHighlightUpdateInProgress = false;
      }, 500);
    }

    function toggleDialogHighlight() {
      // 从渲染变量系统获取并更新状态
      window.renderVariables.isDialogHighlightEnabled = !window.renderVariables.isDialogHighlightEnabled;
      const isDialogHighlightEnabled = window.renderVariables.isDialogHighlightEnabled;
      
      // 更新局部变量以同步渲染变量系统
      updateLocalRenderVariables();
      
      // 保存对话高亮开关状态到全局localStorage
      localStorage.setItem('readerDialogHighlightEnabled', isDialogHighlightEnabled.toString());
      
      // 如果启用了对话高亮，确保应用当前选择的高亮类型和颜色
      if (isDialogHighlightEnabled) {

        const dialogHighlightColor = window.renderVariables.dialogHighlightColor || '#999999';
        
        // 更新CSS变量，确保样式统一
        document.documentElement.style.setProperty('--dialog-highlight-color', `var(--dialog-highlight-${dialogHighlightColor})`);
      }
      
      console.log('对话高亮开关切换:', isDialogHighlightEnabled);
      renderFunctionContent();
      window.forceRerender = true; // 强制重新渲染章节内容，确保高亮效果生效
      renderChapter();
      showToast(`对话高亮已${isDialogHighlightEnabled ? '启用' : '关闭'}`, 'success');
      
      // 保存设置
      if (currentFileId) {
        saveProgress();
      }
    }


    // 自动上下翻页设置
    function toggleSeamlessScrolling() {
      // 从渲染变量系统获取并更新状态
      window.renderVariables.isSeamlessScrollingEnabled = !window.renderVariables.isSeamlessScrollingEnabled;
      const isSeamlessScrollingEnabled = window.renderVariables.isSeamlessScrollingEnabled;
      
      // 如果开启自动上下翻页，则关闭左右翻页
      if (isSeamlessScrollingEnabled) {
        window.renderVariables.isTraditionalPageTurningEnabled = false;
      }
      
      // 更新局部变量以同步渲染变量系统
      updateLocalRenderVariables();
      
      renderFunctionContent();
      
      // 显示/隐藏分页区 - 使用CSS类控制，避免覆盖hidden类
      const chapterFooter = document.querySelector('.chapter-footer');
      if (chapterFooter) {
        if (isSeamlessScrollingEnabled) {
          chapterFooter.classList.add('footer-disabled');
        } else {
          chapterFooter.classList.remove('footer-disabled');
        }
      }
      
      showToast(`自动上下翻页已${isSeamlessScrollingEnabled ? '启用' : '关闭'}`);
      
      // 保存设置
      if (currentFileId) {
        saveProgress();
      }
      
      // 重置无缝缓存并强制只显示当前章节，避免重复加载同章
      loadedChapters = [];
      window.forceRerender = true;
      renderChapter();
      // 短暂抑制滚动触发，避免切换瞬间误判顶部/底部
      isScrollingRestored = true;
      setTimeout(() => { isScrollingRestored = false; }, 200);
    }
    
    // 翻页模式切换函数（合并后的功能）
    function toggleScrollingMode() {
      // 检查是否处于搜索引导模式
      const chapterContent = document.getElementById('chapterContent');
      if (chapterContent && chapterContent.classList.contains('with-search-guide')) {
        showToast('搜索引导模式下不支持切换翻页模式');
        return;
      }
      
      // 从渲染变量系统获取并更新状态
      window.renderVariables.isSeamlessScrollingEnabled = !window.renderVariables.isSeamlessScrollingEnabled;
      const isSeamlessScrollingEnabled = window.renderVariables.isSeamlessScrollingEnabled;
      
      // 设置左右翻页状态为相反值
      window.renderVariables.isTraditionalPageTurningEnabled = !isSeamlessScrollingEnabled;
      
      // 更新局部变量以同步渲染变量系统
      updateLocalRenderVariables();
      
      renderFunctionContent();
      
      // 显示/隐藏分页区
      const chapterFooter = document.querySelector('.chapter-footer');
      if (chapterFooter) {
        if (isSeamlessScrollingEnabled) {
          chapterFooter.classList.add('footer-disabled');
        } else {
          chapterFooter.classList.remove('footer-disabled');
        }
      }
      
      showToast(`已切换为${isSeamlessScrollingEnabled ? '自动上下翻页' : '左右翻页'}模式`);
      
      // 保存设置
      if (currentFileId) {
        saveProgress();
      }
      
      // 重置无缝缓存并强制只显示当前章节，避免重复加载同章
      loadedChapters = [];
      window.forceRerender = true;
      renderChapter();
      // 短暂抑制滚动触发，避免切换瞬间误判顶部/底部
      isScrollingRestored = true;
      setTimeout(() => { isScrollingRestored = false; }, 200);
    }
    
    // 左右翻页设置
    function toggleTraditionalPageTurning() {
      // 从渲染变量系统获取并更新状态
      window.renderVariables.isTraditionalPageTurningEnabled = !window.renderVariables.isTraditionalPageTurningEnabled;
      const isTraditionalPageTurningEnabled = window.renderVariables.isTraditionalPageTurningEnabled;
      
      // 如果开启左右翻页，则关闭自动上下翻页
      if (isTraditionalPageTurningEnabled) {
        window.renderVariables.isSeamlessScrollingEnabled = false;
        // 清除章节缓存
        loadedChapters = [];
        // 强制重新渲染当前章节，确保只显示一章内容
        window.forceRerender = true;
        renderChapterContent();
      }
      
      // 更新局部变量以同步渲染变量系统
      updateLocalRenderVariables();
      
      renderFunctionContent();
      
      // 显示/隐藏分页区
      const chapterFooter = document.querySelector('.chapter-footer');
      if (chapterFooter) {
        if (isTraditionalPageTurningEnabled) {
          chapterFooter.classList.remove('footer-disabled');
        } else {
          chapterFooter.classList.add('footer-disabled');
        }
      }
      
      showToast(`左右翻页已${isTraditionalPageTurningEnabled ? '启用' : '关闭'}`);
      
      // 保存设置
      if (currentFileId) {
        saveProgress();
      }
    }
    
    // 切换单个人名的高亮状态
    function toggleSingleNameHighlight(name) {
      const index = disabledNames.indexOf(name);
      if (index > -1) {
        // 如果已禁用，则启用
        disabledNames.splice(index, 1);
        showToast(`已启用"${name}"的高亮`, 'success');
      } else {
        // 如果未禁用，则禁用
        disabledNames.push(name);
        showToast(`已禁用"${name}"的高亮`, 'success');
      }
      
      // 重新渲染人名列表
      if (document.getElementById('nameListDialog')) {
        document.getElementById('nameListDialog').innerHTML = currentNames.map(name => {
          const isDisabled = disabledNames.includes(name);
          const colorIndex = globalNameColorMap[name] || 1;
          const groupLabel = generateNameGroupLabel(colorIndex);
          return `<span class="name-item ${isDisabled ? 'disabled' : ''}" onclick="toggleSingleNameHighlight('${name}')" title="组别: ${groupLabel}">${name} <span class="name-group-label">${groupLabel}</span></span>`;
        }).join('');
      }
      
      // 重新渲染章节以应用高亮变化
      renderChapter();
    }




    function openNameDialog() {
      // 保存当前阅读位置，以便在人名高亮功能变化后恢复
      const chapterContent = document.getElementById('chapterContent');
      if (chapterContent) {
        window.nameHighlightScrollPosition = chapterContent.scrollTop;
      }
      
      // 确保渲染变量已初始化
      if (!window.renderVariables) {
        window.renderVariables = {
          // 基础设置
          fontSize: 18,
          lineHeight: 1.8,
          paragraphSpacing: 1.5, // 默认值为1.5em（阅读推荐值）
          fontFamily: '',
          currentTheme: 'light',
          textColor: '#000000',
          backgroundColor: '#ffffff',
          accentColor: '#0c8ce9',
          
          // 高亮设置
          isDialogHighlightEnabled: false,
          dialogHighlightColor: '#999999',
          isNameHighlightEnabled: false,
          
          // 搜索模式设置
          isInSearchMode: false,
          
          // 人名相关数据
          currentNames: [],
          disabledNames: [],
          globalNameColorMap: {},
          nameGroups: { group1: { color: '#1976d2', names: [] } }
        };
      }
      
      // 确保分组数据结构存在且类型正确
      if (!window.renderVariables.nameGroups || Array.isArray(window.renderVariables.nameGroups) || typeof window.renderVariables.nameGroups !== 'object') {
        window.renderVariables.nameGroups = {
          group1: { color: '#1976d2', names: [] }
        };
      }
      
      // 根据当前window.renderVariables.nameGroups动态生成添加组按钮
      let addButtonsHTML = '';
      const groupCount = Object.keys(window.renderVariables.nameGroups).length;
      for (let i = 0; i < groupCount; i++) {
        const groupId = `group${i + 1}`;
        const groupLabel = String.fromCharCode(64 + i + 1); // A, B, C...
        const groupColor = window.renderVariables.nameGroups[groupId].color;
        addButtonsHTML += `<button class="name-add-btn add-group-${groupId}" onclick="addNameToGroup('${groupId}')" style="color: ${groupColor};">添加${groupLabel}组</button>`;
      }
      
      // 动态生成分组HTML
      let groupsHTML = '';
      Object.keys(window.renderVariables.nameGroups).forEach((groupId, index) => {
        const group = window.renderVariables.nameGroups[groupId];
        const groupLabel = String.fromCharCode(64 + index + 1); // A, B, C...
        groupsHTML += `
          <div class="name-group" id="${groupId}" data-group-id="${groupId}">
            <div class="name-group-header">
              <div class="name-group-color" style="background-color: ${group.color};">
                <input type="color" value="${group.color}" onchange="onGroupNameColorChange('${groupId}', this.value)" />
              </div>
              <div class="name-group-label">${groupLabel}组：<span id="${groupId}-count">0</span>个</div>
              <button class="remove-group-btn" onclick="removeGroup('${groupId}')" title="删除分组">×</button>
            </div>
            <div class="name-group-items" id="${groupId}-items"></div>
          </div>`;
      });
      
      // 使用统一弹窗系统创建人名高亮弹窗 - 设置为大弹窗
      ModalSystem.createModal({
        id: 'nameDialog',
        title: '人名高亮',
        content: `
          <div class="name-input-container">
            <input type="text" class="name-input" id="nameInputDialog" placeholder="请输入文字，用顿号、分隔或搜索人名" value="" />
            <div class="name-buttons-group">
              ${addButtonsHTML}
            </div>
          </div>
          <div class="name-count" id="nameCountDialog">
            人名数量：${currentNames.length}个
            <button class="clear-names-btn" onclick="clearAllNames()">清空</button>
          </div>
          <div class="name-groups-section">
            <div class="name-groups-title">将人名拖动到指定分组，使用文字颜色</div>
            
            <!-- 分组容器 -->
            <div class="name-groups-container">
              ${groupsHTML}
            </div>
            
            <!-- 新增组按钮 -->
            <button class="add-group-btn" onclick="addNewGroup()">+新增组</button>
          </div>
        `,
        buttons: [
          {
            text: '取消',
            type: 'secondary'
          },
          {
            text: '导入粘贴板人名数据',
            type: 'secondary',
            onClick: function() {
              importNameGroupsFromClipboard();
            }
          },
          {
            text: '复制人名数据',
            type: 'secondary',
            onClick: function() {
              copyNameGroups();
            }
          },
          {
            text: '更新',
            type: 'primary',
            onClick: function() {
              updateNamesFromDialog();
            }
          }
        ],
        large: true, // 满足"人名高亮的弹窗要大"的要求
        closeOnOverlayClick: true,
        onClose: function() {
          // 弹窗关闭后的清理工作
          const style = document.getElementById('nameDialogStyles');
          if (style) {
            style.remove();
          }
        }
      });
      
      // 添加删除分组按钮的样式
      let style = document.getElementById('nameDialogStyles');
      if (!style) {
        style = document.createElement('style');
        style.id = 'nameDialogStyles';
        style.textContent = `
          .remove-group-btn {
            background: none;
            border: none;
            color: #ff4444;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: all 0.2s;
          }
          
          .remove-group-btn:hover {
            background: rgba(255, 68, 68, 0.1);
            transform: scale(1.1);
          }
          
          .name-group-header {
            display: flex;
            align-items: center;
            gap: 8px;
          }
        `;
        document.head.appendChild(style);
      }
      
      // 初始化拖放功能
      setTimeout(() => {
        initNameDragDrop();
        
        // 更新分组显示
        updateGroupDisplays();
        
        // 搜索功能样式
        if (!document.getElementById('nameSearchStyles')) {
          const searchStyle = document.createElement('style');
          searchStyle.id = 'nameSearchStyles';
          searchStyle.textContent = `
            .name-item.filtered {
              display: none !important;
            }
          `;
          document.head.appendChild(searchStyle);
        }
        
        // 聚焦到输入框并添加事件监听
        const input = document.getElementById('nameInputDialog');
        if (input) {
          input.focus();
          
          // 添加回车键事件监听
          input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
              e.preventDefault(); // 阻止默认行为
              addNameToGroup('group1'); // 默认添加到A组
            }
          });
        
          // 添加输入事件监听 - 实时搜索
          input.addEventListener('input', function() {
            filterNamesBySearch(this.value);
          });
        }
      }, 100);
    }
    
    // 初始化人名拖放功能
    function initNameDragDrop() {
      // 为每个组添加拖放区域事件
      const groups = document.querySelectorAll('.name-group');
      groups.forEach(group => {
        group.addEventListener('dragover', function(e) {
          e.preventDefault();
          this.classList.add('drag-over');
        });
        
        group.addEventListener('dragleave', function() {
          this.classList.remove('drag-over');
        });
        
        group.addEventListener('drop', function(e) {
          e.preventDefault();
          this.classList.remove('drag-over');
          
          const data = e.dataTransfer.getData('text/plain');
          const groupId = this.dataset.groupId;
          handleNameDrop(groupId, data);
        });
        
        // 移动端触摸事件支持
        let isTouching = false;
        let touchStartTime = 0;
        
        group.addEventListener('touchstart', function(e) {
          isTouching = true;
          touchStartTime = Date.now();
        });
        
        group.addEventListener('touchmove', function(e) {
          if (isTouching && Date.now() - touchStartTime > 200) { // 长按超过200ms
            // 只有当事件可取消时才阻止默认行为
            if (e.cancelable) {
              e.preventDefault();
            }
            this.classList.add('drag-over');
          }
        });
        
        group.addEventListener('touchend', function(e) {
          if (isTouching && window.draggedName) {
            this.classList.remove('drag-over');
            const groupId = this.dataset.groupId;
            handleNameDrop(groupId, window.draggedName);
            window.draggedName = null;
            window.draggingInProgress = false;
            // 清除所有dragging类
            document.querySelectorAll('.name-item.dragging').forEach(item => {
              item.classList.remove('dragging');
            });
            showToast('已将人名移动到新分组', 'success');
          }
          isTouching = false;
        });
        
        group.addEventListener('touchcancel', function() {
          isTouching = false;
          this.classList.remove('drag-over');
          // 如果正在拖拽中，取消拖拽状态
          if (window.draggingInProgress) {
            window.draggedName = null;
            window.draggingInProgress = false;
            document.querySelectorAll('.name-item.dragging').forEach(item => {
              item.classList.remove('dragging');
            });
          }
        });
        
        // 移动端单击分组实现拖入效果
        group.addEventListener('click', function(e) {
          // 只在移动端处理单击拖入
          if (window.innerWidth <= 768 && window.selectedName) {
            // 避免点击到子元素时触发多次
            if (e.target === this || e.target.closest('.name-group-header')) {
              const groupId = this.dataset.groupId;
              handleNameDrop(groupId, window.selectedName);
              
              // 清除选中状态
              document.querySelectorAll('.name-item.selected').forEach(selectedItem => {
                selectedItem.classList.remove('selected');
              });
              window.selectedName = null;
              showToast('已将人名添加到分组', 'success');
            }
          }
        });
      });
      
      // 为添加组按钮添加拖放功能
      const addGroupButtons = document.querySelectorAll('.name-add-btn');
      addGroupButtons.forEach(button => {
        // 获取组ID（从class名中提取）
        const classList = Array.from(button.classList);
        const groupClass = classList.find(cls => cls.startsWith('add-group-'));
        if (!groupClass) return;
        
        const groupId = groupClass.replace('add-group-', '');
        
        button.addEventListener('dragover', function(e) {
          e.preventDefault();
          this.classList.add('drag-over');
          // 改变鼠标指针样式，表示可以放置
          e.dataTransfer.dropEffect = 'copy';
        });
        
        button.addEventListener('dragleave', function() {
          this.classList.remove('drag-over');
        });
        
        button.addEventListener('drop', function(e) {
          e.preventDefault();
          this.classList.remove('drag-over');
          
          const data = e.dataTransfer.getData('text/plain');
          handleNameDrop(groupId, data);
          
          // 显示成功提示
          const groupLabel = String.fromCharCode(64 + parseInt(groupId.replace('group', '')));
          showToast(`已将人名添加到${groupLabel}组`, 'success');
        });
      });
      
      // 为每个人名项添加事件处理
      const nameItems = document.querySelectorAll('.name-item');
      nameItems.forEach(item => {
        // 鼠标拖拽事件
        item.setAttribute('draggable', 'true');
        
        item.addEventListener('dragstart', function(e) {
          e.dataTransfer.setData('text/plain', this.textContent.replace(/\s+组.*$/, '').trim());
          this.classList.add('dragging');
        });
        
        item.addEventListener('dragend', function() {
          this.classList.remove('dragging');
        });
        
        // 移动端触摸事件 - 长按触发拖拽和单击选择
        let longPressTimer;
        
        item.addEventListener('touchstart', function(e) {
          // 移除preventDefault以允许正常的触摸交互
          const name = this.textContent.replace(/\s+组.*$/, '').trim();
          longPressTimer = setTimeout(() => {
            // 长按触发拖拽状态
            window.draggedName = name;
            window.draggingInProgress = true;
            this.classList.add('dragging');
            showToast(`长按 "${name}" 并移动到目标分组`, 'info');
          }, 500); // 500ms长按触发
        });
        
        item.addEventListener('touchmove', function() {
          clearTimeout(longPressTimer);
        });
        
        item.addEventListener('touchend', function() {
          clearTimeout(longPressTimer);
          // 只有当没有进行拖拽操作时才移除dragging类
          if (!window.draggingInProgress) {
            this.classList.remove('dragging');
          }
        });
        
        item.addEventListener('touchcancel', function() {
          clearTimeout(longPressTimer);
          this.classList.remove('dragging');
        });
        
        // 移动端单击选择人名项
        item.addEventListener('click', function(e) {
          // 只在移动端处理单击选择
          if (window.innerWidth <= 768) {
            const name = this.textContent.replace(/\s+组.*$/, '').trim();
            
            // 清除其他选中状态
            document.querySelectorAll('.name-item.selected').forEach(selectedItem => {
              if (selectedItem !== this) {
                selectedItem.classList.remove('selected');
              }
            });
            
            // 切换当前选中状态
            this.classList.toggle('selected');
            
            // 更新全局选中的人名
            if (this.classList.contains('selected')) {
              window.selectedName = name;
              showToast(`已选中 "${name}"，请点击目标分组`, 'info');
            } else {
              window.selectedName = null;
            }
          }
        });
      });
      
      // 添加点击空白处取消选择的功能
      const nameGroupsDialog = document.getElementById('nameGroupsDialog');
      if (nameGroupsDialog) {
        nameGroupsDialog.addEventListener('click', function(e) {
          // 只有当点击的是对话框本身而不是其子元素时才取消选择
          if (e.target === nameGroupsDialog) {
            document.querySelectorAll('.name-item.selected').forEach(item => {
              item.classList.remove('selected');
            });
          }
        });
      }
      
      // 添加鼠标框选功能
      let isSelecting = false;
      let startX, startY, endX, endY;
      let selectionBox = null;
      let originalSelection = [];
      
      // 获取人名高亮对话框
      const nameDialog = document.getElementById('nameDialog');
      if (!nameDialog) return;
      
      // 鼠标按下事件
      nameDialog.addEventListener('mousedown', function(e) {
        // 如果点击的是人名项或其他可交互元素，不启动框选
        if (e.target.closest('.name-item') || e.target.closest('button') || 
            e.target.closest('input') || e.target.closest('.name-remove-btn')) {
          return;
        }
        
        // 开始框选
        isSelecting = true;
        startX = e.clientX;
        startY = e.clientY;
        
        // 保存当前的选中状态
        originalSelection = Array.from(document.querySelectorAll('.name-item.selected'));
        
        // 创建选择框元素
        if (!selectionBox) {
          selectionBox = document.createElement('div');
          selectionBox.style.position = 'fixed';
          selectionBox.style.background = 'rgba(25, 118, 210, 0.2)';
          selectionBox.style.border = '1px solid #1976d2';
          selectionBox.style.zIndex = '1001';
          document.body.appendChild(selectionBox);
        } else {
          selectionBox.style.display = 'block';
        }
        
        // 初始化选择框位置
        selectionBox.style.left = startX + 'px';
        selectionBox.style.top = startY + 'px';
        selectionBox.style.width = '0px';
        selectionBox.style.height = '0px';
      });
      
      // 鼠标移动事件
      document.addEventListener('mousemove', function(e) {
        if (!isSelecting) return;
        
        // 计算选择框位置和大小
        endX = e.clientX;
        endY = e.clientY;
        
        const left = Math.min(startX, endX);
        const top = Math.min(startY, endY);
        const width = Math.abs(endX - startX);
        const height = Math.abs(endY - startY);
        
        // 更新选择框样式
      selectionBox.style.left = left + 'px';
      selectionBox.style.top = top + 'px';
      selectionBox.style.width = width + 'px';
      selectionBox.style.height = height + 'px';
        
        // 获取选择框区域
        const selectionRect = {
          left: left,
          top: top,
          right: left + width,
          bottom: top + height
        };
        
        // 检查每个人名项是否在选择框内
        const allNameItems = document.querySelectorAll('.name-item');
        allNameItems.forEach(item => {
          const rect = item.getBoundingClientRect();
          
          // 判断元素是否与选择框相交
          const isIntersecting = !(rect.right < selectionRect.left ||
                                   rect.left > selectionRect.right ||
                                   rect.bottom < selectionRect.top ||
                                   rect.top > selectionRect.bottom);
          
          // 根据是否相交来更新选中状态
          if (isIntersecting) {
            item.classList.add('selected');
          } else {
            // 如果不是原始选中的元素，则取消选中
            if (!originalSelection.includes(item)) {
              item.classList.remove('selected');
            }
          }
        });
      });
      
      // 鼠标释放事件
      document.addEventListener('mouseup', function() {
        if (isSelecting) {
          isSelecting = false;
          if (selectionBox) {
            selectionBox.style.display = 'none';
          }
        }
      });
    }
    
    // 处理人名拖放的通用函数
    function handleNameDrop(groupId, data) {
      let names = [];
      
      try {
        // 尝试解析为JSON数组（多选）
        const parsedData = JSON.parse(data);
        // 确保names始终是数组
        names = Array.isArray(parsedData) ? parsedData : [parsedData];
      } catch (e) {
        // 单个名称
        names = [data];
      }
      
      // 确保names是数组类型
      if (!Array.isArray(names)) {
        names = [names];
      }
      
      // 处理每个人名
      names.forEach(name => {
        // 确保renderVariables和nameGroups存在且有效
        if (!window.renderVariables) {
          window.renderVariables = {};
        }
        if (!window.renderVariables.nameGroups || typeof window.renderVariables.nameGroups !== 'object') {
          window.renderVariables.nameGroups = {
            group1: { color: '#1976d2', names: [] },
            group2: { color: '#388e3c', names: [] }
          };
        }
        
        // 将人名添加到组
        if (!window.renderVariables.nameGroups[groupId].names.includes(name)) {
          window.renderVariables.nameGroups[groupId].names.push(name);
          
          // 从其他组中移除
          Object.keys(window.renderVariables.nameGroups).forEach(gid => {
            if (gid !== groupId) {
              window.renderVariables.nameGroups[gid].names = window.renderVariables.nameGroups[gid].names.filter(n => n !== name);
            }
          });
        }
      });
      
      // 取消所有选中状态
      document.querySelectorAll('.name-item.selected').forEach(item => {
        item.classList.remove('selected');
      });
      
      // 更新显示
      updateGroupDisplays();
      
      // 立即应用更改，但不保存
      applyNameChangesImmediately();
    }
    
    // 更新分组显示
    function updateGroupDisplays() {
      // 确保renderVariables和nameGroups存在且有效
      if (!window.renderVariables) {
        window.renderVariables = {};
      }
      if (!window.renderVariables.nameGroups || typeof window.renderVariables.nameGroups !== 'object') {
        window.renderVariables.nameGroups = {
          group1: { color: '#1976d2', names: [] },
          group2: { color: '#388e3c', names: [] }
        };
      }
      
      // 清空所有分组
      Object.keys(window.renderVariables.nameGroups).forEach(groupId => {
        const groupItems = document.getElementById(`${groupId}-items`);
        const groupCount = document.getElementById(`${groupId}-count`);
        
        if (groupItems && groupCount) {
          groupItems.innerHTML = '';
          groupCount.textContent = window.renderVariables.nameGroups[groupId].names.length;
          
          // 添加人名到分组
          window.renderVariables.nameGroups[groupId].names.forEach(name => {
            const nameItem = createNameItem(name, window.renderVariables.nameGroups[groupId].color);
            groupItems.appendChild(nameItem);
          });
        }
      });
      
      // 如果输入框有值，应用搜索过滤
      const input = document.getElementById('nameInputDialog');
      if (input && input.value.trim()) {
        filterNamesBySearch(input.value);
      }
      
      // 未分组功能已移除
    }
    
    // 按搜索词过滤人名
    function filterNamesBySearch(searchTerm) {
      const allNameItems = document.querySelectorAll('.name-item');
      
      // 如果搜索词为空，显示所有人名
      if (!searchTerm || searchTerm.trim() === '') {
        allNameItems.forEach(item => {
          item.classList.remove('filtered');
        });
        return;
      }
      
      // 转换为小写以实现不区分大小写的搜索
      const term = searchTerm.toLowerCase();
      
      // 过滤人名
      allNameItems.forEach(item => {
        const name = item.dataset.name.toLowerCase();
        
        // 如果人名包含搜索词，显示；否则隐藏
        if (name.includes(term)) {
          item.classList.remove('filtered');
        } else {
          item.classList.add('filtered');
        }
      });
    }
    
    // 创建人名项元素
    function createNameItem(name, color) {
      const nameItem = document.createElement('div');
      nameItem.className = 'name-item';
      nameItem.draggable = true;
      nameItem.dataset.name = name;
      nameItem.style.color = color;
      
      // 创建带圆点的HTML结构
      const dotElement = document.createElement('span');
      dotElement.className = 'name-dot';
      dotElement.style.backgroundColor = color;
      
      const nameTextElement = document.createElement('span');
      nameTextElement.className = 'name-text';
      nameTextElement.textContent = name;
      
      nameItem.appendChild(dotElement);
      nameItem.appendChild(nameTextElement);
      
      // 添加点击选择功能
      nameItem.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // 如果按住Ctrl键，进行多选切换
        if (e.ctrlKey) {
          this.classList.toggle('selected');
        } else {
          // 点击一次选中，再点击取消选中
          if (this.classList.contains('selected')) {
            this.classList.remove('selected');
          } else {
            this.classList.add('selected');
          }
        }
      });
      
      // 添加拖动事件
      nameItem.addEventListener('dragstart', function(e) {
        // 检查是否有选中的项
        const selectedItems = document.querySelectorAll('.name-item.selected');
        
        if (selectedItems.length > 1) {
          // 批量拖动
          const names = Array.from(selectedItems).map(item => item.dataset.name);
          e.dataTransfer.setData('text/plain', JSON.stringify(names));
        } else {
          // 单个拖动
          e.dataTransfer.setData('text/plain', name);
        }
        
        this.classList.add('dragging');
      });
      
      nameItem.addEventListener('dragend', function() {
        this.classList.remove('dragging');
      });
      
      // 添加删除按钮
      const removeBtn = document.createElement('span');
      removeBtn.className = 'name-remove-btn';
      removeBtn.textContent = '×';
      removeBtn.onclick = function() {
        // 确保renderVariables和nameGroups存在且有效
        if (!window.renderVariables) {
          window.renderVariables = {};
        }
        if (!window.renderVariables.nameGroups || typeof window.renderVariables.nameGroups !== 'object') {
          window.renderVariables.nameGroups = {
            group1: { color: '#1976d2', names: [] },
            group2: { color: '#388e3c', names: [] }
          };
        }
        
        // 从所有组中移除
        Object.keys(window.renderVariables.nameGroups).forEach(groupId => {
          window.renderVariables.nameGroups[groupId].names = window.renderVariables.nameGroups[groupId].names.filter(n => n !== name);
        });
        updateGroupDisplays();
        
        // 更新人名数量
        const totalNamesCount = Object.values(window.renderVariables.nameGroups)
          .reduce((total, group) => total + group.names.length, 0);
        document.getElementById('nameCountDialog').textContent = `人名数量：${totalNamesCount}个`;
      };
      nameItem.appendChild(removeBtn);
      
      // 添加点击选择功能
      nameItem.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // 如果按住Ctrl键，进行多选切换
        if (e.ctrlKey) {
          this.classList.toggle('selected');
        } else {
          // 点击一次选中，再点击取消选中
          if (this.classList.contains('selected')) {
            this.classList.remove('selected');
          } else {
            this.classList.add('selected');
          }
        }
      });
      
      // 添加拖动事件
      nameItem.addEventListener('dragstart', function(e) {
        // 检查是否有选中的项
        const selectedItems = document.querySelectorAll('.name-item.selected');
        
        if (selectedItems.length > 1) {
          // 批量拖动
          const names = Array.from(selectedItems).map(item => item.dataset.name);
          e.dataTransfer.setData('text/plain', JSON.stringify(names));
        } else {
          // 单个拖动
          e.dataTransfer.setData('text/plain', name);
        }
        
        this.classList.add('dragging');
      });
      
      nameItem.addEventListener('dragend', function() {
        this.classList.remove('dragging');
      });
      
      return nameItem;
    }
    
    // 更新未分组人名功能已移除
    
    // 删除分组函数
    function removeGroup(groupId) {
      // 确保renderVariables和nameGroups存在且有效
      if (!window.renderVariables) {
        window.renderVariables = {};
      }
      if (!window.renderVariables.nameGroups || typeof window.renderVariables.nameGroups !== 'object') {
        window.renderVariables.nameGroups = {
          group1: { color: '#1976d2', names: [] },
          group2: { color: '#388e3c', names: [] }
        };
      }
      
      // 获取分组数据
      const group = window.renderVariables.nameGroups[groupId];
      
      // 检查分组是否存在
      if (!group) {
        showToast('该分组不存在', 'error');
        return;
      }
      
      // 检查分组内是否有人名信息
      if (group.names && group.names.length > 0) {
        showToast('该分组包含人名，无法删除', 'warning');
        return;
      }
      
      // 确认删除
      if (confirm('确定要删除该分组吗？')) {
        // 从数据结构中删除分组
        delete window.renderVariables.nameGroups[groupId];
        
        // 从UI中删除分组元素
        const groupElement = document.getElementById(groupId);
        if (groupElement) {
          groupElement.remove();
        }
        
        // 更新添加组按钮
        const nameButtonsGroup = document.querySelector('.name-buttons-group');
        if (nameButtonsGroup) {
          const groupBtn = nameButtonsGroup.querySelector(`.add-group-${groupId}`);
          if (groupBtn) {
            groupBtn.remove();
          }
        }
        
        // 重新初始化拖放功能
        initNameDragDrop();
        
        // 保存配置到localStorage
        if (currentFileId) {
          saveProgress();
        }
        
        showToast('分组已删除', 'success');
      }
    }
    
    // 添加新组
    function addNewGroup() {
      // 确保renderVariables和nameGroups存在且有效
      if (!window.renderVariables) {
        window.renderVariables = {};
      }
      if (!window.renderVariables.nameGroups || typeof window.renderVariables.nameGroups !== 'object') {
        window.renderVariables.nameGroups = {
          group1: { color: '#1976d2', names: [] },
          group2: { color: '#388e3c', names: [] }
        };
      }
      
      const groupCount = Object.keys(window.renderVariables.nameGroups).length;
      const newGroupId = `group${groupCount + 1}`;
      
      // 生成新颜色（简单的颜色循环）
      const colors = ['#e53935', '#8e24aa', '#f57c00', '#00acc1', '#ff5252', '#795548', '#607d8b'];
      const colorIndex = groupCount % colors.length;
      const newColor = colors[colorIndex];
      
      // 添加新组
      window.renderVariables.nameGroups[newGroupId] = { color: newColor, names: [] };
      
      // 创建新组的HTML
      const groupsContainer = document.querySelector('.name-groups-container');
      const groupLabel = String.fromCharCode(64 + groupCount + 1); // A, B, C...
      
      const newGroupEl = document.createElement('div');
      newGroupEl.className = 'name-group';
      newGroupEl.id = newGroupId;
      newGroupEl.dataset.groupId = newGroupId;
      newGroupEl.innerHTML = `
        <div class="name-group-header">
          <div class="name-group-color" style="background-color: ${newColor};">
            <input type="color" value="${newColor}" onchange="onGroupNameColorChange('${newGroupId}', this.value)" />
          </div>
          <div class="name-group-label">${groupLabel}组：<span id="${newGroupId}-count">0</span>个</div>
        </div>
        <div class="name-group-items" id="${newGroupId}-items"></div>
      `;
      
      groupsContainer.appendChild(newGroupEl);
      
      // 重新初始化拖放
      initNameDragDrop();
      
      // 更新添加组按钮
      const nameButtonsGroup = document.querySelector('.name-buttons-group');
      if (nameButtonsGroup) {
        nameButtonsGroup.innerHTML = '';
        // 确保renderVariables和nameGroups存在且有效
        if (!window.renderVariables) {
          window.renderVariables = {};
        }
        if (!window.renderVariables.nameGroups || typeof window.renderVariables.nameGroups !== 'object') {
          window.renderVariables.nameGroups = {
            group1: { color: '#1976d2', names: [] },
            group2: { color: '#388e3c', names: [] }
          };
        }
        
        const newGroupCount = Object.keys(window.renderVariables.nameGroups).length;
        for (let i = 0; i < newGroupCount; i++) {
          const groupId = `group${i + 1}`;
          const label = String.fromCharCode(64 + i + 1);
          const button = document.createElement('button');
          button.className = `name-add-btn add-group-${groupId}`;
          button.onclick = function() { addNameToGroup(groupId); };
          button.textContent = `添加${label}组`;
          // 设置按钮文字颜色为分组颜色
          button.style.color = window.renderVariables.nameGroups[groupId].color;
          nameButtonsGroup.appendChild(button);
        }
      }
    }
    
    // 处理分组颜色变化
    function onGroupNameColorChange(groupId, color) {
      // 确保renderVariables和nameGroups存在且有效
      if (!window.renderVariables) {
        window.renderVariables = {};
      }
      if (!window.renderVariables.nameGroups || typeof window.renderVariables.nameGroups !== 'object') {
        window.renderVariables.nameGroups = {
          group1: { color: '#1976d2', names: [] },
          group2: { color: '#388e3c', names: [] }
        };
      }
      
      // 更新分组颜色
      window.renderVariables.nameGroups[groupId].color = color;
      
      // 更新UI颜色
      const colorEl = document.querySelector(`#${groupId} .name-group-color`);
      if (colorEl) {
        colorEl.style.backgroundColor = color;
      }
      
      // 更新该分组中所有人名的颜色
      const groupItems = document.getElementById(`${groupId}-items`);
      if (groupItems) {
        const nameItems = groupItems.querySelectorAll('.name-item');
        nameItems.forEach(item => {
          item.style.color = color;
        });
      }
      
      // 更新该分组对应的添加按钮文字颜色
      const addButton = document.querySelector(`.name-add-btn.add-group-${groupId}`);
      if (addButton) {
        addButton.style.color = color;
      }
      
      // 重新渲染章节以应用新的颜色
      renderChapter();
    }
    // 打开对话高亮设置对话框
    function openDialogHighlightDialog() {
      // 确保使用window.renderVariables中的设置
      const dialogHighlightColor = window.renderVariables.dialogHighlightColor || '#999999';
      const dialogHighlightType = window.renderVariables.dialogHighlightType || 'underline';
      const isDialogFontHighlightEnabled = window.renderVariables.isDialogFontHighlightEnabled || false;
      const dialogPrefix = window.renderVariables.dialogPrefix || '“';
      const dialogSuffix = window.renderVariables.dialogSuffix || '”';
      
      // 创建内容
      const content = `
        <div class="settings-content">
          <div class="dialog-highlight-preview" style="margin-bottom: 20px;">
            <p>这是<span id="preview-dialog" class="highlight-dialog ${dialogHighlightType}">对话预览文字</span></p>
          </div>
          
          <div class="dialog-highlight-control">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px; width: 100%;">
              <label style="margin: 0;">当前颜色:</label>
              <input type="color" id="customDialogColor" value="#fff1c2" style="width: 50px; height: 35px; border: none; cursor: pointer;" onchange="setCustomDialogColor()">
            </div>
            
            <label style="display: block; margin-bottom: 8px;">高亮类型</label>
            <div class="dialog-type-buttons" style="display: flex; gap: 10px; margin-bottom: 20px;">
              <button data-type="background" class="type-option ${dialogHighlightType === 'background' ? 'active' : ''}" onclick="setDialogHighlightType(this)">
                背景色
              </button>
              <button data-type="underline" class="type-option ${dialogHighlightType === 'underline' ? 'active' : ''}" onclick="setDialogHighlightType(this)">
                下划线
              </button>
            </div>
            
            <label style="display: block; margin-bottom: 8px;">高亮颜色</label>
            <div class="dialog-color-buttons" style="display: flex; gap: 10px; flex-wrap: wrap;">
              <button data-color="yellow" class="color-option ${dialogHighlightColor === 'yellow' ? 'active' : ''}" onclick="setDialogColorOption(this)">
                黄色
              </button>
              <button data-color="blue" class="color-option ${dialogHighlightColor === 'blue' ? 'active' : ''}" onclick="setDialogColorOption(this)">
                蓝色
              </button>
              <button data-color="red" class="color-option ${dialogHighlightColor === 'red' ? 'active' : ''}" onclick="setDialogColorOption(this)">
                红色
              </button>
              <button data-color="gray" class="color-option ${dialogHighlightColor === 'gray' ? 'active' : ''}" onclick="setDialogColorOption(this)">
                灰色
              </button>
              
              <!-- 字体高亮开关，仅当下划线样式时显示 -->
              <div id="fontHighlightControl" style="margin-top: 20px; display: ${dialogHighlightType === 'underline' ? 'block' : 'none'};">
                <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                  <input type="checkbox" id="dialogFontHighlightToggle" ${isDialogFontHighlightEnabled ? 'checked' : ''} onclick="toggleDialogFontHighlight()">
                  启用字体高亮
                </label>
              </div>
              
              <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 20px; width: 100%;">
                <label style="margin: 0;">自定义符号</label>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <label style="margin: 0;">前符号:</label>
                  <input type="text" id="dialogPrefix" value="${dialogPrefix}" style="width: 50px; padding: 8px; border: 2px solid var(--border-color); border-radius: 4px; background-color: var(--sidebar-bg); color: var(--text-color); text-align: center;">
                  <label style="margin: 0;">后符号:</label>
                  <input type="text" id="dialogSuffix" value="${dialogSuffix}" style="width: 50px; padding: 8px; border: 2px solid var(--border-color); border-radius: 4px; background-color: var(--sidebar-bg); color: var(--text-color); text-align: center;">
                </div>
              </div>
            </div>
            <style>
              .color-option,
              .type-option {
                padding: 8px 16px;
                border: 2px solid var(--border-color);
                border-radius: 4px;
                background-color: var(--sidebar-bg);
                color: var(--text-color);
                cursor: pointer;
                transition: all 0.2s;
              }
              .color-option.active,
              .type-option.active {
                border-color: var(--accent-color);
                background-color: var(--accent-color);
                color: white;
              }
            </style>
          </div>
        </div>
      `;
      
      // 使用ModalSystem创建弹窗
      ModalSystem.createModal({
        id: 'dialogHighlightDialog',
        title: '对话高亮设置',
        content: content,
        buttons: [
          {
            text: '取消',
            type: 'secondary',
            onClick: closeDialogHighlightDialog
          },
          {
            text: '更新',
            type: 'primary',
            onClick: applyDialogHighlight
          }
        ],
        closeOnOverlayClick: true,
        onOpen: function() {
          // 初始化预览
          updateDialogPreview();
          
          // 如果当前是自定义颜色，设置颜色选择器的值
          if (dialogHighlightColor.startsWith('#')) {
            document.getElementById('customDialogColor').value = dialogHighlightColor;
          }
        }
      });
    }
    
    // 设置自定义对话颜色
    function setCustomDialogColor() {
      const customColorInput = document.getElementById('customDialogColor');
      if (!customColorInput) return;
      
      const customColor = customColorInput.value;
      
      // 移除所有预设颜色的活动状态并标记自定义颜色为活动状态
      const colorOptions = document.querySelectorAll('.color-option');
      colorOptions.forEach(option => {
        option.classList.remove('active');
        // 为了标识自定义颜色状态，可以给第一个按钮添加custom-active类
        if (option === colorOptions[0]) {
          option.classList.add('custom-active');
        }
      });
      
      // 应用颜色到CSS变量（仅用于预览）
      document.documentElement.style.setProperty('--dialog-highlight-color', customColor);
      
      // 更新预览
      updateDialogPreview();
      
      // 仅更新临时状态，不直接修改全局渲染变量和localStorage
    }

    // 关闭对话高亮设置对话框
    function closeDialogHighlightDialog() {
      ModalSystem.closeModal('dialogHighlightDialog');
    }

    // 设置对话高亮类型
    function setDialogHighlightType(element) {
      // 移除所有类型选项的active状态
      const allTypeOptions = document.querySelectorAll('.type-option');
      allTypeOptions.forEach(option => option.classList.remove('active'));
      
      // 设置当前活动状态
      element.classList.add('active');
      
      // 保存选择的高亮类型
      const selectedType = element.dataset.type;
      
      // 保存到全局变量，以便应用设置时使用
      if (!window.dialogHighlightType) {
        window.dialogHighlightType = {};
      }
      window.dialogHighlightType.current = selectedType;
      
      // 控制字体高亮开关的显示
      const fontHighlightControl = document.getElementById('fontHighlightControl');
      if (fontHighlightControl) {
        fontHighlightControl.style.display = selectedType === 'underline' ? 'block' : 'none';
      }
      
      // 更新预览
      updateDialogPreview();
    }
    
    // 更新对话预览
    function updateDialogPreview() {
      const previewDialog = document.getElementById('preview-dialog');
      if (!previewDialog) return;
      
      // 获取当前选择的高亮类型
      let highlightType = 'background'; // 默认背景色
      
      // 优先从window.dialogHighlightType.current获取，避免DOM查询可能的问题
      if (window.dialogHighlightType && window.dialogHighlightType.current) {
        highlightType = window.dialogHighlightType.current;
      } else {
        // 如果没有，再从DOM元素中获取
        const typeOptions = document.querySelectorAll('.type-option');
        for (const option of typeOptions) {
          if (option.classList.contains('active') && option.dataset.type) {
            highlightType = option.dataset.type;
            break;
          }
        }
      }
      
      // 获取当前选择的颜色
      const colorOptions = document.querySelectorAll('.color-option');
      let selectedColor = 'yellow';
      let isCustomColor = false;
      
      // 检查是否选择了自定义颜色
      for (const option of colorOptions) {
        if (option.classList.contains('custom-active')) {
          const customColorInput = document.getElementById('customDialogColor');
          selectedColor = customColorInput ? customColorInput.value : 'yellow';
          isCustomColor = true;
          break;
        }
      }
      
      // 如果没有选择自定义颜色，检查预设颜色
      if (!isCustomColor) {
        for (const option of colorOptions) {
          if (option.classList.contains('active') && option.dataset.color) {
            selectedColor = option.dataset.color;
            break;
          }
        }
      }
      
      // 更新预览样式
      previewDialog.className = `highlight-dialog ${highlightType}`;
      
      // 更新背景/下划线高亮颜色
      if (isCustomColor) {
        document.documentElement.style.setProperty('--dialog-highlight-color', selectedColor);
      } else {
        document.documentElement.style.setProperty('--dialog-highlight-color', `var(--dialog-highlight-${selectedColor})`);
      }
      
      // 检查是否启用字体高亮（仅下划线模式下有效）
      const isFontHighlightEnabled = window.renderVariables.isDialogFontHighlightEnabled || false;
      if (highlightType === 'underline' && isFontHighlightEnabled) {
        previewDialog.classList.add('font-highlight');
      } else {
        previewDialog.classList.remove('font-highlight');
      }
      
      // 仅更新预览，不修改全局渲染变量
    }

    // 设置对话颜色选项
    function setDialogColorOption(element) {
      // 移除所有活动状态
      const allOptions = document.querySelectorAll('.color-option');
      allOptions.forEach(option => {
        option.classList.remove('active');
        option.classList.remove('custom-active');
      });
      
      // 设置当前活动状态
      element.classList.add('active');
      
      // 获取当前颜色选项值（从data-color属性）
      const colorOption = element.dataset.color;
      
      // 预设颜色映射表
      const colorMap = {
        'yellow': '#fff1c2',
        'blue': '#d1e0ff',
        'red': '#ffd1d1',
        'gray': '#cccccc'
      };
      
      // 获取实际的十六进制颜色值
      let hexColor = colorMap[colorOption] || '#fff1c2';
      
      // 应用颜色到CSS变量（仅用于预览）
      document.documentElement.style.setProperty('--dialog-highlight-color', hexColor);
      
      // 更新当前颜色输入框的值
      const customColorInput = document.getElementById('customDialogColor');
      if (customColorInput) {
        customColorInput.value = hexColor;
      }
      
      // 更新预览
      updateDialogPreview();
      
      // 仅更新临时状态，不直接修改全局渲染变量和localStorage
    }
    
    // 设置字体高亮颜色选项
    // 切换字体高亮功能
    function toggleDialogFontHighlight() {
      const isEnabled = document.getElementById('dialogFontHighlightToggle').checked;
      // 仅更新预览，不直接修改全局渲染变量
      updateDialogPreview();
    }

    // 应用对话高亮设置
    function applyDialogHighlight() {
      // 获取当前选择的颜色
      const colorOptions = document.querySelectorAll('.color-option');
      let selectedColor = '#fff1c2'; // 默认使用十六进制颜色值
      let isCustomColor = false;
      
      // 检查是否选择了自定义颜色
      for (const option of colorOptions) {
        if (option.classList.contains('custom-active')) {
          const customColorInput = document.getElementById('customDialogColor');
          selectedColor = customColorInput ? customColorInput.value : '#fff1c2';
          isCustomColor = true;
          break;
        }
      }
      
      // 如果没有选择自定义颜色，检查预设颜色
      if (!isCustomColor) {
        for (const option of colorOptions) {
          if (option.classList.contains('active')) {
            // 使用预设颜色映射表获取颜色值
            const colorOption = option.dataset.color;
            const colorMap = {
              'yellow': '#fff1c2',
              'blue': '#d1e0ff',
              'red': '#ffd1d1',
              'gray': '#cccccc'
            };
            selectedColor = colorMap[colorOption] || '#fff1c2';
            break;
          }
        }
      }
      
      // 获取当前选择的高亮类型
      let highlightType = 'background'; // 默认背景色
      
      // 优先从window.dialogHighlightType.current获取，确保即使DOM元素变化也能正确获取
      if (window.dialogHighlightType && window.dialogHighlightType.current) {
        highlightType = window.dialogHighlightType.current;
      } else {
        // 如果没有，再从DOM元素中获取
        const typeOptions = document.querySelectorAll('.type-option');
        for (const option of typeOptions) {
          if (option.classList.contains('active') && option.dataset.type) {
            highlightType = option.dataset.type;
            break;
          }
        }
      }
      
      // 获取自定义符号
      const prefixInput = document.getElementById('dialogPrefix');
      const suffixInput = document.getElementById('dialogSuffix');
      const dialogPrefix = prefixInput ? prefixInput.value || '“' : '“';
      const dialogSuffix = suffixInput ? suffixInput.value || '”' : '”';
      
      // 获取字体高亮开关状态
      const fontHighlightToggle = document.getElementById('dialogFontHighlightToggle');
      const isFontHighlightEnabled = fontHighlightToggle ? fontHighlightToggle.checked : false;
      
      // 更新全局渲染变量
      window.renderVariables.dialogHighlightColor = selectedColor;
      window.renderVariables.dialogHighlightType = highlightType;
      window.renderVariables.dialogPrefix = dialogPrefix;
      window.renderVariables.dialogSuffix = dialogSuffix;
      window.renderVariables.isDialogFontHighlightEnabled = isFontHighlightEnabled;
      
      // 更新对话正则表达式
      updateDialogRegex();
      
      // 调用updateDialogHighlightColor函数来设置CSS变量，确保样式统一
      updateDialogHighlightColor();
      // 同步局部变量
      updateLocalRenderVariables();
      
      // 当前主题的CSS变量已在updateDialogHighlightColor和updateLocalRenderVariables中更新
      
      // 保存对话高亮设置到全局localStorage
      localStorage.setItem('readerDialogHighlightColor', selectedColor);
      localStorage.setItem('readerDialogHighlightType', highlightType);
      localStorage.setItem('readerDialogHighlightEnabled', window.renderVariables.isDialogHighlightEnabled.toString());
      localStorage.setItem('readerDialogFontHighlightEnabled', window.renderVariables.isDialogFontHighlightEnabled.toString());
      localStorage.setItem('readerDialogPrefix', dialogPrefix);
      localStorage.setItem('readerDialogSuffix', dialogSuffix);
      
      closeDialogHighlightDialog();
      
      // 切换到阅读模式并关闭所有侧边栏
      switchToReading();
      
      // 显示吐司提示
      showToast(`对话高亮设置已更新为${highlightType === 'background' ? '背景色' : '下划线'}`);
      
      // 更新对话正则表达式函数
    function updateDialogRegex() {
      const prefix = window.renderVariables.dialogPrefix || '“';
      const suffix = window.renderVariables.dialogSuffix || '”';
      
      // 转义特殊字符以用于正则表达式
      const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const escapedSuffix = suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // 创建新的正则表达式
      window.dialogRegex = new RegExp(`${escapedPrefix}([^${escapedSuffix}]*)${escapedSuffix}`, 'g');
    }
      window.forceRerender = true;
      
      // 保存当前滚动位置
      const currentScrollTop = chapterContent.scrollTop;
      const currentScrollLeft = chapterContent.scrollLeft;
      
      // 创建异步函数来处理重新渲染
      async function reRenderWithScrollPosition() {
        try {
          // 重新渲染当前章节和目录
          renderChapter();
          renderDirectory();
          
          // 重新渲染后恢复滚动位置
          setTimeout(() => {
            chapterContent.scrollTop = currentScrollTop;
            chapterContent.scrollLeft = currentScrollLeft;
          }, 100);
          
          showToast(`对话高亮颜色已设置为 ${window.renderVariables.dialogHighlightColor}，所有章节已更新`, 'success');
        } catch (error) {
          console.error('重新渲染章节失败:', error);
          // 即使出错，也至少重新渲染当前章节
          renderChapter();
          
          // 重新渲染后恢复滚动位置
          setTimeout(() => {
            chapterContent.scrollTop = currentScrollTop;
            chapterContent.scrollLeft = currentScrollLeft;
          }, 100);
          
          showToast(`对话高亮颜色已设置为 ${window.renderVariables.dialogHighlightColor}，当前章节已更新`, 'success');
        }
      }
      
      // 调用异步函数进行重新渲染
      reRenderWithScrollPosition();
      
      // 保存配置到localStorage
      if (currentFileId) {
        saveProgress();
      }
    }
    


    // 关闭人名高亮设置对话框 - 使用统一弹窗系统
    function closeNameDialog() {
      ModalSystem.closeModal('nameDialog');
    }

    // 在对话框中切换人名高亮开关
    function toggleNameHighlightInDialog() {
      // 直接更新渲染变量状态
      window.renderVariables.isNameHighlightEnabled = !window.renderVariables.isNameHighlightEnabled;
      const isNameHighlightEnabled = window.renderVariables.isNameHighlightEnabled;
      
      // 更新局部变量以同步渲染变量系统
      updateLocalRenderVariables();
      
      // 更新对话框中的开关状态
      const checkboxElement = document.getElementById('nameHighlightToggle');
      if (checkboxElement) {
        checkboxElement.checked = isNameHighlightEnabled;
      }
      
      // 更新功能面板
      renderFunctionContent();
      
      // 强制重新渲染章节内容
      window.forceRerender = true;
      renderChapter();
      
      // 显示toast提示
      showToast(`人名高亮已${isNameHighlightEnabled ? '启用' : '关闭'}`, 'success');
      
      // 保存设置
      if (currentFileId) {
        saveProgress();
      }
    }

    // 从输入框添加人名到指定组
    function addNameToGroup(groupId) {
      const nameText = document.getElementById('nameInputDialog').value.trim();
      
      if (!nameText) {
        showToast('请输入要添加的人名', 'warning');
        return;
      }
      
      // 分割人名
      const newNames = nameText.split('、')
        .map(name => name.trim())
        .filter(name => name.length > 0);
      
      if (newNames.length === 0) {
        showToast('请输入有效的人名', 'warning');
        return;
      }
      
      // 确保currentNames包含所有已添加的人名
      if (!currentNames) {
        currentNames = [];
      }
      
      // 将新人名添加到指定组
      newNames.forEach(name => {
        if (!currentNames.includes(name)) {
          currentNames.push(name);
        }
        
        // 确保renderVariables和nameGroups存在且有效
        if (!window.renderVariables) {
          window.renderVariables = {};
        }
        if (!window.renderVariables.nameGroups || typeof window.renderVariables.nameGroups !== 'object') {
          window.renderVariables.nameGroups = {
            group1: { color: '#1976d2', names: [] },
            group2: { color: '#388e3c', names: [] }
          };
        }
        
        // 检查是否已经在其他组
        let inOtherGroup = false;
        Object.keys(window.renderVariables.nameGroups).forEach(gid => {
          if (window.renderVariables.nameGroups[gid].names.includes(name)) {
            inOtherGroup = true;
          }
        });
        
        // 如果不在任何组，添加到指定组
        if (!inOtherGroup) {
          window.renderVariables.nameGroups[groupId].names.push(name);
        }
      });
      
      // 清空输入框
      document.getElementById('nameInputDialog').value = '';
      
      // 更新显示
      updateGroupDisplays();
      
      // 更新人名数量
      // 确保renderVariables和nameGroups存在且有效
      if (!window.renderVariables) {
        window.renderVariables = {};
      }
      if (!window.renderVariables.nameGroups || typeof window.renderVariables.nameGroups !== 'object') {
        window.renderVariables.nameGroups = {
          group1: { color: '#1976d2', names: [] },
          group2: { color: '#388e3c', names: [] }
        };
      }
      
      const totalNamesCount = Object.values(window.renderVariables.nameGroups)
        .reduce((total, group) => total + group.names.length, 0);
      document.getElementById('nameCountDialog').textContent = `人名数量：${totalNamesCount}个`;
      
      // 获取组名
      const groupName = groupId === 'group1' ? 'A' : 'B';
      showToast(`已添加 ${newNames.length} 个人名到${groupName}组`, 'success');
      
      // 立即应用更改，但不保存
      applyNameChangesImmediately();
    }
    
    // 立即应用人名更改到文本高亮
    function applyNameChangesImmediately() {
      // 从分组中获取所有人名
      const groupedNames = Object.values(window.renderVariables.nameGroups)
        .flatMap(group => group.names);
      
      // 更新当前人名列表，只包含分组中的人名
      window.renderVariables.currentNames = [...groupedNames];
      
      // 清空全局颜色映射，重新构建
      window.renderVariables.globalNameColorMap = {};
      
      // 从分组数据更新全局颜色映射
      Object.keys(window.renderVariables.nameGroups).forEach((groupId, index) => {
        const group = window.renderVariables.nameGroups[groupId];
        group.names.forEach(name => {
          window.renderVariables.globalNameColorMap[name] = index + 1; // 分配颜色组索引
        });
      });
      
      // 同步局部变量
      updateLocalRenderVariables();
      
      // 强制重新渲染章节以应用人名高亮，确保高亮立即生效
      window.forceRerender = true;
      // 设置渲染原因标志，防止应用字体设置
      window.renderVariables.lastRerenderReason = 'nameHighlight';
      renderChapter();
      
      // 更新功能面板
      renderFunctionContent();
      
    }
    
    // 立即应用人名更改（不保存）
    function applyNameChangesImmediately() {
      // 从分组中获取所有人名
      const groupedNames = Object.values(window.renderVariables.nameGroups)
        .flatMap(group => group.names);
      
      // 更新当前人名列表，只包含分组中的人名
      window.renderVariables.currentNames = [...groupedNames];
      
      // 清空禁用列表，保存时重置禁用状态
      window.renderVariables.disabledNames = [];
      
      // 清空全局颜色映射，重新构建
      window.renderVariables.globalNameColorMap = {};
      
      // 从分组数据更新全局颜色映射
      Object.keys(window.renderVariables.nameGroups).forEach((groupId, index) => {
        const group = window.renderVariables.nameGroups[groupId];
        group.names.forEach(name => {
          window.renderVariables.globalNameColorMap[name] = index + 1; // 分配颜色组索引
        });
      });
      
      // 同步局部变量
      updateLocalRenderVariables();
      
      // 强制重新渲染章节以应用人名高亮，确保高亮立即生效
      window.forceRerender = true;
      renderChapter();
      
      // 更新功能面板
      renderFunctionContent();
      
      // 保存配置到localStorage
      if (currentFileId) {
        saveProgress();
      }
    }
    
    // 从对话框更新人名
    function updateNamesFromDialog() {
      // 从分组中获取所有人名
      const groupedNames = Object.values(window.renderVariables.nameGroups)
        .flatMap(group => group.names);
      
      // 更新当前人名列表，只包含分组中的人名
      window.renderVariables.currentNames = [...groupedNames];
      
      // 清空全局颜色映射，重新构建
      window.renderVariables.globalNameColorMap = {};
      
      // 从分组数据更新全局颜色映射
      Object.keys(window.renderVariables.nameGroups).forEach((groupId, index) => {
        const group = window.renderVariables.nameGroups[groupId];
        group.names.forEach(name => {
          window.renderVariables.globalNameColorMap[name] = index + 1; // 分配颜色组索引
        });
      });
      
      // 同步局部变量
      updateLocalRenderVariables();
      
      // 保存配置到localStorage
      if (currentFileId) {
        saveProgress();
      }
      
      // 清空输入框
      document.getElementById('nameInputDialog').value = '';
      
      // 关闭对话框
      closeNameDialog();
      
      // 切换到阅读模式但保持菜单栏打开
      switchToReadingKeepMenu();
      
      // 使用增量更新方法，避免完全重新渲染DOM
      // 设置全局标志，表明正在进行人名高亮更新
      window.renderVariables.isNameHighlightUpdateInProgress = true;
      window.renderVariables.lastRerenderReason = 'nameHighlight';
      
      incrementallyUpdateNameHighlights();
      
      const totalNamesCount = window.renderVariables.currentNames.length;
      showToast(`已更新并保存 ${totalNamesCount} 个人名高亮配置`, 'success');
      
      // 渲染完成后，延迟清除临时标志
      setTimeout(() => {
        window.renderVariables.isNameHighlightUpdateInProgress = false;
      }, 500);
    }
    
    // 清空所有人名
    function clearAllNames() {
      if (confirm('确定要清空所有人名高亮设置吗？')) {
        // 清空所有分组的人名
        Object.keys(window.renderVariables.nameGroups).forEach(groupId => {
          window.renderVariables.nameGroups[groupId].names = [];
        });
        
        // 清空当前人名列表
        window.renderVariables.currentNames = [];
        
        // 清空全局颜色映射
        window.renderVariables.globalNameColorMap = {};
        
        // 同步局部变量
        updateLocalRenderVariables();
        
        // 重新渲染章节以移除人名高亮
        window.forceRerender = true;
        renderChapter();
        
        // 更新功能面板
        renderFunctionContent();
        
        // 保存配置到localStorage
        if (currentFileId) {
          saveProgress();
        }
        
        // 更新对话框显示
        if (document.getElementById('nameCountDialog')) {
          document.getElementById('nameCountDialog').innerHTML = '人名数量：0个 <button class="clear-names-btn" onclick="clearAllNames()">清空</button>';
        }
        
        // 更新分组显示
        updateGroupDisplays();
        
        showToast('已清空所有人名高亮设置', 'success');
      }
    }
    
    // 复制人名分组数据到剪贴板
    function copyNameGroups() {
      try {
        // 准备导出数据
        const exportData = {
          nameGroups: window.renderVariables.nameGroups,
          exportTime: new Date().toISOString(),
          version: '1.0'
        };
        
        // 转换为JSON字符串并格式化
        const jsonString = JSON.stringify(exportData, null, 2);
        
        // 使用Clipboard API复制到剪贴板
        if (navigator.clipboard && window.isSecureContext) {
          // 现代浏览器安全上下文下的复制
          navigator.clipboard.writeText(jsonString).then(() => {
            showToast('人名数据已复制到剪贴板', 'success');
          }).catch(err => {
            console.error('复制失败:', err);
            // 降级到传统方法
            fallbackCopyTextToClipboard(jsonString);
          });
        } else {
          // 降级到传统方法
          fallbackCopyTextToClipboard(jsonString);
        }
      } catch (error) {
        console.error('复制人名配置失败:', error);
        showToast('复制失败，请重试', 'error');
      }
    }
    
    // 降级复制方法
    function fallbackCopyTextToClipboard(text) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // 防止滚动到元素位置
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          showToast('人名数据已复制到剪贴板', 'success');
        } else {
          showToast('复制失败，请手动复制', 'error');
        }
      } catch (err) {
        console.error('传统复制方法失败:', err);
        showToast('复制失败，请重试', 'error');
      } finally {
        document.body.removeChild(textArea);
      }
    }
    
    // 从剪贴板导入人名分组数据
    function importNameGroupsFromClipboard() {
      // 确保renderVariables存在
      if (!window.renderVariables) {
        window.renderVariables = {};
      }
      if (!window.renderVariables.nameGroups || typeof window.renderVariables.nameGroups !== 'object') {
        window.renderVariables.nameGroups = {
          group1: { color: '#1976d2', names: [] },
          group2: { color: '#388e3c', names: [] }
        };
      }
      
      // 使用Clipboard API从剪贴板读取数据
      if (navigator.clipboard && window.isSecureContext) {
        // 现代浏览器安全上下文下的读取
        navigator.clipboard.readText().then(text => {
          processClipboardText(text);
        }).catch(err => {
          console.error('从剪贴板读取失败:', err);
          // 降级到传统方法
          showToast('无法访问剪贴板，请手动粘贴', 'error');
          showPasteDialog();
        });
      } else {
        // 降级到手动粘贴对话框
        showPasteDialog();
      }
    }
    
    // 处理剪贴板文本
    function processClipboardText(text) {
      if (!text || text.trim() === '') {
        showToast('剪贴板为空，请先复制人名数据', 'error');
        return;
      }
      
      try {
        // 解析JSON内容
        const importData = JSON.parse(text);
        
        // 验证数据格式
        if (!importData.nameGroups || typeof importData.nameGroups !== 'object') {
          throw new Error('无效的人名数据格式');
        }
        
        // 备份当前配置，防止导入失败
        const backup = JSON.parse(JSON.stringify(window.renderVariables.nameGroups));
        
        // 更新renderVariables中的nameGroups
        window.renderVariables.nameGroups = importData.nameGroups;
        
        // 确保nameGroups是有效的对象结构
        if (Array.isArray(window.renderVariables.nameGroups)) {
          // 处理数组格式
          const newNameGroups = {};
          importData.nameGroups.forEach((group, index) => {
            const groupId = `group${index + 1}`;
            newNameGroups[groupId] = group;
          });
          window.renderVariables.nameGroups = newNameGroups;
        }
        
        // 重新初始化当前人名列表和颜色映射
        rebuildCurrentNamesAndColorMap();
        
        // 重新初始化对话框，应用导入的配置
        closeNameDialog();
        openNameDialog();
        
        // 强制重新渲染章节以应用人名高亮
        window.forceRerender = true;
        renderChapter();
        
        // 更新功能面板
        renderFunctionContent();
        
        // 保存配置到localStorage
        if (currentFileId) {
          saveProgress();
        }
        
        showToast('已从剪贴板导入人名数据', 'success');
      } catch (error) {
        console.error('解析人名数据失败:', error);
        showToast('导入失败，请检查剪贴板内容格式是否正确', 'error');
        // 显示手动粘贴对话框
        showPasteDialog();
      }
    }
    
    // 显示手动粘贴对话框
    function showPasteDialog() {
      // 创建对话框HTML
      const dialogHTML = `
        <div id="pasteDialog" class="dialog-overlay" style="
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
          font-family: inherit;
        ">
          <div style="
            background: var(--background-color);
            border-radius: 8px;
            padding: 20px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          ">
            <h3 style="margin-bottom: 15px; color: var(--text-color);">手动粘贴人名数据</h3>
            <textarea id="pasteTextarea" style="
              width: 100%;
              min-height: 200px;
              padding: 10px;
              border: 1px solid var(--border-color);
              border-radius: 4px;
              background: var(--paper-color);
              color: var(--text-color);
              font-family: inherit;
              font-size: 14px;
              resize: vertical;
            " placeholder="请粘贴人名数据JSON..."></textarea>
            <div style="margin-top: 15px; display: flex; justify-content: flex-end; gap: 10px;">
              <button onclick="document.getElementById('pasteDialog').remove();" style="
                padding: 8px 16px;
                background: var(--paper-color);
                color: var(--text-color);
                border: 1px solid var(--border-color);
                border-radius: 4px;
                cursor: pointer;
                font-family: inherit;
              ">取消</button>
              <button onclick="processPastedText();" style="
                padding: 8px 16px;
                background: var(--accent-color);
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-family: inherit;
              ">确定</button>
            </div>
          </div>
        </div>
      `;
      
      // 添加到body
      document.body.insertAdjacentHTML('beforeend', dialogHTML);
    }
    
    // 处理手动粘贴的文本
    function processPastedText() {
      const textarea = document.getElementById('pasteTextarea');
      if (textarea) {
        const text = textarea.value.trim();
        processClipboardText(text);
        // 移除对话框
        const dialog = document.getElementById('pasteDialog');
        if (dialog) {
          dialog.remove();
        }
      }
    }
    
    // 将processPastedText添加到window对象，使其可以在HTML中通过onclick直接调用
    window.processPastedText = processPastedText;
    
    // 重建当前人名列表和颜色映射
    function rebuildCurrentNamesAndColorMap() {
      // 清空当前人名列表和颜色映射
      window.renderVariables.currentNames = [];
      window.renderVariables.globalNameColorMap = {};
      
      // 遍历所有分组，重建列表和映射
      Object.keys(window.renderVariables.nameGroups).forEach(groupId => {
        const group = window.renderVariables.nameGroups[groupId];
        if (group.names && Array.isArray(group.names)) {
          group.names.forEach(name => {
            window.renderVariables.currentNames.push(name);
            window.renderVariables.globalNameColorMap[name] = group.color;
          });
        }
      });
    }

    // 生成人名分组标记（1A, 1B, 1C, 1D, 1E, 1F, 2A, 2B, ...）
    function generateNameGroupLabel(colorIndex) {
      const groupNumber = Math.ceil(colorIndex / 6); // 每组6个颜色
      const groupLetter = String.fromCharCode(64 + ((colorIndex - 1) % 6) + 1); // A, B, C, D, E, F
      return `${groupNumber}${groupLetter}`;
    }
    
    // 在文本中高亮人名 - 支持处理包含HTML标签的文本
    function highlightNamesInText(text) {
      // 使用window.renderVariables中的变量确保状态正确同步
      if (window.renderVariables.currentNames.length === 0 || !window.renderVariables.isNameHighlightEnabled) return text;
      
      // 过滤掉被禁用的人名
      const activeNames = window.renderVariables.currentNames.filter(name => !window.renderVariables.disabledNames.includes(name));
      if (activeNames.length === 0) return text;
      
      // 确保window.renderVariables.nameGroups存在，但不覆盖已存在的分组
      if (!window.renderVariables.nameGroups) {
        window.renderVariables.nameGroups = {
          group1: { color: '#1976d2', names: [] },
          group2: { color: '#388e3c', names: [] }
        };
      }
      
      // 使用全局颜色映射，确保相同人名使用相同颜色
      let colorIndex = Object.keys(window.renderVariables.globalNameColorMap).length + 1;
      
      // 创建临时DOM元素来处理包含HTML标签的文本
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = text;
      
      // 递归处理DOM树中的文本节点
      function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const textContent = node.textContent;
          const parentNode = node.parentNode;
          
          // 只处理非空文本节点
          if (textContent.trim()) {
            // 构建正则表达式，按长度排序避免部分匹配
            const sortedNames = [...activeNames].sort((a, b) => b.length - a.length);
            const regex = new RegExp(`(${sortedNames.map(escapeRegExp).join('|')})`, 'g');
            
            // 检查文本中是否包含要高亮的人名
            if (regex.test(textContent)) {
              // 创建文档片段来存储处理后的内容
              const fragment = document.createDocumentFragment();
              let lastIndex = 0;
              
              // 重置正则表达式的lastIndex
              regex.lastIndex = 0;
              let match;
              while ((match = regex.exec(textContent)) !== null) {
                // 添加匹配前的文本
                if (match.index > lastIndex) {
                  fragment.appendChild(document.createTextNode(textContent.substring(lastIndex, match.index)));
                }
                
                const name = match[1];
                
                // 如果这个人名还没有分配颜色，则分配一个
                if (!globalNameColorMap[name]) {
                  // 检查是否在某个组中
                  let foundGroup = false;
                  Object.keys(window.renderVariables.nameGroups).forEach((groupId, index) => {
                    if (window.renderVariables.nameGroups[groupId].names.includes(name) && !foundGroup) {
                      globalNameColorMap[name] = index + 1; // 分配对应组的颜色索引
                      foundGroup = true;
                    }
                  });
                  
                  // 如果不在任何组中，分配一个新颜色
                  if (!foundGroup) {
                    globalNameColorMap[name] = colorIndex;
                    colorIndex = colorIndex > 30 ? 1 : colorIndex + 1;
                  }
                }
                
                // 查找人名所在的组
                let groupColor = '';
                Object.keys(window.renderVariables.nameGroups).forEach((groupId) => {
                  if (window.renderVariables.nameGroups[groupId].names.includes(name)) {
                    groupColor = window.renderVariables.nameGroups[groupId].color;
                  }
                });
                
                const colorClass = `color-${globalNameColorMap[name]}`;
                const groupLabel = generateNameGroupLabel(globalNameColorMap[name]);
                
                // 创建高亮人名的span元素
                const span = document.createElement('span');
                span.className = `highlight-name${groupColor ? '' : ' ' + colorClass}`;
                if (groupColor) {
                  span.style.color = groupColor;
                }
                span.title = `组别: ${groupLabel}`;
                span.textContent = name;
                fragment.appendChild(span);
                
                lastIndex = regex.lastIndex;
              }
              
              // 添加最后一个匹配后的文本
              if (lastIndex < textContent.length) {
                fragment.appendChild(document.createTextNode(textContent.substring(lastIndex)));
              }
              
              // 替换原始文本节点
              parentNode.insertBefore(fragment, node);
              parentNode.removeChild(node);
            }
          }
        } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName.toLowerCase() !== 'script' && node.nodeName.toLowerCase() !== 'style') {
          // 递归处理子节点
          const childNodes = Array.from(node.childNodes);
          childNodes.forEach(child => processNode(child));
        }
      }
      
      // 处理所有文本节点
      const childNodes = Array.from(tempDiv.childNodes);
      childNodes.forEach(child => processNode(child));
      
      // 返回处理后的HTML
      return tempDiv.innerHTML;
    }
    // 打开正文字号设置对话框 - 使用统一弹窗系统
    function openFontSizeDialog() {
      ModalSystem.createModal({
        id: 'fontSizeDialog',
        title: '正文字号设置',
        content: `
          <div class="font-size-preview" style="font-size: ${fontSize}px; line-height: ${lineHeight};">
            这是预览文字，当前字号：${fontSize}px
          </div>
          <div class="font-size-control">
            <label>字号大小：<span id="fontSizeValue">${fontSize}</span>px</label>
            <div style="display:flex;align-items:center;gap:8px;">
              <input type="range" id="fontSizeSlider" min="12" max="24" value="${fontSize}" oninput="updateFontSizePreview(this.value); document.getElementById('fontSizeInput').value=this.value;">
              <input type="number" id="fontSizeInput" value="${fontSize}" step="1" style="width:70px;padding:4px 8px;border:1px solid var(--border-color);border-radius:6px;font-size:15px;outline:none;transition:border-color 0.2s;background:var(--background-color);color:var(--text-color);" onfocus="this.style.borderColor='var(--accent-color)'" onblur="this.style.borderColor='var(--border-color)'" oninput="onFontSizeInputChange(this)">
            </div>
            <div class="font-size-buttons">
              <button onclick="setFontSize(18)">小</button>
              <button onclick="setFontSize(20)">中</button>
              <button onclick="setFontSize(22)">常规</button>
              <button onclick="setFontSize(24)">大</button>
            </div>
          </div>
        `,
        buttons: [
          {
            text: '取消',
            type: 'secondary'
          },
          {
            text: '确定',
            type: 'primary',
            onClick: function() {
              applyFontSize();
            }
          }
        ],
        closeOnOverlayClick: true
      });
    }

    // 关闭正文字号设置对话框 - 使用统一弹窗系统
    function closeFontSizeDialog() {
      ModalSystem.closeModal('fontSizeDialog');
    }

    // 更新字号预览
    function updateFontSizePreview(size) {
      const preview = document.querySelector('.font-size-preview');
      const label = document.getElementById('fontSizeValue');
      if (preview) {
        preview.style.fontSize = size + 'px';
      }
      if (label) {
        label.textContent = size;
      }
    }

    // 设置字号
    function setFontSize(size) {
      updateFontSizePreview(size);
      document.getElementById('fontSizeSlider').value = size;
    }

    // 应用字号设置
    function applyFontSize() {
      const newSize = parseInt(document.getElementById('fontSizeSlider').value);
      // 更新渲染变量系统中的字号
      window.renderVariables.fontSize = newSize;
      // 不再同步更新段落间距，保持当前设置不变
      // applyParagraphSpacingToDOM(window.renderVariables.paragraphSpacing);
      // 从渲染变量获取最新的字号和行高
      const { fontSize, lineHeight } = window.renderVariables;
      
      applyCurrentFontSettings();
      
      // 重新渲染章节以应用新的字号设置
      renderChapterContent();
      
      // 确保所有内容段落都应用新的字号设置
      if (chapterContent) {
        const paragraphElements = chapterContent.querySelectorAll('p, .content-paragraph, .highlight-text');
        paragraphElements.forEach(p => {
          p.style.setProperty('font-size', fontSize + 'px', 'important');
          p.style.setProperty('line-height', window.renderVariables.lineHeight, 'important');
        });
      }
      
      closeFontSizeDialog();
      showToast(`字号已设置为 ${fontSize}px`, 'success');
    }

    // 手动输入字号时联动滑块和预览
    window.onFontSizeInputChange = function(input) {
      let val = parseInt(input.value);
      if (isNaN(val)) return;
      document.getElementById('fontSizeSlider').value = val;
      updateFontSizePreview(val);
    }

    // 打开字体字重设置对话框 - 使用统一弹窗系统
    function openFontWeightDialog() {
      const fontWeight = window.renderVariables.fontWeight;
      const fontSize = window.renderVariables.fontSize;
      const lineHeight = window.renderVariables.lineHeight;
      
      ModalSystem.createModal({
        id: 'fontWeightDialog',
        title: '字体字重设置',
        content: `
          <div class="font-size-preview" style="font-size: ${fontSize}px; line-height: ${lineHeight}; font-weight: ${fontWeight};">
            这是预览文字，当前字重：${fontWeight} (${getFontWeightName(fontWeight)})
          </div>
          <div class="font-size-control">
            <label>字体字重：<span id="fontWeightValue">${fontWeight}</span> - ${getFontWeightName(fontWeight)}</label>
            <div style="display:flex;align-items:center;gap:8px;">
              <input type="range" id="fontWeightSlider" min="100" max="900" step="100" value="${fontWeight}" oninput="updateFontWeightPreview(this.value); document.getElementById('fontWeightInput').value=this.value;">
              <input type="number" id="fontWeightInput" value="${fontWeight}" step="100" min="100" max="900" style="width:70px;padding:4px 8px;border:1px solid var(--border-color);border-radius:6px;font-size:15px;outline:none;transition:border-color 0.2s;background:var(--background-color);color:var(--text-color);" onfocus="this.style.borderColor='var(--accent-color)'" onblur="this.style.borderColor='var(--border-color)'" oninput="onFontWeightInputChange(this)">
            </div>
            <div class="font-size-buttons">
              <button onclick="setFontWeight(100)">Thin</button>
              <button onclick="setFontWeight(200)">Extra Light</button>
              <button onclick="setFontWeight(300)">Light</button>
              <button onclick="setFontWeight(400)">Regular</button>
              <button onclick="setFontWeight(500)">Medium</button>
              <button onclick="setFontWeight(600)">Semi Bold</button>
              <button onclick="setFontWeight(700)">Bold</button>
              <button onclick="setFontWeight(800)">Extra Bold</button>
              <button onclick="setFontWeight(900)">Black</button>
            </div>
          </div>
        `,
        buttons: [
          {
            text: '取消',
            type: 'secondary'
          },
          {
            text: '确定',
            type: 'primary',
            onClick: function() {
              applyFontWeight();
            }
          }
        ],
        closeOnOverlayClick: true
      });
    }

    // 关闭字体字重设置对话框 - 使用统一弹窗系统
    function closeFontWeightDialog() {
      ModalSystem.closeModal('fontWeightDialog');
    }

    // 获取字重名称
    function getFontWeightName(weight) {
      const weightMap = {
        100: 'Thin',
        200: 'Extra Light',
        300: 'Light',
        400: 'Regular',
        500: 'Medium',
        600: 'Semi Bold',
        700: 'Bold',
        800: 'Extra Bold',
        900: 'Black'
      };
      return weightMap[weight] || 'Custom';
    }

    // 更新字重预览
    function updateFontWeightPreview(weight) {
      const preview = document.querySelector('.font-size-preview');
      const label = document.getElementById('fontWeightValue');
      if (preview) {
        preview.style.fontWeight = weight;
      }
      if (label) {
        label.textContent = weight;
        // 更新完整标签，包括字重名称
        const parentLabel = label.parentElement;
        parentLabel.innerHTML = `字体字重：<span id="fontWeightValue">${weight}</span> - ${getFontWeightName(weight)}`;
      }
    }

    // 设置字重
    function setFontWeight(weight) {
      updateFontWeightPreview(weight);
      document.getElementById('fontWeightSlider').value = weight;
      document.getElementById('fontWeightInput').value = weight;
    }

    // 应用字重设置
    function applyFontWeight() {
      const newWeight = parseInt(document.getElementById('fontWeightSlider').value);
      // 更新渲染变量系统中的字重
      window.renderVariables.fontWeight = newWeight;
      
      applyCurrentFontSettings();
      
      // 重新渲染章节以应用新的字重设置
      renderChapterContent();
      
      // 确保所有内容段落都应用新的字重设置
      if (chapterContent) {
        const paragraphElements = chapterContent.querySelectorAll('p, .content-paragraph, .highlight-text');
        paragraphElements.forEach(p => {
          p.style.setProperty('font-weight', newWeight, 'important');
        });
      }
      
      closeFontWeightDialog();
      showToast(`字重已设置为 ${newWeight} (${getFontWeightName(newWeight)})`, 'success');
    }

    // 手动输入字重时联动滑块和预览
    window.onFontWeightInputChange = function(input) {
      let val = parseInt(input.value);
      if (isNaN(val)) return;
      // 确保值在有效范围内
      val = Math.max(100, Math.min(900, val));
      // 确保值是100的倍数
      val = Math.round(val / 100) * 100;
      input.value = val;
      document.getElementById('fontWeightSlider').value = val;
      updateFontWeightPreview(val);
    }

    // 打开段落间距设置对话框
    function openParagraphSpacingDialog() {
      const currentSpacing = window.renderVariables.paragraphSpacing;
      
      // 创建改进的对话框内容
      const content = `
        <div class="paragraph-spacing-dialog-content">
          <!-- 预览区域 -->
          <div class="paragraph-spacing-preview-section">
            <h3 style="margin:0 0 16px 0;font-size:16px;color:var(--text-color);font-weight:600;">实时预览</h3>
            <div class="line-height-preview" style="font-size: ${fontSize}px; line-height: ${lineHeight}; padding: 16px; border: 1px solid var(--border-color); border-radius: 8px; background: var(--background-color-light);">
              <p>这是第一段预览文字，用于展示段落间距效果。</p>
              <p>这是第二段预览文字，段落间距会影响阅读体验。</p>
              <p>这是第三段预览文字，适当的间距可以提高阅读舒适度。</p>
            </div>
          </div>
          
          <!-- 控制区域 -->
          <div class="paragraph-spacing-control-section">
            <h3 style="margin:16px 0 12px 0;font-size:16px;color:var(--text-color);font-weight:600;">调整间距</h3>
            
            <!-- 滑块控制 -->
            <div style="margin-bottom:16px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <label style="font-size:14px;color:var(--text-color);font-weight:500;">段落间距</label>
                <span id="paragraphSpacingValue">${currentSpacing}em</span>
              </div>
              <input type="range" id="paragraphSpacingSlider" min="0" max="3" step="0.1" value="${currentSpacing}" 
                     style="width:100%;height:6px;background:var(--border-color);border-radius:3px;outline:none;appearance:none;cursor:pointer;"
                     oninput="updateParagraphSpacingPreview(this.value); document.getElementById('paragraphSpacingInput').value=this.value;">
            </div>
            
            <!-- 数字输入和重置 -->
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
              <input type="number" id="paragraphSpacingInput" value="${currentSpacing}" step="0.1" min="0" max="3" 
                     style="flex:1;padding:8px 12px;border:1px solid var(--border-color);border-radius:6px;font-size:15px;outline:none;transition:border-color 0.2s;background:var(--background-color);color:var(--text-color);"
                     onfocus="this.style.borderColor='var(--accent-color)'"
                     onblur="this.style.borderColor='var(--border-color)'"
                     oninput="onParagraphSpacingInputChange(this)">
              <button onclick="setParagraphSpacingPreset('auto')" 
                      style="padding:8px 12px;border:1px solid var(--border-color);border-radius:6px;background:var(--background-color);color:var(--text-color);font-size:13px;cursor:pointer;transition:all 0.2s;">
                自动
              </button>
            </div>
            
            <!-- 预设按钮 -->
            <h4 style="margin:16px 0 8px 0;font-size:14px;color:var(--text-color);font-weight:500;">常用预设</h4>
            <div class="paragraph-spacing-presets" style="display:flex;gap:8px;flex-wrap:wrap;">
              <button onclick="setParagraphSpacingPreset('0')" 
                      class="preset-btn ${currentSpacing === 0 ? 'active' : ''}">无间距 (0em)</button>
              <button onclick="setParagraphSpacingPreset('0.5')" 
                      class="preset-btn ${currentSpacing === 0.5 ? 'active' : ''}">紧凑间距 (0.5em)</button>
              <button onclick="setParagraphSpacingPreset('1')" 
                      class="preset-btn ${currentSpacing === 1 ? 'active' : ''}">标准间距 (1em)</button>
              <button onclick="setParagraphSpacingPreset('2')" 
                      class="preset-btn ${currentSpacing === 2 ? 'active' : ''}">宽松间距 (2em)</button>
            </div>
          </div>
          
          <!-- 添加CSS样式 -->
          <style>
            .paragraph-spacing-dialog-content {
              color: var(--text-color);
            }
            .paragraph-spacing-dialog-content h3 {
              font-weight: 600;
              color: var(--text-color);
            }
            .preset-btn {
              padding: 6px 12px;
              border: 1px solid var(--border-color);
              border-radius: 6px;
              background: var(--background-color);
              color: var(--text-color);
              font-size: 13px;
              cursor: pointer;
              transition: all 0.2s;
              white-space: nowrap;
            }
            .preset-btn:hover {
              background: var(--hover-background);
              border-color: var(--accent-color);
            }
            .preset-btn.active {
              background: var(--accent-color);
              color: white;
              border-color: var(--accent-color);
            }
            .spacing-indicator {
              pointer-events: none;
            }
          </style>
        </div>
      `;
      
      ModalSystem.createModal({
        id: 'paragraphSpacingDialog',
        title: '段落间距设置',
        content: content,
        width: '480px',
        buttons: [
          {
            text: '取消',
            type: 'secondary',
            onClick: function() { closeParagraphSpacingDialog(); }
          },
          {
            text: '确定',
            type: 'primary',
            onClick: function() { applyParagraphSpacing(); }
          }
        ],
        closeOnOverlayClick: true,
        onOpen: function() {
          // 初始化时触发一次预览更新
          updateParagraphSpacingPreview(currentSpacing);
        }
      });
    }

    // 关闭段落间距设置对话框
    function closeParagraphSpacingDialog() {
      ModalSystem.closeModal('paragraphSpacingDialog');
    }

    // 更新段落间距预览
    function updateParagraphSpacingPreview(spacing) {
      // 使用类名修正
      const preview = document.querySelector('.line-height-preview');
      const label = document.getElementById('paragraphSpacingValue');
      
      if (preview) {
        const paragraphs = preview.querySelectorAll('p');
        paragraphs.forEach((p, index) => {
          // 使用em单位设置段落间距
          p.style.marginBottom = index === paragraphs.length - 1 ? '0' : `${spacing}em`;
        });
        
        // 添加间距指示器，帮助用户直观理解间距大小
        const indicators = preview.querySelectorAll('.spacing-indicator');
        indicators.forEach(indicator => indicator.remove());
        
        // 为每个段落之间添加视觉指示器 - 统一使用em单位
        paragraphs.forEach((p, index) => {
          if (index < paragraphs.length - 1) {
            const indicator = document.createElement('div');
            indicator.className = 'spacing-indicator';
            indicator.style.cssText = `
              height: ${spacing}em;
              background: linear-gradient(to bottom, transparent 2px, rgba(12, 140, 233, 0.2) 2px, rgba(12, 140, 233, 0.2) 4px, transparent 4px);
              background-size: 8px 8px;
              background-position: center;
              margin: 0 auto;
              width: 100%;
              pointer-events: none;
            `;
            p.parentNode.insertBefore(indicator, p.nextSibling);
          }
        });
      }
      
      if (label) {
        // 添加文字描述，帮助用户理解当前间距级别
        let description = '';
        if (spacing === 0) description = '(无间距)';
        else if (spacing === 0.5) description = '(紧凑间距)';
        else if (spacing === 1) description = '(标准间距)';
        else if (spacing === 2) description = '(宽松间距)';
        else if (spacing < 0.5) description = '(非常紧凑)';
        else if (spacing < 1) description = '(较紧凑)';
        else if (spacing < 2) description = '(较宽松)';
        else description = '(非常宽松)';
        label.innerHTML = `${spacing}em <span style="font-size:12px;opacity:0.6;">${description}</span>`;
      }
    }

    // 设置段落间距预设
    window.setParagraphSpacingPreset = function(presetName) {
      let spacing;
      
      // 处理自动间距选项
      if (presetName === 'auto') {
        // 自动设置为0，这是无间距
        spacing = 0;
      } else {
        // 直接使用传入的预设值
        spacing = parseFloat(presetName);
      }
      
      if (!isNaN(spacing)) {
        updateParagraphSpacingPreview(spacing);
        document.getElementById('paragraphSpacingSlider').value = spacing;
        document.getElementById('paragraphSpacingInput').value = spacing;
      }
    }

    // 设置段落间距
    function setParagraphSpacing(spacing) {
      updateParagraphSpacingPreview(spacing);
      document.getElementById('paragraphSpacingSlider').value = spacing;
      document.getElementById('paragraphSpacingInput').value = spacing;
    }

    // 应用段落间距设置
    function applyParagraphSpacing() {
      let newSpacing = parseFloat(document.getElementById('paragraphSpacingSlider').value);
      
      // 添加范围限制，防止设置过大或过小的值
      newSpacing = Math.min(Math.max(newSpacing, -1), 3);
      
      // 更新全局渲染变量
      window.renderVariables.paragraphSpacing = newSpacing;
      
      // 更新CSS变量
      applyParagraphSpacingToDOM(newSpacing);
      
      // 保存设置
      saveProgress();
      
      // 关闭对话框并显示提示
      closeParagraphSpacingDialog();
      showToast(`段落间距已设置为 ${newSpacing}em`, 'success');
    }

    // 将段落间距应用到DOM - 统一使用em单位
    function applyParagraphSpacingToDOM(spacingValue) {
      // 使用CSS变量实现全局统一的段落间距管理
      document.documentElement.style.setProperty('--paragraph-spacing', `${spacingValue}em`, 'important');
      
      // 查找所有的内容区域
      const contentAreas = document.querySelectorAll('.chapter-content, .next-chapter-preview, .seamless-chapter, .preview-chapter, #chapterContent, .prev-chapter-preview, .loaded-chapter, .cached-chapter');
      
      contentAreas.forEach(area => {
        // 查找所有段落元素
        const paragraphs = area.querySelectorAll('p, .content-paragraph');
        
        // 设置段落之间的间距
        paragraphs.forEach((p, index) => {
          // 使用CSS变量设置段落间距，确保最后一个段落没有间距
          p.style.setProperty('margin-bottom', index === paragraphs.length - 1 ? '0' : `var(--paragraph-spacing, ${spacingValue}em)`, 'important');
        });
      });
      
      // 记录当前应用的间距值
      window.currentAppliedParagraphSpacing = spacingValue;
    }

    // 段落间距输入框变化处理 - 添加范围限制
    window.onParagraphSpacingInputChange = function(input) {
      let val = parseFloat(input.value);
      if (isNaN(val)) return;
      // 添加范围限制，防止设置过大或过小的值
      val = Math.min(Math.max(val, -1), 3);
      input.value = val;
      document.getElementById('paragraphSpacingSlider').value = val;
      updateParagraphSpacingPreview(val);
    }

    // 打开行间距设置对话框
    function openLineHeightDialog() {
      // 使用预设配置创建内容
      const content = `
        <div class="line-height-preview" style="font-size: ${fontSize}px; line-height: ${window.renderVariables.lineHeight};">
          <p>这是预览文字，当前行间距：${window.renderVariables.lineHeight}</p>
          <p>这是第二行预览文字，用于展示行间距效果</p>
          <p>这是第三行预览文字，继续展示行间距效果</p>
        </div>
        <div class="line-height-control">
          <label>行间距：<span id="lineHeightValue">${window.renderVariables.lineHeight}</span></label>
          <div style="display:flex;align-items:center;gap:8px;">
            <input type="range" id="lineHeightSlider" min="1.2" max="2.5" step="0.1" value="${window.renderVariables.lineHeight}" oninput="updateLineHeightPreview(this.value); document.getElementById('lineHeightInput').value=this.value;">
            <input type="number" id="lineHeightInput" value="${window.renderVariables.lineHeight}" step="0.1" style="width:70px;padding:4px 8px;border:1px solid var(--border-color);border-radius:6px;font-size:15px;outline:none;transition:border-color 0.2s;background:var(--background-color);color:var(--text-color);" onfocus="this.style.borderColor='var(--accent-color)'" onblur="this.style.borderColor='var(--border-color)'" oninput="onLineHeightInputChange(this)">
          </div>
          <div class="line-height-buttons">
            <button onclick="setLineHeightPreset('compact')">紧凑</button>
            <button onclick="setLineHeightPreset('standard')">标准</button>
            <button onclick="setLineHeightPreset('comfortable')">舒适</button>
            <button onclick="setLineHeightPreset('spacious')">宽松</button>
          </div>
        </div>
      `;
      
      ModalSystem.createModal({
        id: 'lineHeightDialog',
        title: '行间距设置',
        content: content,
        buttons: [
          {
            text: '取消',
            type: 'secondary',
            onClick: function() {}
          },
          {
            text: '确定',
            type: 'primary',
            onClick: function() { applyLineHeight(); }
          }
        ],
        closeOnOverlayClick: true
      });
    }

    // 关闭行间距设置对话框
    function closeLineHeightDialog() {
      ModalSystem.closeModal('lineHeightDialog');
    }

    // 更新行间距预览
    function updateLineHeightPreview(height) {
      const preview = document.querySelector('.line-height-preview');
      const label = document.getElementById('lineHeightValue');
      if (preview) {
        preview.style.lineHeight = height;
      }
      if (label) {
        label.textContent = height;
      }
    }

    // 设置行间距预设
    window.setLineHeightPreset = function(presetName) {
      if (window.lineHeightPresets && window.lineHeightPresets[presetName]) {
        const height = window.lineHeightPresets[presetName];
        updateLineHeightPreview(height);
        document.getElementById('lineHeightSlider').value = height;
        document.getElementById('lineHeightInput').value = height;
      }
    }
    
    // 直接设置行间距（保持向后兼容）
    function setLineHeight(height) {
      updateLineHeightPreview(height);
      document.getElementById('lineHeightSlider').value = height;
      document.getElementById('lineHeightInput').value = height;
    }

    // 应用行间距设置
    function applyLineHeight() {
      const newHeight = parseFloat(document.getElementById('lineHeightSlider').value);
      
      // 更新渲染变量系统中的行间距设置
      window.renderVariables.lineHeight = newHeight;
      
      // 应用行间距到DOM元素
      applyLineHeightToDOM(newHeight);
      
      // 保存设置
      saveProgress();
      
      closeLineHeightDialog();
      showToast(`行间距已设置为 ${newHeight}`, 'success');
    }
    
    // 简洁版：将行间距应用到DOM的函数
    function applyLineHeightToDOM(lineHeightValue) {
      // 只更新全局CSS变量
      document.documentElement.style.setProperty('--line-height', lineHeightValue, 'important');
      
      // 同步更新字体大小变量
      const fontSize = window.renderVariables.fontSize;
      document.documentElement.style.setProperty('--font-size', fontSize + 'px', 'important');
      
      // 清除所有可能存在的行内样式覆盖
      const allChapterContainers = document.querySelectorAll(
        '.chapter-content, #chapterContent, .seamless-chapter, ' +
        '.next-chapter-preview, .preview-chapter, .prev-chapter-preview, ' +
        '.loaded-chapter, .cached-chapter'
      );
      
      // 移除所有容器和内容元素的行内line-height样式
      allChapterContainers.forEach(container => {
        container.style.removeProperty('line-height');
        container.style.removeProperty('--line-height');
      });
      
      const allContentElements = document.querySelectorAll(
        '.content-paragraph, .highlight-text, .chapter-main-title, ' +
        '.chapter-seamless-spacing, .highlight-result'
      );
      
      allContentElements.forEach(element => {
        element.style.removeProperty('line-height');
      });
    }
    
    // 应用当前的字号和行间距设置 - 优化版确保所有元素样式一致
    function applyCurrentFontSettings() {
      // 从渲染变量系统获取字体设置
      const { fontSize, fontWeight } = window.renderVariables;
      
      // 更新全局CSS变量，确保所有元素都能继承这些设置
      document.documentElement.style.setProperty('--font-size', fontSize + 'px', 'important');
      document.documentElement.style.setProperty('--font-weight', fontWeight, 'important');
      
      // 更新章节内容的根字体大小和字重
      if (chapterContent) {
        chapterContent.style.setProperty('--font-size', fontSize + 'px', 'important');
        chapterContent.style.setProperty('--font-weight', fontWeight, 'important');
        chapterContent.style.fontSize = fontSize + 'px';
        chapterContent.style.fontWeight = fontWeight;
      }
      
      // 遍历所有章节容器并应用字体大小和字重样式
      const allChapterContainers = document.querySelectorAll('.chapter-content, .next-chapter-preview, .seamless-chapter, .preview-chapter, #chapterContent, .prev-chapter-preview, .loaded-chapter, .cached-chapter');
      allChapterContainers.forEach(container => {
        container.style.fontSize = fontSize + 'px';
        container.style.fontWeight = fontWeight;
        container.style.setProperty('--font-size', fontSize + 'px', 'important');
        container.style.setProperty('--font-weight', fontWeight, 'important');
      });
      
      // 应用字体大小和字重到所有正文元素
      const contentElements = document.querySelectorAll('.chapter-content p, .next-chapter-preview p, .seamless-chapter p, .preview-chapter p, .content-paragraph, .highlight-text, .seamless-chapter, .prev-chapter-preview p, .loaded-chapter p, .cached-chapter p, .text-content');
      contentElements.forEach(p => {
        p.style.setProperty('font-size', fontSize + 'px', 'important');
        p.style.setProperty('font-weight', fontWeight, 'important');
      });
      
      // 统一应用行间距设置
      applyLineHeightToDOM(window.renderVariables.lineHeight);
      
      // 统一应用页边距设置
      applyContentMarginsToDOM();
    }
    
    // 打开页边距设置对话框
    function openMarginSettingsDialog() {
      // 确保contentMargins对象存在并有默认值
      if (!window.renderVariables.contentMargins) {
        window.renderVariables.contentMargins = {
          left: 32,
          right: 32,
          top: 20,
          bottom: 76
        };
      }
      
      // 左右边距相等，取左侧值作为统一边距
      const margin = window.renderVariables.contentMargins.left;
      
      ModalSystem.createModal({
        id: 'marginSettingsDialog',
        title: '页边距设置',
        content: `
          <div class="margin-settings-dialog-content">
            <!-- 预览区域 -->
            <div class="margin-preview-section">
              <h3 style="margin:0 0 16px 0;font-size:16px;color:var(--text-color);font-weight:600;">实时预览</h3>
              <div class="margin-preview" style="padding:16px;background:var(--background-color-light);border:1px solid var(--border-color);border-radius:8px;">
                <div class="margin-preview-content" style="padding-left:${margin}px;padding-right:${margin}px;">
                  <p style="margin:10px 0;">这是页边距预览文本，左右边距均为${margin}px。</p>
                  <p style="margin:10px 0;">调整滑块可以实时查看阅读区域两侧间距的变化效果。</p>
                  <p style="margin:10px 0;">合适的页边距可以提高阅读舒适度，减少眼睛疲劳。</p>
                </div>
              </div>
            </div>
            
            <!-- 控制区域 -->
            <div class="margin-control-section">
              <h3 style="margin:16px 0 12px 0;font-size:16px;color:var(--text-color);font-weight:600;">调整页边距</h3>
              
              <!-- 统一边距控制（单个拖动条） -->
              <div style="margin-bottom:16px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                  <label style="font-size:14px;color:var(--text-color);font-weight:500;">左右边距</label>
                  <span id="marginValue">${margin}px</span>
                </div>
                <input type="range" id="marginSlider" min="0" max="100" step="4" value="${margin}" 
                       style="width:100%;height:6px;background:var(--border-color);border-radius:3px;outline:none;appearance:none;cursor:pointer;" 
                       oninput="updateMarginPreview(this.value);">
              </div>
              
              <!-- 预设按钮（更新为8、16、32、64） -->
              <h4 style="margin:16px 0 8px 0;font-size:14px;color:var(--text-color);font-weight:500;">常用预设</h4>
              <div class="margin-presets" style="display:flex;gap:8px;flex-wrap:wrap;">
                <button onclick="setMarginPreset('small')" 
                        class="preset-btn ${margin === 8 ? 'active' : ''}">窄边距 (8px)</button>
                <button onclick="setMarginPreset('medium')" 
                        class="preset-btn ${margin === 16 ? 'active' : ''}">适中边距 (16px)</button>
                <button onclick="setMarginPreset('large')" 
                        class="preset-btn ${margin === 32 ? 'active' : ''}">宽边距 (32px)</button>
                <button onclick="setMarginPreset('xlarge')" 
                        class="preset-btn ${margin === 64 ? 'active' : ''}">超宽边距 (64px)</button>
              </div>
            </div>
            
            <!-- 添加CSS样式 -->
            <style>
              .margin-settings-dialog-content {
                color: var(--text-color);
              }
              .margin-settings-dialog-content h3 {
                font-weight: 600;
                color: var(--text-color);
              }
              .preset-btn {
                padding: 6px 12px;
                border: 1px solid var(--border-color);
                border-radius: 6px;
                background: var(--background-color);
                color: var(--text-color);
                font-size: 13px;
                cursor: pointer;
                transition: all 0.2s;
                white-space: nowrap;
              }
              .preset-btn:hover {
                background: var(--hover-background);
                border-color: var(--accent-color);
              }
              .preset-btn.active {
                background: var(--accent-color);
                color: white;
                border-color: var(--accent-color);
              }
              .margin-preview-content {
                background: var(--background-color);
                border: 1px dashed var(--border-color);
                border-radius: 4px;
              }
            </style>
          </div>
        `,
        width: '480px',
        buttons: [
          {
            text: '取消',
            type: 'secondary'
          },
          {
            text: '确定',
            type: 'primary',
            onClick: function() {
              applyContentMargins();
            }
          }
        ],
        closeOnOverlayClick: true
      });
    }
    
    // 关闭页边距设置对话框
    function closeMarginSettingsDialog() {
      ModalSystem.closeModal('marginSettingsDialog');
    }
    
    // 更新页边距预览
    function updateMarginPreview(value) {
      const previewContent = document.querySelector('.margin-preview-content');
      const label = document.getElementById('marginValue');
      
      if (previewContent) {
        previewContent.style.paddingLeft = value + 'px';
        previewContent.style.paddingRight = value + 'px';
      }
      
      if (label) {
        label.textContent = value + 'px';
      }
    }
    
    // 设置页边距预设
    window.setMarginPreset = function(presetName) {
      let margin;
      
      switch(presetName) {
        case 'small':
          margin = 8;
          break;
        case 'medium':
          margin = 16;
          break;
        case 'large':
          margin = 32;
          break;
        case 'xlarge':
          margin = 64;
          break;
        default:
          margin = 32;
      }
      
      const marginSlider = document.getElementById('marginSlider');
      if (marginSlider) {
        marginSlider.value = margin;
        updateMarginPreview(margin);
      }
    }
    
    // 应用页边距设置
    function applyContentMargins() {
      const margin = parseInt(document.getElementById('marginSlider').value);
      
      // 更新全局渲染变量
      window.renderVariables.contentMargins.left = margin;
      window.renderVariables.contentMargins.right = margin;
      
      // 应用页边距到DOM
      applyContentMarginsToDOM();
      
      // 保存设置
      saveProgress();
      
      // 关闭对话框并显示提示
      closeMarginSettingsDialog();
      showToast(`页边距已设置为${margin}px`, 'success');
    }
    
    // 将页边距应用到DOM
    function applyContentMarginsToDOM() {
      // 确保contentMargins对象存在
      if (!window.renderVariables.contentMargins) {
        window.renderVariables.contentMargins = {
          left: 32,
          right: 32,
          top: 20,
          bottom: 76
        };
      }
      
      const { left, right, top, bottom } = window.renderVariables.contentMargins;
      
      // 更新CSS变量
      document.documentElement.style.setProperty('--content-margin-left', left + 'px', 'important');
      document.documentElement.style.setProperty('--content-margin-right', right + 'px', 'important');
      
      // 查找所有章节内容容器
      const chapterContainers = document.querySelectorAll('.chapter-content, #chapterContent, .seamless-chapter, .next-chapter-preview, .preview-chapter, .prev-chapter-preview, .loaded-chapter, .cached-chapter');
      
      chapterContainers.forEach(container => {
        // 应用页边距
        container.style.paddingLeft = left + 'px';
        container.style.paddingRight = right + 'px';
        
        // 保持原有的顶部和底部边距，但可以选择在这里也应用
        // container.style.paddingTop = top + 'px';
        // container.style.paddingBottom = bottom + 'px';
      });
    }

    // 手动输入行间距时联动滑块和预览
    window.onLineHeightInputChange = function(input) {
      let val = parseFloat(input.value);
      if (isNaN(val)) return;
      document.getElementById('lineHeightSlider').value = val;
      updateLineHeightPreview(val);
    }

    // 更新状态栏背景色的函数
    function updateStatusBarBackgroundColor(backgroundColor) {
      // 更新Android设备的状态栏背景色
      const themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (themeColorMeta) {
        themeColorMeta.setAttribute('content', backgroundColor);
      }
      
      // 更新iOS设备的状态栏样式
      const appleStatusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
      if (appleStatusBarMeta) {
        // 根据背景色亮度决定状态栏文字颜色
        const isDarkBackground = isDarkColor(backgroundColor);
        appleStatusBarMeta.setAttribute('content', isDarkBackground ? 'light-content' : 'dark-content');
      }
    }
    
    // 判断颜色是否为深色的辅助函数
    function isDarkColor(color) {
      // 如果color是undefined或不是字符串，返回默认值
      if (!color || typeof color !== 'string') {
        return true; // 默认返回深色背景，以便使用浅色文字
      }
      
      // 如果颜色是var()格式，尝试获取实际值
      if (color.startsWith('var(')) {
        const varName = color.slice(4, -1);
        const style = getComputedStyle(document.documentElement);
        color = style.getPropertyValue(varName).trim();
      }
      
      // 移除可能的#前缀
      color = color.replace('#', '');
      
      // 解析RGB值
      let r, g, b;
      if (color.length === 3) {
        // 缩写形式: #RGB
        r = parseInt(color[0] + color[0], 16);
        g = parseInt(color[1] + color[1], 16);
        b = parseInt(color[2] + color[2], 16);
      } else if (color.length === 6) {
        // 标准形式: #RRGGBB
        r = parseInt(color.substring(0, 2), 16);
        g = parseInt(color.substring(2, 4), 16);
        b = parseInt(color.substring(4, 6), 16);
      } else {
        // 默认使用白色
        return false;
      }
      
      // 使用相对亮度公式计算颜色亮度
      // 参考: https://www.w3.org/TR/WCAG20/#relativeluminancedef
      const luminance = 0.2126 * (r/255) + 0.7152 * (g/255) + 0.0722 * (b/255);
      
      // 亮度小于0.5的视为深色
      return luminance < 0.5;
    }
    
    // 主题设置相关函数
    function openThemeDialog() {
      // 确保isFollowSystemTheme变量存在，默认勾选跟随系统主题
      if (typeof window.renderVariables.isFollowSystemTheme === 'undefined') {
        window.renderVariables.isFollowSystemTheme = true;
      }
      
      // 确保当前主题不是sepia，如果是则回退到light
      if (currentTheme === 'sepia') {
        currentTheme = 'light';
        window.renderVariables.currentTheme = 'light';
      }
      
      const content = `
        <div class="theme-preview">
          <h3>当前主题预览</h3>
          <p>这是主题预览文字，展示当前的颜色搭配效果。您可以在这里看到文字颜色、背景色和主题色的组合。</p>
        </div>
        
        <div class="theme-options">
          <div class="theme-option ${!window.renderVariables.isFollowSystemTheme && currentTheme === 'light' ? 'active' : ''}" onclick="selectTheme('light')">
            <div class="theme-option-icon">☀️</div>
            <div class="theme-option-name">浅色主题</div>
          </div>
          <div class="theme-option ${!window.renderVariables.isFollowSystemTheme && currentTheme === 'dark' ? 'active' : ''}" onclick="selectTheme('dark')">
            <div class="theme-option-icon">🌙</div>
            <div class="theme-option-name">深色主题</div>
          </div>
        </div>
        
        <div class="follow-system-option" style="margin-top: 20px; padding: 15px; border-top: 1px solid var(--border-color);">
          <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
            <input type="checkbox" id="followSystemToggle" ${window.renderVariables.isFollowSystemTheme ? 'checked' : ''} style="width: 20px; height: 20px; cursor: pointer;">
            <span>跟随系统主题</span>
          </label>
          <p style="margin-top: 5px; color: var(--secondary-text-color); font-size: 14px;">开启后，阅读器将根据系统设置自动切换深色/浅色主题</p>
        </div>
        
        <div class="color-settings">
          <div class="color-setting">
            <label>文字颜色</label>
            <input type="color" id="textColorPicker" value="${textColor}" onchange="updateTextColor(this.value)">
            <div class="color-preview" id="textColorPreview" style="color: ${textColor}; background: ${backgroundColor};">文字预览</div>
          </div>
          <div class="color-setting">
            <label>背景颜色</label>
            <input type="color" id="backgroundColorPicker" value="${backgroundColor}" onchange="updateBackgroundColor(this.value)">
            <div class="color-preview" id="backgroundColorPreview" style="background: ${backgroundColor}; color: ${textColor};">背景预览</div>
          </div>
          <div class="color-setting">
            <label>主题色</label>
            <input type="color" id="accentColorPicker" value="${accentColor}" onchange="updateAccentColor(this.value)">
            <div class="color-preview" id="accentColorPreview" style="background: ${accentColor}; color: white;">主题色预览</div>
          </div>
        </div>
      `;
      
      ModalSystem.createModal({
        id: 'themeDialog',
        title: '主题设置',
        content: content,
        buttons: [
          {
            text: '取消',
            type: 'secondary',
            onClick: function() {}
          },
          {
            text: '确定',
            type: 'primary',
            onClick: function() { applyThemeSettings(); }
          }
        ],
        closeOnOverlayClick: true
      });
    }

    function closeThemeDialog() {
      ModalSystem.closeModal('themeDialog');
    }

    function selectTheme(theme) {
      // 选择主题时，关闭跟随系统开关
      window.renderVariables.isFollowSystemTheme = false;
      
      // 更新渲染变量系统中的主题设置
      window.renderVariables.currentTheme = theme;
      
      // 更新主题选项的激活状态
      document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
      });
      event.target.closest('.theme-option').classList.add('active');
      
      // 更新跟随系统开关状态
      const followSystemToggle = document.getElementById('followSystemToggle');
      if (followSystemToggle) {
        followSystemToggle.checked = false;
      }
      
      // 根据主题设置默认颜色，覆盖手动设置的颜色
      switch (theme) {
        case 'light':
          window.renderVariables.textColor = '#000000';
          window.renderVariables.backgroundColor = '#ffffff';
          window.renderVariables.accentColor = '#0c8ce9';
          break;
        case 'dark':
          window.renderVariables.textColor = '#ffffff';
          window.renderVariables.backgroundColor = '#000000';
          window.renderVariables.accentColor = '#4a9eff';
          break;
      }
      
      // 更新局部变量以同步渲染变量系统
      updateLocalRenderVariables();
      
      // 更新颜色选择器
      updateColorPickers();
      
      // 应用主题到对话框预览
      applyThemeToDialog();
      
      // 立即更新颜色预览div
      updateColorPreviews();
    }

    function updateTextColor(color) {
      // 更新渲染变量系统中的文字颜色
      window.renderVariables.textColor = color;
      updateColorPreviews();
      // 更新局部变量以同步渲染变量系统
      updateLocalRenderVariables();
    }

    function updateBackgroundColor(color) {
      // 更新渲染变量系统中的背景颜色
      window.renderVariables.backgroundColor = color;
      updateColorPreviews();
      // 更新局部变量以同步渲染变量系统
      updateLocalRenderVariables();
    }

    function updateAccentColor(color) {
      // 更新渲染变量系统中的主题色
      window.renderVariables.accentColor = color;
      updateColorPreviews();
      // 更新局部变量以同步渲染变量系统
      updateLocalRenderVariables();
    }

    function updateColorPickers() {
      const textPicker = document.getElementById('textColorPicker');
      const bgPicker = document.getElementById('backgroundColorPicker');
      const accentPicker = document.getElementById('accentColorPicker');
      
      // 从渲染变量系统获取颜色值
      const { textColor, backgroundColor, accentColor } = window.renderVariables;
      
      if (textPicker) textPicker.value = textColor;
      if (bgPicker) bgPicker.value = backgroundColor;
      if (accentPicker) accentPicker.value = accentColor;
    }

    function updateColorPreviews() {
      const textPreview = document.getElementById('textColorPreview');
      const bgPreview = document.getElementById('backgroundColorPreview');
      const accentPreview = document.getElementById('accentColorPreview');
      
      // 从渲染变量系统获取颜色值
      const { textColor, backgroundColor, accentColor } = window.renderVariables;
      
      // 确保颜色预览div始终使用当前的颜色值，无论是主题切换还是手动设置
      if (textPreview) {
        textPreview.style.color = textColor;
        textPreview.style.background = backgroundColor;
      }
      if (bgPreview) {
        bgPreview.style.background = backgroundColor;
        bgPreview.style.color = textColor;
      }
      if (accentPreview) {
        accentPreview.style.background = accentColor;
      }
    }

    function applyThemeToDialog() {
      const dialog = document.getElementById('themeDialog');
      if (dialog) {
        // 从渲染变量系统获取主题和颜色值
        const { textColor, backgroundColor, accentColor, currentTheme } = window.renderVariables;
        
        dialog.style.setProperty('--text-color', textColor);
        dialog.style.setProperty('--background-color', backgroundColor);
        dialog.style.setProperty('--dialog-bg', backgroundColor);
        dialog.style.setProperty('--accent-color', accentColor);
        dialog.style.setProperty('--border-color', currentTheme === 'dark' ? '#333333' : '#EEEEEE');
        dialog.style.setProperty('--sidebar-bg', currentTheme === 'dark' ? '#2a2a2a' : '#FAFAFA');
      }
    }

    function applyThemeSettings() {
      // 获取跟随系统开关状态
      const followSystemToggle = document.getElementById('followSystemToggle');
      if (followSystemToggle) {
        window.renderVariables.isFollowSystemTheme = followSystemToggle.checked;
      }
      
      // 从渲染变量系统获取主题值
      let currentTheme = window.renderVariables.currentTheme;
      let { textColor, backgroundColor, accentColor, isFollowSystemTheme } = window.renderVariables;
      
      // 如果开启了跟随系统主题，清除所有主题选项的active状态
      if (isFollowSystemTheme) {
        document.querySelectorAll('.theme-option').forEach(option => {
          option.classList.remove('active');
        });
      }
      
      // 如果开启了跟随系统主题，立即检测系统当前主题并更新currentTheme
      if (isFollowSystemTheme) {
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        const systemTheme = prefersDarkScheme.matches ? 'dark' : 'light';
        window.renderVariables.currentTheme = systemTheme;
        currentTheme = systemTheme;
        
        // 根据系统主题设置默认颜色
        switch (currentTheme) {
          case 'dark':
            window.renderVariables.textColor = '#ffffff';
            window.renderVariables.backgroundColor = '#000000';
            window.renderVariables.accentColor = '#4a9eff';
            break;
          case 'light':
          default:
            window.renderVariables.textColor = '#000000';
            window.renderVariables.backgroundColor = '#ffffff';
            window.renderVariables.accentColor = '#0c8ce9';
            break;
        }
        
        // 更新变量引用
        textColor = window.renderVariables.textColor;
        backgroundColor = window.renderVariables.backgroundColor;
        accentColor = window.renderVariables.accentColor;
      }
      
      // 应用主题到整个应用 - 设置data-theme属性
      document.documentElement.setAttribute('data-theme', currentTheme);
      
      // 将自定义颜色应用到全局CSS变量中
      document.documentElement.style.setProperty('--text-color', textColor);
      document.documentElement.style.setProperty('--background-color', backgroundColor);
      document.documentElement.style.setProperty('--accent-color', accentColor);
      
      // 更新状态栏背景色
      updateStatusBarThemeColor();
      
      // 保存主题设置到localStorage
      localStorage.setItem('readerFollowSystemTheme', isFollowSystemTheme);
      
      // 如果不是跟随系统，保存主题设置
      if (!isFollowSystemTheme) {
        localStorage.setItem('readerTheme', currentTheme);
      } else {
        // 如果是跟随系统，清除保存的主题设置，以便下次启动时跟随系统
        localStorage.removeItem('readerTheme');
      }
      
      localStorage.setItem('readerTextColor', textColor);
      localStorage.setItem('readerBackgroundColor', backgroundColor);
      localStorage.setItem('readerAccentColor', accentColor);
      
      // 更新局部变量以同步渲染变量系统
      updateLocalRenderVariables();
      
      // 重新渲染界面
      renderChapter();
      renderDirectory();
      renderFunctionContent();
      
      closeThemeDialog();
      showToast('主题设置已应用', 'success');
    }



    // 章节切换提醒toast函数
    let chapterToastTimer = null;
    function showChapterToast(title) {
      const toast = document.getElementById('chapterToast');
      if (chapterToastTimer) {
        clearTimeout(chapterToastTimer);
        chapterToastTimer = null;
      }
      toast.textContent = title;
      toast.style.display = 'block';
      chapterToastTimer = setTimeout(() => {
        toast.style.display = 'none';
      }, 2000);
    }

    // 响应式：窄屏时自动关闭侧栏，目录/更多栏全屏切换
    function isMobile() {
      return window.innerWidth <= 768;
    }
    function closeAllSidebars() {
      sidebarLeft.classList.remove('show', 'fullscreen');
      sidebarRight.classList.remove('show', 'fullscreen');
      // 恢复所有主内容区域显示
      const readingArea = document.querySelector('.reading-area');
      const searchContainer = document.querySelector('.search-main-container');
      if (readingArea) readingArea.classList.remove('hide-mobile');
      if (searchContainer) searchContainer.classList.remove('hide-mobile');
    }
    window.addEventListener('resize', function() {
      if (isMobile()) {
        closeAllSidebars();
      }
      
      // 在窗口大小变化时重新应用字体和行高设置，确保响应式体验一致
      // 使用防抖处理，避免短时间内重复触发
      if (window.resizeDebounceTimer) {
        clearTimeout(window.resizeDebounceTimer);
      }
      window.resizeDebounceTimer = setTimeout(function() {
        // 确保所有文本元素都使用统一的字体变量
        applyCurrentFontSettings();
        
        // 移除自动调整字体大小的逻辑，让用户能够完全控制字体大小设置
      }, 300); // 300ms防抖延迟
    });

    // 性能优化：页面初始化

    // 定期自动保存进度
    setInterval(function() {
      if (currentFileId && volData && volData.length > 0) {
        saveProgress();
      }
    }, 30000); // 每30秒自动保存一次
    
    // 页面关闭或刷新前保存进度
    window.addEventListener('beforeunload', function() {
      if (currentFileId && volData && volData.length > 0) {
        saveProgress();
      }
    });

    // 暴露全局函数
    window.resetSettings = resetSettings;
    window.goPrev = goPrev;
    window.goNext = goNext;
    window.toggleDirectory = toggleDirectory;
    window.toggleMore = toggleMore;
    window.switchToReading = switchToReading;
    window.switchToSearch = switchToSearch;
    window.switchFunctionTab = switchFunctionTab;
    window.toggleNameHighlight = toggleNameHighlightMaster;
    window.toggleDialogHighlight = toggleDialogHighlight;
    window.openNameDialog = openNameDialog;
    window.closeNameDialog = closeNameDialog;
    window.updateNamesFromDialog = updateNamesFromDialog;
    window.openThemeDialog = openThemeDialog;
    window.closeThemeDialog = closeThemeDialog;
    window.selectTheme = selectTheme;
    window.updateTextColor = updateTextColor;
    window.updateBackgroundColor = updateBackgroundColor;
    window.updateAccentColor = updateAccentColor;
    window.applyThemeSettings = applyThemeSettings;
    window.performSearch = performSearch;
    window.jumpToChapter = jumpToChapter;
    window.resetSettings = resetSettings;
    window.openFontSizeDialog = openFontSizeDialog;
    window.closeFontSizeDialog = closeFontSizeDialog;
    window.applyFontSize = applyFontSize;
    window.openLineHeightDialog = openLineHeightDialog;
    window.closeLineHeightDialog = closeLineHeightDialog;
    window.applyLineHeight = applyLineHeight;
    window.openParagraphSpacingDialog = openParagraphSpacingDialog;
    window.closeParagraphSpacingDialog = closeParagraphSpacingDialog;
    window.applyParagraphSpacing = applyParagraphSpacing;
    window.openMarginSettingsDialog = openMarginSettingsDialog;
    window.closeMarginSettingsDialog = closeMarginSettingsDialog;
    window.applyContentMargins = applyContentMargins;
    window.applyNameChangesImmediately = applyNameChangesImmediately;
    window.addEventListener('DOMContentLoaded', function() {
      // 检测系统主题偏好并设置初始主题
      checkSystemThemePreference();
      
      // 初始化状态栏背景色
      if (window.renderVariables) {
        updateStatusBarThemeColor();
      }
      
      // 检查系统主题偏好的函数
      function checkSystemThemePreference() {
        // 初始化isFollowSystemTheme变量，默认勾选跟随系统主题
        if (typeof window.renderVariables.isFollowSystemTheme === 'undefined') {
          window.renderVariables.isFollowSystemTheme = true;
          // 检查localStorage中是否有保存的跟随系统设置
          const savedFollowSystem = localStorage.getItem('readerFollowSystemTheme');
          if (savedFollowSystem) {
            window.renderVariables.isFollowSystemTheme = savedFollowSystem === 'true';
          }
        }
        
        // 获取系统主题偏好
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        // 检查本地存储中是否有保存的主题设置
        const savedTheme = localStorage.getItem('readerTheme');
        
        // 设置主题和颜色的函数
        function setThemeAndColors(theme) {
          window.renderVariables.currentTheme = theme;
          
          // 根据主题设置默认颜色
          switch (theme) {
            case 'dark':
              window.renderVariables.textColor = '#ffffff';
              window.renderVariables.backgroundColor = '#000000';
              window.renderVariables.accentColor = '#4a9eff';
              break;
            case 'light':
            default:
              window.renderVariables.textColor = '#000000';
              window.renderVariables.backgroundColor = '#ffffff';
              window.renderVariables.accentColor = '#0c8ce9';
              break;
          }
          
          // 应用主题到DOM
          document.documentElement.setAttribute('data-theme', theme);
          
          // 将自定义颜色应用到全局CSS变量中
          document.documentElement.style.setProperty('--text-color', window.renderVariables.textColor);
          document.documentElement.style.setProperty('--background-color', window.renderVariables.backgroundColor);
          document.documentElement.style.setProperty('--accent-color', window.renderVariables.accentColor);
          
          // 更新状态栏背景色
          updateStatusBarThemeColor();
          
          // 更新局部变量以同步渲染变量系统
          updateLocalRenderVariables();
        }
        
        // 如果启用了跟随系统，忽略保存的主题设置
        if (window.renderVariables.isFollowSystemTheme) {
          const theme = prefersDarkScheme.matches ? 'dark' : 'light';
          setThemeAndColors(theme);
        } else if (savedTheme) {
          setThemeAndColors(savedTheme);
        } else {
          // 检测系统主题偏好
          const theme = prefersDarkScheme.matches ? 'dark' : 'light';
          setThemeAndColors(theme);
        }
        
        // 添加系统主题变化监听器
        prefersDarkScheme.addEventListener('change', function(e) {
          if (window.renderVariables.isFollowSystemTheme) {
            const newTheme = e.matches ? 'dark' : 'light';
            setThemeAndColors(newTheme);
            // 重新渲染界面以应用新主题
            renderChapter();
            renderDirectory();
            renderFunctionContent();
            // 不需要保存到localStorage，因为是跟随系统
          }
        });
      }
      
      // 性能监控
      const performanceMonitor = {
        searchTimes: [],
        renderTimes: [],
        
        startTimer: function(type) {
          return performance.now();
        },
        
        endTimer: function(type, startTime) {
          const duration = performance.now() - startTime;
          this[type + 'Times'].push(duration);
          
          // 只保留最近10次记录
          if (this[type + 'Times'].length > 10) {
            this[type + 'Times'].shift();
          }
          
          return duration;
        },
        
        getAverageTime: function(type) {
          const times = this[type + 'Times'];
          if (times.length === 0) return 0;
          return times.reduce((sum, time) => sum + time, 0) / times.length;
        },
        
        // 内存使用监控
        getMemoryUsage: function() {
          if (performance.memory) {
            return {
              used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
              total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
              limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
            };
          }
          return null;
        },
        
        // 检查内存使用情况
        checkMemoryUsage: function() {
          const memory = this.getMemoryUsage();
          if (memory && memory.used > memory.limit * 0.8) {
            console.warn('内存使用率过高:', memory.used + 'MB / ' + memory.limit + 'MB');
            // 清理缓存
            searchCache.clear();
            renderCache.clear();
            // 强制垃圾回收
            if (window.gc) window.gc();
          }
        }
      };
      
      // 暴露性能监控到全局
      window.performanceMonitor = performanceMonitor;
      
      // 导航和底部翻页点击弹出/关闭功能
      let isNavVisible = false; // 默认隐藏
      let navToggleTimeout = null;
      
      function toggleNavVisibility() {
        const topNav = document.querySelector('.top-nav');
        const chapterFooter = document.querySelector('.chapter-footer');
        
        if (!topNav || !chapterFooter) return;
        
        isNavVisible = !isNavVisible;
        
        if (isNavVisible) {
          topNav.classList.remove('hidden');
          chapterFooter.classList.remove('hidden');
        } else {
          topNav.classList.add('hidden');
          chapterFooter.classList.add('hidden');
        }
      }
      
      function showNav() {
        const topNav = document.querySelector('.top-nav');
        const chapterFooter = document.querySelector('.chapter-footer');
        
        if (!topNav || !chapterFooter) return;
        
        isNavVisible = true;
        topNav.classList.remove('hidden');
        chapterFooter.classList.remove('hidden');
      }
      
      function hideNav() {
        const topNav = document.querySelector('.top-nav');
        const chapterFooter = document.querySelector('.chapter-footer');
        
        if (!topNav || !chapterFooter) return;
        
        isNavVisible = false;
        topNav.classList.add('hidden');
        chapterFooter.classList.add('hidden');
      }
      
      // 绑定章节内容点击事件的函数（可重复调用）
      function bindChapterContentClick() {
        const chapterContentEl = document.getElementById('chapterContent');
        if (chapterContentEl) {
          // 移除可能存在的旧监听器（通过克隆方式）
          chapterContentEl.removeEventListener('click', handleChapterContentClick);
          // 添加新的监听器
          chapterContentEl.addEventListener('click', handleChapterContentClick);
        }
      }
      
      // 章节内容点击处理函数
      function handleChapterContentClick(e) {
        // 排除文本选择和链接点击
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) return;
        
        // 排除点击笔记相关元素
        if (e.target.closest('.note-highlight') || e.target.closest('.note-popup')) return;
        
        toggleNavVisibility();
      }
      
      // 暴露绑定函数到全局，以便在其他地方调用
      window.bindChapterContentClick = bindChapterContentClick;
      
      // 初始化UI元素（延迟执行，确保DOM完全加载）
      setTimeout(() => {
        initializeUIElements();
        // 默认隐藏导航和底部翻页
        hideNav();
        
        // 点击章节内容区域切换导航显示
        bindChapterContentClick();
        
        // 点击导航栏或底部翻页时保持显示
        document.querySelector('.top-nav')?.addEventListener('click', function(e) {
          showNav();
        });
        
        document.querySelector('.chapter-footer')?.addEventListener('click', function(e) {
          showNav();
        });
      }, 100);
      
      // 暴露全局函数
      window.toggleNavVisibility = toggleNavVisibility;
      window.showNav = showNav;
      window.hideNav = hideNav;
      
      // 使用事件委托优化事件监听
      document.addEventListener('click', function(e) {
        const target = e.target;
        
        // 搜索按钮点击
        if (target.closest('#searchBtn')) {
          const startTime = performanceMonitor.startTimer('search');
          performSearch();
          performanceMonitor.endTimer('search', startTime);
        }
        
        // 其他按钮点击事件可以在这里统一处理
      });
      
      // 优化滚动事件 - 减少处理频率
      // 检测是否滚动到底部的函数
      function isScrolledToBottom(element) {
        // 在人名高亮更新期间，始终返回false，防止触发自动加载
        if (window.renderVariables.isNameHighlightUpdateInProgress) {
          return false;
        }
        return element.scrollHeight - element.scrollTop <= element.clientHeight + 50; // 50px的缓冲区域
      }
      
      // 检测是否滚动到顶部的函数
      function isScrolledToTop(element) {
        // 在人名高亮更新期间，始终返回false，防止触发自动加载
        if (window.renderVariables.isNameHighlightUpdateInProgress) {
          return false;
        }
        return element.scrollTop <= 50; // 50px的缓冲区域
      }
      
      // 检测分页区是否被隐藏
      function isChapterFooterHidden() {
        const chapterFooter = document.querySelector('.chapter-footer');
        return !chapterFooter || chapterFooter.classList.contains('footer-disabled') || chapterFooter.classList.contains('hidden');
      }
      
      // 当前加载的章节缓存，最多保存2个章节
      // 全局的章节加载缓存
      
      // 当前加载的章节缓存，最多保存2个章节
      // 全局的章节加载缓存
      
      // 无缝加载上一章的函数 - 暴露为全局函数
      window.loadPrevChapterSeamlessly = function() {
        // 先更新局部变量以确保使用最新的设置
        updateLocalRenderVariables();
        
        if (currentIndex <= 0) {
          showToast('已到底');
          return;
        }
        
        const prevIndex = currentIndex - 1;
        
        // 检查是否已经加载过这个章节
        if (loadedChapters.includes(prevIndex)) return;
        
        const prevChapter = flatChapters[prevIndex];
        
        // 最多保留2个章节
        if (loadedChapters.length >= 2) {
            const oldestChapterIndex = loadedChapters.shift();
            // 移除旧章节的标题和段落
            const chapterElements = document.querySelectorAll(`[data-chapter-index="${oldestChapterIndex}"]`);
            chapterElements.forEach(element => element.remove());
            
            // 移除对应的章节间留白
            const spacingElements = document.querySelectorAll('.chapter-seamless-spacing');
            if (spacingElements.length > 1) {
                spacingElements[0].remove(); // 移除第一个留白
            }
        }
        
        // 添加章节间留白，使用与阅读页一级标题一致的样式
        const spacing = document.createElement('div');
        spacing.className = 'chapter-seamless-spacing';
        spacing.style.textAlign = 'left'; // 与阅读页一级标题一致的左对齐
        spacing.style.color = 'var(--text-color)'; // 与阅读页一级标题一致的文本颜色
        spacing.style.opacity = '1'; // 不透明度设为1，与阅读页一级标题一致
        spacing.style.padding = '100px 0 0 0'; // 调整内边距，增加章节间距
        spacing.style.fontSize = '20px'; // 与阅读页一级标题一致的字体大小
        spacing.style.fontWeight = '700'; // 与阅读页一级标题一致的字重
        spacing.textContent = prevChapter.title; // 直接显示章节标题，不添加分隔符
        spacing.dataset.chapterIndex = prevIndex;
        
        // 保存当前滚动位置
        const currentScrollTop = chapterContent.scrollTop;
        const currentScrollHeight = chapterContent.scrollHeight;
        
        // 先添加章节间留白到chapterContent的开头
        if (chapterContent.firstChild) {
          chapterContent.insertBefore(spacing, chapterContent.firstChild);
        } else {
          chapterContent.appendChild(spacing);
        }
        
        // 处理段落内容
        const paragraphs = prevChapter.content.split(/\n+/);
        
        // 记录插入的段落数量，用于计算插入高度
        let insertedParagraphs = 0;
        
        // 创建临时文档片段以提高性能
        const fragment = document.createDocumentFragment();
        
        paragraphs.forEach((paragraph, index) => {
          if (paragraph.trim()) {
            const pDiv = document.createElement('div');
            pDiv.className = 'content-paragraph';
            pDiv.setAttribute('data-paragraph-index', index);
            pDiv.setAttribute('data-chapter-index', prevIndex);
            
            // 应用当前的字体大小设置，确保人名高亮不会改变字号
            pDiv.style.fontSize = window.renderVariables.fontSize + 'px';
            
            let highlightedText = paragraph;
            
            // 应用对话高亮（引号内内容）
            if (window.renderVariables.isDialogHighlightEnabled) {
              // 确保使用正确的颜色值
              const currentDialogColor = window.renderVariables.dialogHighlightColor || '#999999';
              
              // 正确处理自定义颜色
              if (currentDialogColor.startsWith('#')) {
                // 自定义颜色，直接使用
                document.documentElement.style.setProperty('--dialog-highlight-color', currentDialogColor);
              } else {
                // 预设颜色，使用对应的CSS变量
                document.documentElement.style.setProperty('--dialog-highlight-color', `var(--dialog-highlight-${currentDialogColor})`);
              }
              
              // 使用当前选择的高亮类型
              const highlightType = window.renderVariables.dialogHighlightType || 'underline';
              // 使用统一的正则表达式变量以保持一致性
              const prefix = window.renderVariables.dialogPrefix || '“';
              const suffix = window.renderVariables.dialogSuffix || '”';
              highlightedText = highlightedText.replace(window.dialogRegex, function(match, content) {
                return prefix + '<span class="highlight-dialog ' + highlightType + '">' + escapeHTML(content) + '</span>' + suffix;
              });
            }
            
            // 应用人名高亮
            if (isNameHighlightEnabled && currentNames.length > 0) {
              highlightedText = highlightNamesInText(highlightedText);
            }
            
            pDiv.innerHTML = highlightedText;
            fragment.appendChild(pDiv);
            insertedParagraphs++;
          }
        });
        
        // 将临时文档片段添加到chapterContent的开头（在spacing之后）
        if (chapterContent.firstChild) {
          chapterContent.insertBefore(fragment, chapterContent.firstChild.nextSibling);
        } else {
          chapterContent.appendChild(fragment);
        }
        
        // 应用当前的字体大小和行间距设置 - applyCurrentFontSettings内部已包含applyContentMarginsToDOM调用
        applyCurrentFontSettings();
        
        // 强制应用行间距和段落间距设置到所有章节
        // 使用统一的行间距应用机制
        applyLineHeightToDOM(window.renderVariables.lineHeight);
        // 统一应用段落间距设置
        applyParagraphSpacingToDOM(window.renderVariables.paragraphSpacing);
        
        // 计算新添加内容的高度
        const newScrollHeight = chapterContent.scrollHeight;
        const addedContentHeight = newScrollHeight - currentScrollHeight;
        
        // 保持用户当前浏览位置不变
        // 使用setTimeout确保DOM完全渲染后再设置滚动位置
        setTimeout(() => {
          chapterContent.scrollTop = currentScrollTop + addedContentHeight;
        }, 0);
        
        // 更新章节缓存
        loadedChapters.unshift(prevIndex);
        
        // 更新当前章节索引
        currentIndex = prevIndex;
        
        // 更新UI状态
        updateProgress();
        renderFunctionContent();
        updateChapterJumpUI();
        
        // 重新渲染目录以高亮当前章节
        renderDirectory();
        
        // 在左右翻页模式下，不进行多章节缓存和加载
        const isTraditionalTurning = window.renderVariables.isTraditionalPageTurningEnabled;
        if (isTraditionalTurning) {
          // 清除所有已加载的章节
          loadedChapters = [];
          return;
        }
        
        // 只保留最近的2个章节
        if (loadedChapters.length > 2) {
          const oldestChapterIndex = loadedChapters.shift();
          // 移除旧章节的标题和段落
          const chapterElements = document.querySelectorAll(`[data-chapter-index="${oldestChapterIndex}"]`);
          chapterElements.forEach(element => element.remove());
          
          // 移除对应的章节间留白
          const spacingElements = document.querySelectorAll('.chapter-seamless-spacing');
          if (spacingElements.length > 1) {
            spacingElements[0].remove(); // 移除第一个留白
          }
        }
      }
      
      // 无缝加载下一章的函数 - 暴露为全局函数
    window.loadNextChapterSeamlessly = function() {
        // 先更新局部变量以确保使用最新的设置
        updateLocalRenderVariables();
        
        // 确保获取最新的章节内容容器
        const chapterContent = document.getElementById('chapterContent');
        if (!chapterContent) {
          console.error('找不到章节内容容器');
          return;
        }
        
        if (currentIndex >= flatChapters.length - 1) {
          showToast('已到底');
          return;
        }
        
        const nextIndex = currentIndex + 1;
        
        // 检查是否已经加载过这个章节
        if (loadedChapters.includes(nextIndex)) return;
        
        const nextChapter = flatChapters[nextIndex];
        
        // 最多保留2个章节
        if (loadedChapters.length >= 2) {
            const oldestChapterIndex = loadedChapters.shift();
            // 移除旧章节的标题和段落
            const chapterElements = document.querySelectorAll(`[data-chapter-index="${oldestChapterIndex}"]`);
            chapterElements.forEach(element => element.remove());
            
            // 移除对应的章节间留白
            const spacingElements = document.querySelectorAll('.chapter-seamless-spacing');
            if (spacingElements.length > 1) {
                spacingElements[0].remove(); // 移除第一个留白
            }
        }
        
        // 添加章节间留白，使用与阅读页一级标题一致的样式
        const spacing = document.createElement('div');
        spacing.className = 'chapter-seamless-spacing';
        spacing.style.textAlign = 'left'; // 与阅读页一级标题一致的左对齐
        spacing.style.color = 'var(--text-color)'; // 与阅读页一级标题一致的文本颜色
        spacing.style.opacity = '1'; // 不透明度设为1，与阅读页一级标题一致
        spacing.style.padding = '100px 0 0 0'; // 调整内边距，增加章节间距
        spacing.style.fontSize = '20px'; // 与阅读页一级标题一致的字体大小
        spacing.style.fontWeight = '700'; // 与阅读页一级标题一致的字重
        spacing.textContent = nextChapter.title; // 直接显示章节标题，不添加分隔符
        spacing.dataset.chapterIndex = nextIndex;
        chapterContent.appendChild(spacing);
        
        // 处理段落内容
        const paragraphs = nextChapter.content.split(/\n+/);
        
        paragraphs.forEach((paragraph, index) => {
          if (paragraph.trim()) {
            const pDiv = document.createElement('div');
            pDiv.className = 'content-paragraph';
            pDiv.setAttribute('data-paragraph-index', index);
            pDiv.setAttribute('data-chapter-index', nextIndex);
            
            let highlightedText = paragraph;
            
            // 应用对话高亮（引号内内容）
            if (window.renderVariables.isDialogHighlightEnabled) {
              // 确保使用正确的颜色值
              const currentDialogColor = window.renderVariables.dialogHighlightColor || '#999999';
              
              // 正确处理自定义颜色
              if (currentDialogColor.startsWith('#')) {
                // 自定义颜色，直接使用
                document.documentElement.style.setProperty('--dialog-highlight-color', currentDialogColor);
              } else {
                // 预设颜色，使用对应的CSS变量
                document.documentElement.style.setProperty('--dialog-highlight-color', `var(--dialog-highlight-${currentDialogColor})`);
              }
              
              // 使用当前选择的高亮类型
              const highlightType = window.renderVariables.dialogHighlightType || 'underline';
              highlightedText = highlightedText.replace(new RegExp(escapeRegExp(window.renderVariables.dialogPrefix) + '([^' + escapeRegExp(window.renderVariables.dialogSuffix) + ']+)' + escapeRegExp(window.renderVariables.dialogSuffix), 'g'), function(match, content) {
                return window.renderVariables.dialogPrefix + '<span class="highlight-dialog ' + highlightType + '">' + escapeHTML(content) + '</span>' + window.renderVariables.dialogSuffix;
              });
            }
            
            // 应用人名高亮
            if (isNameHighlightEnabled && currentNames.length > 0) {
              highlightedText = highlightNamesInText(highlightedText);
            }
            
            pDiv.innerHTML = highlightedText;
            chapterContent.appendChild(pDiv);
          }
        });
        
        // 应用当前的字体大小和行间距设置 - applyCurrentFontSettings内部已包含applyContentMarginsToDOM调用
        applyCurrentFontSettings();
        
        // 更新章节缓存
        loadedChapters.push(nextIndex);
        
        // 更新当前章节索引
        currentIndex = nextIndex;
        
        // 更新UI状态
        updateProgress();
        renderFunctionContent();
        updateChapterJumpUI();
        
        // 重新渲染目录以高亮当前章节
        renderDirectory();
        
        // 在左右翻页模式下，不进行多章节缓存和加载
      const isTraditionalTurning = window.renderVariables.isTraditionalPageTurningEnabled;
      if (isTraditionalTurning) {
        // 清除所有已加载的章节
        loadedChapters = [];
        return;
      }
      
      // 只保留最近的2个章节
      if (loadedChapters.length > 2) {
        const oldestChapterIndex = loadedChapters.shift();
        // 移除旧章节的标题和段落
        const chapterElements = document.querySelectorAll(`[data-chapter-index="${oldestChapterIndex}"]`);
        chapterElements.forEach(element => element.remove());
        
        // 移除对应的章节间留白
        const spacingElements = document.querySelectorAll('.chapter-seamless-spacing');
        if (spacingElements.length > 1) {
          spacingElements[0].remove(); // 移除第一个留白
        }
      }
    }
    
    // 手动加载下一章和删除前一章功能已移除，以优化用户体验
    // 相关按钮已从功能页面删除
    
      
      // 添加滚动监听事件，当滚动到底部时自动加载下一章，滚动到顶部时自动加载上一章（仅在全屏模式下生效）
      let loadTimer = null;
      chapterContent.addEventListener('scroll', function() {
        // 使用防抖避免频繁触发
        clearTimeout(loadTimer);
        
        // 在人名高亮更新期间或滚动恢复期间，不触发自动加载章节
        if (window.renderVariables.isNameHighlightUpdateInProgress || isScrollingRestored) {
          return;
        }
        
        // 当滚动到底部且在自动上下翻页模式下时触发自动加载下一章
        if (window.renderVariables.isSeamlessScrollingEnabled && isScrolledToBottom(this)) {
          loadTimer = setTimeout(() => {
            loadNextChapterSeamlessly();
          }, 300);
        }
        // 当滚动到顶部且在自动上下翻页模式下时触发自动加载上一章
        else if (window.renderVariables.isSeamlessScrollingEnabled && isScrolledToTop(this)) {
          loadTimer = setTimeout(() => {
            loadPrevChapterSeamlessly();
          }, 300);
        }
      });
      
      // 预加载和缓存优化（仅在HTTPS环境下注册ServiceWorker）
      if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        navigator.serviceWorker.register('/sw.js').catch(console.error);
      }
      
      // 内存管理：定期清理缓存和监控
      setInterval(() => {
        const now = Date.now();
        const cacheEntries = Array.from(searchCache.entries());
        
        // 清理过期缓存
        for (const [key, value] of cacheEntries) {
          if (now - value.timestamp > CACHE_EXPIRE_TIME) {
            searchCache.delete(key);
          }
        }
        
        // 如果缓存仍然过大，删除最旧的条目
        if (searchCache.size > MAX_CACHE_SIZE) {
          const sortedEntries = cacheEntries
            .filter(([key, value]) => now - value.timestamp <= CACHE_EXPIRE_TIME)
            .sort((a, b) => a[1].timestamp - b[1].timestamp);
          
          const toDelete = sortedEntries.slice(0, searchCache.size - MAX_CACHE_SIZE);
          toDelete.forEach(([key]) => searchCache.delete(key));
        }
        
        // 清理渲染缓存
        renderCache.clear();
        
        // 检查内存使用情况
        performanceMonitor.checkMemoryUsage();
        
        // 强制垃圾回收（如果可用）
        if (window.gc) {
          window.gc();
        }
      }, 30000); // 每30秒清理一次
    });
    
    // 初始化UI元素的函数
    function initializeUIElements() {
      // 初始化导航图标
      initializeNavIcons();
      
      // 目录栏顶部书名和更换按钮UI优化
      const sidebarHeader = document.querySelector('.sidebar-header');
      const bookReupload = document.querySelector('.book-reupload');
      const bookTitle = document.querySelector('.book-title');
      
      if (sidebarHeader) {
        sidebarHeader.style.cursor = 'pointer';
        sidebarHeader.style.background = 'var(--sidebar-bg)';
        sidebarHeader.style.transition = 'background 0.2s';
        sidebarHeader.onmouseover = function() {
          this.style.background = 'var(--chapter-item-hover)';
          if (bookReupload) bookReupload.style.color = 'var(--text-color)';
        };
        sidebarHeader.onmouseout = function() {
          this.style.background = 'var(--sidebar-bg)';
          if (bookReupload) bookReupload.style.color = 'var(--nav-text)';
        };
        sidebarHeader.onclick = switchToBooksPage;
      }
      
      // 书名和更换按钮样式
      if (bookTitle) {
        bookTitle.style.fontWeight = '700';
        bookTitle.style.color = 'var(--text-color)';
      }
      
      if (bookReupload) {
        bookReupload.style.background = 'none';
        bookReupload.style.border = 'none';
        bookReupload.style.fontSize = '13px';
        bookReupload.style.padding = '0';
        bookReupload.style.marginLeft = '8px';
        bookReupload.style.color = 'var(--nav-text)';
        bookReupload.style.transition = 'color 0.2s';
      }
      

    }
    
    // 初始化导航图标
    function initializeNavIcons() {
      // 定义SVG图标路径
      const iconPaths = {
        list: 'M4 6h16M4 12h16M4 18h16',
        book: 'M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zM6 8h12M6 12h12',
        search: 'M15 15l6 6M10 17a7 7 0 100-14 7 7 0 000 14z',
        more: 'M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z',
        left: 'M15 19l-7-7 7-7',
        right: 'M9 5l7 7-7 7',
        back: 'M19 12H5M12 19l-7-7 7-7',
        backToChapter: 'M12 19V5M5 12l7-7 7 7',
        manage: 'M3 17v2h6v-2H3zM3 5v2h6V5H3zm10 0v2h8V5h-8zm0 16v-2h8v-2h-8v2zM3 12h18v-2H3v2z',
        delete: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
        copy: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z',
        fix: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
        read: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
      };
      
      // 设置图标
      const setIcon = (id, path) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = createSvgIcon(path, 'none', 'currentColor', 2);
      };
      
      // 导航栏图标
      setIcon('iconDirectory', iconPaths.list);
      setIcon('iconReading', iconPaths.book);
      setIcon('iconSearch', iconPaths.search);
      setIcon('iconMore', iconPaths.more);
      
      // 分页区图标
      setIcon('iconPrev', iconPaths.left);
      setIcon('iconNext', iconPaths.right);
      
      // 目录页图标
      setIcon('iconBack', iconPaths.back);
      setIcon('iconBackToChapter', iconPaths.backToChapter);
      
      // 书架页图标
      setIcon('iconManage', iconPaths.manage);
      
      // 导入检查页面图标
      setIcon('iconImportBack', iconPaths.back);
      setIcon('iconImportDelete', iconPaths.delete);
      setIcon('iconCopyFormat', iconPaths.copy);
      setIcon('iconCopyStructure', iconPaths.list);
      setIcon('iconFixEncoding', iconPaths.fix);
      
      // 书籍详情页面图标
      setIcon('iconDetailBack', iconPaths.back);
      setIcon('iconDetailRead', iconPaths.read);
    }
    
    // 创建SVG图标的辅助函数
    function createSvgIcon(pathD, fill, stroke, strokeWidth) {
      return `<svg viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
        <path d="${pathD}"/>
      </svg>`;
    }
    
    // 1. 分页输入框和跳转按钮高度一致
    chapterJumpInput.style.height = '32px';
    chapterJumpBtn.style.height = '32px';
    chapterJumpBtn.style.fontSize = '14px';
    chapterJumpInput.style.fontSize = '14px';
    chapterJumpInput.style.padding = '0 8px';
    chapterJumpBtn.style.padding = '0 12px'; // 间距改为0px
    chapterJumpBtn.style.marginLeft = '0px'; // 间距改为0px
    chapterJumpBtn.style.marginRight = '0px'; // 间距改为0px

    // 2. 文件名更换栏为整行热区，样式与章节卡片一致
    // 注意：UI初始化已移至 initializeUIElements() 函数中
    // 3. 移动端/窄屏点击阅读能正确显示内容页
    // (switchToReading函数已在顶部导航交互修正部分定义)

    // ===== 搜索页面UI静态结构（参考5号文件风格） =====
    // 搜索模式下渲染搜索主面板
    function renderSearchPage() {
      // 主体容器
      const searchContainer = document.createElement('div');
      searchContainer.className = 'search-main-container';

      // 搜索栏
      const searchBar = document.createElement('div');
      searchBar.style.cssText = `
        align-self: stretch;
        padding: 16px;
        background: var(--background-color);
        border-bottom: 1px var(--border-color) solid;
        justify-content: flex-start;
        align-items: center;
        gap: 8px;
        display: inline-flex;
        flex-wrap: wrap;
        align-content: center;
        flex-shrink: 0;
      `;
      
      // 章节范围
      const rangeGroup = document.createElement('div');
      rangeGroup.style.cssText = `
        flex: 1 1 0;
        min-width: 200px;
        padding-top: 8px;
        padding-bottom: 8px;
        justify-content: flex-start;
        align-items: center;
        gap: 8px;
        display: flex;
      `;
      rangeGroup.innerHTML = `
        <div style="opacity: 0.50; color: var(--text-color); font-size: 14px; font-family: Inter; font-weight: 700; white-space: nowrap;">筛选</div>
        <input id="searchStartChapter" type="number" min="1" placeholder="起始" style="flex: 1 1 0; min-width: 60px; opacity: 0.30; justify-content: center; display: flex; flex-direction: column; color: var(--text-color); font-size: 14px; font-family: Inter; font-weight: 400; border: none; outline: none; background: transparent; padding: 4px 8px; text-align: center;" />
        <div style="opacity: 0.30; justify-content: center; display: flex; flex-direction: column; color: var(--text-color); font-size: 14px; font-family: Inter; font-weight: 400; white-space: nowrap;">—</div>
        <input id="searchEndChapter" type="number" min="1" placeholder="结束" style="flex: 1 1 0; min-width: 60px; opacity: 0.30; justify-content: center; display: flex; flex-direction: column; color: var(--text-color); font-size: 14px; font-family: Inter; font-weight: 400; border: none; outline: none; background: transparent; padding: 4px 8px; text-align: center;" />
      `;
      
      // 关键词
      const keywordGroup = document.createElement('div');
      keywordGroup.style.cssText = `
        flex: 1 1 0;
        min-width: 200px;
        padding-top: 8px;
        padding-bottom: 8px;
        justify-content: flex-start;
        align-items: center;
        gap: 8px;
        display: flex;
      `;
      keywordGroup.innerHTML = `
        <div style="opacity: 0.50; color: var(--text-color); font-size: 14px; font-family: Inter; font-weight: 700;">搜索</div>
        <input id="searchKeyword" type="text" placeholder="请输入关键词" style="text-align: left; justify-content: center; display: flex; flex-direction: column; color: var(--text-color); opacity: 0.3; font-size: 14px; font-family: Inter; font-weight: 400; border: none; outline: none; background: transparent; flex: 1; padding: 4px 8px; transition: opacity 0.2s; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;" />
      `;
      
      // 搜索按钮
      const searchBtn = document.createElement('button');
      searchBtn.id = 'searchBtn';
      searchBtn.style.cssText = `
        padding-left: 16px;
        padding-right: 16px;
        padding-top: 8px;
        padding-bottom: 8px;
        background: var(--accent-color);
        border-radius: 999px;
        justify-content: center;
        align-items: center;
        display: flex;
        border: none;
        cursor: pointer;
        transition: background 0.2s;
        margin-left: 8px;
      `;
      searchBtn.innerHTML = `<div style="color: white; font-size: 12px; font-family: Inter; font-weight: 500;">搜索</div>`;
      
      // 重置按钮
      const resetBtn = document.createElement('button');
      resetBtn.id = 'resetBtn';
      resetBtn.style.cssText = `
        padding-left: 16px;
        padding-right: 16px;
        padding-top: 8px;
        padding-bottom: 8px;
        background: var(--chapter-item-hover);
        border-radius: 999px;
        justify-content: center;
        align-items: center;
        display: flex;
        border: 1px solid var(--border-color);
        cursor: pointer;
        transition: background 0.2s;
        margin-left: 8px;
      `;
      resetBtn.innerHTML = `<div style="color: var(--nav-text); font-size: 12px; font-family: Inter; font-weight: 500;">重置</div>`;
      
      // 确保搜索按钮事件绑定
      searchBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('搜索按钮被点击，触发搜索');
        console.log('当前搜索关键词:', document.getElementById('searchKeyword').value);
        console.log('当前章节数据:', flatChapters);
        
        // 防抖处理：避免多次点击显示重复提示
        if (!searchBtn.toastShown) {
          const keyword = document.getElementById('searchKeyword').value.trim();
          if (!keyword) {
            showToast('请输入关键词', 'warning');
            searchBtn.toastShown = true;
            setTimeout(() => {
              searchBtn.toastShown = false;
            }, 2000); // 2秒内不重复显示
            return;
          }
        }
        
        performSearch();
      };
      
      // 添加搜索按钮的hover效果
      searchBtn.addEventListener('mouseenter', function() {
        this.style.background = 'var(--accent-color)';
      });
      searchBtn.addEventListener('mouseleave', function() {
        this.style.background = 'var(--accent-color)';
      });
      
      // 添加重置按钮的hover效果
      resetBtn.addEventListener('mouseenter', function() {
        this.style.background = 'var(--nav-hover)';
      });
      resetBtn.addEventListener('mouseleave', function() {
        this.style.background = 'var(--chapter-item-hover)';
      });
      
          // 重置按钮点击事件
    resetBtn.onclick = function() {
      document.getElementById('searchKeyword').value = '';
      document.getElementById('searchStartChapter').value = '';
      document.getElementById('searchEndChapter').value = '';
      
      // 清空搜索结果
      const statContainer = document.getElementById('searchResultStat');
      const listContainer = document.getElementById('searchResultList');
      if (statContainer) statContainer.innerHTML = '';
      if (listContainer) listContainer.innerHTML = '';
      
      // 防抖处理：避免多次点击显示重复提示
      if (!resetBtn.toastShown) {
        showToast('搜索条件已重置', 'info');
        resetBtn.toastShown = true;
        setTimeout(() => {
          resetBtn.toastShown = false;
        }, 2000); // 2秒内不重复显示
      }
    };
      
      // 组装搜索栏
      searchBar.appendChild(rangeGroup);
      
      // 修改关键词组样式，让它填充剩余空间
      keywordGroup.style.flex = '1 1 0';
      keywordGroup.style.minWidth = '0';
      
      // 按钮组容器
      const btnGroup = document.createElement('div');
      btnGroup.className = 'btnGroup';
      btnGroup.style.cssText = `
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 8px;
        margin-top: 8px;
        width: 100%;
      `;
      btnGroup.appendChild(searchBtn);
      btnGroup.appendChild(resetBtn);
      
      // 创建搜索行容器
      const searchRow = document.createElement('div');
      searchRow.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 100%;
      `;
      
      // 将输入框和按钮组放入不同行
      searchRow.appendChild(keywordGroup);
      searchRow.appendChild(btnGroup);
      searchBar.appendChild(searchRow);
      
      // 结果统计
      const resultStat = document.createElement('div');
      resultStat.id = 'searchResultStat';
      resultStat.style.cssText = `
        width: 100%;
        max-width: 700px;
        padding-top: 32px;
        padding-bottom: 16px;
        padding-left: 32px;
        padding-right: 32px;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 16px;
        display: flex;
        visibility: visible;
        flex-shrink: 0;
      `;
      // 初始显示空内容
      resultStat.innerHTML = '';
      
      // 结果列表
      const resultList = document.createElement('div');
      resultList.id = 'searchResultList';
      resultList.style.cssText = `
        align-self: stretch;
        padding-left: 32px;
        padding-right: 32px;
        padding-top: 16px;
        padding-bottom: 16px;
        background: var(--background-color);
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 16px;
        display: flex;
        overflow-y: auto;
        min-height: 0;
        flex: 1;
      `;
      // 初始显示空状态
      resultList.innerHTML = '';
      
      // 组装主容器
      searchContainer.appendChild(searchBar);
      searchContainer.appendChild(resultStat);
      searchContainer.appendChild(resultList);
      
      // 渲染到主内容区
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        // 插入到sidebar-right前，保证右侧更多栏在右边
        const sidebarRight = document.getElementById('sidebarRight');
        if (sidebarRight && sidebarRight.parentNode === mainContent) {
          mainContent.insertBefore(searchContainer, sidebarRight);
        } else {
          mainContent.appendChild(searchContainer);
        }
        
        // 确保搜索页面正确布局但默认隐藏
        searchContainer.style.display = 'none'; // 默认隐藏
        searchContainer.style.flexDirection = 'column';
        searchContainer.style.height = '100%';
        
        // 验证DOM插入是否成功
        if (searchContainer.parentNode !== mainContent) {
          console.error('搜索容器插入失败');
        }
      } else {
        console.error('找不到主内容区域');
      }
      
      // 绑定回车键搜索和输入框样式
      const searchKeyword = document.getElementById('searchKeyword');
      const searchStartChapter = document.getElementById('searchStartChapter');
      const searchEndChapter = document.getElementById('searchEndChapter');
      
      // 绑定回车键搜索
      searchKeyword.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          performSearch();
        }
      });
      
      // 添加章节筛选验证
      searchStartChapter.addEventListener('input', function() {
        const start = parseInt(this.value) || 0;
        const end = parseInt(searchEndChapter.value) || flatChapters.length;
        
        if (start > 0 && end > 0 && start > end) {
          this.style.borderColor = '#ff4444';
          this.title = '起始章节不能大于结束章节';
        } else {
          this.style.borderColor = '';
          this.title = '';
        }
      });
      
      searchEndChapter.addEventListener('input', function() {
        const start = parseInt(searchStartChapter.value) || 1;
        const end = parseInt(this.value) || flatChapters.length;
        
        if (start > 0 && end > 0 && start > end) {
          this.style.borderColor = '#ff4444';
          this.title = '结束章节不能小于起始章节';
        } else {
          this.style.borderColor = '';
          this.title = '';
        }
      });
      
      // 搜索按钮事件已经在上面绑定过了，这里不需要重复绑定
      
      // 输入框焦点样式
      [searchKeyword, searchStartChapter, searchEndChapter].forEach(input => {
        input.addEventListener('focus', function() {
          this.style.opacity = '1';
          this.style.color = 'var(--text-color)';
        });
        input.addEventListener('blur', function() {
          if (!this.value) {
            this.style.opacity = '0.30';
          }
        });
        input.addEventListener('input', function() {
          if (this.value) {
            this.style.opacity = '1';
          } else {
            this.style.opacity = '0.30';
          }
        });
        // 添加鼠标悬浮效果
        input.addEventListener('mouseenter', function() {
          if (!this.value) {
            this.style.opacity = '0.6';
          }
        });
        input.addEventListener('mouseleave', function() {
          if (!this.value) {
            this.style.opacity = '0.30';
          }
        });
      });
    }
    
    // 搜索事件绑定已在renderSearchPage函数中完成，无需重复绑定

    // 性能优化：防抖搜索
    function performSearch() {
      // 清除之前的防抖定时器
      if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
      }
      
      // 设置新的防抖定时器
      searchDebounceTimer = setTimeout(() => {
        performSearchInternal();
      }, SEARCH_DEBOUNCE_DELAY);
    }
    
    // 优化：减少搜索防抖延迟（已在上面更新）
    
    // 实际执行搜索的函数
    async function performSearchInternal() {
      // 检查是否有章节数据
      if (!flatChapters || flatChapters.length === 0) {
        // 尝试从localStorage加载最近打开的文件
        try {
          const lastFileInfo = localStorage.getItem('reader_last_file');
          if (lastFileInfo) {
            const fileInfo = JSON.parse(lastFileInfo);
            const fileId = fileInfo.id;
            
            showToast('正在加载缓存文件...', 'info');
            
            // 尝试从localStorage加载文件内容
            let fileContent = localStorage.getItem('reader_file_content_' + fileId);
            
            if (fileContent) {
              // 解析文件内容
              volData = parseText(fileContent);
              
              // 扁平化章节数据
              flatChapters = flatten(volData);
              
              if (flatChapters && flatChapters.length > 0) {
                showToast('成功加载缓存文件，正在搜索...', 'success');
              } else {
                showToast('缓存文件解析失败，请重新上传书籍文件', 'warning');
                return;
              }
            } else {
              showToast('缓存文件不存在，请重新上传书籍文件', 'warning');
              return;
            }
          } else {
            showToast('请先上传书籍文件', 'warning');
            return;
          }
        } catch (e) {
          console.error('加载缓存文件失败:', e);
          showToast('加载缓存文件失败，请重新上传书籍文件', 'error');
          return;
        }
      }
      
      const keyword = document.getElementById('searchKeyword')?.value.trim();
      const start = parseInt(document.getElementById('searchStartChapter')?.value) || 1;
      const end = parseInt(document.getElementById('searchEndChapter')?.value) || flatChapters.length;

      if (!keyword) {
        // 这里不再显示提示，因为搜索按钮点击时已经处理了
        return;
      }

      // 🔍 修复：每次搜索前清除之前的状态，确保结果准确
      console.log('🔍 开始新搜索，清除之前的状态');
      searchResults = {};
      searchResultsData = {};
      allSearchResults = [];
      searchResultsDisplayed = 0;

      // 如果正在搜索，取消之前的搜索
      if (isSearching && searchAbortController) {
        searchAbortController.abort();
      }

      // 设置搜索状态
      isSearching = true;
      searchAbortController = new AbortController();

      // 显示搜索等待效果
      showSearchLoading(keyword);

      // 检查缓存 - 修复：使用更精确的缓存键值
      const validStart = Math.max(1, Math.min(start, flatChapters.length));
      const validEnd = Math.max(validStart, Math.min(end, flatChapters.length));
      const cacheKey = `${keyword}_${validStart}_${validEnd}_${flatChapters.length}`;
      const now = Date.now();
      const cachedResult = searchCache.get(cacheKey);
      
      // 🔍 临时禁用缓存，强制重新搜索以调试问题
      const forceRefresh = true; // 设置为 true 强制重新搜索
      
      if (!forceRefresh && cachedResult && (now - cachedResult.timestamp) < CACHE_EXPIRE_TIME) {
        console.log('使用缓存结果:', cacheKey);
        
        // 缓存结果设置
        searchResults = cachedResult.data;
        searchResultsData = cachedResult.data;
        
        // 强制修复数据一致性
        fixSearchResultsData();
        
        // 缓存结果状态验证
        const searchKeys = Object.keys(searchResults || {}).length;
        const dataKeys = Object.keys(searchResultsData || {}).length;
        const allResultsLength = allSearchResults.length;
        
        hideSearchLoading();
        renderSearchResults(keyword, cachedResult.data);
        isSearching = false;
        return;
      }

      if (forceRefresh) {
        console.log('🔍 强制重新搜索，忽略缓存');
      }

      try {
        // 使用异步搜索，避免阻塞主线程
        const chapterResults = await performSearchInChunks(keyword, validStart, validEnd);
        
        // 检查是否被取消
        if (searchAbortController.signal.aborted) {
          console.log('搜索被取消');
          return;
        }
        
        // 统一设置搜索数据变量
        searchResults = chapterResults;
        searchResultsData = chapterResults;
        
        // 强制修复数据一致性
        fixSearchResultsData();
        
        // 搜索完成后状态验证
        const searchKeys = Object.keys(searchResults || {}).length;
        const dataKeys = Object.keys(searchResultsData || {}).length;
        const allResultsLength = allSearchResults.length;
        const chapterKeys = Object.keys(chapterResults || {}).length;
        
        // 缓存结果
        searchCache.set(cacheKey, {
          data: chapterResults,
          timestamp: now
        });
        
        console.log('搜索结果已缓存:', cacheKey);
        hideSearchLoading();
        renderSearchResults(keyword, chapterResults);
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('搜索被取消');
          return;
        }
        console.error('搜索出错:', error);
        hideSearchLoading();
        showToast('搜索出错，请重试', 'error');
      } finally {
        isSearching = false;
      }
    }
    
    // 显示搜索等待效果
    function showSearchLoading(keyword) {
      const listContainer = document.getElementById('searchResultList');
      if (!listContainer) return;
      
      listContainer.innerHTML = `
        <div class="search-loading">
          <div class="search-loading-spinner"></div>
          <div class="search-loading-text">
            <div style="margin-bottom: 8px;">正在搜索 "${keyword}"</div>
            <div style="opacity: 0.7; font-size: 12px;">请稍等...</div>
            <div style="opacity: 0.5; font-size: 11px; margin-top: 8px;">优化搜索中，减少内存占用</div>
          </div>
          <button onclick="cancelSearch()" style="margin-top: 16px; padding: 8px 16px; background: var(--chapter-item-hover); border: 1px solid var(--border-color); border-radius: 4px; cursor: pointer; font-size: 12px; color: var(--nav-text);">取消搜索</button>
        </div>
      `;
      
      // 确保容器有足够的高度来居中显示
      listContainer.style.display = 'flex';
      listContainer.style.alignItems = 'center';
      listContainer.style.justifyContent = 'center';
      listContainer.style.minHeight = '300px';
    }
    
    // 隐藏搜索等待效果
    function hideSearchLoading() {
      const listContainer = document.getElementById('searchResultList');
      if (listContainer) {
        const loadingElement = listContainer.querySelector('.search-loading');
        if (loadingElement) {
          loadingElement.remove();
        }
        // 恢复容器的正常布局
        listContainer.style.display = 'flex';
        listContainer.style.alignItems = 'flex-start';
        listContainer.style.justifyContent = 'flex-start';
        listContainer.style.minHeight = 'auto';
      }
    }
    
    // 分块搜索，避免阻塞主线程
    function performSearchInChunks(keyword, start, end) {
      const chapterResults = {};
      const chunkSize = 5; // 减少每次处理的章节数量
      const maxResultsPerChapter = 50; // 增加每个章节的最大结果数
      let totalResults = 0;
      
      // 修复：确保章节索引在有效范围内
      const validStart = Math.max(1, Math.min(start, flatChapters.length));
      const validEnd = Math.max(validStart, Math.min(end, flatChapters.length));
      
      console.log(`搜索范围: ${validStart}-${validEnd}, 总章节数: ${flatChapters.length}`);
      
      // 🔍 修复：使用同步搜索，避免递归调用导致的结果重复
      for (let i = validStart - 1; i < validEnd && i < flatChapters.length; i++) {
        const chapter = flatChapters[i];
        if (chapter && chapter.content && chapter.content.includes(keyword)) {
            // 查找所有匹配位置
            let searchIndex = 0;
            const excerpts = [];
            const positions = [];
          let chapterResultsCount = 0;
            
            while ((searchIndex = chapter.content.indexOf(keyword, searchIndex)) !== -1) {
            if (chapterResultsCount >= maxResultsPerChapter) break;
            
            // 提取包含关键词的上下文（减少上下文长度）
            const contextStart = Math.max(0, searchIndex - 30);
            const contextEnd = Math.min(chapter.content.length, searchIndex + keyword.length + 30);
            let excerpt = chapter.content.substring(contextStart, contextEnd);
            
            // 高亮关键词 - 改为蓝色字体
            excerpt = excerpt.replace(keyword, `<span style="color: #0c8ce9; font-weight: bold;">${keyword}</span>`);
              
              excerpts.push(excerpt);
              positions.push(searchIndex);
            
            chapterResultsCount++;
            totalResults++;
              
              // 移动到下一个位置继续搜索
              searchIndex += keyword.length;
            }
            
            if (excerpts.length > 0) {
            chapterResults[i] = {
              chapterIndex: i,
                chapterTitle: chapter.title,
                excerpts: excerpts,
                positions: positions
              };
            }
          }
        }
        
      console.log(`搜索完成，找到 ${totalResults} 个结果，涉及 ${Object.keys(chapterResults).length} 个章节`);
      return chapterResults;
    }
    
    // 简单的让出主线程函数
    function yield() {
      return new Promise(resolve => setTimeout(resolve, 0));
    }
    
    // 异步分块搜索函数（如果需要真正的异步处理）
    async function performSearchInChunksAsync(keyword, start, end) {
      const chapterResults = {};
      const chunkSize = 10; // 每次处理10章
      const maxResultsPerChapter = 50; // 每个章节最多50个结果
      
      for (let i = start - 1; i < end && i < flatChapters.length; i += chunkSize) {
        const chunkEnd = Math.min(i + chunkSize, end, flatChapters.length);
        
        for (let j = i; j < chunkEnd; j++) {
          const chapter = flatChapters[j];
          if (chapter.content.includes(keyword)) {
            // 查找所有匹配位置
            let searchIndex = 0;
            const excerpts = [];
            const positions = [];
            let chapterResultsCount = 0;
            
            while ((searchIndex = chapter.content.indexOf(keyword, searchIndex)) !== -1) {
              if (chapterResultsCount >= maxResultsPerChapter) break;
              
              // 提取包含关键词的上下文
              const start = Math.max(0, searchIndex - 50);
              const end = Math.min(chapter.content.length, searchIndex + keyword.length + 50);
              let excerpt = chapter.content.substring(start, end);
              
              // 高亮关键词 - 改为蓝色字体
              excerpt = excerpt.replace(keyword, `<span style="color: #0c8ce9; font-weight: bold;">${keyword}</span>`);
              
              excerpts.push(excerpt);
              positions.push(searchIndex);
              
              chapterResultsCount++;
              
              // 移动到下一个位置继续搜索
              searchIndex += keyword.length;
            }
            
            if (excerpts.length > 0) {
              chapterResults[j] = {
                chapterIndex: j,
                chapterTitle: chapter.title,
                excerpts: excerpts,
                positions: positions
              };
            }
          }
        }
        
        // 让出主线程
        if (i + chunkSize < end && i + chunkSize < flatChapters.length) {
          await yield();
        }
      }

      return chapterResults;
    }

    // 搜索结果渲染（参考5号文件风格，直接显示结果）
    // 极简搜索结果数据结构
    let searchResultsData = {}; // 唯一主数据源：存储完整的搜索结果数据
    let allSearchResults = []; // 扁平化的结果数组（从searchResultsData派生）
    let searchResultsDisplayed = 0; // 已显示的结果项数量
    
    function renderSearchResults(keyword, chapterResults) {
      try {
        // 空值 fallback 逻辑
        if (!chapterResults || Object.keys(chapterResults).length === 0) {
          if (searchResultsData && Object.keys(searchResultsData).length > 0) {
            chapterResults = searchResultsData;
          } else if (searchResults && Object.keys(searchResults).length > 0) {
            chapterResults = searchResults;
          }
        }
        
        const statContainer = document.getElementById('searchResultStat');
        const listContainer = document.getElementById('searchResultList');

        if (!statContainer || !listContainer) {
          renderSearchPage();
          const newStatContainer = document.getElementById('searchResultStat');
          const newListContainer = document.getElementById('searchResultList');
          
          if (!newStatContainer || !newListContainer) {
            return;
          }
        }

        // 强制显示容器
        statContainer.style.display = 'flex';
        statContainer.style.visibility = 'visible';
        listContainer.style.display = 'flex';
        listContainer.style.visibility = 'visible';

        const chapterKeys = Object.keys(chapterResults);

        // 搜索结果为空判断逻辑
        const hasValidResults = chapterKeys.some(k =>
          chapterResults[k] && Array.isArray(chapterResults[k].excerpts) && chapterResults[k].excerpts.length > 0
        );
        
        if (chapterKeys.length === 0 || !hasValidResults) {
          statContainer.innerHTML = `
            <div style="opacity: 0.70; color: var(--text-color); font-size: 13px; font-family: Inter; font-weight: 400;">搜索结果：0项</div>
          `;
          listContainer.innerHTML = '<div style="text-align:center;color:rgba(0,0,0,0.50);font-size:14px;font-family:Inter;font-weight:400;padding:40px 0;display:flex;justify-content:center;align-items:center;height:100%;">没有找到匹配的内容</div>';
          return;
        }

        // 存储完整数据用于分批加载
        searchResultsData = chapterResults;
        searchResultsDisplayed = 0;
        
        // 调用修复函数构建allSearchResults
        fixSearchResultsData();

        // 更新统计信息
        const displayCount = Math.min(SEARCH_RESULTS_PER_PAGE, allSearchResults.length);
        statContainer.innerHTML = `
          <div style="opacity: 0.70; color: var(--text-color); font-size: 13px; font-family: Inter; font-weight: 400;">搜索结果：${allSearchResults.length}项，${chapterKeys.length}章（已显示${displayCount}项）</div>
        `;

        // 开始分批渲染
        renderSearchResultsBatch(keyword);
        
      } catch (error) {
        const listContainer = document.getElementById('searchResultList');
        if (listContainer) {
          listContainer.innerHTML = `
            <div style="color: red; padding: 20px; text-align: center;">
              搜索结果渲染失败
              <br><br>
              <button onclick="performSearch()" style="padding: 8px 16px; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer;">
                重试搜索
              </button>
            </div>
          `;
        }
      }
    }
    
    // 分批渲染搜索结果（按结果项数量）- 性能优化版
    // 缓存DOM查询结果和常用CSS属性
    let searchResultListCache = null;
    let renderPerformanceStats = {
      totalRenders: 0,
      totalTime: 0,
      avgTime: 0
    };
    
    // 创建结果项的工厂函数 - 使用闭包缓存DOM操作
    const createResultItemFactory = (() => {
      // 缓存常用的样式字符串
      const resultItemStyle = `
        align-self: stretch;
        padding: 16px;
        background: var(--sidebar-bg);
        border-radius: 8px;
        justify-content: center;
        align-items: center;
        gap: 16px;
        display: inline-flex;
        cursor: pointer;
      `;
      
      const contentDivStyle = `
        flex: 1 1 0;
        color: var(--text-color);
        font-size: var(--font-size, 16px);
        font-family: Inter;
        font-weight: 400;
        line-height: var(--line-height, 1.5);
      `;
      
      return function(chapterIndex, excerptIndex, excerpt, keyword) {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.style.cssText = resultItemStyle;
        item.dataset.chapterIndex = chapterIndex;
        item.dataset.excerptIndex = excerptIndex;
        
        // 只存储必要的数据，避免DOM元素上存储过多数据
        item.dataset.keyword = keyword;
        
        const contentDiv = document.createElement('div');
        contentDiv.style.cssText = contentDivStyle;
        
        // 优化正则表达式使用 - 复用正则对象
        const regex = new RegExp(escapeRegExp(keyword), 'gi');
        const highlightedExcerpt = excerpt.replace(
          regex,
          '<span style="color: var(--accent-color); font-size: var(--font-size, 16px); font-family: Inter; font-weight: 700; line-height: var(--line-height, 1.5);">$&</span>'
        );
        contentDiv.innerHTML = highlightedExcerpt;
        
        item.appendChild(contentDiv);
        return item;
      };
    })();
    
    // 初始化事件委托（只执行一次）
    function initSearchResultsEventDelegation() {
      const listContainer = document.getElementById('searchResultList');
      if (!listContainer) return;
      
      // 点击事件委托
      listContainer.addEventListener('click', function(e) {
        const target = e.target.closest('.search-result-item');
        if (target) {
          e.preventDefault();
          e.stopPropagation();
          
          const chapterIndex = parseInt(target.dataset.chapterIndex);
          const excerptIndex = parseInt(target.dataset.excerptIndex);
          const keyword = target.dataset.keyword;
          
          // 点击防抖处理
          if (listContainer.clickTimeout) {
            clearTimeout(listContainer.clickTimeout);
          }
          
          listContainer.clickTimeout = setTimeout(() => {
            // 保存搜索状态
            currentSearchKeyword = keyword;
            currentSearchIndex = excerptIndex;
            isInSearchMode = true;
            
            // 确保搜索结果数据的一致性
            fixSearchResultsData();
            
            // 使用新的跳转函数
            jumpToKeyword(chapterIndex, excerptIndex);
          }, 300);
        }
      });
      
      // 鼠标悬停事件委托
      listContainer.addEventListener('mouseenter', function(e) {
        const target = e.target.closest('.search-result-item');
        if (target) {
          target.style.background = 'var(--chapter-item-hover)';
        }
      });
      
      listContainer.addEventListener('mouseleave', function(e) {
        const target = e.target.closest('.search-result-item');
        if (target) {
          target.style.background = 'var(--sidebar-bg)';
        }
      });
    }
    
    // 确保事件委托只初始化一次
    let searchEventDelegationInitialized = false;
    
    function renderSearchResultsBatch(keyword) {
      const startTime = performance.now();
      
      // 缓存DOM查询结果
      if (!searchResultListCache) {
        searchResultListCache = document.getElementById('searchResultList');
        if (!searchResultListCache) {
          console.error('搜索结果容器未找到');
          return;
        }
        
        // 初始化事件委托
        if (!searchEventDelegationInitialized) {
          initSearchResultsEventDelegation();
          searchEventDelegationInitialized = true;
        }
      }
      
      const listContainer = searchResultListCache;
      
      // 清空容器（只在第一批时）
      if (searchResultsDisplayed === 0) {
        listContainer.innerHTML = '';
        // 重置性能统计
        renderPerformanceStats = {
          totalRenders: 0,
          totalTime: 0,
          avgTime: 0
        };
      }
      
      // 计算本次要渲染的结果项
      const startIndex = searchResultsDisplayed;
      const endIndex = Math.min(startIndex + SEARCH_RESULTS_PER_PAGE, allSearchResults.length);
      const itemsToRender = allSearchResults.slice(startIndex, endIndex);
      
      // 使用 DocumentFragment 优化DOM操作
      const fragment = document.createDocumentFragment();
      
      // 使用 Map 缓存已创建的章节标题
      const chapterTitlesMap = new Map();
      
      // 按章节分组渲染
      itemsToRender.forEach(item => {
        // 如果是新章节，创建章节标题
        if (!chapterTitlesMap.has(item.chapterIndex)) {
          // 查找对应的章节，检查是否是前言章节
          const chapter = flatChapters[item.chapterIndex];
          // 前言章节显示为0，其他章节显示为章节索引
          const chapterNum = chapter && chapter.isPreface ? 0 : item.chapterIndex;
          
          // 创建章节标题
          const chapterTitle = document.createElement('div');
          chapterTitle.setAttribute('data-chapter', item.chapterIndex);
          chapterTitle.style.cssText = `
            align-self: stretch;
            color: var(--text-color);
            font-size: 14px;
            font-family: Inter;
            font-weight: 700;
            opacity: 0.70;
          `;
          chapterTitle.textContent = `第${chapterNum}章：${item.chapterTitle}`;
          
          chapterTitlesMap.set(item.chapterIndex, chapterTitle);
          fragment.appendChild(chapterTitle);
        }
        
        // 创建搜索结果项 - 使用工厂函数提高性能
        const resultItem = createResultItemFactory(item.chapterIndex, item.excerptIndex, item.excerpt, keyword);
        fragment.appendChild(resultItem);
      });
      
      // 一次性更新DOM
      listContainer.appendChild(fragment);
      
      // 更新已显示的结果项数量
      searchResultsDisplayed = endIndex;
      
      // 性能统计
      const renderTime = performance.now() - startTime;
      renderPerformanceStats.totalRenders++;
      renderPerformanceStats.totalTime += renderTime;
      renderPerformanceStats.avgTime = renderPerformanceStats.totalTime / renderPerformanceStats.totalRenders;
      
      console.log(`搜索结果渲染批次完成:`, {
        batch: renderPerformanceStats.totalRenders,
        items: itemsToRender.length,
        time: renderTime.toFixed(2),
        avgTime: renderPerformanceStats.avgTime.toFixed(2),
        totalDisplayed: searchResultsDisplayed
      });
      
      // 如果还有更多结果项，显示加载更多按钮
      if (endIndex < allSearchResults.length) {
        // 检查是否已存在加载更多按钮
        if (!listContainer.querySelector('.load-more-btn')) {
          const loadMoreBtn = document.createElement('div');
          loadMoreBtn.className = 'load-more-btn';
          loadMoreBtn.style.cssText = `
            align-self: stretch;
            padding: 16px;
            background: var(--background-color);
            border: 1px var(--border-color) solid;
            border-radius: 4px;
            justify-content: center;
            align-items: center;
            display: flex;
            cursor: pointer;
            color: var(--text-color);
            font-size: 14px;
            font-family: Inter;
            font-weight: 500;
            transition: all 0.2s;
            margin: 16px 0;
            height: 56px;
            box-sizing: border-box;
          `;
          loadMoreBtn.innerHTML = `加载更多 (${endIndex}/${allSearchResults.length})`;
          
          loadMoreBtn.onclick = function() {
            this.remove();
            
            // 使用 requestAnimationFrame 优化渲染
            requestAnimationFrame(() => {
              // 修复数据一致性
              fixSearchResultsData();
              
              // 使用当前活跃的搜索关键词，确保数据正确
              const currentKeyword = currentSearchKeyword || keyword;
              renderSearchResultsBatch(currentKeyword);
              
              // 更新统计信息
              const chapterKeys = Object.keys(searchResultsData);
              const displayCount = Math.min(searchResultsDisplayed, allSearchResults.length);
              updateSearchResultStats(currentKeyword, allSearchResults.length, chapterKeys, displayCount);
            });
          };
          
          listContainer.appendChild(loadMoreBtn);
        }
      } else {
        // 如果已经加载完所有结果项，显示"已到底"
        if (!listContainer.querySelector('.search-end-text')) {
          const endText = document.createElement('div');
          endText.className = 'search-end-text';
          endText.style.cssText = `
            align-self: stretch;
            text-align: center;
            color: var(--text-color);
            opacity: 0.5;
            font-size: 14px;
            font-family: Inter;
            font-weight: 400;
          `;
          endText.textContent = '已到底';
          listContainer.appendChild(endText);
        }
      }
    }
    

    

    
    // 创建搜索结果项（参考5号文件风格）
    // ⚠️ 注意：此函数已被 createResultItemFactory 替代，用于性能优化
    // 保留此函数仅为了向后兼容性，新代码请使用工厂函数
    function createSearchResultItem(chapterIndex, excerptIndex, excerpt, keyword) {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.style.cssText = `
        align-self: stretch;
        padding: 16px;
        background: var(--sidebar-bg);
        border-radius: 8px;
        justify-content: center;
        align-items: center;
        gap: 16px;
        display: inline-flex;
        cursor: pointer;
      `;
      
      // 添加悬浮效果
      item.addEventListener('mouseenter', function() {
        this.style.background = 'var(--chapter-item-hover)';
      });
      item.addEventListener('mouseleave', function() {
        this.style.background = 'var(--sidebar-bg)';
      });
      
      // 优化点击响应，避免重复触发
      let clickTimeout = null;
      item.addEventListener('click', function(e) {
        if (clickTimeout) return; // 防止重复点击
        
        clickTimeout = setTimeout(() => {
          clickTimeout = null;
        }, 300);
        
        e.preventDefault();
        e.stopPropagation();
        console.log('点击搜索结果项:', { chapterIndex, excerptIndex, keyword });
        
        // 保存搜索状态
        currentSearchKeyword = keyword;
        currentSearchIndex = excerptIndex;
        isInSearchMode = true;
        
        // 使用新的跳转函数
        jumpToKeyword(parseInt(chapterIndex), excerptIndex);
      });
      
      const contentDiv = document.createElement('div');
      contentDiv.style.cssText = `
        flex: 1 1 0;
        color: var(--text-color);
        font-size: 16px;
        font-family: Inter;
        font-weight: 400;
        line-height: 32px;
      `;
      
      // 确保关键词高亮显示（使用蓝色字体色）
      const highlightedExcerpt = excerpt.replace(
        new RegExp(escapeRegExp(keyword), 'gi'),
        `<span style="color: var(--accent-color); font-size: var(--font-size, 16px); font-family: Inter; font-weight: 700; line-height: var(--line-height, 1.5);">$&</span>`
      );
      contentDiv.innerHTML = highlightedExcerpt;
      
      item.appendChild(contentDiv);

      return item;
    }

    // 跳转到指定章节 - 优化：确保章节切换时正确应用全局渲染变量
    function jumpToChapter(index) {
      if (index < 0 || index >= flatChapters.length) return;
      // 先更新局部变量以确保使用最新的设置
      updateLocalRenderVariables();
      
      // 清空已加载章节数组，确保从新位置开始加载
      loadedChapters = [];
      // 将当前章节添加到已加载数组
      loadedChapters.push(index);
      
      currentIndex = index;
      renderChapter();
      renderDirectory();
      updateProgress();
      renderFunctionContent();
      updateChapterJumpUI();
      switchToReading(); // 切回阅读模式
      chapterContent.scrollTop = 0;
    }

    // 跳转到指定关键词 - 优化：确保章节切换时正确应用全局渲染变量
    function jumpToKeyword(chapterIndex, keywordIndex) {
      console.log('跳转到关键词:', { chapterIndex, keywordIndex });
      
      // 确保flatChapters数组不为空
      if (flatChapters.length === 0) {
        console.log('flatChapters为空，尝试重新加载当前文件');
        // 如果当前有打开的文件，尝试重新加载
        if (currentFileId && currentFileName) {
          loadCachedFile(currentFileId, currentFileName).then(() => {
            // 重新加载后再次调用jumpToKeyword
            if (chapterIndex >= 0 && chapterIndex < flatChapters.length) {
              jumpToKeyword(chapterIndex, keywordIndex);
            }
          });
        }
        return;
      }
      
      if (chapterIndex < 0 || chapterIndex >= flatChapters.length) {
        console.log('章节索引超出范围');
        return;
      }
      
      // 先更新局部变量以确保使用最新的设置
      updateLocalRenderVariables();
      
      // 保存搜索前的章节索引
      if (typeof window.searchPreChapterIndex === 'undefined' && currentIndex !== chapterIndex) {
        window.searchPreChapterIndex = currentIndex;
        console.log('保存搜索前章节索引:', window.searchPreChapterIndex);
      }
      
      // 临时保存并关闭人名高亮和对话高亮 - 提前保存以确保在任何渲染前生效
      window.tempNameHighlightState = isNameHighlightEnabled;
      window.tempDialogHighlightState = isDialogHighlightEnabled;
      isNameHighlightEnabled = false;
      isDialogHighlightEnabled = false;
      
      // 强制更新window.renderVariables中的值，确保渲染函数能正确获取禁用状态
      if (window.renderVariables) {
        window.renderVariables.isNameHighlightEnabled = false;
        window.renderVariables.isDialogHighlightEnabled = false;
      } else {
        // 如果window.renderVariables不存在，创建它
        window.renderVariables = {
          isNameHighlightEnabled: false,
          isDialogHighlightEnabled: false
        };
      }
      
      // 更新当前章节索引
      currentIndex = chapterIndex;
      
      // 设置搜索状态
      isInSearchMode = true;
      currentSearchIndex = keywordIndex;
      
      // 同时更新window.renderVariables中的isInSearchMode
      if (window.renderVariables) {
        window.renderVariables.isInSearchMode = true;
      } else {
        // 如果window.renderVariables不存在，创建它
        window.renderVariables = {
          isInSearchMode: true
        };
      }
      
      // 切换到阅读模式
      currentMode = 'reading';
      navReading.classList.add('active');
      navSearch.classList.remove('active');
      navDirectory.classList.remove('active');
      navMore.classList.remove('active');
      
      // 显示阅读区域
      const readingArea = document.querySelector('.reading-area');
      readingArea.style.display = 'flex';
      
      // 隐藏搜索页
      const searchContainer = document.querySelector('.search-main-container');
      if (searchContainer) {
        searchContainer.style.display = 'none';
        searchContainer.classList.remove('show');
      }
      
      // 移动端关闭侧栏
      if (isMobile()) {
        closeAllSidebars();
        if (readingArea) readingArea.classList.remove('hide-mobile');
        if (searchContainer) {
          searchContainer.classList.add('hide-mobile');
          searchContainer.classList.remove('show');
        }
      }
      
      // 应用当前的字号和行间距设置
      applyCurrentFontSettings();
      
      // 渲染章节内容
      renderChapterContent();
      renderDirectory();
      updateProgress();
      renderFunctionContent();
      updateChapterJumpUI();
      
      // 显示搜索引导界面
      showSearchGuide(currentSearchKeyword, chapterIndex);
      
      // 滚动到指定关键词 - 减少延迟以提高响应速度
      setTimeout(() => {
        scrollToSpecificKeyword(keywordIndex);
      }, 100);
    }

    // 滚动到指定关键词
    function scrollToSpecificKeyword(keywordIndex) {
      console.log('滚动到指定关键词，索引:', keywordIndex);
      
      const highlightedKeywords = document.querySelectorAll('.highlight-keyword');
      console.log('找到的高亮关键词数量:', highlightedKeywords.length);
      
      if (highlightedKeywords.length === 0) {
        console.log('没有找到高亮的关键词');
        return;
      }
      
      // 确保索引在有效范围内
      const targetIndex = Math.min(keywordIndex, highlightedKeywords.length - 1);
      const targetKeyword = highlightedKeywords[targetIndex];
      
      if (targetKeyword) {
        console.log(`滚动到第 ${targetIndex + 1} 个关键词`);
        
        // 滚动到目标关键词 - 改为即时滚动
        targetKeyword.scrollIntoView({ 
          behavior: 'instant', 
          block: 'center' 
        });
        
        // 保持highlightKeywords函数中设置的蓝色背景样式不变
        // 不添加临时背景色，以确保关键词样式的一致性
      } else {
        console.log('目标关键词不存在');
      }
    }

    // 跳转到指定章节并显示搜索引导（修复版本）
    function jumpToChapterWithSearch(chapterIndex, excerptIndex, keyword) {
      // 首先修复数据一致性
      fixSearchResultsData();
      
      // 保存搜索状态
      currentSearchKeyword = keyword;
      currentSearchIndex = excerptIndex;
      isInSearchMode = true;
      
      // 更新全局渲染状态
      if (window.renderVariables) {
        window.renderVariables.isInSearchMode = true;
        window.renderVariables.currentSearchKeyword = keyword;
        window.renderVariables.currentSearchIndex = excerptIndex;
      }
      
      // 调用跳转函数
      jumpToKeyword(chapterIndex, excerptIndex);
    }
    
    // 前往默认阅读页并跳转到当前搜索中的章节
    function goToDefaultReadingPage() {
      // 记录当前搜索的章节和状态
      const currentSearchChapter = currentIndex;
      const currentSearchKeywordCopy = currentSearchKeyword;
      const currentSearchIndexCopy = currentSearchIndex;
      const searchResultsDataCopy = JSON.parse(JSON.stringify(searchResultsData));
      const allSearchResultsCopy = [...allSearchResults];
      
      // 清除搜索前章节索引，避免closeSearchGuide跳回搜索前章节
      if (typeof window.searchPreChapterIndex !== 'undefined') {
        delete window.searchPreChapterIndex;
      }
      
      // 关闭搜索引导，但保留搜索状态数据
      closeSearchGuide();
      
      // 保存搜索状态到localStorage，确保数据持久化
      try {
        localStorage.setItem('searchState', JSON.stringify({
          keyword: currentSearchKeywordCopy,
          index: currentSearchIndexCopy,
          chapter: currentSearchChapter,
          searchResultsData: searchResultsDataCopy,
          allSearchResults: allSearchResultsCopy
        }));
        console.log('搜索状态已保存到localStorage');
      } catch (e) {
        console.error('保存搜索状态失败:', e);
      }
      
      // 切换到默认阅读模式（如果不在默认模式）
      if (currentMode !== 'reading') {
        switchToReading();
      }
      
      // 跳转到当前搜索的章节
      if (currentSearchChapter !== undefined && currentSearchChapter >= 0) {
        jumpToChapter(currentSearchChapter);
        
        // 如果有关键词，尝试高亮显示
        if (currentSearchKeywordCopy) {
          setTimeout(() => {
            // 尝试高亮当前关键词
            const paragraphs = document.querySelectorAll('.content-paragraph');
            if (paragraphs.length > 0) {
              // 简单实现：只高亮第一个匹配的关键词
              for (let i = 0; i < paragraphs.length; i++) {
                const para = paragraphs[i];
                const paraText = para.innerText;
                const keywordIndex = paraText.indexOf(currentSearchKeywordCopy);
                if (keywordIndex !== -1) {
                  // 滚动到包含关键词的段落
                  para.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  
                  // 高亮显示关键词
                  const beforeKeyword = paraText.substring(0, keywordIndex);
                  const afterKeyword = paraText.substring(keywordIndex + currentSearchKeywordCopy.length);
                  para.innerHTML = `${beforeKeyword}<span style="color: #0c8ce9; font-weight: bold;">${currentSearchKeywordCopy}</span>${afterKeyword}`;
                  
                  break;
                }
              }
            }
          }, 300); // 延迟执行，确保章节渲染完成
        }
      }
    }

    // 搜索引导界面 - 重做版本
    function showSearchGuide(keyword, chapterIndex) {
      // 保存用户当前的翻页模式设置
      window.tempTraditionalPageTurningState = window.renderVariables.isTraditionalPageTurningEnabled;
      window.tempSeamlessScrollingState = window.renderVariables.isSeamlessScrollingEnabled;
      
      // 强制启用左右翻页模式，禁用无缝滚动模式
      window.renderVariables.isTraditionalPageTurningEnabled = true;
      window.renderVariables.isSeamlessScrollingEnabled = false;
      
      // 更新UI上的翻页模式开关
      const toggleSwitch = document.querySelector('.toggle-switch');
      if (toggleSwitch) {
        toggleSwitch.classList.add('off');
      }
      
      // 尝试从localStorage恢复搜索状态
      try {
        const savedSearchState = localStorage.getItem('searchState');
        if (savedSearchState && (!currentSearchKeyword || !allSearchResults.length)) {
          const parsedState = JSON.parse(savedSearchState);
          console.log('从localStorage恢复搜索状态:', parsedState);
          
          // 恢复搜索数据
          currentSearchKeyword = parsedState.keyword || keyword;
          currentSearchIndex = parsedState.index || 0;
          searchResultsData = parsedState.searchResultsData || {};
          allSearchResults = parsedState.allSearchResults || [];
          
          // 如果提供了章节索引，则使用提供的
          if (chapterIndex !== undefined) {
            // 保持传入的chapterIndex
          } else if (parsedState.chapter !== undefined) {
            chapterIndex = parsedState.chapter;
          }
          
          console.log('搜索状态恢复成功');
        }
      } catch (e) {
        console.error('恢复搜索状态失败:', e);
      }
      
      // 确保数据一致性
      fixSearchResultsData();
      
      // 创建搜索引导容器
      let guideContainer = document.getElementById('searchGuideContainer');
      if (!guideContainer) {
        guideContainer = document.createElement('div');
        guideContainer.id = 'searchGuideContainer';
        guideContainer.className = 'search-guide-container';
        // 插入到阅读区域内部
        const readingArea = document.querySelector('.reading-area');
        if (readingArea) {
          readingArea.style.position = 'relative';
          readingArea.insertBefore(guideContainer, readingArea.firstChild);
        }
      }
      
      // 隐藏底部分页
      const chapterFooter = document.querySelector('.chapter-footer');
      if (chapterFooter) {
        chapterFooter.classList.add('hidden');
      }
      
      // 确保currentSearchKeyword不为空
      if (!currentSearchKeyword) {
        currentSearchKeyword = keyword;
      }
      
      // 每次都重新计算章节列表，确保数据最新
      // 修复：避免缓存导致第二次进入时数据为空的问题
      window._cachedResultChapters = [];
      const chapterSet = new Set();
      allSearchResults.forEach(result => {
        if (!chapterSet.has(result.chapterIndex)) {
          chapterSet.add(result.chapterIndex);
          window._cachedResultChapters.push({
            chapterIndex: result.chapterIndex,
            chapterTitle: result.chapterTitle
          });
        }
      });
      
      // 按章节索引排序
      window._cachedResultChapters.sort((a, b) => a.chapterIndex - b.chapterIndex);
      window._cachedAllSearchResultsLength = allSearchResults.length;
      const resultChapters = window._cachedResultChapters;
      
      // 找到当前章节在结果章节列表中的位置
      let currentChapterPosition = resultChapters.findIndex(chapter => 
        chapter.chapterIndex === chapterIndex
      );
      
      // 如果没找到，使用第一个结果
      if (currentChapterPosition === -1 && resultChapters.length > 0) {
        currentChapterPosition = 0;
        chapterIndex = resultChapters[0].chapterIndex;
        // 更新当前搜索索引为该章节的第一个结果
        const firstResultInChapter = allSearchResults.find(result => 
          result.chapterIndex === chapterIndex
        );
        if (firstResultInChapter) {
          currentSearchIndex = firstResultInChapter.excerptIndex;
        }
      }
      
      // 构建搜索引导界面
      guideContainer.innerHTML = `
        <div style="width: 100%; max-width: 700px; margin: 0 auto; background: var(--background-color); display: flex; flex-direction: column;">
          <div style="width: 100%; height: 56px; display: flex; align-items: center; justify-content: space-between; padding: 0 32px;">
            <div style="color: var(--text-color); font-size: 13px;">包含 " ${keyword} " 的结果</div>
            <div style="display: flex; gap: 16px;">
            <div style="opacity: 0.50; color: var(--text-color); font-size: 13px; cursor: pointer;" onclick="goToDefaultReadingPage()">前往</div>
            <div style="opacity: 0.50; color: var(--text-color); font-size: 13px; cursor: pointer;" onclick="returnToSearchResults()">关闭</div>
            </div>
          </div>
          <div style="width: 100%; height: 56px; display: flex; align-items: center; justify-content: center;">
            <div style="flex: 1; text-align: center; cursor: pointer;" onclick="goToPreviousSearchChapter()">上一章</div>
            <div style="flex: 1; text-align: center; color: var(--text-color);">${currentChapterPosition + 1} / ${resultChapters.length}</div>
            <div style="flex: 1; text-align: center; cursor: pointer;" onclick="goToNextSearchChapter()">下一章</div>
          </div>
        </div>
      `;
      
      // 灰色横线
      let line = document.getElementById('searchGuideLine');
      if (!line) {
        line = document.createElement('div');
        line.id = 'searchGuideLine';
        line.className = 'search-guide-line';
        const readingArea = document.querySelector('.reading-area');
        if (readingArea) {
          readingArea.appendChild(line);
        }
      }
      line.style.display = 'block';
      
      // 调整阅读内容区域位置
      if (chapterContent) {
        chapterContent.classList.add('with-search-guide');
      }
      
      // 转义正则表达式特殊字符
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& 表示整个匹配的字符串
    }

    // 高亮当前章节的所有关键词
      highlightAllKeywordsInCurrentChapter(keyword);
    }

    // 关闭搜索引导 - 修复：保留搜索结果数据，只清除显示状态
    function closeSearchGuide() {
      console.log('关闭搜索引导');
      
      // 恢复用户之前的翻页模式设置
      if (typeof window.tempTraditionalPageTurningState !== 'undefined') {
        window.renderVariables.isTraditionalPageTurningEnabled = window.tempTraditionalPageTurningState;
        window.renderVariables.isSeamlessScrollingEnabled = window.tempSeamlessScrollingState;
        
        // 更新UI上的翻页模式开关
        const toggleSwitch = document.querySelector('.toggle-switch');
        if (toggleSwitch) {
          if (window.tempSeamlessScrollingState) {
            toggleSwitch.classList.remove('off');
          } else {
            toggleSwitch.classList.add('off');
          }
        }
        
        // 清除临时保存的状态
        delete window.tempTraditionalPageTurningState;
        delete window.tempSeamlessScrollingState;
      }
      
      const guideContainer = document.getElementById('searchGuideContainer');
      if (guideContainer) guideContainer.remove();
      const line = document.getElementById('searchGuideLine');
      if (line) line.style.display = 'none';
      if (chapterContent) {
        chapterContent.classList.remove('with-search-guide');
      }
      
      // 恢复底部分页显示
      const chapterFooter = document.querySelector('.chapter-footer');
      if (chapterFooter) {
        chapterFooter.classList.remove('hidden');
      }
      
      // 关闭搜索引导时，只清除显示状态，保留搜索结果数据
      isInSearchMode = false;
      // 不清除currentSearchKeyword和currentSearchIndex，以便再次打开搜索引导时能够恢复
      
      // 同时更新window.renderVariables中的isInSearchMode
      if (window.renderVariables) {
        window.renderVariables.isInSearchMode = false;
      }
      
      // 恢复阅读内容区域的底部内边距
      if (chapterContent) {
        chapterContent.style.paddingBottom = '';
      }
      
      // 恢复之前的人名高亮和对话高亮设置
      if (typeof window.tempNameHighlightState !== 'undefined') {
        isNameHighlightEnabled = window.tempNameHighlightState;
        // 强制更新window.renderVariables中的值
        if (window.renderVariables) {
          window.renderVariables.isNameHighlightEnabled = window.tempNameHighlightState;
        } else {
          // 如果window.renderVariables不存在，创建它
          window.renderVariables = {
            isNameHighlightEnabled: window.tempNameHighlightState
          };
        }
        delete window.tempNameHighlightState;
      }
      if (typeof window.tempDialogHighlightState !== 'undefined') {
        isDialogHighlightEnabled = window.tempDialogHighlightState;
        // 强制更新window.renderVariables中的值
        if (window.renderVariables) {
          window.renderVariables.isDialogHighlightEnabled = window.tempDialogHighlightState;
        } else {
          // 如果window.renderVariables不存在，创建它
          window.renderVariables = {
            isDialogHighlightEnabled: window.tempDialogHighlightState
          };
        }
        delete window.tempDialogHighlightState;
      }
      
      // 返回搜索前的章节（如果存在）
      if (typeof window.searchPreChapterIndex !== 'undefined' && window.searchPreChapterIndex >= 0) {
        console.log('返回到搜索前章节索引:', window.searchPreChapterIndex);
        const prevIndex = window.searchPreChapterIndex;
        delete window.searchPreChapterIndex;
        
        // 延迟执行，确保渲染完成后再跳转
        setTimeout(() => {
          jumpToChapter(prevIndex);
        }, 10);
      } else {
        // 重新渲染当前章节，清除高亮效果
        renderChapter();
      }
      
      console.log('搜索引导已关闭，关键词高亮已清除，已返回搜索前章节，搜索结果数据已保留');
    }

    // 返回搜索结果列表
    function returnToSearchResults() {
      console.log('返回搜索结果列表');
      
      // 关闭搜索引导
      closeSearchGuide();
      
      // 切换回搜索模式
      currentMode = 'search';
      navSearch.classList.add('active');
      navReading.classList.remove('active');
      navDirectory.classList.remove('active');
      navMore.classList.remove('active');
      
      // 显示搜索页面
      const searchContainer = document.querySelector('.search-main-container');
      if (searchContainer) {
        searchContainer.style.display = 'flex';
        searchContainer.classList.add('show');
      }
      
      // 隐藏阅读区域
      const readingArea = document.querySelector('.reading-area');
      readingArea.style.display = 'none';
      
      // 清空搜索结果数据
      currentSearchKeyword = '';
      searchResultsData = {};
      allSearchResults = [];
      currentSearchIndex = 0;
      isInSearchMode = false;
      
      // 清空搜索输入框
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.value = '';
      }
      
      // 清空搜索结果列表
      const searchResultList = document.getElementById('searchResultList');
      if (searchResultList) {
        searchResultList.innerHTML = '';
      }
    }

    // 获取所有搜索结果（极简版）
    function getAllSearchResults() {
      // 直接返回allSearchResults的副本
      // fixSearchResultsData会确保allSearchResults与searchResultsData同步
      return [...allSearchResults];
    }

    // 滚动到关键词位置
    function scrollToKeyword(keyword, excerptIndex, chapterIndex) {
      console.log('滚动到关键词:', { keyword, excerptIndex, chapterIndex });
      
      const paragraphs = document.querySelectorAll('.content-paragraph');
      let targetPara = null;
      let targetKeywordIndex = -1;
      
      // 根据章节和索引精确定位关键词
      if (searchResultsData && searchResultsData[chapterIndex]) {
        const chapterResult = searchResultsData[chapterIndex];
        console.log('章节搜索结果:', chapterResult);
        console.log('目标excerptIndex:', excerptIndex);
        console.log('positions数组:', chapterResult.positions);
        
        if (chapterResult.positions && chapterResult.positions[excerptIndex] !== undefined) {
          const targetPosition = chapterResult.positions[excerptIndex];
          console.log('目标位置:', targetPosition);
          
          // 计算目标关键词在章节内容中的位置
          let currentPosition = 0;
          for (let i = 0; i < paragraphs.length; i++) {
            const para = paragraphs[i];
            const paraText = para.innerText;
            const paraLength = paraText.length;
            
            // 检查这个段落是否包含目标位置的关键词
            if (currentPosition <= targetPosition && targetPosition < currentPosition + paraLength) {
              // 在这个段落中找到关键词
              const localPosition = targetPosition - currentPosition;
              const keywordIndex = paraText.indexOf(keyword, localPosition);
              if (keywordIndex !== -1) {
                targetPara = para;
                targetKeywordIndex = keywordIndex;
                console.log('找到目标段落:', i, '关键词位置:', keywordIndex);
                break;
              }
            }
            currentPosition += paraLength + 1; // +1 for newline
          }
        }
      }
      
      // 如果没找到精确位置，使用备用方法：按excerptIndex顺序查找
      if (!targetPara) {
        console.log('使用备用方法查找关键词');
        let keywordCount = 0;
        for (let i = 0; i < paragraphs.length; i++) {
          const para = paragraphs[i];
          const paraText = para.innerText;
          let searchIndex = 0;
          
          while ((searchIndex = paraText.indexOf(keyword, searchIndex)) !== -1) {
            if (keywordCount === excerptIndex) {
            targetPara = para;
              targetKeywordIndex = searchIndex;
              console.log('备用方法找到段落:', i, '关键词位置:', searchIndex, '关键词计数:', keywordCount);
              break;
            }
            keywordCount++;
            searchIndex += keyword.length;
          }
          if (targetPara) break;
        }
      }
      
      if (targetPara) {
        // 滚动到目标段落 - 改为即时滚动
        targetPara.scrollIntoView({ behavior: 'instant', block: 'center' });
        
        // 高亮显示目标段落（永久高亮，不隐藏）
        targetPara.style.background = 'rgba(12, 140, 233, 0.1)';
        
        // 如果找到了精确的关键词位置，可以进一步高亮关键词本身（永久高亮）
        if (targetKeywordIndex !== -1) {
          const originalText = targetPara.innerText;
          const beforeKeyword = originalText.substring(0, targetKeywordIndex);
          const afterKeyword = originalText.substring(targetKeywordIndex + keyword.length);
          targetPara.innerHTML = `${beforeKeyword}<span style="color: #0c8ce9; font-weight: bold;">${keyword}</span>${afterKeyword}`;
        }
        
        // 移除自动隐藏逻辑，保持永久高亮
        // setTimeout(() => {
        //   targetPara.style.background = '';
        //   targetPara.style.boxShadow = '';
        //   // 恢复原始文本
        //   if (targetKeywordIndex !== -1) {
        //     targetPara.innerHTML = targetPara.innerText;
        //   }
        // }, 3000);
      } else {
        console.log('未找到目标段落');
      }
    }
    
    // 转义正则表达式特殊字符
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& 表示整个匹配的字符串
    }
    
    // 高亮当前章节的所有关键词
    function highlightAllKeywordsInCurrentChapter(keyword) {
      if (!keyword || !chapterContent) return;
      
      // 获取当前章节的所有段落
      const paragraphs = chapterContent.querySelectorAll('.content-paragraph');
      if (!paragraphs.length) return;
      
      // 遍历所有段落，高亮关键词
      paragraphs.forEach(para => {
        const paraText = para.innerText;
        
        // 如果段落包含关键词，进行高亮处理
        if (paraText.includes(keyword)) {
          // 使用正则表达式全局高亮所有关键词
          const regex = new RegExp(escapeRegExp(keyword), 'gi');
          const highlightedText = paraText.replace(
            regex,
            `<span class="highlight-keyword" style="color: var(--accent-color); font-weight: bold; background-color: rgba(12, 140, 233, 0.1);">$&</span>`
          );
          
          // 保留原有属性和结构，只更新内容
          para.innerHTML = highlightedText;
        }
      });
    }
    
    // 上一章搜索结果（在搜索结果章节之间切换）
    function goToPreviousSearchChapter() {
      // 确保数据一致性
      fixSearchResultsData();
      
      if (allSearchResults.length === 0) return;
      
      // 获取包含搜索结果的章节列表（去重并排序）
      const resultChapters = [];
      const chapterSet = new Set();
      allSearchResults.forEach(result => {
        if (!chapterSet.has(result.chapterIndex)) {
          chapterSet.add(result.chapterIndex);
          resultChapters.push(result.chapterIndex);
        }
      });
      
      // 按章节索引排序
      resultChapters.sort((a, b) => a - b);
      
      // 找到当前章节在结果章节列表中的位置
      const currentChapterPosition = resultChapters.findIndex(chapterIndex => 
        chapterIndex === currentIndex
      );
      
      // 如果找到当前章节
      if (currentChapterPosition !== -1) {
        // 计算上一个章节的位置（循环）
        const prevChapterPosition = currentChapterPosition > 0 ? 
          currentChapterPosition - 1 : resultChapters.length - 1;
        const prevChapterIndex = resultChapters[prevChapterPosition];
        
        // 查找该章节的第一个搜索结果
        const firstResultInChapter = allSearchResults.find(result => 
          result.chapterIndex === prevChapterIndex
        );
        
        if (firstResultInChapter) {
          // 更新全局状态
          currentIndex = prevChapterIndex;
          currentSearchIndex = firstResultInChapter.excerptIndex;
          
          // 跳转到上一个章节的第一个结果
          jumpToChapterWithSearch(prevChapterIndex, firstResultInChapter.excerptIndex, currentSearchKeyword);
        }
      }
    }
    
    // 下一章搜索结果（在搜索结果章节之间切换）
    function goToNextSearchChapter() {
      // 确保数据一致性
      fixSearchResultsData();
      
      if (allSearchResults.length === 0) return;
      
      // 获取包含搜索结果的章节列表（去重并排序）
      const resultChapters = [];
      const chapterSet = new Set();
      allSearchResults.forEach(result => {
        if (!chapterSet.has(result.chapterIndex)) {
          chapterSet.add(result.chapterIndex);
          resultChapters.push(result.chapterIndex);
        }
      });
      
      // 按章节索引排序
      resultChapters.sort((a, b) => a - b);
      
      // 找到当前章节在结果章节列表中的位置
      const currentChapterPosition = resultChapters.findIndex(chapterIndex => 
        chapterIndex === currentIndex
      );
      
      // 如果找到当前章节
      if (currentChapterPosition !== -1) {
        // 计算下一个章节的位置（循环）
        const nextChapterPosition = currentChapterPosition < resultChapters.length - 1 ? 
          currentChapterPosition + 1 : 0;
        const nextChapterIndex = resultChapters[nextChapterPosition];
        
        // 查找该章节的第一个搜索结果
        const firstResultInChapter = allSearchResults.find(result => 
          result.chapterIndex === nextChapterIndex
        );
        
        if (firstResultInChapter) {
          // 更新全局状态
          currentIndex = nextChapterIndex;
          currentSearchIndex = firstResultInChapter.excerptIndex;
          
          // 跳转到下一个章节的第一个结果
          jumpToChapterWithSearch(nextChapterIndex, firstResultInChapter.excerptIndex, currentSearchKeyword);
        }
      }
    }
    
    // 全局函数，供HTML调用
    window.goToPreviousSearchChapter = goToPreviousSearchChapter;
    window.goToNextSearchChapter = goToNextSearchChapter;

    // 返回全部结果
    function goToAllResults() {
      closeSearchGuide();
      switchToSearch();
      
      // 滚动到当前结果位置 - 改为即时滚动
      setTimeout(() => {
        const resultList = document.getElementById('searchResultList');
        if (resultList) {
          const currentChapterCard = resultList.querySelector(`[data-chapter="${currentIndex}"]`);
          if (currentChapterCard) {
            currentChapterCard.scrollIntoView({ behavior: 'instant', block: 'center' });
          }
        }
      }, 100); // 减少延迟时间
    }

    // 切换搜索页面显示/隐藏
    function toggleSearchPage() {
      if (currentMode === 'search') {
        // 当前在搜索模式，切换到阅读模式
        switchToReading();
      } else {
        // 当前在阅读模式，切换到搜索模式
        switchToSearch();
      }
    }
    
    // 重置搜索状态
    function resetSearchState() {
      searchResultsData = {};
      searchResultsDisplayed = 0;
      allSearchResults = [];
      currentSearchKeyword = '';
      currentSearchIndex = 0;
      isInSearchMode = false;
    }
    
    // 更新搜索结果统计信息
    function updateSearchResultStats(keyword, totalResults, chapterKeys, displayCount) {
      const statContainer = document.getElementById('searchResultStat');
      if (statContainer) {
        // 确保参数有效
        const validTotalResults = totalResults || 0;
        const validChapterKeys = chapterKeys || [];
        const validDisplayedCount = displayCount || Math.min(searchResultsDisplayed, validTotalResults);
        
        console.log('🔍 更新统计信息:', {
          totalResults: validTotalResults,
          chapterCount: validChapterKeys.length,
          displayedCount: validDisplayedCount
        });
        
        statContainer.innerHTML = `
          <div style="opacity: 0.70; color: var(--text-color); font-size: 13px; font-family: Inter; font-weight: 400;">搜索结果：${validTotalResults}项，${validChapterKeys.length}章（已显示${validDisplayedCount}项）</div>
        `;
      }
    }
    
    // 关闭搜索页面（重置搜索并关闭）
    function closeSearchPage() {
      // 隐藏搜索页
      const searchContainer = document.querySelector('.search-main-container');
      if (searchContainer) {
        searchContainer.style.display = 'none';
        searchContainer.classList.remove('show');
      }
      
      // 清空搜索输入
      const searchKeyword = document.getElementById('searchKeyword');
      if (searchKeyword) {
        searchKeyword.value = '';
      }
      
      // 清空搜索结果
      const searchResultStat = document.getElementById('searchResultStat');
      const searchResultList = document.getElementById('searchResultList');
      if (searchResultStat) {
        searchResultStat.innerHTML = '';
      }
      if (searchResultList) {
          searchResultList.innerHTML = '';
      }
      
      // 重置搜索状态
      currentSearchKeyword = '';
      currentSearchIndex = 0;
      isInSearchMode = false;
      searchResultsData = {};
      searchResultsDisplayed = 0;
      allSearchResults = [];
      
      // 切换到阅读模式
      switchToReading();
    }
    
    // 更新导航状态
    function updateNavigationState() {
      // 移除所有导航项的激活状态
      document.querySelectorAll('.nav-item, .nav-center-item').forEach(item => {
        item.classList.remove('active');
      });
      
      // 根据当前模式设置激活状态
      if (currentMode === 'reading') {
        const navReading = document.querySelector('.nav-center-item[data-mode="reading"]');
        if (navReading) navReading.classList.add('active');
      } else if (currentMode === 'search') {
        const navSearch = document.querySelector('.nav-center-item[data-mode="search"]');
        if (navSearch) navSearch.classList.add('active');
      }
    }

    // 取消搜索函数
    function cancelSearch() {
      if (isSearching && searchAbortController) {
        searchAbortController.abort();
        isSearching = false;
        hideSearchLoading();
        showToast('搜索已取消', 'info');
      }
    }

    // 全局函数，供HTML调用
    window.closeSearchGuide = closeSearchGuide;
    window.goToPreviousSearchChapter = goToPreviousSearchChapter;
    window.goToNextSearchChapter = goToNextSearchChapter;
    window.goToAllResults = goToAllResults;
    window.closeSearchPage = closeSearchPage;
    window.resetSearchState = resetSearchState;
    window.cancelSearch = cancelSearch;
    window.fixSearchResultsData = fixSearchResultsData;

    // 工具函数：转义正则特殊字符
    function escapeRegExp(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    // 修复搜索结果数据一致性的函数 - 极简版
    function fixSearchResultsData() {
      // 确保基本数据结构存在且有效
      if (!Array.isArray(allSearchResults)) {
        allSearchResults = [];
      }
      if (!searchResultsData) {
        searchResultsData = {};
      }
      
      // 重新构建 allSearchResults（直接从searchResultsData派生）
      allSearchResults = [];
      if (Object.keys(searchResultsData).length > 0) {
        Object.keys(searchResultsData).forEach(chapterIndex => {
          const result = searchResultsData[chapterIndex];
          if (result && result.excerpts && Array.isArray(result.excerpts)) {
            result.excerpts.forEach((excerpt, excerptIndex) => {
              allSearchResults.push({
                chapterIndex: parseInt(chapterIndex),
                chapterTitle: result.chapterTitle,
                excerptIndex: excerptIndex,
                excerpt: excerpt,
                position: result.positions[excerptIndex] || 0
              });
            });
          }
        });
        
        // 按章节索引和position排序
        allSearchResults.sort((a, b) => {
          if (a.chapterIndex !== b.chapterIndex) {
            return a.chapterIndex - b.chapterIndex;
          }
          return a.position - b.position;
        });
      }
      
      // 确保 currentSearchIndex 有效
      if (currentSearchIndex === undefined || currentSearchIndex < 0 || 
          (allSearchResults.length > 0 && currentSearchIndex >= allSearchResults.length)) {
        currentSearchIndex = allSearchResults.length > 0 ? 0 : -1;
      }
      
      // 更新全局渲染状态
      if (window.renderVariables) {
        window.renderVariables.isInSearchMode = isInSearchMode;
        window.renderVariables.currentSearchKeyword = currentSearchKeyword;
        window.renderVariables.currentSearchIndex = currentSearchIndex;
        window.renderVariables.searchResultsData = searchResultsData;
        window.renderVariables.allSearchResults = allSearchResults;
      }
    }

    // 测试搜索功能的结果数计算
    window.testSearchResults = function() {
      console.log('=== 搜索功能测试 ===');
      console.log('searchResults:', searchResults);
      console.log('searchResultsData:', searchResultsData);
      console.log('allSearchResults:', allSearchResults);
      console.log('searchResultsDisplayed:', searchResultsDisplayed);

      
      if (Object.keys(searchResults).length > 0) {
        const totalResults = Object.keys(searchResults).reduce((sum, key) => {
          const chapterResult = searchResults[key];
          return sum + (chapterResult.excerpts ? chapterResult.excerpts.length : 0);
        }, 0);
        console.log('计算的总结果数:', totalResults);
        console.log('allSearchResults长度:', allSearchResults.length);
      }
      
      // 测试 getAllSearchResults 函数
      const getAllResults = getAllSearchResults();
      console.log('getAllSearchResults 返回:', getAllResults);
      console.log('getAllSearchResults 长度:', getAllResults.length);
      
      // 验证数据一致性
      console.log('=== 数据一致性验证 ===');
      const searchDataKeys = Object.keys(searchResultsData || {}).length;
      const searchKeys = Object.keys(searchResults || {}).length;
      const allResultsLength = allSearchResults.length;
      
      console.log('数据一致性检查:', {
        searchResultsData: searchDataKeys,
        searchResults: searchKeys,
        allSearchResults: allResultsLength
      });
      
      if (searchDataKeys !== searchKeys) {
        console.warn('⚠️ 搜索结果数据不一致，建议调用 fixSearchResultsData()');
      }
    };
    
    // 🔍 新增：测试"平安"搜索的完整流程
    window.testPingAnSearch = function() {
      console.log('🔍 === 测试"平安"搜索完整流程 ===');
      
      // 1. 清除缓存和重置状态
      clearSearchCache();
      resetSearchState();
      
      // 2. 设置搜索关键词
      const searchKeywordInput = document.getElementById('searchKeyword');
      if (searchKeywordInput) {
        searchKeywordInput.value = '平安';
        console.log('🔍 设置搜索关键词: 平安');
      }
      
      // 3. 执行搜索
      console.log('🔍 开始执行搜索...');
      performSearch();
      
      // 4. 等待搜索完成后检查结果
      setTimeout(() => {
        console.log('🔍 搜索完成，检查结果...');
        debugPingAnSearch();
        validateSearchData();
      }, 2000);
    };
    
    // 🔍 新增：快速测试搜索功能
    window.quickTestSearch = function() {
      console.log('🔍 === 快速测试搜索功能 ===');
      
      // 清除所有状态
      clearSearchCache();
      resetSearchState();
      
      // 设置搜索关键词为"平安"
      const searchKeywordInput = document.getElementById('searchKeyword');
      if (searchKeywordInput) {
        searchKeywordInput.value = '平安';
      }
      
      // 直接执行搜索
      performSearch();
      
      console.log('🔍 搜索已启动，请查看控制台输出和页面显示');
    };
    
    // 🔍 新增：全局搜索结果数据验证函数
    window.validateSearchData = function() {
      console.log('🔍 === 全局搜索结果数据验证 ===');
      
      const validation = {
        searchResults: {
          exists: !!searchResults,
          keys: Object.keys(searchResults || {}).length,
          hasValidData: false
        },
        searchResultsData: {
          exists: !!searchResultsData,
          keys: Object.keys(searchResultsData || {}).length,
          hasValidData: false
        },
        allSearchResults: {
          exists: !!allSearchResults,
          length: allSearchResults.length,
          hasValidData: false
        }
      };
      
      // 检查数据有效性
      if (searchResults && Object.keys(searchResults).length > 0) {
        validation.searchResults.hasValidData = Object.values(searchResults).some(result => 
          result && Array.isArray(result.excerpts) && result.excerpts.length > 0
        );
      }
      
      if (searchResultsData && Object.keys(searchResultsData).length > 0) {
        validation.searchResultsData.hasValidData = Object.values(searchResultsData).some(result => 
          result && Array.isArray(result.excerpts) && result.excerpts.length > 0
        );
      }
      

      
      validation.allSearchResults.hasValidData = allSearchResults.length > 0;
      
      console.log('🔍 验证结果:', validation);
      
      // 检查数据一致性
      const validDataSources = [
        validation.searchResults.hasValidData,
        validation.searchResultsData.hasValidData,
        validation.allSearchResults.hasValidData
      ].filter(Boolean);
      
      console.log('🔍 有效数据源数量:', validDataSources.length);
      
      if (validDataSources.length === 0) {
        console.warn('🔍 ⚠️ 没有找到有效的搜索结果数据！');
        return false;
      } else if (validDataSources.length > 1) {
        console.warn('🔍 ⚠️ 发现多个数据源，可能存在数据不一致问题！');
        return false;
      } else {
        console.log('🔍 ✅ 数据验证通过');
        return true;
      }
    };
    
    // 🔍 新增：专门调试"平安"搜索结果问题的函数
    window.debugPingAnSearch = function() {
      console.log('🔍 === 调试"平安"搜索结果问题 ===');
      
      // 1. 检查当前搜索关键词
      const currentKeyword = document.getElementById('searchKeyword')?.value;
      console.log('🔍 当前搜索关键词:', currentKeyword);
      
      // 2. 检查缓存
      console.log('🔍 搜索缓存内容:');
      searchCache.forEach((value, key) => {
        console.log(`  ${key}:`, {
          timestamp: value.timestamp,
          dataKeys: Object.keys(value.data || {}).length,
          totalResults: Object.values(value.data || {}).reduce((sum, result) => 
            sum + (result.excerpts ? result.excerpts.length : 0), 0
          )
        });
      });
      
      // 3. 检查当前搜索结果数据
      console.log('🔍 当前搜索结果数据:');
      if (searchResultsData && Object.keys(searchResultsData).length > 0) {
        Object.keys(searchResultsData).forEach(chapterIndex => {
          const result = searchResultsData[chapterIndex];
          console.log(`  章节 ${chapterIndex}:`, {
            title: result.chapterTitle,
            excerptsCount: result.excerpts ? result.excerpts.length : 0,
            positionsCount: result.positions ? result.positions.length : 0
          });
        });
      }
      
      // 4. 检查 allSearchResults
      console.log('🔍 allSearchResults 详情:');
      if (allSearchResults && allSearchResults.length > 0) {
        console.log(`  总长度: ${allSearchResults.length}`);
        console.log('  前5项:', allSearchResults.slice(0, 5));
        console.log('  后5项:', allSearchResults.slice(-5));
      }
      
      // 5. 手动计算正确的搜索结果数
      let manualTotalResults = 0;
      let manualChapterCount = 0;
      
      if (searchResultsData && Object.keys(searchResultsData).length > 0) {
        manualChapterCount = Object.keys(searchResultsData).length;
        manualTotalResults = Object.values(searchResultsData).reduce((sum, result) => {
          return sum + (result.excerpts ? result.excerpts.length : 0);
        }, 0);
      }
      
      console.log('🔍 手动计算结果:', {
        totalResults: manualTotalResults,
        chapterCount: manualChapterCount,
        allSearchResultsLength: allSearchResults.length,
        searchResultsDisplayed: searchResultsDisplayed
      });
      
      // 6. 检查是否有数据不一致
      if (manualTotalResults !== allSearchResults.length) {
        console.warn('🔍 ⚠️ 数据不一致！手动计算的总结果数与 allSearchResults 长度不匹配');
      }
      

      
      return {
        manualTotalResults,
        manualChapterCount,
        allSearchResultsLength: allSearchResults.length,
        searchResultsDisplayed
      };
    };
    
    // 🔍 新增：清除搜索缓存函数
    window.clearSearchCache = function() {
      console.log('🔍 清除搜索缓存...');
      searchCache.clear();
      console.log('🔍 搜索缓存已清除');
    };
    
    // 🔍 新增：重置搜索状态函数
    window.resetSearchState = function() {
      console.log('🔍 重置搜索状态...');
      searchResults = {};
      searchResultsData = {};
      allSearchResults = [];
      searchResultsDisplayed = 0;
      currentSearchKeyword = '';
      currentSearchIndex = 0;
      isInSearchMode = false;
      
      // 同时清除localStorage中的搜索状态
      try {
        localStorage.removeItem('searchState');
        console.log('🔍 localStorage中的搜索状态已清除');
      } catch (e) {
        console.error('🔍 清除localStorage中的搜索状态失败:', e);
      }
      
      console.log('🔍 搜索状态已重置');
    };

    // 测试搜索结果跳转索引
    window.testSearchIndex = function() {
      console.log('=== 搜索索引测试 ===');
      console.log('当前章节索引:', currentIndex);
      console.log('当前搜索索引:', currentSearchIndex);
      console.log('当前搜索关键词:', currentSearchKeyword);
      
      const allResults = getAllSearchResults();
      console.log('所有搜索结果:', allResults);
      
      if (allResults.length > 0) {
        const currentResult = allResults.find(result => 
          result.chapterIndex === currentIndex && result.excerptIndex === currentSearchIndex
        );
        console.log('当前结果:', currentResult);
        
        if (currentResult) {
          const currentIndexInArray = allResults.indexOf(currentResult);
          console.log('在数组中的索引:', currentIndexInArray);
          console.log('显示索引 (从1开始):', currentIndexInArray + 1);
        }
      }
    };

    // 测试关键词高亮功能
    window.testKeywordHighlight = function() {
      console.log('=== 关键词高亮测试 ===');
      console.log('搜索模式:', isInSearchMode);
      console.log('搜索关键词:', currentSearchKeyword);
      console.log('当前章节:', currentIndex);
      
      // 模拟搜索模式
      isInSearchMode = true;
      currentSearchKeyword = '测试';
      
      // 重新渲染章节
      renderChapter();
      
      console.log('已启用关键词高亮，关键词: "测试"');
    };

    // 测试人名高亮功能
    window.testNameHighlight = function() {
      console.log('=== 人名高亮测试 ===');
      console.log('人名高亮状态:', isNameHighlightEnabled);
      console.log('当前人名列表:', currentNames);
      console.log('禁用的人名:', disabledNames);
      console.log('全局颜色映射:', globalNameColorMap);
      
      // 测试分组标记生成
      console.log('分组标记测试:');
      for (let i = 1; i <= 30; i++) {
        console.log(`颜色${i}: ${generateNameGroupLabel(i)}`);
      }
      
      // 设置测试人名
      currentNames = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'];
      isNameHighlightEnabled = true;
      
      // 重新渲染章节
      renderChapter();
      renderFunctionContent();
      
      console.log('已启用人名高亮，人名:', currentNames);
      showToast('人名高亮测试已启用', 'success');
    };

    // 测试对话高亮功能
    window.testDialogHighlight = function() {
      console.log('=== 对话高亮测试 ===');
      console.log('对话高亮状态:', isDialogHighlightEnabled);
      console.log('对话高亮颜色:', dialogHighlightColor);
      
      // 启用对话高亮
      isDialogHighlightEnabled = true;
      console.log('已启用对话高亮');
      
      // 重新渲染
      renderFunctionContent();
      renderChapter();
      
      // 检查当前章节是否有对话内容
      if (currentIndex >= 0 && currentIndex < flatChapters.length) {
        const chapter = flatChapters[currentIndex];
        const dialogMatches = chapter.content.match(/"([^"]*)"/g);
        console.log('当前章节对话内容数量:', dialogMatches ? dialogMatches.length : 0);
        if (dialogMatches) {
          console.log('对话内容示例:', dialogMatches.slice(0, 3));
        }
      }
      
      showToast('对话高亮测试已启用', 'success');
    };

    // 测试搜索跳转功能
    window.testSearchJump = function() {
      console.log('=== 搜索跳转测试 ===');
      console.log('当前搜索结果数据:', searchResultsData);
      console.log('当前搜索关键词:', currentSearchKeyword);
      console.log('当前搜索索引:', currentSearchIndex);
      console.log('所有搜索结果项:', allSearchResults);
      
      if (allSearchResults.length > 0) {
        const firstResult = allSearchResults[0];
        console.log('第一个搜索结果:', firstResult);
        console.log('模拟点击第一个结果...');
        jumpToChapterWithSearch(firstResult.chapterIndex, firstResult.excerptIndex, currentSearchKeyword);
      } else {
        console.log('没有搜索结果，请先执行搜索');
      }
    };

    // 测试搜索索引计算
    window.testSearchIndexCalculation = function() {
      console.log('=== 搜索索引计算测试 ===');
      
      console.log('allSearchResults:', allSearchResults);
      console.log('当前搜索索引:', currentSearchIndex);
      console.log('当前章节索引:', currentIndex);
    };

    // 测试章节筛选功能
    window.testChapterFilter = function() {
      console.log('=== 章节筛选测试 ===');
      
      const startInput = document.getElementById('searchStartChapter');
      const endInput = document.getElementById('searchEndChapter');
      
      if (!startInput || !endInput) {
        console.error('找不到章节筛选输入框');
        return;
      }
      
      const start = parseInt(startInput.value) || 1;
      const end = parseInt(endInput.value) || flatChapters.length;
      
      console.log('当前筛选设置:', {
        start: start,
        end: end,
        totalChapters: flatChapters.length,
        validStart: Math.max(1, Math.min(start, flatChapters.length)),
        validEnd: Math.max(start, Math.min(end, flatChapters.length))
      });
      
      // 验证筛选范围
      if (start > end) {
        console.warn('⚠️ 起始章节大于结束章节');
      }
      
      if (start < 1 || start > flatChapters.length) {
        console.warn('⚠️ 起始章节超出有效范围');
      }
      
      if (end < 1 || end > flatChapters.length) {
        console.warn('⚠️ 结束章节超出有效范围');
      }
      
      // 显示筛选范围内的章节信息
      const validStart = Math.max(1, Math.min(start, flatChapters.length));
      const validEnd = Math.max(validStart, Math.min(end, flatChapters.length));
      
      console.log('有效筛选范围:', {
        validStart: validStart,
        validEnd: validEnd,
        chaptersInRange: validEnd - validStart + 1
      });
      
      // 显示范围内的前几个章节标题
      for (let i = validStart - 1; i < Math.min(validStart + 2, validEnd); i++) {
        if (flatChapters[i]) {
          console.log(`章节 ${i + 1}: ${flatChapters[i].title}`);
        }
      }
    };

    // 综合测试搜索功能
    window.testSearchFunction = function() {
      console.log('=== 综合测试搜索功能 ===');
      
      // 1. 检查搜索状态
      console.log('搜索状态:', {
        isInSearchMode,
        currentSearchKeyword,
        currentSearchIndex,
        currentIndex
      });
      
      // 2. 检查搜索结果数据
      console.log('搜索结果数据:', {
        searchResultsData: Object.keys(searchResultsData || {}).length,
        allSearchResults: allSearchResults.length
      });
      
      // 3. 检查当前章节的关键词高亮
      if (isInSearchMode && currentSearchKeyword) {
        const paragraphs = document.querySelectorAll('.content-paragraph');
        let highlightedCount = 0;
        paragraphs.forEach(para => {
          if (para.innerHTML.includes('color: #0c8ce9')) {
            highlightedCount++;
          }
        });
        console.log('当前章节高亮段落数:', highlightedCount);
      }
      
      // 4. 测试第一个搜索结果的跳转
      if (allSearchResults.length > 0) {
        const firstResult = allSearchResults[0];
        console.log('第一个搜索结果:', firstResult);
        console.log('建议测试: jumpToChapterWithSearch(' + firstResult.chapterIndex + ', ' + firstResult.excerptIndex + ', "' + currentSearchKeyword + '")');
      }
      
      // 5. 检查搜索引导状态
      const guideContainer = document.getElementById('searchGuideContainer');
      console.log('搜索引导状态:', {
        exists: !!guideContainer,
        visible: guideContainer ? guideContainer.style.display !== 'none' : false
      });
    };

    // 重置搜索状态测试
    window.resetSearchTest = function() {
      console.log('=== 重置搜索状态测试 ===');
      
      // 重置所有搜索相关变量
      isInSearchMode = false;
      currentSearchKeyword = '';
      currentSearchIndex = 0;
      
      // 重新渲染章节
      renderChapter();
      
      // 关闭搜索引导
      closeSearchGuide();
      
      console.log('搜索状态已重置');
    };

    // 调试对话高亮实现
    window.debugDialogHighlight = function() {
      console.log('=== 调试对话高亮实现 ===');
      
      // 1. 检查变量状态
      console.log('对话高亮变量:', {
        isDialogHighlightEnabled,
        dialogHighlightColor
      });
      
      // 2. 检查当前章节内容
      if (currentIndex >= 0 && currentIndex < flatChapters.length) {
        const chapter = flatChapters[currentIndex];
        console.log('当前章节:', chapter.title);
        
        // 查找引号内容
        const dialogMatches = chapter.content.match(/"([^"]*)"/g);
        console.log('引号内容数量:', dialogMatches ? dialogMatches.length : 0);
        
        if (dialogMatches && dialogMatches.length > 0) {
          console.log('前3个引号内容:', dialogMatches.slice(0, 3));
          
          // 测试正则替换
          const testText = dialogMatches[0];
          const replaced = testText.replace(/"([^"]*)"/g, (match, content) => {
            return `"${escapeHTML(content)}"`;
          });
          console.log('替换测试:', {
            original: testText,
            replaced: replaced
          });
        }
      }
      
      // 3. 检查DOM中的高亮元素
      const highlightedDialogs = document.querySelectorAll('.highlight-dialog');
      console.log('DOM中对话高亮元素数量:', highlightedDialogs.length);
      
      if (highlightedDialogs.length > 0) {
        console.log('第一个高亮元素:', highlightedDialogs[0]);
        console.log('高亮元素样式:', highlightedDialogs[0].style.backgroundColor);
      }
      
      // 4. 检查CSS样式
      const style = document.createElement('div');
      style.className = 'highlight-dialog';
      document.body.appendChild(style);
      const computedStyle = window.getComputedStyle(style);
      console.log('CSS样式检查:', {
        display: computedStyle.display,
        backgroundColor: computedStyle.backgroundColor
      });
      document.body.removeChild(style);
    };

        // 测试对话高亮设置对话框
    window.testDialogHighlightDialog = function() {
      console.log('=== 测试对话高亮设置对话框 ===');
      
      // 打开对话框
      openDialogHighlightDialog();
      
      // 等待对话框创建完成
      setTimeout(() => {
        const preview = document.querySelector('.dialog-highlight-preview');
        const colorPicker = document.getElementById('dialogColorPicker');
        
        console.log('对话框元素检查:', {
          preview: !!preview,
          colorPicker: !!colorPicker,
          previewBackground: preview ? preview.style.backgroundColor : 'N/A',
          colorPickerValue: colorPicker ? colorPicker.value : 'N/A'
        });
        
        if (preview) {
          console.log('预览元素样式:', {
            backgroundColor: preview.style.backgroundColor,
            computedBackground: window.getComputedStyle(preview).backgroundColor
          });
        }
        
        // 测试颜色更新
        if (colorPicker) {
          console.log('测试颜色更新...');
          updateDialogColorPreview('#ff0000');
          
          setTimeout(() => {
            console.log('更新后预览背景色:', preview ? preview.style.backgroundColor : 'N/A');
          }, 100);
        }
      }, 100);
    };

    // 调试对话高亮实现
    window.debugDialogHighlight = function() {
      console.log('=== 调试对话高亮实现 ===');
      
      // 1. 检查变量状态
      console.log('对话高亮变量:', {
        isDialogHighlightEnabled,
        dialogHighlightColor
      });
      
      // 2. 检查当前章节内容
      if (currentIndex >= 0 && currentIndex < flatChapters.length) {
        const chapter = flatChapters[currentIndex];
        console.log('当前章节:', chapter.title);
        
        // 查找引号内容
        const dialogMatches = chapter.content.match(/"([^"]*)"/g);
        console.log('引号内容数量:', dialogMatches ? dialogMatches.length : 0);
        
        if (dialogMatches && dialogMatches.length > 0) {
          console.log('前3个引号内容:', dialogMatches.slice(0, 3));
          
          // 测试正则替换
          const testText = dialogMatches[0];
          const replaced = testText.replace(/"([^"]*)"/g, (match, content) => {
            return `"${escapeHTML(content)}"`;
          });
          console.log('替换测试:', {
            original: testText,
            replaced: replaced
          });
        }
      }
      
      // 3. 检查DOM中的高亮元素
      const highlightedDialogs = document.querySelectorAll('.highlight-dialog');
      console.log('DOM中对话高亮元素数量:', highlightedDialogs.length);
      
      if (highlightedDialogs.length > 0) {
        console.log('第一个高亮元素:', highlightedDialogs[0]);
        console.log('高亮元素样式:', highlightedDialogs[0].style.backgroundColor);
      }
      
      // 4. 检查CSS样式
      const style = document.createElement('div');
      style.className = 'highlight-dialog';
      document.body.appendChild(style);
      const computedStyle = window.getComputedStyle(style);
      console.log('CSS样式检查:', {
        display: computedStyle.display,
        backgroundColor: computedStyle.backgroundColor
      });
      document.body.removeChild(style);
    };

    // 验证搜索功能完整性
    window.validateSearchCompleteness = function() {
      console.log('=== 验证搜索功能完整性 ===');
      
      const issues = [];
      
      // 1. 检查必要变量是否存在
      if (typeof isInSearchMode === 'undefined') issues.push('isInSearchMode 未定义');
      if (typeof currentSearchKeyword === 'undefined') issues.push('currentSearchKeyword 未定义');
      if (typeof currentSearchIndex === 'undefined') issues.push('currentSearchIndex 未定义');
      
      // 2. 检查必要函数是否存在
      if (typeof jumpToChapterWithSearch !== 'function') issues.push('jumpToChapterWithSearch 函数不存在');
      if (typeof scrollToKeyword !== 'function') issues.push('scrollToKeyword 函数不存在');
      if (typeof showSearchGuide !== 'function') issues.push('showSearchGuide 函数不存在');
      if (typeof closeSearchGuide !== 'function') issues.push('closeSearchGuide 函数不存在');
      if (typeof getAllSearchResults !== 'function') issues.push('getAllSearchResults 函数不存在');
      
      // 3. 检查DOM元素是否存在
      if (!chapterContent) issues.push('章节内容容器不存在');
      
      // 4. 检查搜索结果数据
      if (!allSearchResults || allSearchResults.length === 0) {
        issues.push('没有搜索结果数据');
      } else {
        console.log('搜索结果数据正常，共', allSearchResults.length, '项');
      }
      
      if (issues.length === 0) {
        console.log('✅ 搜索功能完整性检查通过');
        return true;
      } else {
        console.log('❌ 发现以下问题:');
        issues.forEach(issue => console.log('- ' + issue));
        return false;
      }
    };

    // 清除所有关键词高亮
    window.clearAllHighlights = function() {
      console.log('=== 清除所有关键词高亮 ===');
      
      // 清除段落背景高亮
      const paragraphs = document.querySelectorAll('.content-paragraph');
      paragraphs.forEach(para => {
        para.style.background = '';
        para.style.boxShadow = '';
        // 恢复原始文本（移除HTML高亮标签）
        if (para.innerHTML !== para.innerText) {
          para.innerHTML = para.innerText;
        }
      });
      
      // 重置搜索状态
      isInSearchMode = false;
      currentSearchKeyword = '';
      currentSearchIndex = 0;
      
      console.log('所有关键词高亮已清除');
    };

    // 重新应用关键词高亮
    window.reapplyHighlights = function() {
      console.log('=== 重新应用关键词高亮 ===');
      
      if (!currentSearchKeyword || !currentSearchKeyword.trim()) {
        console.log('没有搜索关键词，无法重新应用高亮');
        return;
      }
      
      // 重新渲染章节以应用高亮
      renderChapter();
      
      console.log('关键词高亮已重新应用');
    };

    // 测试永久高亮功能
    window.testPermanentHighlight = function() {
      console.log('=== 测试永久高亮功能 ===');
      
      // 检查当前高亮状态
      const paragraphs = document.querySelectorAll('.content-paragraph');
      let highlightedCount = 0;
      let backgroundHighlightedCount = 0;
      let totalKeywords = 0;
      
      paragraphs.forEach(para => {
        if (para.innerHTML.includes('color: #0c8ce9')) {
          highlightedCount++;
          // 计算这个段落中的关键词数量
          const keywordMatches = para.innerHTML.match(/color: #0c8ce9[^>]*>([^<]+)</g) || [];
          totalKeywords += keywordMatches.length;
        }
        if (para.style.background === 'rgba(12, 140, 233, 0.1)') {
          backgroundHighlightedCount++;
        }
      });
      
      console.log('高亮统计:', {
        关键词高亮段落数: highlightedCount,
        总关键词高亮数: totalKeywords,
        背景高亮段落数: backgroundHighlightedCount,
        总段落数: paragraphs.length,
        搜索关键词: currentSearchKeyword,
        搜索模式: isInSearchMode
      });
      
      // 检查是否有永久高亮（背景色）
      if (backgroundHighlightedCount > 0) {
        console.log('✅ 发现永久高亮段落');
      } else {
        console.log('❌ 没有发现永久高亮段落');
      }
      
      // 检查搜索引导状态
      const guideContainer = document.getElementById('searchGuideContainer');
      console.log('搜索引导状态:', {
        存在: !!guideContainer,
        可见: guideContainer ? guideContainer.style.display !== 'none' : false
      });
      
      return {
        highlightedParagraphs: highlightedCount,
        totalKeywords: totalKeywords,
        backgroundHighlighted: backgroundHighlightedCount
      };
    };

    // 测试关键词高亮功能
    window.testKeywordHighlighting = function(keyword) {
      console.log('=== 测试关键词高亮功能 ===');
      
      if (!keyword || !keyword.trim()) {
        console.log('请提供关键词参数');
        return;
      }
      
      // 设置搜索状态
      isInSearchMode = true;
      currentSearchKeyword = keyword;
      
      console.log('设置搜索状态:', { isInSearchMode, currentSearchKeyword });
      
      // 重新渲染当前章节
      renderChapter();
      
      // 检查高亮结果
      setTimeout(() => {
        const result = testPermanentHighlight();
        console.log('高亮测试结果:', result);
        
        if (result.totalKeywords > 0) {
          console.log(`✅ 成功高亮 ${result.totalKeywords} 个关键词`);
        } else {
          console.log('❌ 没有找到关键词高亮');
        }
      }, 100);
    };

    // 模拟搜索跳转流程
    window.simulateSearchJump = function(keyword, chapterIndex = 0) {
      console.log('=== 模拟搜索跳转流程 ===');
      
      if (!keyword || !keyword.trim()) {
        console.log('请提供关键词参数');
        return;
      }
      
      if (chapterIndex < 0 || chapterIndex >= flatChapters.length) {
        console.log('章节索引超出范围');
        return;
      }
      
      // 模拟搜索结果数据
      const mockSearchResults = {
        [chapterIndex]: {
          chapterIndex: chapterIndex,
          chapterTitle: flatChapters[chapterIndex].title,
          excerpts: [`包含 ${keyword} 的示例内容`],
          positions: [0]
        }
      };
      
      // 设置搜索状态
      searchResultsData = mockSearchResults;
      currentSearchKeyword = keyword;
      currentSearchIndex = 0;
      isInSearchMode = true;
      
      console.log('模拟搜索状态设置完成');
      
      // 执行跳转
      jumpToChapterWithSearch(chapterIndex, 0, keyword);
      
      console.log('模拟搜索跳转完成，请检查高亮效果');
    };

    // 检查当前章节中的关键词
    window.checkCurrentChapterKeywords = function(keyword) {
      console.log('=== 检查当前章节中的关键词 ===');
      
      if (!keyword || !keyword.trim()) {
        console.log('请提供关键词参数');
        return;
      }
      
      if (currentIndex < 0 || currentIndex >= flatChapters.length) {
        console.log('当前章节索引无效');
        return;
      }
      
      const chapter = flatChapters[currentIndex];
      const content = chapter.content;
      
      // 使用正则表达式查找所有匹配
      const regex = new RegExp(escapeRegExp(keyword), 'gi');
      const matches = content.match(regex) || [];
      
      console.log('关键词检查结果:', {
        关键词: keyword,
        章节标题: chapter.title,
        章节索引: currentIndex,
        总字符数: content.length,
        匹配次数: matches.length,
        匹配内容: matches.slice(0, 10) // 只显示前10个匹配
      });
      
      if (matches.length > 0) {
        console.log(`✅ 当前章节包含 ${matches.length} 个关键词 "${keyword}"`);
        
        // 显示前几个匹配的位置
        let searchIndex = 0;
        const positions = [];
        for (let i = 0; i < Math.min(5, matches.length); i++) {
          searchIndex = content.indexOf(keyword, searchIndex);
          if (searchIndex !== -1) {
            const context = content.substring(Math.max(0, searchIndex - 20), searchIndex + keyword.length + 20);
            positions.push({
              position: searchIndex,
              context: '...' + context + '...'
            });
            searchIndex += keyword.length;
          }
        }
        
        console.log('前几个匹配位置:', positions);
      } else {
        console.log(`❌ 当前章节不包含关键词 "${keyword}"`);
      }
      
      return matches.length;
    };

    // 综合测试搜索高亮功能
    window.testCompleteSearchHighlight = function(keyword) {
      console.log('=== 综合测试搜索高亮功能 ===');
      
      if (!keyword || !keyword.trim()) {
        console.log('请提供关键词参数');
        return;
      }
      
      console.log('测试关键词:', keyword);
      
      // 1. 检查当前章节是否包含关键词
      const keywordCount = checkCurrentChapterKeywords(keyword);
      
      if (keywordCount === 0) {
        console.log('❌ 当前章节不包含关键词，无法测试高亮功能');
        return;
      }
      
      // 2. 设置搜索状态并重新渲染
      console.log('设置搜索状态...');
      isInSearchMode = true;
      currentSearchKeyword = keyword;
      
      // 3. 重新渲染章节
      console.log('重新渲染章节...');
      renderChapter();
      
      // 4. 检查高亮结果
      setTimeout(() => {
        console.log('检查高亮结果...');
        const result = testPermanentHighlight();
        
        if (result.totalKeywords > 0) {
          console.log(`✅ 测试成功！高亮了 ${result.totalKeywords} 个关键词`);
          console.log(`   预期关键词数: ${keywordCount}`);
          console.log(`   实际高亮数: ${result.totalKeywords}`);
          
          if (result.totalKeywords >= keywordCount) {
            console.log('🎉 所有关键词都已正确高亮！');
          } else {
            console.log('⚠️  部分关键词可能未高亮，请检查');
          }
        } else {
          console.log('❌ 测试失败！没有找到高亮的关键词');
        }
        
        // 5. 显示高亮效果
        console.log('当前页面应该显示所有包含 "' + keyword + '" 的内容都已高亮');
        console.log('高亮样式: 浅黄色背景 (#fff3cd) + 粗体字');
        
      }, 200);
    };

    // 深度调试搜索高亮功能
    window.debugSearchHighlight = function(keyword) {
      console.log('=== 深度调试搜索高亮功能 ===');
      
      if (!keyword || !keyword.trim()) {
        console.log('请提供关键词参数');
        return;
      }
      
      console.log('调试关键词:', keyword);
      
      // 1. 检查全局变量状态
      console.log('=== 全局变量状态 ===');
      console.log('isInSearchMode:', isInSearchMode);
      console.log('currentSearchKeyword:', currentSearchKeyword);
      console.log('currentSearchIndex:', currentSearchIndex);
      console.log('currentIndex:', currentIndex);
      console.log('searchResultsData:', searchResultsData);
      
      // 2. 检查当前章节内容
      if (currentIndex >= 0 && currentIndex < flatChapters.length) {
        const chapter = flatChapters[currentIndex];
        console.log('=== 当前章节信息 ===');
        console.log('章节标题:', chapter.title);
        console.log('章节内容长度:', chapter.content.length);
        console.log('章节内容预览:', chapter.content.substring(0, 200) + '...');
        
        // 3. 检查关键词匹配
        const regex = new RegExp(escapeRegExp(keyword), 'gi');
        const matches = chapter.content.match(regex) || [];
        console.log('=== 关键词匹配检查 ===');
        console.log('关键词:', keyword);
        console.log('匹配次数:', matches.length);
        console.log('前5个匹配:', matches.slice(0, 5));
        
        if (matches.length === 0) {
          console.log('❌ 章节中不包含关键词');
          return;
        }
      }
      
      // 4. 设置搜索状态
      console.log('=== 设置搜索状态 ===');
      isInSearchMode = true;
      currentSearchKeyword = keyword;
      
      console.log('设置后的状态:');
      console.log('isInSearchMode:', isInSearchMode);
      console.log('currentSearchKeyword:', currentSearchKeyword);
      
      // 5. 重新渲染章节
      console.log('=== 重新渲染章节 ===');
      renderChapter();
      
      // 6. 检查渲染结果
      setTimeout(() => {
        console.log('=== 检查渲染结果 ===');
        const paragraphs = document.querySelectorAll('.content-paragraph');
        console.log('段落总数:', paragraphs.length);
        
        let highlightedParagraphs = 0;
        let totalKeywords = 0;
        let sampleHighlightedText = '';
        
        paragraphs.forEach((para, index) => {
          if (para.innerHTML.includes('color: #0c8ce9')) {
            highlightedParagraphs++;
            const keywordMatches = para.innerHTML.match(/color: #0c8ce9[^>]*>([^<]+)</g) || [];
            totalKeywords += keywordMatches.length;
            
            if (sampleHighlightedText === '' && keywordMatches.length > 0) {
              sampleHighlightedText = para.innerHTML.substring(0, 200) + '...';
            }
          }
        });
        
        console.log('高亮段落数:', highlightedParagraphs);
        console.log('总关键词数:', totalKeywords);
        console.log('示例高亮文本:', sampleHighlightedText);
        
        if (totalKeywords > 0) {
          console.log('✅ 高亮功能正常工作');
        } else {
          console.log('❌ 高亮功能异常');
          console.log('可能的原因:');
          console.log('1. renderChapter函数中的高亮逻辑有问题');
          console.log('2. 搜索状态设置不正确');
          console.log('3. 正则表达式匹配失败');
        }
      }, 300);
    };


    

    // 快速测试函数
    window.quickTest = function(keyword) {
      console.log('=== 快速测试 ===');
      console.log('关键词:', keyword);
      
      // 直接设置状态
      isInSearchMode = true;
      currentSearchKeyword = keyword;
      
      console.log('状态设置完成:', { isInSearchMode, currentSearchKeyword });
      
      // 重新渲染
      renderChapter();
      
      // 立即检查结果
      setTimeout(() => {
        const paragraphs = document.querySelectorAll('.content-paragraph');
        let count = 0;
        paragraphs.forEach(para => {
          if (para.innerHTML.includes('color: #0c8ce9')) {
            count++;
          }
        });
        console.log('高亮段落数:', count);
        
        if (count > 0) {
          console.log('✅ 高亮成功');
        } else {
          console.log('❌ 高亮失败');
        }
      }, 100);
    };

    // 测试正则表达式匹配
    window.testRegex = function(keyword) {
      console.log('=== 测试正则表达式匹配 ===');
      console.log('关键词:', keyword);
      
      if (currentIndex >= 0 && currentIndex < flatChapters.length) {
        const chapter = flatChapters[currentIndex];
        const content = chapter.content;
        
        // 测试转义函数
        const escapedKeyword = escapeRegExp(keyword);
        console.log('转义后的关键词:', escapedKeyword);
        
        // 测试正则表达式
        const regex = new RegExp(escapedKeyword, 'gi');
        console.log('正则表达式:', regex);
        
        // 测试匹配
        const matches = content.match(regex);
        console.log('匹配结果:', matches);
        console.log('匹配数量:', matches ? matches.length : 0);
        
        if (matches && matches.length > 0) {
          console.log('✅ 正则表达式匹配成功');
          console.log('前5个匹配:', matches.slice(0, 5));
        } else {
          console.log('❌ 正则表达式匹配失败');
        }
      } else {
        console.log('❌ 当前章节索引无效');
      }
    };

    // 强制高亮函数（备用方案）
    window.forceHighlight = function(keyword) {
      console.log('=== 强制高亮 ===');
      console.log('关键词:', keyword);
      
      if (!keyword || !keyword.trim()) {
        console.log('请提供关键词');
        return;
      }
      
      // 设置搜索状态
      isInSearchMode = true;
      currentSearchKeyword = keyword;
      
      // 直接操作DOM，强制高亮所有匹配的关键词
      const paragraphs = document.querySelectorAll('.content-paragraph');
      let totalHighlighted = 0;
      
      paragraphs.forEach(para => {
        const text = para.textContent;
        const regex = new RegExp(escapeRegExp(keyword), 'gi');
        const matches = text.match(regex);
        
        if (matches && matches.length > 0) {
          const highlightedText = text.replace(
            regex,
            `<span style="color: #0c8ce9; font-weight: bold;">$&</span>`
          );
          para.innerHTML = highlightedText;
          totalHighlighted += matches.length;
        }
      });
      
      console.log(`强制高亮完成，共高亮 ${totalHighlighted} 个关键词`);
      
      if (totalHighlighted > 0) {
        console.log('✅ 强制高亮成功');
      } else {
        console.log('❌ 强制高亮失败，没有找到匹配的关键词');
      }
    };

    // 测试新的高亮和跳转功能
    window.testNewHighlightAndJump = function(keyword) {
      console.log('=== 测试新的高亮和跳转功能 ===');
      console.log('关键词:', keyword);
      
      if (!keyword || !keyword.trim()) {
        console.log('请提供关键词');
        return;
      }
      
      // 1. 设置搜索状态
      isInSearchMode = true;
      currentSearchKeyword = keyword;
      
      console.log('搜索状态设置完成:', { isInSearchMode, currentSearchKeyword });
      
      // 2. 重新渲染章节内容
      console.log('重新渲染章节内容...');
      renderChapterContent();
      
      // 3. 检查高亮结果
      setTimeout(() => {
        const highlightedKeywords = document.querySelectorAll('.highlight-keyword');
        console.log('高亮关键词数量:', highlightedKeywords.length);
        
        if (highlightedKeywords.length > 0) {
          console.log('✅ 关键词高亮成功');
          console.log('高亮样式:', highlightedKeywords[0].outerHTML);
          
          // 4. 测试跳转到第一个关键词
          console.log('测试跳转到第一个关键词...');
          jumpToKeyword(currentIndex, 0);
          
        } else {
          console.log('❌ 关键词高亮失败');
          console.log('可能的原因:');
          console.log('1. 当前章节不包含关键词');
          console.log('2. highlightKeywords函数有问题');
          console.log('3. renderChapterContent函数有问题');
        }
      }, 200);
    };

    // 测试索引计算
    window.testIndexCalculation = function() {
      console.log('=== 测试索引计算 ===');
      
      if (!currentSearchKeyword) {
        console.log('请先设置搜索关键词');
        return;
      }
      
      const highlightedKeywords = document.querySelectorAll('.highlight-keyword');
      console.log('当前高亮关键词总数:', highlightedKeywords.length);
      
      if (highlightedKeywords.length === 0) {
        console.log('没有高亮的关键词，无法测试索引');
        return;
      }
      
      // 测试跳转到不同位置的关键词
      for (let i = 0; i < Math.min(3, highlightedKeywords.length); i++) {
        console.log(`测试跳转到第 ${i + 1} 个关键词...`);
        setTimeout(() => {
          jumpToKeyword(currentIndex, i);
        }, i * 1000);
      }
    };

    // 综合测试搜索流程
    window.testCompleteSearchFlow = function(keyword) {
      console.log('=== 综合测试搜索流程 ===');
      console.log('关键词:', keyword);
      
      if (!keyword || !keyword.trim()) {
        console.log('请提供关键词');
        return;
      }
      
      // 1. 模拟搜索结果数据
      console.log('1. 模拟搜索结果数据...');
      const mockSearchResults = {
        [currentIndex]: {
          chapterIndex: currentIndex,
          chapterTitle: flatChapters[currentIndex].title,
          excerpts: [`包含 ${keyword} 的示例内容`],
          positions: [0]
        }
      };
      
      // 2. 设置搜索状态
      console.log('2. 设置搜索状态...');
      searchResultsData = mockSearchResults;
      currentSearchKeyword = keyword;
      currentSearchIndex = 0;
      isInSearchMode = true;
      
      // 3. 重新渲染章节
      console.log('3. 重新渲染章节...');
      renderChapterContent();
      
      // 4. 检查高亮结果
      setTimeout(() => {
        console.log('4. 检查高亮结果...');
        const highlightedKeywords = document.querySelectorAll('.highlight-keyword');
        console.log('高亮关键词数量:', highlightedKeywords.length);
        
        if (highlightedKeywords.length > 0) {
          console.log('✅ 关键词高亮成功');
          
          // 5. 测试跳转
          console.log('5. 测试跳转功能...');
          jumpToKeyword(currentIndex, 0);
          
          // 6. 检查搜索引导
          setTimeout(() => {
            const guideContainer = document.getElementById('searchGuideContainer');
            if (guideContainer) {
              console.log('✅ 搜索引导显示成功');
            } else {
              console.log('❌ 搜索引导显示失败');
            }
          }, 500);
          
        } else {
          console.log('❌ 关键词高亮失败');
        }
      }, 300);
    };

    // Toast提示系统
    function showToast(message, type = 'info', duration = 3000) {
      // 创建或获取toast容器
      let container = document.getElementById('toastContainer');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          gap: 10px;
        `;
        document.body.appendChild(container);
      }
      
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.style.cssText = `
        padding: 12px 16px;
        border-radius: 6px;
        color: white;
        font-size: 14px;
        font-weight: 500;
        max-width: 300px;
        word-wrap: break-word;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      `;
      
      // 根据类型设置背景色
      switch (type) {
        case 'success':
          toast.style.background = '#4caf50';
          break;
        case 'error':
          toast.style.background = '#f44336';
          break;
        case 'warning':
          toast.style.background = '#ff9800';
          break;
        default:
          toast.style.background = '#2196f3';
      }
      
      toast.textContent = message;
      container.appendChild(toast);
      
      // 显示动画
      setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
      }, 10);
      
      // 自动隐藏
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 300);
      }, duration);
    }

    // 检查页面宽度变化
    function checkPageWidthChange() {
      const searchContainer = document.querySelector('.search-main-container');
      if (searchContainer) {
        const currentWidth = searchContainer.offsetWidth;
        // 触发重排以确保布局正确
        searchContainer.style.width = searchContainer.style.width;
        setTimeout(() => {
          searchContainer.style.width = '';
        }, 10);
      }
    }







    // 搜索性能优化：防抖处理
    let searchTimeout = null;
    window.debouncedSearch = function() {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      searchTimeout = setTimeout(() => {
        performSearch();
      }, 300);
    };






      
      // 检查关键函数是否存在
      console.log('performSearch函数:', typeof performSearch);
      console.log('renderSearchResults函数:', typeof renderSearchResults);
      console.log('renderSearchPage函数:', typeof renderSearchPage);
      console.log('switchToSearch函数:', typeof switchToSearch);
      
      // 检查关键变量是否存在
      console.log('searchResults变量:', typeof searchResults);
      console.log('flatChapters变量:', typeof flatChapters);
      
      // 检查DOM元素是否存在
      const searchContainer = document.querySelector('.search-main-container');
      const searchBtn = document.getElementById('searchBtn');
      const searchKeyword = document.getElementById('searchKeyword');
      
      console.log('搜索容器存在:', !!searchContainer);
      console.log('搜索按钮存在:', !!searchBtn);
      console.log('搜索输入框存在:', !!searchKeyword);
      
      // 检查事件绑定
      if (searchBtn) {
        console.log('搜索按钮事件:', typeof searchBtn.onclick);
      }
      
      // 检查样式
      if (searchContainer) {
        const computedStyle = window.getComputedStyle(searchContainer);
        console.log('搜索容器计算样式:', {
          display: computedStyle.display,
          flexDirection: computedStyle.flexDirection,
          height: computedStyle.height
        });
      }
    


    




    // 测试搜索引导功能
    window.testSearchGuide = function() {
      console.log('=== 测试搜索引导功能 ===');
      
      // 模拟搜索结果
      currentSearchKeyword = '测试';
      searchResultsData = {
        0: {
          chapterIndex: 0,
          chapterTitle: '第一章',
          excerpts: ['测试内容1', '测试内容2'],
          positions: [10, 50]
        },
        1: {
          chapterIndex: 1,
          chapterTitle: '第二章',
          excerpts: ['测试内容3'],
          positions: [20]
        }
      };
      currentSearchIndex = 0;
      isInSearchMode = true;
      
      // 显示搜索引导
      showSearchGuide('测试', 0);
      console.log('搜索引导已显示');
    };

    // 验证搜索数据结构
    window.validateSearchDataStructure = function() {
      console.log('=== 验证搜索数据结构 ===');
      console.log('searchResults类型:', typeof searchResults);
      console.log('searchResults是否为数组:', Array.isArray(searchResults));
      console.log('searchResults是否为对象:', typeof searchResults === 'object' && !Array.isArray(searchResults));
      console.log('searchResults键数量:', Object.keys(searchResults).length);
      console.log('searchResults内容:', searchResults);
      
      if (typeof searchResults === 'object' && !Array.isArray(searchResults)) {
        console.log('✅ 搜索数据结构正确（对象形式）');
      } else {
        console.log('❌ 搜索数据结构错误（应该是对象形式）');
      }
      
      // 检查章节数据
      console.log('=== 章节数据检查 ===');
      console.log('flatChapters类型:', typeof flatChapters);
      console.log('flatChapters长度:', flatChapters?.length);
      if (flatChapters && flatChapters.length > 0) {
        console.log('第一个章节:', {
          title: flatChapters[0].title,
          contentLength: flatChapters[0].content?.length,
          contentPreview: flatChapters[0].content?.substring(0, 100) + '...'
        });
      }
      
      // 检查全局变量
      console.log('=== 全局变量检查 ===');
      console.log('currentSearchKeyword:', currentSearchKeyword);
      console.log('currentSearchIndex:', currentSearchIndex);
      console.log('isInSearchMode:', isInSearchMode);
    };

    // 检查搜索容器状态
    window.checkSearchContainers = function() {
      console.log('=== 检查搜索容器状态 ===');
      
      const searchContainer = document.querySelector('.search-main-container');
      const statContainer = document.getElementById('searchResultStat');
      const listContainer = document.getElementById('searchResultList');
      const searchKeyword = document.getElementById('searchKeyword');
      
      console.log('搜索主容器:', searchContainer);
      console.log('统计容器:', statContainer);
      console.log('列表容器:', listContainer);
      console.log('搜索关键词输入框:', searchKeyword);
      
      if (searchContainer) {
        console.log('搜索容器显示状态:', searchContainer.style.display);
        console.log('搜索容器可见性:', searchContainer.style.visibility);
        console.log('搜索容器计算样式:', window.getComputedStyle(searchContainer).display);
        console.log('搜索容器位置:', searchContainer.getBoundingClientRect());
      }
      
      if (statContainer) {
        console.log('统计容器显示状态:', statContainer.style.display);
        console.log('统计容器可见性:', statContainer.style.visibility);
        console.log('统计容器计算样式:', window.getComputedStyle(statContainer).display);
        console.log('统计容器内容:', statContainer.innerHTML.substring(0, 100) + '...');
      }
      
      if (listContainer) {
        console.log('列表容器显示状态:', listContainer.style.display);
        console.log('列表容器可见性:', listContainer.style.visibility);
        console.log('列表容器计算样式:', window.getComputedStyle(listContainer).display);
        console.log('列表容器子元素数量:', listContainer.children.length);
        console.log('列表容器内容长度:', listContainer.innerHTML.length);
        console.log('列表容器内容预览:', listContainer.innerHTML.substring(0, 200) + '...');
      }
      
      // 检查父容器状态
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        console.log('主内容区域显示状态:', mainContent.style.display);
        console.log('主内容区域计算样式:', window.getComputedStyle(mainContent).display);
      }
      
      // 检查当前模式
      console.log('当前模式:', {
        isInSearchMode: typeof isInSearchMode !== 'undefined' ? isInSearchMode : 'undefined',
        currentMode: typeof currentMode !== 'undefined' ? currentMode : 'undefined'
      });
      
      if (!searchContainer) {
        console.log('❌ 搜索主容器不存在，需要先切换到搜索模式');
        console.log('建议执行: switchToSearch()');
      }
      
      if (!statContainer || !listContainer) {
        console.log('❌ 搜索结果容器不存在，可能需要重新创建搜索页面');
        console.log('建议执行: renderSearchPage()');
      }
      
      // 提供修复建议
      console.log('=== 修复建议 ===');
      if (!searchContainer) {
        console.log('1. 执行 renderSearchPage() 创建搜索页面');
        console.log('2. 执行 switchToSearch() 切换到搜索模式');
      } else if (!statContainer || !listContainer) {
        console.log('1. 执行 renderSearchPage() 重新创建搜索页面');
      } else if (listContainer.children.length === 0) {
        console.log('1. 执行 directSearch() 测试搜索功能');
        console.log('2. 检查 flatChapters 数据是否正确');
      }
    };

    // 系统性诊断搜索问题
    window.diagnoseSearchIssues = function() {
      console.log('=== 系统性诊断搜索问题 ===');
      
      const diagnosis = {
        issues: [],
        warnings: [],
        recommendations: []
      };
      
      // 1. 检查基础环境
      if (!flatChapters || flatChapters.length === 0) {
        diagnosis.issues.push('没有加载书籍数据');
        diagnosis.recommendations.push('请先上传书籍文件');
        return diagnosis;
      }
      
      // 2. 检查搜索数据一致性
      const searchDataKeys = Object.keys(searchResultsData || {}).length;
      const searchKeys = Object.keys(searchResults || {}).length;
      const allResultsLength = allSearchResults.length;
      
      if (searchDataKeys !== searchKeys) {
        diagnosis.warnings.push('搜索结果数据不一致');
        diagnosis.recommendations.push('调用 fixSearchResultsData() 修复数据');
      }
      
      // 3. 检查章节筛选设置
      const startInput = document.getElementById('searchStartChapter');
      const endInput = document.getElementById('searchEndChapter');
      
      if (startInput && endInput) {
        const start = parseInt(startInput.value) || 1;
        const end = parseInt(endInput.value) || flatChapters.length;
        
        if (start > end) {
          diagnosis.issues.push('起始章节大于结束章节');
          diagnosis.recommendations.push('调整章节筛选范围');
        }
        
        if (start < 1 || start > flatChapters.length) {
          diagnosis.warnings.push('起始章节超出有效范围');
        }
        
        if (end < 1 || end > flatChapters.length) {
          diagnosis.warnings.push('结束章节超出有效范围');
        }
      }
      
      // 4. 检查搜索状态
      if (isSearching) {
        diagnosis.warnings.push('当前正在搜索中');
      }
      
      // 5. 检查缓存状态
      if (searchCache.size > MAX_CACHE_SIZE) {
        diagnosis.warnings.push('搜索缓存过大');
        diagnosis.recommendations.push('清理搜索缓存');
      }
      
      // 6. 检查搜索结果质量
      if (allResultsLength > 0) {
        const avgResultsPerChapter = allResultsLength / searchDataKeys;
        if (avgResultsPerChapter > 100) {
          diagnosis.warnings.push('搜索结果过多，可能影响性能');
          diagnosis.recommendations.push('使用更精确的关键词或缩小搜索范围');
        }
      }
      
      // 7. 检查DOM元素状态
      const searchContainer = document.querySelector('.search-main-container');
      const statContainer = document.getElementById('searchResultStat');
      const listContainer = document.getElementById('searchResultList');
      
      if (!searchContainer) {
        diagnosis.issues.push('搜索容器不存在');
        diagnosis.recommendations.push('执行 renderSearchPage() 创建搜索页面');
      }
      
      if (!statContainer || !listContainer) {
        diagnosis.warnings.push('搜索结果容器不存在');
        diagnosis.recommendations.push('执行 renderSearchPage() 重新创建搜索页面');
      }
      
      // 输出诊断结果
      console.log('诊断结果:', diagnosis);
      
      if (diagnosis.issues.length > 0) {
        console.error('❌ 发现严重问题:', diagnosis.issues);
      }
      
      if (diagnosis.warnings.length > 0) {
        console.warn('⚠️ 发现警告:', diagnosis.warnings);
      }
      
      if (diagnosis.recommendations.length > 0) {
        console.log('💡 建议:', diagnosis.recommendations);
      }
      
      return diagnosis;
    };

    // 快速修复搜索问题
    window.fixSearchIssues = function() {
      console.log('=== 快速修复搜索问题 ===');
      
      const fixes = [];
      
      // 1. 修复数据一致性
      if (typeof fixSearchResultsData === 'function') {
        fixSearchResultsData();
        fixes.push('修复了搜索结果数据一致性');
      }
      
      // 2. 重新创建搜索页面
      if (typeof renderSearchPage === 'function') {
        renderSearchPage();
        fixes.push('重新创建了搜索页面');
      }
      
      // 3. 清理缓存
      if (searchCache.size > MAX_CACHE_SIZE) {
        searchCache.clear();
        fixes.push('清理了搜索缓存');
      }
      
      // 4. 重置搜索状态
      if (isSearching) {
        isSearching = false;
        if (searchAbortController) {
          searchAbortController.abort();
        }
        fixes.push('重置了搜索状态');
      }
      
      console.log('修复完成:', fixes);
      return fixes;
    };

    // 3. 键盘左右键切换章节/结果
    window.addEventListener('keydown', function(e) {
      if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;
      if (isInSearchMode) {
        if (e.key === 'ArrowLeft') {
          goToPreviousSearchChapter();
          e.preventDefault();
        } else if (e.key === 'ArrowRight') {
          goToNextSearchChapter();
          e.preventDefault();
        }
      } else {
        if (e.key === 'ArrowLeft') {
          goPrev();
          e.preventDefault();
        } else if (e.key === 'ArrowRight') {
          goNext();
          e.preventDefault();
        }
      }
    });

    // ========== HTML转义函数 ==========    
    function escapeHTML(str) {
      return String(str).replace(/[&<>"']/g, function(c) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[c];
      });
    }
    
    // 优化自动翻页功能：添加滚动位置检测，当用户滚动到接近底部时就加载下一章
    function enhanceAutoPaging() {
      // 使用全局的chapterContent变量
      if (!chapterContent) {
        chapterContent = document.getElementById('chapterContent');
      }
      
      // 移除现有的滚动事件监听器（如果有）
      const newChapterContent = chapterContent;
      
      // 移除可能存在的旧监听器
      const newClone = newChapterContent.cloneNode(false);
      while (newChapterContent.firstChild) {
        newClone.appendChild(newChapterContent.firstChild);
      }
      newChapterContent.parentNode.replaceChild(newClone, newChapterContent);
      chapterContent = newClone;
      chapterContent.id = 'chapterContent';
      
      // 添加优化的滚动事件监听器，使用全局的防抖定时器
      chapterContent.addEventListener('scroll', function() {
        // 使用防抖避免频繁触发
        if (scrollDebounceTimer) {
          clearTimeout(scrollDebounceTimer);
        }
        
        // 获取左右翻页状态
        const isTraditionalTurning = window.renderVariables.isTraditionalPageTurningEnabled;
        
        // 在左右翻页模式下或滚动恢复期间，不触发自动加载功能
        if (isTraditionalTurning || isScrollingRestored) {
          return;
        }
        
        // 检查是否应该启用滚动加载功能
        // 如果自动上下翻页功能已开启，则启用
        const shouldEnableScrolling = window.renderVariables.isSeamlessScrollingEnabled;
        
        if (shouldEnableScrolling) {
          // 当滚动到距离底部100px时就开始加载
          if (this.scrollHeight - this.scrollTop <= this.clientHeight + 100) {
            scrollDebounceTimer = setTimeout(() => {
              if (window.loadNextChapterSeamlessly) {
                window.loadNextChapterSeamlessly();
              }
            }, SCROLL_DEBOUNCE_DELAY); // 使用统一的防抖延迟时间
          }
          // 当滚动到顶部时触发自动加载上一章
          else if (this.scrollTop <= 50) {
            scrollDebounceTimer = setTimeout(() => {
              if (window.loadPrevChapterSeamlessly) {
                window.loadPrevChapterSeamlessly();
              }
            }, SCROLL_DEBOUNCE_DELAY); // 使用统一的防抖延迟时间
          }
        }
      });
      
      console.log('自动翻页功能已优化 - 使用轻量级DOM操作和统一防抖设置');
      
      // 重新应用所有阅读页设置，确保新的chapterContent元素也应用相同的设置
      applyCurrentFontSettings();
      applyLineHeightToDOM(window.renderVariables.lineHeight);
      applyParagraphSpacingToDOM(window.renderVariables.paragraphSpacing);
      applyContentMarginsToDOM();
      
      return chapterContent;
    }
    
    // 这些函数在前面已经定义并暴露到全局，这里不再重复定义
    
    // 在页面加载完成后初始化自动翻页功能
    document.addEventListener('DOMContentLoaded', function() {
      // 不再在这里初始化自动翻页功能，而是在文件导入后再初始化
      console.log('阅读器已初始化，等待文件导入...');
      
      // 尝试自动加载上次打开的文件
      tryAutoLoadLastFile();
    });
    
    // 缓存管理对话框
    async function openCacheManagementDialog() {
      // 获取当前缓存信息
      const cacheInfo = await getCacheInfo();
      
      // 获取存储详情数据
      const storageDetailsData = await getStorageDetailsData();
      
      // 创建内容
      const content = `
        <style>
          /* Tab 样式 */
          .tab-container {
            display: flex;
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 16px;
          }
          
          .tab {
            padding: 12px 24px;
            cursor: pointer;
            background-color: transparent;
            border: none;
            border-bottom: 2px solid transparent;
            color: var(--text-color);
            font-weight: 500;
            transition: all 0.2s ease;
            flex: 1;
            text-align: center;
          }
          
          .tab.active {
            border-bottom-color: var(--accent-color);
            color: var(--accent-color);
            background-color: rgba(12, 140, 233, 0.05);
          }
          
          .tab-content {
            display: none;
            min-height: 200px;
          }
          
          .tab-content.active {
            display: block;
          }
          
          /* 缓存统计概览样式 */
          .storage-summary {
            background-color: rgba(0, 0, 0, 0.03);
            border-bottom: 1px solid var(--border-color);
            padding: 16px 20px;
            margin-bottom: 16px;
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            align-items: center;
          }
          
          .summary-item {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .summary-label {
            font-size: 14px;
            color: var(--text-color);
            font-weight: 500;
          }
          
          .summary-value {
            font-size: 16px;
            font-weight: bold;
            color: var(--accent-color);
          }
          
          /* 文件卡片样式 */
          .cache-book-card {
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
            background-color: var(--background-color);
            transition: all 0.2s ease;
            position: relative;
          }
          
          .cache-book-card:hover {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transform: translateY(-2px);
          }
          
          .cache-book-card.selected {
            border-color: var(--accent-color);
            background-color: rgba(12, 140, 233, 0.05);
            box-shadow: 0 0 0 2px rgba(12, 140, 233, 0.2);
          }
          
          .cache-book-card.selectable {
            cursor: pointer;
          }
          
          /* 按钮禁用状态样式 */
          .settings-dialog-btn.disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          
          .book-card-header {
            margin-bottom: 12px;
          }
          
          .book-title {
            margin: 0;
            font-size: 16px;
            font-weight: 500;
            color: var(--text-color);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          
          .book-info {
            margin-bottom: 12px;
          }
          
          .book-info-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            color: var(--text-color);
            margin-bottom: 6px;
          }
          
          .book-info-item:last-child {
            margin-bottom: 0;
          }
          
          .book-info-icon {
            font-size: 16px;
          }
          
          .book-last-read {
            font-size: 12px;
            color: var(--text-color);
            opacity: 0.7;
            margin-bottom: 12px;
            overflow-wrap: break-word;
            word-break: break-all;
          }
          
          .recent-file-actions {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
          }
          
          .file-action-btn {
            padding: 6px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s ease;
            background-color: var(--accent-color);
            color: white;
            min-width: 60px;
          }
          
          .file-action-btn:hover {
            background-color: var(--accent-color);
            opacity: 0.9;
          }
          
          .file-action-btn.delete {
            background-color: var(--error-color);
            color: white;
          }
          
          .file-action-btn.delete:hover {
            background-color: var(--error-hover-color);
            color: white;
          }
          
          /* 存储详情卡片样式 */
          .storage-item-card {
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
            background-color: var(--background-color);
          }
          
          .storage-item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
          }
          
          .storage-item-info {
            flex: 1;
          }
          
          .storage-item-name {
            margin: 0 0 8px 0;
            font-size: 15px;
            font-weight: 500;
            color: var(--text-color);
          }
          
          .storage-item-stats {
            display: flex;
            gap: 12px;
            font-size: 13px;
            color: var(--text-color);
          }
          
          .storage-item-actions {
            display: flex;
            gap: 8px;
          }
          
          /* 文件组样式 */
          .file-group-section {
            margin-bottom: 24px;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            overflow: hidden;
            background-color: var(--background-color);
          }
          
          .file-group-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            background-color: rgba(0, 0, 0, 0.03);
            border-bottom: 1px solid var(--border-color);
          }
          
          .file-group-header h4 {
            margin: 0;
            font-size: 16px;
            font-weight: 500;
            color: var(--text-color);
          }
          
          .file-group-items {
            padding: 16px;
          }
          
          /* 类型标签样式 */
          .type-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-right: 8px;
          }
          
          .type-file_content {
            background-color: rgba(12, 140, 233, 0.1);
            color: var(--accent-color);
          }
          
          .type-progress {
            background-color: rgba(56, 142, 60, 0.1);
            color: var(--success-color);
          }
          
          .type-chapters {
            background-color: rgba(245, 124, 0, 0.1);
            color: var(--warning-color);
          }
          
          .type-recent_files,
          .type-last_file {
            background-color: rgba(12, 140, 233, 0.1);
            color: var(--accent-color);
          }
          
          .type-other {
            background-color: rgba(0, 0, 0, 0.03);
            color: var(--text-color);
          }
          
          /* 存储容器样式 */
          .storage-items-container {
            padding: 4px 0;
          }
          
          /* 缓存管理对话框特定按钮样式 */
          .cache-management-dialog .settings-dialog-btn {
            width: auto;
            min-width: 100px;
          }
          
          /* 缓存操作区域样式 */
          .cache-actions {
            margin-top: 20px;
            padding-top: 16px;
            border-top: 1px solid var(--border-color);
          }
          
          .action-group {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
          }
          
          /* 笔记管理相关样式 */
          /* 笔记管理相关样式 */
          .notes-controls {
            margin-bottom: 20px;
            text-align: right;
            display: flex;
            justify-content: flex-end;
            flex-wrap: wrap;
            gap: 12px;
          }
          
          .notes-list {
            max-height: 400px;
            overflow-y: auto;
            padding-right: 4px;
          }
          
          /* 任务列表样式笔记 */
          .notes-progress {
            padding: 16px 0;
            margin-bottom: 20px;
            border-bottom: 1px solid var(--border-color);
          }
          
          .notes-progress .progress-text {
            font-size: 14px;
            color: var(--secondary-text-color, #666);
            margin-bottom: 10px;
          }
          
          /* 空笔记提示信息样式 */
          .notes-empty {
            text-align: center;
            padding: 60px 20px;
            color: var(--secondary-text-color, #666);
            font-size: 14px;
          }
          
          .progress-bar-small {
            width: 100%;
            height: 6px;
            background-color: var(--border-color);
            border-radius: 3px;
            overflow: hidden;
          }
          
          .progress-fill-small {
            height: 100%;
            background-color: var(--accent-color);
            transition: width 0.3s ease;
          }
          
          /* 笔记列表 - 极简扁平化设计 */
          .notes-task-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          
          /* 笔记任务列表容器 */
          .notes-task-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-top: 0;
          }
          
          .note-task-item {
            display: flex;
            align-items: flex-start;
            padding: 16px;
            background-color: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          .note-task-item:hover {
            background-color: rgba(255, 255, 255, 0.05);
            border-color: rgba(99, 102, 241, 0.3);
          }
          
          .note-task-item.note-completed {
            background-color: rgba(99, 102, 241, 0.05);
            border-color: rgba(99, 102, 241, 0.2);
          }
          
          .note-task-item.note-completed:hover {
            background-color: rgba(99, 102, 241, 0.08);
          }
          
          .note-task-header {
            display: flex;
            align-items: flex-start;
            width: 100%;
            gap: 12px;
          }
          
          .note-task-number {
            font-size: 12px;
            color: var(--secondary-text-color);
            min-width: 20px;
            text-align: right;
            margin-top: 3px;
          }
          
          .note-task-checkbox {
            width: 18px;
            height: 18px;
            margin-top: 2px;
            margin-right: 12px;
            cursor: pointer;
            accent-color: var(--accent-color);
            background-color: transparent;
            border: 1px solid var(--border-color);
            border-radius: 4px;
          }
          
          .note-task-content-container {
            flex: 1;
            min-width: 0;
          }
          
          .note-task-content {
            font-size: 14px;
            line-height: 1.4;
            color: var(--text-color);
            word-wrap: break-word;
            margin-bottom: 4px;
            font-weight: 500;
          }
          
          /* 增强任务内容样式区分 */
          .note-task-content {
            transition: all 0.3s ease;
          }
          
          .note-task-content.note-completed {
            text-decoration: line-through 2px;
            color: var(--disabled-text-color, #999);
            font-style: italic;
          }
          
          /* 未完成任务强调样式 */
          .note-task-item:not(.note-completed) .note-task-content {
            color: var(--text-color);
            font-weight: 500;
          }
          
          .note-task-time {
            font-size: 12px;
            color: var(--secondary-text-color);
            margin-top: 6px;
            line-height: 1.4;
          }
          
          .note-original-text {
            color: var(--secondary-text-color, #666);
            font-style: italic;
            margin-bottom: 8px;
            font-size: 14px;
            line-height: 1.4;
          }
          
          /* 增强任务项完整样式区分 */
          .note-task-item {
            transition: all 0.3s ease;
          }
          
          .note-task-item.note-completed {
            background-color: rgba(0, 0, 0, 0.05);
          }
          
          .note-task-item:not(.note-completed) {
            background-color: var(--card-background);
          }
          
          .note-task-item.note-completed .note-task-content {
            text-decoration: line-through 2px;
            color: var(--disabled-text-color, #999);
            font-style: italic;
          }
          
          .note-task-item.note-completed .note-original-text {
            text-decoration: line-through 2px;
            color: var(--disabled-text-color, #999);
            opacity: 0.8;
          }
          
          /* 笔记操作按钮样式 */
          .note-task-actions {
            display: flex;
            gap: 10px;
            margin-top: 12px;
          }
          
          .note-action-btn {
            padding: 6px 20px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
            font-weight: 500;
          }
          
          .edit-btn {
            background-color: #6366f1;
            color: white;
          }
          
          .edit-btn:hover {
            background-color: #4f46e5;
            transform: translateY(-1px);
          }
          
          .delete-btn {
            background-color: #f87171;
            color: white;
          }
          
          .delete-btn:hover {
            background-color: #ef4444;
            transform: translateY(-1px);
          }
          
          /* 文本选择迷你菜单样式 */
          .selection-menu-btn {
            display: inline-block;
            padding: 6px 12px;
            margin: 0;
            border: none;
            background: none;
            color: #333;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s;
          }
          
          .selection-menu-btn:hover {
            background-color: #f5f5f5;
          }
          
          .selection-menu-btn:not(:last-child) {
            border-right: 1px solid #ddd;
          }
          
          /* 响应式设计 */
          @media (max-width: 768px) {
            /* 缓存管理对话框响应式 */
            .settings-dialog.cache-management-dialog {
              width: 95vw !important;
              max-width: 95vw !important;
              max-height: 90vh !important;
            }
            
            .settings-dialog.cache-management-dialog .recent-files-list {
              width: 100% !important;
            }
            
            .storage-summary {
              flex-direction: column;
              align-items: flex-start;
              gap: 12px;
            }
            
            .summary-item {
              width: 100%;
              justify-content: space-between;
            }
            
            .recent-file-actions {
              flex-wrap: wrap;
            }
            
            .file-action-btn {
              flex: 1;
              min-width: 0;
            }
            
            .action-group {
              flex-direction: column;
            }
            
            .settings-dialog-btn {
              width: 100%;
            }
            
            /* 笔记管理移动端适配 */
            .notes-controls {
              flex-direction: column;
              align-items: flex-end;
            }
            
            .notes-controls select {
              width: 100%;
              max-width: 200px;
            }
            
            .note-task-item {
              padding: 12px;
            }
            
            .note-task-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 8px;
            }
            
            .note-task-actions {
              margin-left: 0;
              margin-top: 8px;
              align-self: flex-end;
            }
            
            .note-action-btn {
              padding: 4px 12px;
              font-size: 11px;
            }
          }
        </style>
        
        <div class="settings-dialog-content">
          <!-- 最近文件和储存管理合并为一页 -->
          <div class="merged-content">
            <!-- 最近文件部分 -->
            <div class="section-header">最近文件</div>
            <div class="recent-files-list">
              ${cacheInfo.recentFilesHtml}
            </div>
            
            <!-- 分割线 -->
            <div class="section-divider"></div>
            
            <!-- 存储管理部分 -->
            <div class="section-header">存储管理</div>
            <!-- 存储统计概览 - 使用缓存概览样式 -->
            <div class="storage-summary">
              <div class="summary-item">
                <span class="summary-label">总缓存大小:</span>
                <span class="summary-value">${storageDetailsData.totalSize}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">缓存项总数:</span>
                <span class="summary-value">${storageDetailsData.totalItems}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">localStorage大小:</span>
                <span class="summary-value">${storageDetailsData.localStorageSize}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">IndexedDB大小:</span>
                <span class="summary-value">${storageDetailsData.indexedDBSize}</span>
              </div>
            </div>
            <div class="storage-items-container">
              ${storageDetailsData.storageItemsHtml}
            </div>
          </div>
          
          <!-- 缓存管理操作 - 只保留清空所有缓存和关闭按钮 -->
          <div class="cache-actions">
            <div class="action-group">
              <button class="settings-dialog-btn danger" onclick="clearAllCache()">清空所有缓存</button>
              <button class="settings-dialog-btn primary" onclick="closeCacheManagementDialog()">关闭</button>
            </div>
          </div>
          
          <style>
            .merged-content {
              margin-bottom: 20px;
            }
            .section-header {
              font-size: 16px;
              font-weight: 600;
              margin-bottom: 12px;
              color: var(--text-color);
            }
            .section-divider {
              height: 1px;
              background-color: var(--border-color);
              margin: 20px 0;
            }
          </style>
        </div>
      `;
      
      // 使用ModalSystem创建弹窗
      ModalSystem.createModal({
        id: 'cacheManagementDialog',
        title: '文件管理',
        content: content,
        buttons: [],
        closeOnOverlayClick: true,
        onOpen: function() {
          // 为文件卡片添加点击选中事件
          setupFileCardSelection();
        }
      });
    }
    
    // 关闭缓存管理对话框
    function closeCacheManagementDialog() {
      ModalSystem.closeModal('cacheManagementDialog');
    }
    
    // 打开初始化设置对话框

    
    // 设置文件卡片选择功能 - 适配合并后的布局
    function setupFileCardSelection() {
      // 为文件卡片添加点击选中事件，但不影响底部按钮状态，因为我们只保留了清空所有缓存和关闭按钮
      const fileCards = document.querySelectorAll('.cache-book-card');
      fileCards.forEach(card => {
        // 移除选择相关的样式和功能，因为合并后的布局只需要单个文件操作
        card.classList.remove('selectable', 'selected');
      });
    }
    
    // 重置文件选中状态
    function resetFileSelections() {
      const fileCards = document.querySelectorAll('.cache-book-card');
      fileCards.forEach(card => {
        card.classList.remove('selected');
      });
    }
    
    // 更新底部操作按钮状态 - 适配合并后的布局
    function updateActionButtonsState() {
      // 由于合并后的布局只保留了"清空所有缓存"和"关闭"按钮
      // 这些按钮不受文件选择状态影响，所以此函数简化为空
    }
    
    // 删除选中的文件 - 适配合并后的布局
    function deleteSelectedFiles() {
      showToast('请使用文件卡片上的删除按钮单独删除文件', 'warning');
    }
    
    // 打开选中的文件 - 适配合并后的布局
    function openSelectedFile() {
      showToast('请使用文件卡片上的打开按钮单独打开文件', 'warning');
    }
    
    // 获取缓存信息
    async function getCacheInfo() {
      let itemCount = 0;
      let totalSize = 0;
      let recentFilesHtml = '';
      let indexedDBFileCount = 0;
      let indexedDBSize = '0 B';
      
      // 遍历localStorage计算大小
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('reader_')) {
          itemCount++;
          const value = localStorage.getItem(key);
          totalSize += new Blob([value]).size;
        }
      }
      
      // 格式化localStorage大小
      let estimatedSize = '';
      if (totalSize < 1024) {
        estimatedSize = totalSize + ' B';
      } else if (totalSize < 1024 * 1024) {
        estimatedSize = (totalSize / 1024).toFixed(2) + ' KB';
      } else {
        estimatedSize = (totalSize / (1024 * 1024)).toFixed(2) + ' MB';
      }
      
      // 获取IndexedDB缓存信息
      try {
        const indexedDBInfo = await getIndexedDBInfo();
        indexedDBFileCount = indexedDBInfo.fileCount;
        indexedDBSize = indexedDBInfo.size;
      } catch (error) {
        console.error('获取IndexedDB信息失败:', error);
        indexedDBFileCount = 0;
        indexedDBSize = '无法获取';
      }
      
      // 获取最近文件列表（卡片样式）
      try {
        console.log('尝试加载最近文件列表...');
        
        // 检查localStorage是否可用
        if (typeof localStorage === 'undefined') {
          throw new Error('浏览器不支持localStorage');
        }
        
        // 获取并验证最近文件数据
        const recentFilesData = localStorage.getItem('reader_recent_files');
        console.log('reader_recent_files数据:', recentFilesData);
        
        let recentFiles = [];
        if (recentFilesData) {
          try {
            recentFiles = JSON.parse(recentFilesData);
            // 验证数据格式
            if (!Array.isArray(recentFiles)) {
              throw new Error('最近文件数据格式错误，应为数组');
            }
          } catch (parseError) {
            console.error('解析最近文件数据失败:', parseError);
            // 提供修复选项
            recentFilesHtml = `
              <div class="error-message">
                <p>最近文件数据格式错误</p>
                <button class="settings-dialog-btn danger" onclick="localStorage.removeItem('reader_recent_files'); openCacheManagementDialog();">
                  重置最近文件列表
                </button>
              </div>
            `;
            // 继续执行，不抛出异常
          }
        }
        
        // 如果没有遇到解析错误并且文件列表有内容
        if (!recentFilesHtml && recentFiles.length > 0) {
          // 创建表格标题行
          recentFilesHtml = `
            <table class="recent-files-table">
              <thead>
                <tr>
                  <th>文件名</th>
                  <th>章节数</th>
                  <th>进度</th>
                  <th>人名</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
          `;
          
          // 遍历文件列表生成表格内容行
          recentFiles.forEach((file) => {
            // 获取书籍的缓存信息
            let chapterCount = 0;
            let nameCount = 0;
            let readPages = '0'; // 初始化readPages变量，避免未定义错误
            let progressPercentage = 0;
            try {
              const progressData = localStorage.getItem('reader_progress_' + file.id);
              if (progressData) {
                const data = JSON.parse(progressData);
                chapterCount = data.chapterCount || 0;
                
                // 统计人名数
                if (data.nameGroups && typeof data.nameGroups === 'object') {
                  if (Array.isArray(data.nameGroups)) {
                    // 处理数组格式
                    for (const group of data.nameGroups) {
                      if (group && group.names && Array.isArray(group.names)) {
                        nameCount += group.names.length;
                      }
                    }
                  } else {
                    // 处理对象格式
                    for (const groupId in data.nameGroups) {
                      const group = data.nameGroups[groupId];
                      if (group && group.names && Array.isArray(group.names)) {
                        nameCount += group.names.length;
                      }
                    }
                  }
                }
                if (data.currentNames && Array.isArray(data.currentNames)) {
                  nameCount += data.currentNames.length;
                }
                
                // 获取当前阅读页数和进度
                if (data.currentIndex !== undefined) {
                  readPages = (data.currentIndex + 1).toString();
                  if (chapterCount > 0) {
                    progressPercentage = Math.round(((data.currentIndex + 1) / chapterCount) * 100);
                  }
                }
              }
            } catch (e) {
              console.error(`解析文件${file.name}的进度数据失败:`, e);
            }
            
            // 隐藏文件名中的.txt后缀
            let displayName = file.name;
            if (displayName.toLowerCase().endsWith('.txt')) {
              displayName = displayName.substring(0, displayName.length - 4);
            }
            
            // 限制章节名长度为40个字符
            if (displayName.length > 40) {
              displayName = displayName.substring(0, 40) + '...';
            }
            
            // 生成表格行
            recentFilesHtml += `
              <tr>
                <td class="file-name-cell">
                  <div class="file-name">${escapeHTML(displayName)}</div>
                </td>
                <td>${chapterCount || '未知'}</td>
                <td>${readPages}/${chapterCount || '?'}</td>
                <td>${nameCount}</td>
                <td class="action-cell">
                  <button class="file-action-btn small" onclick="loadCachedFile('${file.id}', '${escapeHTML(file.name)}'); closeCacheManagementDialog();" title="打开文件">
                    打开
                  </button>
                  <button class="file-action-btn small delete" onclick="removeCachedFile('${file.id}', '${escapeHTML(file.name)}');" title="删除缓存">
                    删除
                  </button>
                </td>
              </tr>
            `;
          });
          
          // 闭合表格标签
          recentFilesHtml += `
              </tbody>
            </table>
            <style>
              .recent-files-list {
                background-color: var(--background-color);
              }
              .recent-files-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 14px;
              }
              .recent-files-table th {
                text-align: left;
                padding: 12px 15px;
                background-color: var(--background-color);
                color: var(--text-color);
                font-weight: 600;
                border-bottom: 2px solid var(--border-color);
              }
              .recent-files-table td {
                padding: 12px 15px;
                border-bottom: 1px solid var(--border-color);
                vertical-align: middle;
              }
              .recent-files-table tr:hover {
                background-color: var(--nav-hover);
              }
              .file-name-cell {
                min-width: 200px;
              }
              .file-name {
                font-weight: 500;
                color: var(--text-color);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .action-cell {
                text-align: right;
                white-space: nowrap;
              }
              .file-action-btn.small {
                padding: 6px 12px;
                font-size: 12px;
                margin-left: 5px;
              }
            </style>
          `;
        } else if (!recentFilesHtml) {
          recentFilesHtml = '<div class="no-files-message">暂无最近打开的文件</div>';
        }
        
        console.log('最近文件列表加载成功');
      } catch (e) {
        console.error('加载最近文件列表失败:', e);
        recentFilesHtml = `
          <div class="error-message">
            <p>无法加载最近文件列表: ${e.message}</p>
            <button class="settings-dialog-btn danger" onclick="localStorage.removeItem('reader_recent_files'); openCacheManagementDialog();">
              重置最近文件列表
            </button>
          </div>
        `;
      }
      
      return {
        itemCount,
        estimatedSize,
        recentFilesHtml,
        indexedDBFileCount,
        indexedDBSize
      };
    }
    
    // 清空所有缓存
    async function clearAllCache() {
      if (confirm('确定要清空所有缓存吗？这将删除所有阅读进度和设置！')) {
        // 记录当前所有localStorage项，以便在调试时查看
        const beforeKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
          beforeKeys.push(localStorage.key(i));
        }
        console.log('清除缓存前的localStorage项:', beforeKeys);
        
        // 删除所有reader_开头的localStorage项
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key.startsWith('reader_')) {
            console.log('删除localStorage项:', key);
            localStorage.removeItem(key);
          }
        }
        
        // 同时清除IndexedDB中的所有文件内容
        try {
          await clearAllIndexedDBFiles();
          console.log('IndexedDB缓存已清空');
        } catch (error) {
          console.error('清空IndexedDB缓存失败:', error);
        }
        
        // 重置渲染变量，确保内存中的人名信息也被清除
        if (window.renderVariables) {
          window.renderVariables.nameGroups = { group1: { color: '#1976d2', names: [] } };
          window.renderVariables.currentNames = [];
          window.renderVariables.disabledNames = [];
          window.renderVariables.globalNameColorMap = {};
          updateLocalRenderVariables();
        }
        
        showToast('所有缓存已清空', 'success');
        closeCacheManagementDialog();
        setTimeout(() => {
          location.reload();
        }, 500);
      }
    }
    
    // 清除进度缓存和文件内容缓存
    async function clearProgressCache() {
      if (confirm('确定要清除所有阅读进度和文件内容缓存吗？')) {
        // 删除所有与进度、内容和人名高亮相关的localStorage项
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key.startsWith('reader_progress_') || 
              key.startsWith('reader_file_content_') || 
              key.startsWith('reader_name_groups_') || 
              key.startsWith('reader_name_highlight_')) {
            localStorage.removeItem(key);
          }
        }
        
        // 同时清除IndexedDB中的所有文件内容
        try {
          await clearAllIndexedDBFiles();
          console.log('IndexedDB文件内容缓存已清空');
        } catch (error) {
          console.error('清空IndexedDB缓存失败:', error);
        }
        
        showToast('进度和文件内容缓存已清空', 'success');
        
        // 刷新对话框内容
        if (document.getElementById('cacheManagementDialog')) {
          closeCacheManagementDialog();
          openCacheManagementDialog();
        }
      }
    }
    
    // 清除最近文件列表
    function clearRecentFiles() {
      if (confirm('确定要清除最近文件列表吗？')) {
        localStorage.removeItem('reader_recent_files');
        localStorage.removeItem('reader_last_file');
        
        showToast('最近文件列表已清空', 'success');
        
        // 刷新对话框内容
        if (document.getElementById('cacheManagementDialog')) {
          closeCacheManagementDialog();
          openCacheManagementDialog();
        }
      }
    }
    
    // 获取IndexedDB缓存信息
    async function getIndexedDBInfo() {
      return openDB().then(db => {
        return new Promise((resolve, reject) => {
          const transaction = db.transaction([STORE_NAME], 'readonly');
          const store = transaction.objectStore(STORE_NAME);
          const request = store.getAll();
          let totalSize = 0;
          
          request.onsuccess = function(event) {
            const allFiles = event.target.result;
            const fileCount = allFiles.length;
            
            // 计算总大小 - 改进版本，更准确地计算文件大小
            allFiles.forEach(file => {
              if (file.content) {
                // 对于字符串内容，使用TextEncoder计算更准确的字节大小
                if (typeof file.content === 'string') {
                  const encoder = new TextEncoder();
                  const encoded = encoder.encode(file.content);
                  totalSize += encoded.byteLength;
                } else {
                  // 对于其他类型的内容，使用Blob
                  totalSize += new Blob([file.content]).size;
                }
              }
              
              // 也计算其他元数据的大小
              if (file.name) totalSize += file.name.length * 2; // 估算文件名大小
              if (file.timestamp) totalSize += 8; // 时间戳大小
            });
            
            // 改进的大小格式化函数，确保小文件显示正确
            let formattedSize = '';
            if (totalSize < 1024) {
              // 对于小于1KB的文件，直接显示字节数
              formattedSize = totalSize + ' B';
            } else if (totalSize < 1024 * 1024) {
              // 对于KB级别，保留2位小数，但确保不会显示为0.00 KB
              const kbSize = totalSize / 1024;
              formattedSize = kbSize.toFixed(2) + ' KB';
            } else {
              // 对于MB级别，使用更精确的计算方法
              const mbSize = totalSize / (1024 * 1024);
              // 如果非常小（小于0.01MB），则使用KB显示
              if (mbSize < 0.01) {
                const kbSize = totalSize / 1024;
                formattedSize = kbSize.toFixed(2) + ' KB';
              } else {
                formattedSize = mbSize.toFixed(2) + ' MB';
              }
            }
            
            resolve({
              fileCount: fileCount,
              size: formattedSize,
              // 返回原始字节大小，以便在需要时进行更精确的计算
              rawSize: totalSize
            });
          };
          
          request.onerror = function(event) {
            console.error('获取IndexedDB信息失败:', event.target.error);
            reject(event.target.error);
          };
        });
      }).catch(error => {
        console.error('打开IndexedDB失败:', error);
        return {
          fileCount: 0,
          size: '0 B',
          rawSize: 0
        };
      });
    }
    
    // 删除单个文件的缓存
    async function removeCachedFile(fileId, fileName) {
      if (confirm(`确定要删除文件 "${fileName}" 的缓存吗？这将清除该文件的所有阅读进度和设置。`)) {
        try {
          // 从localStorage删除所有与该文件相关的项
          const prefixes = ['reader_file_content_', 'reader_chapters_', 'reader_progress_', 'reader_name_groups_', 'reader_name_highlight_'];
          
          // 查找并删除所有匹配的项
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            for (const prefix of prefixes) {
              if (key.startsWith(prefix + fileId)) {
                keysToRemove.push(key);
                break;
              }
            }
          }
          
          // 执行删除操作
          keysToRemove.forEach(key => localStorage.removeItem(key));
          
          // 从IndexedDB删除文件内容 - 确保删除成功
          await deleteFileFromIndexedDB(fileId);
          
          // 更新最近文件列表
          try {
            const recentFiles = JSON.parse(localStorage.getItem('reader_recent_files') || '[]');
            const updatedFiles = recentFiles.filter(file => file.id !== fileId);
            localStorage.setItem('reader_recent_files', JSON.stringify(updatedFiles));
            
            // 如果删除的是最后一个文件，更新last_file
            if (localStorage.getItem('reader_last_file') === fileId && updatedFiles.length > 0) {
              localStorage.setItem('reader_last_file', updatedFiles[0].id);
            } else if (updatedFiles.length === 0) {
              localStorage.removeItem('reader_last_file');
            }
          } catch (e) {
            console.error('更新最近文件列表失败:', e);
          }
          
          showToast(`文件 "${fileName}" 的缓存已完全删除`, 'success');
          
          // 刷新对话框内容
          if (document.getElementById('cacheManagementDialog')) {
            closeCacheManagementDialog();
            openCacheManagementDialog();
          }
          
        } catch (error) {
          console.error('删除文件缓存失败:', error);
          showToast('删除文件缓存失败，请重试', 'error');
        }
      }
    }
    
    // 显示存储详情（保持兼容旧版调用，现在直接打开缓存管理窗口并切换到存储总览标签）
    async function showStorageUsageDetails() {
      try {
        // 检查是否已经存在缓存管理对话框
        let existingDialog = document.getElementById('cacheManagementDialog');
        if (existingDialog) {
          existingDialog.remove();
        }
        
        // 打开缓存管理对话框
        await openCacheManagementDialog();
        
        // 切换到存储总览标签
        switchCacheManagementTab('storage-overview');
        
      } catch (error) {
        console.error('显示存储详情失败:', error);
        showToast('显示存储详情失败', 'error');
      }
    }
    
    // 获取存储详情数据（用于缓存管理窗口中的存储总览标签页）
    async function getStorageDetailsData() {
      try {
        // 获取最近文件列表
        let recentFiles = [];
        try {
          const recentFilesData = localStorage.getItem('reader_recent_files');
          if (recentFilesData) {
            recentFiles = JSON.parse(recentFilesData);
          }
        } catch (error) {
          console.error('获取最近文件列表失败:', error);
        }
        
        // 按文件分组处理localStorage和IndexedDB数据
        const fileGroups = new Map();
        
        // 获取localStorage数据并按文件分组
        let localStorageTotalSize = 0;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.startsWith('reader_')) {
            const value = localStorage.getItem(key);
            const size = new Blob([value]).size;
            localStorageTotalSize += size;
            
            // 提取文件ID
            let fileId = null;
            if (key.startsWith('reader_progress_')) {
              fileId = key.replace('reader_progress_', '');
            } else if (key.startsWith('reader_chapters_')) {
              fileId = key.replace('reader_chapters_', '');
            } else if (key.startsWith('reader_name_groups_')) {
              fileId = key.replace('reader_name_groups_', '');
            } else if (key.startsWith('reader_name_highlight_')) {
              fileId = key.replace('reader_name_highlight_', '');
            }
            
            // 创建或获取文件分组
            if (!fileId) {
              // 全局设置项
              fileId = 'global_settings';
            }
            
            if (!fileGroups.has(fileId)) {
              fileGroups.set(fileId, {
                name: getFileNameById(fileId, recentFiles),
                items: [],
                totalSize: 0
              });
            }
            
            // 添加缓存项
            const item = {
              key: key,
              size: size,
              sizeFormatted: formatSize(size),
              type: getKeyType(key),
              value: value
            };
            
            fileGroups.get(fileId).items.push(item);
            fileGroups.get(fileId).totalSize += size;
          }
        }
        
        // 获取IndexedDB数据并按文件分组
        let indexedDBTotalSize = 0;
        try {
          const db = await openDB();
          const transaction = db.transaction([STORE_NAME], 'readonly');
          const store = transaction.objectStore(STORE_NAME);
          const allFiles = await new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
          });
          
          for (const file of allFiles) {
            const size = file.content ? new Blob([file.content]).size : 0;
            indexedDBTotalSize += size;
            
            // 创建或获取文件分组
            if (!fileGroups.has(file.id)) {
              fileGroups.set(file.id, {
                name: getFileNameById(file.id, recentFiles),
                items: [],
                totalSize: 0
              });
            }
            
            // 添加IndexedDB文件内容
            const item = {
              key: 'file_content_' + file.id,
              size: size,
              sizeFormatted: formatSize(size),
              type: 'file_content',
              timestamp: file.timestamp
            };
            
            fileGroups.get(file.id).items.push(item);
            fileGroups.get(file.id).totalSize += size;
          }
        } catch (error) {
          console.error('获取IndexedDB详情失败:', error);
        }
        
        // 按文件总大小降序排序
        const sortedFileGroups = Array.from(fileGroups.entries())
          .sort(([,a], [,b]) => b.totalSize - a.totalSize);
        
        // 生成文件卡片HTML
        let storageItemsHtml = '';
        if (sortedFileGroups.length > 0) {
          storageItemsHtml = sortedFileGroups.map(([fileId, group]) => {
            const isGlobalSettings = fileId === 'global_settings';
            
            // 生成组内项目的卡片HTML
            const itemsHtml = group.items.map(item => {
              // 格式化时间戳
              let timeInfo = '';
              if (item.timestamp) {
                const date = new Date(item.timestamp);
                timeInfo = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
              }
              
              // 确定删除按钮的点击事件
              let deleteAction = '';
              if (item.key.startsWith('file_content_')) {
                const contentFileId = item.key.replace('file_content_', '');
                deleteAction = `deleteFileFromIndexedDB('${contentFileId}').then(() => { showToast('删除成功'); document.getElementById('cacheManagementDialog').remove(); openCacheManagementDialog(); })`;
              } else {
                deleteAction = `removeSpecificStorageItem('${escapeHTML(item.key)}')`;
              }
              
              // 限制键名长度
              const displayKey = item.key.length > 60 ? item.key.substring(0, 60) + '...' : item.key;
              
              return `
                <div class="storage-item-card">
                  <div class="storage-item-header">
                    <div class="storage-item-info">
                      <h5 class="storage-item-name">
                        <span class="type-badge type-${item.type}">${getTypeLabel(item.type)}</span>
                        ${escapeHTML(displayKey)}
                      </h5>
                      <div class="storage-item-stats">
                        <span>大小: ${item.sizeFormatted}</span>
                        ${timeInfo ? `<span>• 修改时间: ${timeInfo}</span>` : ''}
                      </div>
                    </div>
                    <div class="storage-item-actions">
                      <button class="file-action-btn delete" onclick="${deleteAction}" title="删除此缓存项">
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }).join('');
            
            return `
              <div class="file-group-section">
                <div class="file-group-header">
                  <h4>${isGlobalSettings ? '全局设置' : escapeHTML(group.name || '未命名文件')} (${group.items.length} 项, 总大小: ${formatSize(group.totalSize)})</h4>
                  ${!isGlobalSettings ? `
                    <button class="file-action-btn delete" onclick="removeCachedFile('${fileId}', '${escapeHTML(group.name || '未命名文件')}');">
                      删除全部
                    </button>
                  ` : ''}
                </div>
                <div class="file-group-items">
                  ${itemsHtml}
                </div>
              </div>
            `;
          }).join('');
        } else {
          storageItemsHtml = '<div class="no-data-message">没有找到任何阅读器缓存数据</div>';
        }
        
        // 生成总体统计信息
        const totalSize = localStorageTotalSize + indexedDBTotalSize;
        const totalItems = Array.from(fileGroups.values())
          .reduce((total, group) => total + group.items.length, 0);
        
        return {
          totalSize: formatSize(totalSize),
          totalItems: totalItems,
          localStorageSize: formatSize(localStorageTotalSize),
          indexedDBSize: formatSize(indexedDBTotalSize),
          storageItemsHtml: storageItemsHtml
        };
      } catch (error) {
        console.error('获取存储详情数据失败:', error);
        return {
          totalSize: '0 B',
          totalItems: 0,
          localStorageSize: '0 B',
          indexedDBSize: '0 B',
          storageItemsHtml: '<div class="error-message">获取存储详情数据失败</div>'
        };
      }
    }
    
    // 切换缓存管理窗口的标签页
    function switchCacheManagementTab(tabId) {
      // 隐藏所有标签内容
      const tabContents = document.querySelectorAll('.tab-content');
      tabContents.forEach(content => {
        content.classList.remove('active');
      });
      
      // 移除所有标签的活跃状态
      const tabs = document.querySelectorAll('.tab');
      tabs.forEach(tab => {
        tab.classList.remove('active');
      });
      
      // 显示选中的标签内容和添加活跃状态
      const activeTab = document.getElementById(tabId);
      const activeTabButton = Array.from(tabs).find(tab => tab.getAttribute('onclick').includes(tabId));
      
      if (activeTab && activeTabButton) {
        activeTab.classList.add('active');
        activeTabButton.classList.add('active');
      }
      
      // 根据标签页显示对应的底部按钮
      document.getElementById('recentFilesActions').style.display = tabId === 'recent-files' ? 'flex' : 'none';
      document.getElementById('storageOverviewActions').style.display = tabId === 'storage-overview' ? 'flex' : 'none';
      
      // 重置文件选中状态
      resetFileSelections();
    }
    
    // 辅助函数：格式化大小
    function formatSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
      else return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
    
    // 辅助函数：获取键类型
    function getKeyType(key) {
      if (key.includes('file_content')) return 'file_content';
      if (key.includes('progress')) return 'progress';
      if (key.includes('chapters')) return 'chapters';
      if (key.includes('recent_files')) return 'recent_files';
      if (key.includes('last_file')) return 'last_file';
      return 'other';
    }
    
    // 辅助函数：获取类型标签
    function getTypeLabel(type) {
      const labels = {
        file_content: '文件内容',
        progress: '阅读进度',
        chapters: '章节信息',
        recent_files: '最近文件',
        last_file: '上次文件',
        other: '其他'
      };
      return labels[type] || '未知';
    }
    
    // 辅助函数：通过文件ID获取文件名
    function getFileNameById(fileId, recentFiles) {
      if (!recentFiles || !Array.isArray(recentFiles)) {
        return '未命名文件';
      }
      
      const file = recentFiles.find(f => f.id === fileId);
      if (file && file.name) {
        // 隐藏.txt后缀
        let displayName = file.name;
        if (displayName.toLowerCase().endsWith('.txt')) {
          displayName = displayName.substring(0, displayName.length - 4);
        }
        return displayName;
      }
      
      // 如果没有找到匹配的文件，返回文件ID的前20个字符
      return fileId.substring(0, 20) + (fileId.length > 20 ? '...' : '');
    }
    
    // 删除特定的存储项
    function removeSpecificStorageItem(key) {
      if (confirm(`确定要删除存储项 "${key}" 吗？`)) {
        try {
          localStorage.removeItem(key);
          // 找到并移除表格行
          const rows = document.querySelectorAll('.storage-details-table tr');
          rows.forEach(row => {
            const keyCell = row.querySelector('.item-key');
            if (keyCell && keyCell.textContent === key) {
              row.remove();
            }
          });
        } catch (error) {
          console.error('删除存储项失败:', error);
          showToast('删除存储项失败', 'error');
        }
      }
    }

    // 笔记功能实现
    // 打开笔记管理对话框 - 现在它会切换到笔记管理tab
    function openNotesDialog() {
      // 切换到笔记管理tab
      const sidebarRight = document.getElementById('sidebarRight');
      if (!sidebarRight.classList.contains('show')) {
        toggleMore(); // 如果更多页没打开，先打开
      }
      // 等待更多页打开后切换到笔记tab
      setTimeout(() => {
        switchFunctionTab('notes');
      }, 100);
    }
    
    // 新增笔记
    function addNewNote() {
      const currentSelection = window.getSelection().toString().trim();
      openNoteEditDialog(null, currentSelection);
    }

    // 关闭笔记管理对话框
    function closeNotesDialog() {
      ModalSystem.closeModal('notesDialog');
    }

    // 打开笔记编辑分屏
    function openNoteEditDialog(noteId = null, originalText = '') {
      // 首先获取笔记数据（如果是编辑模式）
      let noteData = null;
      if (noteId) {
        noteData = getCurrentFileNotes().find(n => n.id === noteId);
      }
      
      // 获取当前章节索引
      const currentChapterIndex = window.currentIndex || 0;
      const maxChapterIndex = window.flatChapters ? window.flatChapters.length - 1 : 1000;
      
      // 获取分屏元素
      const splitScreen = document.getElementById('noteSplitScreen');
      const noteSplitId = document.getElementById('noteSplitId');
      const noteSplitChapterIndex = document.getElementById('noteSplitChapterIndex');
      const noteSplitTitleInput = document.getElementById('noteSplitTitleInput');
      const noteSplitContent = document.getElementById('noteSplitContent');
      const noteSplitIsChecked = document.getElementById('noteSplitIsChecked');
      const noteSplitStatusText = document.getElementById('noteSplitStatusText');
      const noteSplitChapterIndexInput = document.getElementById('noteSplitChapterIndexInput');
      const noteSplitDeleteBtn = document.getElementById('noteSplitDeleteBtn');
      const noteSplitSaveBtn = document.getElementById('noteSplitSaveBtn');
      
      // 设置分屏数据
      noteSplitId.value = noteId || '';
      noteSplitChapterIndex.value = noteData?.chapterIndex || currentChapterIndex;
      
      // 设置输入框的值
      if (noteData) {
        // 编辑模式
        const contentLines = noteData.content ? noteData.content.split('\n') : ['', ''];
        noteSplitTitleInput.value = contentLines[0] || '';
        noteSplitContent.value = contentLines.slice(1).join('\n') || '';
        noteSplitIsChecked.checked = noteData.isChecked || false;
        noteSplitStatusText.textContent = noteData.isChecked ? '已完成' : '进行中';
        noteSplitChapterIndexInput.value = noteData?.chapterIndex || currentChapterIndex;
        noteSplitChapterIndexInput.max = maxChapterIndex;
        noteSplitDeleteBtn.style.display = 'block';
        noteSplitSaveBtn.textContent = '保存';
      } else {
        // 新增模式
        noteSplitTitleInput.value = '';
        noteSplitContent.value = originalText || '';
        noteSplitIsChecked.checked = false;
        noteSplitStatusText.textContent = '进行中';
        noteSplitChapterIndexInput.value = currentChapterIndex;
        noteSplitChapterIndexInput.max = maxChapterIndex;
        noteSplitDeleteBtn.style.display = 'none';
        noteSplitSaveBtn.textContent = '确认添加';
      }
      
      // 字符计数功能已移除，无需更新
      
      // 显示分屏
      splitScreen.style.display = 'flex';
      
      // 调整主内容区域和所有侧边栏的高度，确保分页区和笔记编辑区能同时显示
      const mainContent = document.querySelector('.main-content');
      const sidebarLeft = document.getElementById('sidebarLeft');
      const sidebarRight = document.getElementById('sidebarRight');
      const noteSplitScreen = document.getElementById('noteSplitScreen');
      const searchPanel = document.querySelector('.search-panel');
      const directoryList = document.getElementById('directoryList');
      const functionContent = document.getElementById('functionContent');
      const chapterFooter = document.querySelector('.chapter-footer');
      
      if (mainContent) {
        mainContent.classList.add('with-note-split');
        // 保存原始高度以便后续恢复
        mainContent.dataset.originalHeight = mainContent.style.height || '';
        // 调整主内容区域高度，为笔记编辑区留出空间
        mainContent.style.height = `calc(100vh - ${noteSplitScreen.offsetHeight}px)`;
      }
      
      // 确保分页区可见
      if (chapterFooter) {
        chapterFooter.style.position = 'relative';
      }
      
      // 调整左侧目录栏高度
      if (sidebarLeft) {
        sidebarLeft.dataset.originalHeight = sidebarLeft.style.height || '';
        sidebarLeft.style.height = `calc(100vh - ${noteSplitScreen.offsetHeight}px)`;
      }
      
      // 调整右侧功能栏高度
      if (sidebarRight) {
        // 保存原始高度以便后续恢复
        sidebarRight.dataset.originalHeight = sidebarRight.style.height || '';
        // 调整侧边栏高度
        sidebarRight.style.height = `calc(100vh - ${noteSplitScreen.offsetHeight}px)`;
      }
      
      // 调整搜索面板高度
      if (searchPanel) {
        searchPanel.dataset.originalHeight = searchPanel.style.height || '';
        searchPanel.style.height = `calc(100vh - ${noteSplitScreen.offsetHeight}px)`;
      }
      
      // 调整目录列表高度
      if (directoryList && (directoryList.parentElement.classList.contains('show') || sidebarLeft.classList.contains('show'))) {
        directoryList.dataset.originalHeight = directoryList.style.height || '';
        directoryList.style.height = `calc(100% - 150px)`; // 减去头部高度
      }
      
      // 调整功能内容高度
      if (functionContent && functionContent.parentElement.classList.contains('show')) {
        functionContent.dataset.originalHeight = functionContent.style.height || '';
        functionContent.style.height = `calc(100% - 60px)`; // 减去头部高度
      }
      
      // 输入框获得焦点
      setTimeout(() => {
        if (!noteId && originalText) {
          noteSplitContent.focus();
        } else {
          noteSplitTitleInput.focus();
        }
      }, 100);
      
      // 初始化分隔线拖动
      initSplitLineDrag();
      
      // 绑定删除按钮事件
      noteSplitDeleteBtn.onclick = function() {
        if (noteId && confirm('确定要删除这条笔记吗？')) {
          deleteNote(noteId);
          closeNoteEditDialog();
        }
      };
      
      // 绑定分屏模式保存按钮事件
      noteSplitSaveBtn.onclick = saveNoteSplit;
      
      // 绑定状态文本更新事件
      noteSplitIsChecked.onchange = function() {
        noteSplitStatusText.textContent = this.checked ? '已完成' : '进行中';
      };
      
      // 字符计数功能已移除，无需绑定事件监听器
    }
    
    // 初始化分隔线拖动功能
    function initSplitLineDrag() {
      const splitScreen = document.getElementById('noteSplitScreen');
      const splitLine = document.getElementById('splitLine');
      let isDragging = false;
      let initialY = 0;
      let initialHeight = 0;
      
      // 获取触摸或鼠标位置的函数
      const getEventY = function(e) {
        if (e.type.startsWith('touch')) {
          return e.touches[0].clientY;
        } else {
          return e.clientY;
        }
      };
      
      // 开始拖动的处理函数
      const startDragging = function(e) {
        e.preventDefault();
        isDragging = true;
        initialY = getEventY(e);
        initialHeight = splitScreen.offsetHeight;
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'ns-resize';
      };
      
      // 拖动中的处理函数
      const dragMove = function(e) {
        if (!isDragging) return;
        
        const deltaY = getEventY(e) - initialY;
        let newHeight = initialHeight - deltaY;
        
        // 设置最小和最大高度限制
        const minHeight = 200;
        const maxHeight = window.innerHeight - 100;
        
        if (newHeight >= minHeight && newHeight <= maxHeight) {
          splitScreen.style.height = newHeight + 'px';
          
          // 更新主内容区域的padding
          const mainContent = document.querySelector('.main-content');
          const sidebarLeft = document.getElementById('sidebarLeft');
          const sidebarRight = document.getElementById('sidebarRight');
          const directoryList = document.getElementById('directoryList');
          const functionContent = document.getElementById('functionContent');
          const searchPanel = document.querySelector('.search-panel');
          const chapterFooter = document.querySelector('.chapter-footer');
          
          if (mainContent) {
            mainContent.style.height = `calc(100vh - ${newHeight}px)`;
            mainContent.style.paddingBottom = newHeight + 'px';
          }
          
          // 确保分页区始终可见
          if (chapterFooter) {
            chapterFooter.style.position = 'relative';
          }
          
          // 同步更新侧边栏高度
          if (sidebarLeft) {
            sidebarLeft.style.height = `calc(100vh - ${newHeight}px)`;
          }
          
          if (sidebarRight) {
            sidebarRight.style.height = `calc(100vh - ${newHeight}px)`;
          }
          
          // 同步更新目录列表高度 - 修正逻辑，检查sidebarLeft的show状态
          if (directoryList && (directoryList.parentElement.classList.contains('show') || sidebarLeft.classList.contains('show'))) {
            directoryList.style.height = `calc(100% - 150px)`;
          }
          
          // 同步更新功能内容高度
          if (functionContent && functionContent.parentElement.classList.contains('show')) {
            functionContent.style.height = `calc(100% - 60px)`;
          }
          
          // 同步更新搜索面板高度
          if (searchPanel) {
            searchPanel.style.height = `calc(100vh - ${newHeight}px)`;
          }
        }
      };
      
      // 结束拖动的处理函数
      const stopDragging = function() {
        if (isDragging) {
          isDragging = false;
          document.body.style.userSelect = '';
          document.body.style.cursor = '';
        }
      };
      
      // 添加鼠标事件监听
      splitLine.addEventListener('mousedown', startDragging);
      document.addEventListener('mousemove', dragMove);
      document.addEventListener('mouseup', stopDragging);
      
      // 添加触摸事件监听，以支持移动端
      splitLine.addEventListener('touchstart', startDragging);
      document.addEventListener('touchmove', dragMove, { passive: false });
      document.addEventListener('touchend', stopDragging);
    }

    // 笔记字符计数更新功能已移除（2023-11-10） - 字符计数显示元素已从UI中移除
    
    // 关闭笔记编辑分屏
    function closeNoteEditDialog() {
      const splitScreen = document.getElementById('noteSplitScreen');
      splitScreen.style.display = 'none';
      
      // 恢复主内容区域和所有侧边栏的原始高度
      const mainContent = document.querySelector('.main-content');
      const sidebarLeft = document.getElementById('sidebarLeft');
      const sidebarRight = document.getElementById('sidebarRight');
      const searchPanel = document.querySelector('.search-panel');
      const directoryList = document.getElementById('directoryList');
      const functionContent = document.getElementById('functionContent');
      const chapterFooter = document.querySelector('.chapter-footer');
      
      if (mainContent) {
        mainContent.classList.remove('with-note-split');
        // 恢复原始高度
        mainContent.style.height = mainContent.dataset.originalHeight || '';
        if (!mainContent.dataset.originalHeight) {
          mainContent.style.height = '';
        }
        // 清除所有内联样式，确保没有残留
        mainContent.style.paddingBottom = '';
        delete mainContent.dataset.originalHeight;
      }
      
      // 确保分页区回到正常位置
      if (chapterFooter) {
        chapterFooter.style.bottom = '0';
      }
      
      // 恢复左侧目录栏高度
      if (sidebarLeft) {
        sidebarLeft.style.height = sidebarLeft.dataset.originalHeight || '';
        if (!sidebarLeft.dataset.originalHeight) {
          sidebarLeft.style.height = '';
        }
        delete sidebarLeft.dataset.originalHeight;
      }
      
      // 恢复右侧功能栏高度
      if (sidebarRight) {
        // 恢复原始高度
        sidebarRight.style.height = sidebarRight.dataset.originalHeight || '';
        if (!sidebarRight.dataset.originalHeight) {
          sidebarRight.style.height = '';
        }
        delete sidebarRight.dataset.originalHeight;
      }
      
      // 恢复搜索面板高度
      if (searchPanel) {
        searchPanel.style.height = searchPanel.dataset.originalHeight || '';
        if (!searchPanel.dataset.originalHeight) {
          searchPanel.style.height = '';
        }
        delete searchPanel.dataset.originalHeight;
      }
      
      // 恢复目录列表高度
      if (directoryList) {
        directoryList.style.height = directoryList.dataset.originalHeight || '';
        if (!directoryList.dataset.originalHeight) {
          directoryList.style.height = '';
        }
        delete directoryList.dataset.originalHeight;
      }
      
      // 恢复功能内容高度
      if (functionContent) {
        functionContent.style.height = functionContent.dataset.originalHeight || '';
        if (!functionContent.dataset.originalHeight) {
          functionContent.style.height = '';
        }
        delete functionContent.dataset.originalHeight;
      }
    }

    // 从笔记编辑分屏跳转到指定章节
    function jumpToChapterFromNoteSplit() {
      const chapterIndexInput = document.getElementById('noteSplitChapterIndexInput');
      if (!chapterIndexInput) return;
      
      const chapterIndex = parseInt(chapterIndexInput.value);
      if (!isNaN(chapterIndex) && typeof window.jumpToChapter === 'function') {
        // 跳转到指定章节
        window.jumpToChapter(chapterIndex);
      } else {
        showToast('无效的章节索引', 'error');
      }
    }

    // 保存笔记
    function saveNote() {
      // 获取分屏元素
      const noteId = document.getElementById('noteId').value;
      const noteTitleInput = document.getElementById('noteTitleInput');
      const noteContent = document.getElementById('noteContent');
      const isChecked = document.getElementById('isChecked').checked;
      const isDictionary = document.getElementById('isDictionary') ? document.getElementById('isDictionary').checked : false;

      if (!noteTitleInput || !noteContent) {
        return;
      }

      const title = noteTitleInput.value;
      const content = noteContent.value;
      const chapterIndex = currentIndex;

      if (!title.trim() && !content.trim()) {
        showToast('笔记标题和内容不能为空', 'error');
        return;
      }

      // 检查笔记标题唯一性（仅针对词典笔记和新增笔记）
      if (isDictionary && !noteId && title.trim()) {
        const existingNotes = getCurrentFileNotes();
        const hasDuplicate = existingNotes.some(note => 
          note.isDictionary && note.content && note.content.split('\n')[0] === title.trim()
        );
        
        if (hasDuplicate) {
          showToast('词典笔记标题已存在，请使用其他标题', 'error');
          return;
        }
      }
      
      // 合并标题和内容（用换行分隔）
      let fullContent = '';
      if (title.trim()) {
        fullContent = title.trim();
        if (content.trim()) {
          fullContent += '\n' + content.trim();
        }
      } else {
        fullContent = content.trim();
      }
      
      // 字数限制检查
      if (fullContent.length > 2000) {
        showToast('笔记内容不能超过2000字', 'error');
        return;
      }

      const fileId = currentFileId || 'default';
      const notes = getCurrentFileNotes();

      if (noteId) {
        // 更新现有笔记
        const noteIndex = notes.findIndex(n => n.id === noteId);
        if (noteIndex !== -1) {
          notes[noteIndex] = {
            ...notes[noteIndex],
            content: fullContent,
            isChecked,
            isDictionary: isDictionary,
            chapterIndex: isNaN(chapterIndex) ? 0 : chapterIndex,
            updateTime: new Date().getTime()
          };
          showToast('笔记更新成功');
        }
      } else {
        // 添加新笔记
        notes.push({
          id: 'note_' + Date.now(),
          content: fullContent,
          isChecked,
          isDictionary: isDictionary,
          chapterIndex: isNaN(chapterIndex) ? 0 : chapterIndex,
          createTime: new Date().getTime(),
          updateTime: new Date().getTime()
        });
        showToast('笔记添加成功');
      }

      // 保存到缓存
      saveNotes(fileId, notes);
      // 更新UI
      renderNotesList();
      // 更新进度显示
      updateNotesProgress();
      
      // 不关闭分屏，保持显示
    }

    // 分屏模式保存笔记
    function saveNoteSplit() {
      // 获取分屏元素
      const noteId = document.getElementById('noteSplitId').value;
      const noteTitleInput = document.getElementById('noteSplitTitleInput');
      const noteContent = document.getElementById('noteSplitContent');
      const isChecked = document.getElementById('noteSplitIsChecked').checked;
      const chapterIndexInput = document.getElementById('noteSplitChapterIndexInput');

      if (!noteTitleInput || !noteContent) {
        return;
      }

      const title = noteTitleInput.value;
      const content = noteContent.value;
      const chapterIndex = chapterIndexInput ? parseInt(chapterIndexInput.value) : currentChapterIndex;

      if (!title.trim() && !content.trim()) {
        showToast('笔记标题和内容不能为空', 'error');
        return;
      }

      // 合并标题和内容（用换行分隔）
      let fullContent = '';
      if (title.trim()) {
        fullContent = title.trim();
        if (content.trim()) {
          fullContent += '\n' + content.trim();
        }
      } else {
        fullContent = content.trim();
      }
      
      // 字数限制检查
      if (fullContent.length > 2000) {
        showToast('笔记内容不能超过2000字', 'error');
        return;
      }

      const fileId = currentFileId || 'default';
      const notes = getCurrentFileNotes();

      if (noteId) {
        // 更新现有笔记
        const noteIndex = notes.findIndex(n => n.id === noteId);
        if (noteIndex !== -1) {
          notes[noteIndex] = {
            ...notes[noteIndex],
            content: fullContent,
            isChecked,
            chapterIndex: isNaN(chapterIndex) ? 0 : chapterIndex,
            updateTime: new Date().getTime()
          };
          showToast('笔记更新成功');
        }
      } else {
        // 添加新笔记
        notes.push({
          id: 'note_' + Date.now(),
          content: fullContent,
          isChecked,
          chapterIndex: isNaN(chapterIndex) ? 0 : chapterIndex,
          createTime: new Date().getTime(),
          updateTime: new Date().getTime()
        });
        showToast('笔记添加成功');
      }

      // 保存到缓存
      saveNotes(fileId, notes);
      // 更新UI
      renderNotesList();
      // 更新进度显示
      updateNotesProgress();
      
      // 不关闭分屏，保持显示
    }
    
    // 删除笔记
    function deleteNote(noteId) {
      if (confirm('确定要删除这条笔记吗？')) {
        const fileId = currentFileId || 'default';
        let notes = getCurrentFileNotes();
        notes = notes.filter(n => n.id !== noteId);
        saveNotes(fileId, notes);
        renderNotesList();
        // 更新进度显示
        updateNotesProgress();
        showToast('笔记已删除');
      }
    }

    // 切换笔记勾选状态
    function toggleNoteCheck(noteId) {
      const fileId = currentFileId || 'default';
      const notes = getCurrentFileNotes();
      const noteIndex = notes.findIndex(n => n.id === noteId);
      if (noteIndex !== -1) {
        notes[noteIndex].isChecked = !notes[noteIndex].isChecked;
        notes[noteIndex].updateTime = new Date().getTime();
        saveNotes(fileId, notes);
        renderNotesList();
        // 更新进度显示
        updateNotesProgress();
      }
    }

    // 获取当前文件的笔记
    function getCurrentFileNotes() {
      const fileId = currentFileId || 'default';
      return loadNotes(fileId) || [];
    }

    // 保存笔记到localStorage
    function saveNotes(fileId, notes) {
      try {
        // 更新全局变量
        if (!window.renderVariables.notes) {
          window.renderVariables.notes = {};
        }
        window.renderVariables.notes[fileId] = notes;
        // 保存到localStorage
        localStorage.setItem(`reader_notes_${fileId}`, JSON.stringify(notes));
      } catch (error) {
        console.error('保存笔记失败:', error);
      }
    }

    // 从localStorage加载笔记
    function loadNotes(fileId) {
      try {
        const storedNotes = localStorage.getItem(`reader_notes_${fileId}`);
        if (!storedNotes) return null;
        
        const notes = JSON.parse(storedNotes);
        // 确保每条笔记都有isDictionary字段（向后兼容）
        return notes.map(note => ({
          ...note,
          isDictionary: note.isDictionary || false
        }));
      } catch (error) {
        console.error('加载笔记失败:', error);
        return null;
      }
    }

    // 复制笔记到剪贴板
    function exportNotes() {
      if (!currentFileId) {
        showToast('请先打开文件', 'error');
        return;
      }
      
      const notes = getCurrentFileNotes();
      if (!notes || notes.length === 0) {
        showToast('当前文件没有笔记', 'info');
        return;
      }
      
      const dataStr = JSON.stringify(notes, null, 2);
      
      // 使用剪贴板API复制数据
      navigator.clipboard.writeText(dataStr).then(() => {
        showToast('笔记已复制到剪贴板', 'success');
      }).catch(err => {
        console.error('复制笔记到剪贴板失败:', err);
        showToast('复制笔记失败，请手动选择笔记内容复制', 'error');
      });
    }

    // 从剪贴板导入笔记
    function importNotes() {
      if (!currentFileId) {
        showToast('请先打开文件', 'error');
        return;
      }
      
      // 使用剪贴板API读取数据
      navigator.clipboard.readText().then(text => {
        if (!text) {
          showToast('剪贴板中没有笔记数据', 'info');
          return;
        }
        
        try {
          const importedNotes = JSON.parse(text);
          if (!Array.isArray(importedNotes)) {
            showToast('无效的笔记格式', 'error');
            return;
          }
          
          // 保存导入的笔记
          saveNotes(currentFileId, importedNotes);
          
          // 重新渲染笔记列表
          renderNotesList();
          updateNotesProgress();
          
          showToast(`成功导入 ${importedNotes.length} 条笔记`, 'success');
        } catch (error) {
          console.error('导入笔记失败:', error);
          showToast('导入笔记失败，请检查笔记格式', 'error');
        }
      }).catch(err => {
        console.error('从剪贴板读取笔记失败:', err);
        showToast('读取剪贴板失败，请手动粘贴笔记数据', 'error');
      });
    }

    // 处理笔记搜索
    function handleNotesSearch(keyword) {
      currentNoteSearchKeyword = keyword.toLowerCase().trim();
      // 重新渲染笔记列表，应用搜索过滤
      const activeTab = document.querySelector('.notes-tab.active')?.id.replace('tab', '');
      renderNotesList(activeTab.charAt(0).toLowerCase() + activeTab.slice(1));
    }
    
    // 切换笔记标签页
    function switchNoteTab(tab) {
      // 更新标签样式
      const tabs = ['tabAll', 'tabInProgress', 'tabCompleted'];
      tabs.forEach(tabId => {
        const tabElement = document.getElementById(tabId);
        tabElement.classList.remove('active');
        tabElement.style.backgroundColor = 'transparent';
        tabElement.style.color = 'var(--secondary-text-color)';
      });
      
      const activeTabId = 'tab' + tab.charAt(0).toUpperCase() + tab.slice(1);
      const activeTab = document.getElementById(activeTabId);
      activeTab.classList.add('active');
      activeTab.style.backgroundColor = 'var(--accent-color)';
      activeTab.style.color = 'white';
      
      // 切换笔记显示
      renderNotesList(tab);
    }
    
    // 更新笔记进度显示
    function updateNotesProgress() {
      const notes = getCurrentFileNotes();
      const completedCount = notes.filter(note => note.isChecked).length;
      const totalCount = notes.length;
      const progressElement = document.getElementById('notesProgress');
      if (progressElement) {
        progressElement.textContent = `${completedCount}/${totalCount}`;
      }
    }
    
    // 渲染笔记列表
    function renderNotesList(tab = 'all') {
      const notesList = document.getElementById('notesList');
      if (!notesList) return;

      // 先设置列表容器的样式
      notesList.innerHTML = '';
      notesList.style.padding = '16px';
      notesList.style.maxWidth = '100%';
      notesList.style.boxSizing = 'border-box';
      notesList.style.height = 'calc(100vh - 250px)'; // 调整高度以适应搜索框
      notesList.style.overflowY = 'auto';

      const notes = getCurrentFileNotes();
      
      // 筛选笔记
      let filteredNotes = [...notes];
      
      // 应用标签筛选
      if (tab === 'inProgress') {
        filteredNotes = notes.filter(note => !note.isChecked);
      } else if (tab === 'completed') {
        filteredNotes = notes.filter(note => note.isChecked);
      }
      
      // 应用搜索筛选
      if (currentNoteSearchKeyword) {
        filteredNotes = filteredNotes.filter(note => {
          const content = note.content || '';
          const contentLines = content.split('\n');
          const title = contentLines[0] || '';
          const body = contentLines.slice(1).join('\n');
          
          return title.toLowerCase().includes(currentNoteSearchKeyword) || 
                 body.toLowerCase().includes(currentNoteSearchKeyword);
        });
      }
      
      // 排序规则：
      // 1. 一级排序：未完成的笔记在前，已完成的笔记在后
      // 2. 二级排序：按章节索引升序排序
      // 3. 三级排序：按修改时间倒序排序
      filteredNotes.sort((a, b) => {
        // 一级排序：完成状态
        if (a.isChecked !== b.isChecked) {
          return a.isChecked ? 1 : -1; // 未完成的在前
        }
        // 二级排序：章节索引
        const chapterA = a.chapterIndex || 0;
        const chapterB = b.chapterIndex || 0;
        if (chapterA !== chapterB) {
          return chapterA - chapterB;
        }
        // 三级排序：修改时间
        const timeA = a.updateTime || a.createTime || 0;
        const timeB = b.updateTime || b.createTime || 0;
        return timeB - timeA; // 时间倒序
      });

      if (filteredNotes.length === 0) {
        notesList.innerHTML = `
          <div class="no-notes-container" style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 20px;
            color: var(--secondary-text-color);
            text-align: center;
            min-height: 250px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 12px;
          ">
            <div style="font-size: 48px; margin-bottom: 16px; opacity: 0.6;">📝</div>
            <div style="margin-bottom: 8px; font-size: 16px; font-weight: 500; color: var(--text-color);">暂无笔记</div>
            <div style="font-size: 14px; color: var(--secondary-text-color);">点击添加笔记开始记录</div>
          </div>
        `;
        return;
      }

      // 创建笔记列表容器
      const notesContainer = document.createElement('div');
      notesContainer.className = 'notes-container';
      notesContainer.style.display = 'flex';
      notesContainer.style.flexDirection = 'column';
      notesContainer.style.gap = '12px';
      notesList.appendChild(notesContainer);
      
      // 渲染笔记项
      filteredNotes.forEach((note) => {
        const noteItem = document.createElement('div');
        noteItem.className = `note-card ${note.isChecked ? 'note-completed' : ''}`;
        noteItem.dataset.id = note.id;
        noteItem.style.cssText = `
          background: ${note.isChecked ? 'rgba(0, 0, 0, 0.05)' : 'var(--card-background)'};
          border: 1px solid var(--border-color);
          border-left: 4px solid ${note.isChecked ? 'var(--success-color, #4CAF50)' : 'var(--accent-color)'};
          border-radius: 4px;
          padding: 16px;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
        `;
        
        // 添加悬停效果
        // 增强悬停效果，根据完成状态使用不同颜色
        noteItem.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-2px)';
          this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
          if (this.classList.contains('note-completed')) {
            this.style.borderColor = 'var(--success-color, #4CAF50)';
          } else {
            this.style.borderColor = 'var(--accent-color)';
          }
        });
        noteItem.addEventListener('mouseleave', function() {
          this.style.transform = 'translateY(0)';
          this.style.boxShadow = 'none';
          this.style.borderColor = 'var(--border-color)';
        });
        
        // 提取标题（第一行内容）和正文
        const contentLines = (note.content || '').split('\n');
        const title = contentLines[0] || '无标题笔记';
        const content = contentLines.slice(1).join('\n');
        
        // 获取时间信息
        const timeText = formatNoteTime(note.updateTime || note.createTime);
        
        // 根据是否是词典笔记设置标题样式
        const titleStyle = note.isDictionary 
          ? 'font-weight: 700; font-size: 15px; color: var(--accent-color); margin-bottom: 4px; cursor: pointer;' 
          : 'font-weight: 500; font-size: 15px; color: var(--text-color); margin-bottom: 4px;';
        
        noteItem.innerHTML = `
          <div style="display: flex; align-items: flex-start; gap: 12px;">
            <input type="checkbox" class="note-task-checkbox" ${note.isChecked ? 'checked' : ''} 
               style="margin-top: 2px; transform: scale(1.4); cursor: pointer; accent-color: ${note.isChecked ? 'var(--success-color, #4CAF50)' : 'var(--accent-color)'};"
               onclick="toggleNoteCheck('${note.id}')">
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <div class="note-title ${note.isChecked ? 'note-completed' : ''}" 
                  style="${titleStyle}">
                  ${escapeHTML(title)}
                </div>
                <div style="font-size: 12px; color: var(--secondary-text-color); opacity: 0.8; white-space: nowrap;">
                  ${timeText}
                </div>
              </div>
              ${content ? `
                <div class="note-content ${note.isChecked ? 'note-completed' : ''}" 
                  style="font-size: 14px; color: var(--secondary-text-color); line-height: 1.5; margin-bottom: 12px; word-wrap: break-word; overflow-wrap: break-word;">
                  ${escapeHTML(content)}
                </div>
              ` : ''}
            </div>
          </div>
        `;
        
        // 添加点击编辑功能
        noteItem.addEventListener('click', function(e) {
          // 避免点击复选框或操作按钮时触发编辑
          if (!e.target.classList.contains('note-task-checkbox') && !e.target.classList.contains('note-action-btn')) {
            openNoteEditDialog(note.id);
          }
        });
        
        notesContainer.appendChild(noteItem);
      });
    }

    // 格式化笔记时间
    function formatNoteTime(timestamp) {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 60) {
        return `${diffMins}分钟前`;
      } else if (diffHours < 24) {
        return `${diffHours}小时前`;
      } else if (diffDays < 7) {
        return `${diffDays}天前`;
      } else {
        return date.toLocaleDateString();
      }
    }

    // 文本选择迷你菜单功能
    // 显示文本选择菜单
    function showSelectionMenu() {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();
      if (!selectedText) {
        hideSelectionMenu();
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const menu = document.getElementById('selectionMenu');
      
      if (menu) {
        // 设置菜单位置
        const menuWidth = menu.offsetWidth || 150; // 预估宽度
        let left = rect.left + (rect.width - menuWidth) / 2;
        
        // 确保菜单不超出视口
        if (left < 0) left = 10;
        if (left + menuWidth > window.innerWidth) {
          left = window.innerWidth - menuWidth - 10;
        }
        
        menu.style.left = left + 'px';
        menu.style.top = (rect.top - 40) + 'px'; // 显示在选中文本上方
        
        // 保存选中的文本
        menu.dataset.selectedText = selectedText;
        
        // 显示菜单
        menu.classList.add('show');
      }
    }

    // 隐藏文本选择菜单
    function hideSelectionMenu() {
      const menu = document.getElementById('selectionMenu');
      if (menu) {
        menu.classList.remove('show');
      }
    }

    // 复制选中的文本
    function copySelectedText() {
      const menu = document.getElementById('selectionMenu');
      const selectedText = menu ? menu.dataset.selectedText : '';
      
      if (selectedText) {
        navigator.clipboard.writeText(selectedText)
          .then(() => {
            showToast('已复制到剪贴板');
          })
          .catch(err => {
            console.error('复制失败:', err);
            showToast('复制失败', 'error');
          });
      }
      
      hideSelectionMenu();
    }

    // 从选中的文本添加笔记
    function addNoteFromSelection() {
      const menu = document.getElementById('selectionMenu');
      const selectedText = menu ? menu.dataset.selectedText : '';
      
      if (selectedText) {
        openNoteEditDialog(null, selectedText);
      }
      
      hideSelectionMenu();
    }

    // 搜索选中的文本
    function searchSelectedText() {
      const menu = document.getElementById('selectionMenu');
      const selectedText = menu ? menu.dataset.selectedText : '';
      
      if (selectedText) {
        // 查找搜索输入框和按钮
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');
        
        if (searchInput) {
          searchInput.value = selectedText;
          // 触发搜索事件
          const searchEvent = new Event('input', { bubbles: true });
          searchInput.dispatchEvent(searchEvent);
          
          // 尝试不同的搜索触发方式
          if (typeof window.startSearch === 'function') {
            window.startSearch(selectedText);
          } else if (searchButton) {
            searchButton.click();
          } else {
            // 如果找不到明确的搜索函数，就触发键盘事件
            const enterEvent = new KeyboardEvent('keydown', {
              key: 'Enter',
              code: 'Enter',
              bubbles: true
            });
            searchInput.dispatchEvent(enterEvent);
          }
          
          // 滚动到搜索区域
          if (searchInput.offsetParent) {
            searchInput.offsetParent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        } else {
          showToast('未找到搜索功能', 'error');
        }
      }
      
      hideSelectionMenu();
    }

    // 初始化文本选择监听
    function initTextSelectionListener() {
      const chapterContent = document.getElementById('chapterContent');
      if (chapterContent) {
        chapterContent.addEventListener('mouseup', showSelectionMenu);
        chapterContent.addEventListener('touchend', showSelectionMenu);
      }
      
      // 点击其他地方隐藏菜单
      document.addEventListener('click', function(e) {
        const menu = document.getElementById('selectionMenu');
        const chapterContent = document.getElementById('chapterContent');
        
        if (menu && !menu.contains(e.target) && 
            chapterContent && !chapterContent.contains(e.target)) {
          hideSelectionMenu();
        }
      });
    }

    // 导出所有数据
    function exportAllData() {
      if (!currentFileId) {
        showToast('请先打开文件', 'error');
        return;
      }
      
      // 获取需要导出的数据
      const exportData = {
        fileId: currentFileId,
        fileName: currentFileName,
        exportTime: new Date().toISOString(),
        
        // 阅读设置
        readerSettings: {
          currentTheme: window.renderVariables.currentTheme,
          fontSize: window.renderVariables.fontSize,
          lineHeight: window.renderVariables.lineHeight,
          paragraphSpacing: window.renderVariables.paragraphSpacing,
          fontFamily: window.renderVariables.fontFamily,
          contentMargins: window.renderVariables.contentMargins,
          isDialogHighlightEnabled: window.renderVariables.isDialogHighlightEnabled,
          dialogHighlightColor: window.renderVariables.dialogHighlightColor,
  
          isNameHighlightEnabled: window.renderVariables.isNameHighlightEnabled,
          isTraditionalPageTurningEnabled: window.renderVariables.isTraditionalPageTurningEnabled,
          isSeamlessScrollingEnabled: window.renderVariables.isSeamlessScrollingEnabled
        },
        
        // 阅读章节进度
        progress: {
          currentIndex: currentIndex,
          volData: volData ? {
            chaptersCount: volData.reduce((total, vol) => total + (vol.chapters ? vol.chapters.length : 0), 0),
            volumesCount: volData.length
          } : null
        },
        
        // 人名高亮
        nameHighlight: {
          isEnabled: window.renderVariables.isNameHighlightEnabled,
          currentNames: window.renderVariables.currentNames,
          disabledNames: window.renderVariables.disabledNames,
          nameGroups: window.renderVariables.nameGroups,
          globalNameColorMap: window.renderVariables.globalNameColorMap
        },
        
        // 笔记
        notes: getCurrentFileNotes()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      
      // 使用剪贴板API复制数据
      navigator.clipboard.writeText(dataStr).then(() => {
        showToast('当前数据已复制到剪贴板', 'success');
      }).catch(err => {
        console.error('复制到剪贴板失败:', err);
        showToast('复制失败，请手动复制以下数据', 'error');
        
        // 显示一个临时的文本区域让用户手动复制
        const tempTextarea = document.createElement('textarea');
        tempTextarea.value = dataStr;
        tempTextarea.style.position = 'fixed';
        tempTextarea.style.opacity = '0';
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextarea);
      });
    }

    // 导入所有数据
    function importAllData() {
      if (!currentFileId) {
        showToast('请先打开文件', 'error');
        return;
      }
      
      // 创建一个包含文本区域的模态框让用户粘贴数据
      ModalSystem.createModal({
        id: 'pasteImportModal',
        title: '导入数据',
        content: `
          <div style="padding: 16px 0;">
            <p style="margin: 0 0 12px 0; color: var(--text-color);">
              请粘贴要导入的数据（从剪贴板复制的JSON格式）：
            </p>
            <textarea id="importDataTextarea" style="width: 100%; height: 200px; padding: 12px; font-size: 14px; border: 1px solid var(--border-color); border-radius: 4px; background-color: var(--background-color); color: var(--text-color); resize: vertical;" placeholder="在此粘贴JSON数据..."></textarea>
          </div>
        `,
        width: '500px',
        buttons: [
          {
            text: '取消',
            type: 'secondary',
            close: true
          },
          {
            text: '导入',
            type: 'primary',
            onClick: function() {
              const textarea = document.getElementById('importDataTextarea');
              const dataStr = textarea.value.trim();
              
              if (!dataStr) {
                showToast('请输入要导入的数据', 'error');
                return;
              }
              
              try {
                const importedData = JSON.parse(dataStr);
                
                // 检查数据格式
                if (!importedData || typeof importedData !== 'object') {
                  showToast('无效的数据格式', 'error');
                  return;
                }
                
                // 显示确认对话框
                ModalSystem.createModal({
                  id: 'confirmImportModal',
                  title: '确认导入',
                  content: `
                    <div style="padding: 16px 0;">
                      <p style="margin: 0 0 12px 0; color: var(--text-color);">
                        导入数据将覆盖当前文件的所有设置（包括阅读进度、人名高亮和笔记等）。
                      </p>
                      <p style="margin: 0; color: var(--text-color-secondary); font-size: 14px;">
                        确定要继续导入吗？
                      </p>
                    </div>
                  `,
                  width: '400px',
                  buttons: [
                    {
                      text: '取消',
                      type: 'secondary'
                    },
                    {
                      text: '确定导入',
                      type: 'primary',
                      onClick: function() {
                        // 应用阅读设置
                        if (importedData.readerSettings) {
                          Object.assign(window.renderVariables, importedData.readerSettings);
                        }
                        
                        // 应用阅读进度
                        if (importedData.progress && importedData.progress.currentIndex !== undefined) {
                          currentIndex = importedData.progress.currentIndex;
                          if (volData && currentIndex >= 0 && currentIndex < volData.length) {
                            renderChapter();
                          }
                        }
                        
                        // 应用人名高亮
                        if (importedData.nameHighlight) {
                          window.renderVariables.isNameHighlightEnabled = importedData.nameHighlight.isEnabled || false;
                          window.renderVariables.currentNames = importedData.nameHighlight.currentNames || [];
                          window.renderVariables.disabledNames = importedData.nameHighlight.disabledNames || [];
                          window.renderVariables.nameGroups = importedData.nameHighlight.nameGroups || {};
                          window.renderVariables.globalNameColorMap = importedData.nameHighlight.globalNameColorMap || {};
                        }
                        
                        // 应用笔记
                        if (importedData.notes && Array.isArray(importedData.notes)) {
                          saveNotes(currentFileId, importedData.notes);
                          renderNotesList();
                          updateNotesProgress();
                        }
                        
                        // 保存所有设置
                        saveProgress();
                        
                        showToast('数据导入成功', 'success');
                        ModalSystem.closeModal('confirmImportModal');
                        ModalSystem.closeModal('pasteImportModal');
                      }
                    }
                  ],
                  closeOnOverlayClick: true
                });
              } catch (error) {
                console.error('导入数据失败:', error);
                showToast('导入数据失败，请检查JSON格式', 'error');
              }
            }
          }
        ],
        closeOnOverlayClick: true
      });
      
      // 尝试从剪贴板自动粘贴
      navigator.clipboard.readText().then(text => {
        const textarea = document.getElementById('importDataTextarea');
        if (textarea && text) {
          textarea.value = text;
        }
      }).catch(err => {
        // 如果剪贴板API不可用，不做处理，用户可以手动粘贴
      });
    }

    // 打开书籍数据同步设置弹窗
    function openImportExportSettings() {
      // 获取当前数据信息
      const notes = getCurrentFileNotes() || [];
      const totalNotes = notes.length;
      const completedNotes = notes.filter(note => note.isChecked).length;
      const nameCount = window.renderVariables.currentNames ? window.renderVariables.currentNames.length : 0;
      const isNameHighlightEnabled = window.renderVariables.isNameHighlightEnabled ? '启用' : '禁用';
      const isDialogHighlightEnabled = window.renderVariables.isDialogHighlightEnabled ? '启用' : '禁用';
      const fontSize = window.renderVariables.fontSize || '16px';
      const lineHeight = window.renderVariables.lineHeight || '1.5';
      const paragraphSpacing = window.renderVariables.paragraphSpacing || '10px';
      const fontFamily = window.renderVariables.fontFamily || '默认';
      const dialogHighlightColor = window.renderVariables.dialogHighlightColor || '#999999';

      const isTraditionalPageTurningEnabled = window.renderVariables.isTraditionalPageTurningEnabled ? '启用' : '禁用';
      const isSeamlessScrollingEnabled = window.renderVariables.isSeamlessScrollingEnabled ? '启用' : '禁用';
      
      const content = `
        <div class="import-export-settings">
          <h3 style="margin-bottom: 20px; color: var(--text-color);">书籍数据同步</h3>
          
          <!-- 书籍数据同步功能 -->
          <div class="setting-group" style="margin-bottom: 25px;">
            <div class="setting-item" style="margin-bottom: 12px;">
              <label style="display: inline-block; width: 200px; color: var(--text-color);">复制当前数据:</label>
              <button class="modal-btn secondary" onclick="exportAllData()" style="width: 120px;">复制</button>
            </div>
            <div class="setting-item" style="margin-bottom: 12px;">
              <label style="display: inline-block; width: 200px; color: var(--text-color);">粘贴板导入同步:</label>
              <button class="modal-btn secondary" onclick="importAllData()" style="width: 120px;">粘贴</button>
            </div>
          </div>
          
          <!-- 数据信息展示 -->
          <div style="padding: 15px; background-color: var(--background-color-light); border-radius: 8px; margin-bottom: 20px;">
            <h4 style="margin-bottom: 15px; font-size: 14px; color: var(--text-color);">当前数据信息</h4>
            <div class="data-info-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px;">
              <div class="data-info-item">
                <span style="color: var(--secondary-text-color);">当前文件名:</span>
                <span style="color: var(--text-color); display: block; margin-top: 2px; word-break: break-all;">${currentFileName || '未打开文件'}</span>
              </div>
              <div class="data-info-item">
                <span style="color: var(--secondary-text-color);">笔记数量:</span>
                <span style="color: var(--text-color); display: block; margin-top: 2px;">${totalNotes} 条 (${completedNotes} 条已完成)</span>
              </div>
              <div class="data-info-item">
                <span style="color: var(--secondary-text-color);">高亮人名数量:</span>
                <span style="color: var(--text-color); display: block; margin-top: 2px;">${nameCount} 个</span>
              </div>
              <div class="data-info-item">
                <span style="color: var(--secondary-text-color);">当前主题:</span>
                <span style="color: var(--text-color); display: block; margin-top: 2px;">${window.renderVariables.currentTheme || '默认'}</span>
              </div>
              <div class="data-info-item">
                <span style="color: var(--secondary-text-color);">字体大小:</span>
                <span style="color: var(--text-color); display: block; margin-top: 2px;">${fontSize}</span>
              </div>
              <div class="data-info-item">
                <span style="color: var(--secondary-text-color);">行间距:</span>
                <span style="color: var(--text-color); display: block; margin-top: 2px;">${lineHeight}</span>
              </div>
              <div class="data-info-item">
                <span style="color: var(--secondary-text-color);">段落间距:</span>
                <span style="color: var(--text-color); display: block; margin-top: 2px;">${paragraphSpacing}</span>
              </div>
              <div class="data-info-item">
                <span style="color: var(--secondary-text-color);">字体:</span>
                <span style="color: var(--text-color); display: block; margin-top: 2px;">${fontFamily}</span>
              </div>
              <div class="data-info-item">
                <span style="color: var(--secondary-text-color);">对话高亮状态:</span>
                <span style="color: var(--text-color); display: block; margin-top: 2px;">${isDialogHighlightEnabled}</span>
              </div>
              <div class="data-info-item">
                <span style="color: var(--secondary-text-color);">对话高亮颜色:</span>
                <span style="color: var(--text-color); display: block; margin-top: 2px;">${dialogHighlightColor}</span>
              </div>

              <div class="data-info-item">
                <span style="color: var(--secondary-text-color);">人名高亮状态:</span>
                <span style="color: var(--text-color); display: block; margin-top: 2px;">${isNameHighlightEnabled}</span>
              </div>
              <div class="data-info-item">
                <span style="color: var(--secondary-text-color);">翻页模式:</span>
                <span style="color: var(--text-color); display: block; margin-top: 2px;">${isSeamlessScrollingEnabled ? '自动上下翻页' : '左右翻页'}</span>
              </div>
              </div>
            </div>
          </div>
          
          <!-- 说明文本 -->
          <div style="padding: 15px; background-color: var(--background-color-light); border-radius: 8px; font-size: 13px; color: var(--secondary-text-color);">
            <p>说明:</p>
            <ul style="margin-top: 8px; margin-bottom: 0;">
              <li>所有数据同步包含：阅读设置、阅读进度、人名高亮和笔记</li>
              <li>导入数据会覆盖当前文件的所有设置和数据</li>
              <li>建议在导入前备份重要数据</li>
            </ul>
          </div>
        </div>
      `;
      
      ModalSystem.createModal({
        id: 'importExportSettingsDialog',
        title: '书籍数据同步',
        content: content,
        large: false,
        buttons: [
          {
            text: '关闭',
            type: 'secondary',
            close: true
          }
        ]
      });
    }

    // 更新对话高亮颜色
    function updateDialogHighlightColor() {
      // 处理背景/下划线高亮颜色
      // 优先使用window.renderVariables.dialogHighlightColor，如果为null或undefined，则使用默认的十六进制颜色值
      let dialogHighlightColor = window.renderVariables.dialogHighlightColor;
      
      // 预设颜色映射表，用于兼容可能存在的旧格式颜色名称
      const colorMap = {
        'yellow': '#fff1c2',
        'blue': '#d1e0ff',
        'red': '#ffd1d1',
        'gray': '#cccccc'
      };
      
      // 如果颜色值不存在，使用默认黄色
      if (!dialogHighlightColor) {
        dialogHighlightColor = '#fff1c2';
      }
      // 如果是预设颜色名称，转换为对应的十六进制值
      else if (colorMap[dialogHighlightColor]) {
        dialogHighlightColor = colorMap[dialogHighlightColor];
      }
      // 确保使用的是十六进制颜色值
      else if (!dialogHighlightColor.startsWith('#')) {
        dialogHighlightColor = '#fff1c2'; // 默认为黄色
      }
      
      // 应用颜色到CSS变量
      document.documentElement.style.setProperty('--dialog-highlight-color', dialogHighlightColor);
    }

    // 页面加载时初始化
    window.addEventListener('load', function() {
      initTextSelectionListener();
      // 初始化移动端状态栏背景色
      updateStatusBarThemeColor();
      
      // 从localStorage加载全局对话高亮设置
      const savedIsDialogHighlightEnabled = localStorage.getItem('readerDialogHighlightEnabled');
      const savedDialogHighlightColor = localStorage.getItem('readerDialogHighlightColor');
      const savedDialogHighlightType = localStorage.getItem('readerDialogHighlightType');
      const savedDialogFontHighlightEnabled = localStorage.getItem('readerDialogFontHighlightEnabled');
      const savedDialogPrefix = localStorage.getItem('readerDialogPrefix');
      const savedDialogSuffix = localStorage.getItem('readerDialogSuffix');
      
      // 如果有保存的设置，应用它们
      if (savedIsDialogHighlightEnabled !== null) {
        window.renderVariables.isDialogHighlightEnabled = savedIsDialogHighlightEnabled === 'true';
      }
      if (savedDialogHighlightColor) {
        window.renderVariables.dialogHighlightColor = savedDialogHighlightColor;
      }
      if (savedDialogHighlightType) {
        window.renderVariables.dialogHighlightType = savedDialogHighlightType;
      }
      if (savedDialogFontHighlightEnabled) {
        window.renderVariables.isDialogFontHighlightEnabled = savedDialogFontHighlightEnabled === 'true';
      } else {
        // 默认关闭字体高亮
        window.renderVariables.isDialogFontHighlightEnabled = false;
      }
      if (savedDialogPrefix) {
        window.renderVariables.dialogPrefix = savedDialogPrefix;
      }
      if (savedDialogSuffix) {
        window.renderVariables.dialogSuffix = savedDialogSuffix;
      }
      
      // 初始化对话高亮颜色
      updateDialogHighlightColor();
      
      // 同步局部变量
      updateLocalRenderVariables();
    });

    // ===== 新增：书籍导入检查和书籍详情功能 =====
    
    // 全局变量：当前正在导入的书籍信息
    let currentImportingBook = null;
    let currentDetailBook = null;
    
    // 切换到导入检查页面
    function switchToImportCheckPage(file) {
      const booksPage = document.getElementById('booksPage');
      const importCheckPage = document.getElementById('importCheckPage');
      const bookDetailPage = document.getElementById('bookDetailPage');
      
      // 清理详情状态
      currentDetailBook = null;
      
      // 隐藏所有其他页面
      if (booksPage) booksPage.style.display = 'none';
      if (bookDetailPage) bookDetailPage.style.display = 'none';
      if (appContainer) appContainer.style.display = 'none';
      
      // 显示导入检查页面
      importCheckPage.style.display = 'flex';
      
      // 设置页面标题
      const fileNameWithoutExt = file.name.replace(/\.[^.]+$/, '');
      document.getElementById('importCheckTitle').textContent = fileNameWithoutExt + '导入';
      
      // 初始化图标
      initializeNavIcons();
      
      // 处理文件导入和检查
      processFileForImportCheck(file);
    }
    
    // 处理文件用于导入检查
    function processFileForImportCheck(file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      
      reader.onload = async function(e) {
        try {
          const buffer = e.target.result;
          const uint8Array = new Uint8Array(buffer);
          
          // 编码检测
          const sampleSize = Math.min(uint8Array.length, 20000);
          const sample = uint8Array.subarray(0, sampleSize);
          let binaryString = "";
          for (let i = 0; i < sample.length; i++) {
            binaryString += String.fromCharCode(sample[i]);
          }
          
          const detected = jschardet.detect(binaryString);
          let encoding = detected.encoding || 'utf-8';
          
          if (encoding.toLowerCase() === 'gb2312' || encoding.toLowerCase() === 'ascii') {
            encoding = 'gb18030';
          }
          
          // 解码文件内容
          const decoder = new TextDecoder(encoding);
          const text = decoder.decode(uint8Array);
          
          // 保存当前导入书籍信息
          currentImportingBook = {
            file: file,
            name: file.name,
            size: file.size,
            lastModified: file.lastModified,
            encoding: encoding,
            text: text,
            fileId: file.name + '_' + file.size + '_' + file.lastModified
          };
          
          // 渲染导入检查页面
          renderImportCheckPage(currentImportingBook);
        } catch (error) {
          console.error('文件处理失败:', error);
          showToast('文件处理失败: ' + error.message, 'error');
        }
      };
      
      reader.onerror = function() {
        showToast('无法读取文件', 'error');
      };
    }
    
    // 渲染导入检查页面
    function renderImportCheckPage(bookInfo) {
      // 渲染书籍信息
      renderImportInfoGrid(bookInfo);
      
      // 渲染编码检查
      renderEncodingCheck(bookInfo);
      
      // 渲染目录检查
      renderDirectoryCheck(bookInfo);
      
      // 渲染目录预览
      renderImportDirectoryPreview(bookInfo);
      
      // 更新确认按钮状态
      updateImportConfirmButtonState(bookInfo);
    }
    
    // 更新确认导入按钮状态
    function updateImportConfirmButtonState(bookInfo) {
      const confirmBtn = document.getElementById('importConfirmBtn');
      if (!confirmBtn) return;
      
      // 检查是否有乱码
      const hasGarbled = checkForGarbledText(bookInfo.text);
      
      // 检查章节数量
      let vols = [];
      try {
        vols = parseText(bookInfo.text);
      } catch (e) {
        // 解析失败
      }
      
      let chapterCount = 0;
      vols.forEach(vol => {
        chapterCount += vol.chapters.length;
      });
      
      // 判断是否禁用按钮
      const shouldDisable = hasGarbled || chapterCount === 0;
      
      if (shouldDisable) {
        confirmBtn.disabled = true;
        confirmBtn.style.opacity = '0.5';
        confirmBtn.style.cursor = 'not-allowed';
        confirmBtn.title = '格式异常或编码问题，无法阅读，请先修复';
      } else {
        confirmBtn.disabled = false;
        confirmBtn.style.opacity = '1';
        confirmBtn.style.cursor = 'pointer';
        confirmBtn.title = '确认导入并阅读';
      }
    }
    
    // 渲染导入页面目录预览
    function renderImportDirectoryPreview(bookInfo) {
      const container = document.getElementById('importDirectoryContainer');
      const vols = bookInfo.vols || [];
      
      if (vols.length === 0) {
        container.innerHTML = '<div class="check-detail">暂无目录</div>';
        return;
      }
      
      let html = '<div class="import-directory-list">';
      
      vols.forEach((vol, volIndex) => {
        if (vols.length > 1) {
          html += `<div class="volume-title" style="padding: 12px 0; font-weight: 600; color: var(--nav-text);">${vol.volTitle}</div>`;
        }
        
        vol.chapters.forEach((chap, chapIndex) => {
          html += `<div class="import-directory-item">${chap.title}</div>`;
        });
      });
      
      html += '</div>';
      container.innerHTML = html;
    }
    
    // 渲染书籍信息网格
    function renderImportInfoGrid(bookInfo) {
      const grid = document.getElementById('importInfoGrid');
      
      grid.innerHTML = `
        <div class="info-item">
          <div class="info-item-label">文件名</div>
          <div class="info-item-value">${bookInfo.name}</div>
        </div>
        <div class="info-item">
          <div class="info-item-label">修改时间</div>
          <div class="info-item-value">${new Date(bookInfo.lastModified).toLocaleString()}</div>
        </div>
        <div class="info-item">
          <div class="info-item-label">检测编码</div>
          <div class="info-item-value">${bookInfo.encoding}</div>
        </div>
      `;
    }
    
    // 渲染编码检查
    function renderEncodingCheck(bookInfo) {
      const container = document.getElementById('encodingCheckContainer');
      const text = bookInfo.text;
      
      // 检查是否有乱码特征
      const hasGarbled = checkForGarbledText(text);
      let statusClass = 'success';
      let statusIcon = '✓';
      let statusText = '编码检测正常';
      let detailText = `文件使用 ${bookInfo.encoding} 编码，内容解析正常。`;
      
      if (hasGarbled) {
        statusClass = 'warning';
        statusIcon = '⚠';
        statusText = '可能存在编码问题';
        detailText = '检测到可能的乱码字符，建议尝试其他编码或使用修复功能。';
      }
      
      container.innerHTML = `
        <div class="check-status ${statusClass}">
          <span class="check-status-icon">${statusIcon}</span>
          <span>${statusText}</span>
        </div>
        <div class="check-detail">${detailText}</div>
      `;
    }
    
    // 检查乱码
    function checkForGarbledText(text) {
      // 简单的乱码检测：检查是否有大量连续的不可打印字符
      const sample = text.substring(0, 1000);
      let garbledCount = 0;
      
      for (let i = 0; i < sample.length; i++) {
        const charCode = sample.charCodeAt(i);
        // 检查是否是控制字符或扩展ASCII中不常见的字符
        if ((charCode < 32 && charCode !== 9 && charCode !== 10 && charCode !== 13) || 
            (charCode >= 127 && charCode < 160)) {
          garbledCount++;
        }
      }
      
      return garbledCount > sample.length * 0.1;
    }
    
    // 渲染目录检查
    function renderDirectoryCheck(bookInfo) {
      const container = document.getElementById('directoryCheckContainer');
      const text = bookInfo.text;
      
      // 解析目录
      let vols = [];
      try {
        vols = parseText(text);
      } catch (e) {
        console.error('目录解析失败:', e);
      }
      
      const volCount = vols.length;
      let chapterCount = 0;
      vols.forEach(vol => {
        chapterCount += vol.chapters.length;
      });
      
      let statusClass = 'success';
      let statusIcon = '✓';
      let statusText = '目录解析成功';
      let detailText = `共解析出 ${volCount} 卷，${chapterCount} 章。`;
      
      if (chapterCount === 0) {
        statusClass = 'error';
        statusIcon = '✗';
        statusText = '目录解析失败';
        detailText = '未能识别出任何章节，请检查文件格式。';
      } else if (chapterCount < 5) {
        statusClass = 'warning';
        statusIcon = '⚠';
        statusText = '章节数量较少';
        detailText = `仅识别出 ${chapterCount} 章，可能需要手动调整。`;
      }
      
      container.innerHTML = `
        <div class="check-status ${statusClass}">
          <span class="check-status-icon">${statusIcon}</span>
          <span>${statusText}</span>
        </div>
        <div class="check-detail">${detailText}</div>
      `;
      
      // 保存解析结果
      currentImportingBook.vols = vols;
      currentImportingBook.chapterCount = chapterCount;
    }
    
    // 复制书籍目录结构
    function copyBookDirectoryStructure() {
      if (!currentImportingBook) return;
      
      let content = '// 书籍信息\n';
      content += `文件名: ${currentImportingBook.name}\n`;
      content += `文件大小: ${(currentImportingBook.size / 1024).toFixed(2)} KB\n`;
      content += `检测编码: ${currentImportingBook.encoding}\n`;
      
      content += '\n// 编码检查\n';
      const encodingCheckContainer = document.getElementById('encodingCheckContainer');
      if (encodingCheckContainer) {
        content += encodingCheckContainer.innerText + '\n';
      }
      
      content += '\n// 目录分卷分章检查\n';
      const directoryCheckContainer = document.getElementById('directoryCheckContainer');
      if (directoryCheckContainer) {
        content += directoryCheckContainer.innerText + '\n';
      }
      
      // 添加目录格式和正文预览
      if (currentImportingBook.vols) {
        content += '\n// 目录格式\n';
        const vols = currentImportingBook.vols;
        
        vols.forEach((vol, volIndex) => {
          if (vols.length > 1) {
            content += `${vol.volTitle}\n`;
          }
          
          const chaptersToCopy = vol.chapters.slice(0, 10);
          chaptersToCopy.forEach((chap, chapIndex) => {
            content += `${chap.title}\n`;
          });
        });
        
        content += '\n// 正文预览\n';
        content += currentImportingBook.text.substring(0, 300);
      }
      
      navigator.clipboard.writeText(content).then(() => {
        showToast('已复制书籍目录结构到剪贴板', 'success');
      }).catch(() => {
        showToast('复制失败，请手动复制', 'error');
      });
    }
    
    // 尝试修复编码
    function tryFixEncoding() {
      if (!currentImportingBook) return;
      
      showToast('正在尝试编码修复...', 'info');
      
      // 保存当前编码作为参考
      const currentEncoding = currentImportingBook.encoding;
      
      // 这里可以添加iconv-lite等编码转换逻辑
      // 目前先尝试多种常见编码，但是优先保留当前编码，或者排除当前编码
      let encodings = ['utf-8', 'gb18030', 'gbk', 'big5'];
      
      // 如果当前编码在列表中，把它放到最前面
      const currentIndex = encodings.indexOf(currentEncoding);
      if (currentIndex > 0) {
        encodings.splice(currentIndex, 1);
        encodings.unshift(currentEncoding);
      }
      
      let fixed = false;
      let bestEncoding = null;
      let bestText = null;
      let bestChapterCount = 0;
      
      // 重新读取文件尝试其他编码
      const reader = new FileReader();
      reader.readAsArrayBuffer(currentImportingBook.file);
      
      reader.onload = function(e) {
        const buffer = e.target.result;
        const uint8Array = new Uint8Array(buffer);
        
        for (const enc of encodings) {
          try {
            const decoder = new TextDecoder(enc);
            const text = decoder.decode(uint8Array);
            
            // 解析目录检查章节数量
            let vols = [];
            try {
              vols = parseText(text);
            } catch (e) {
              continue;
            }
            
            let chapterCount = 0;
            vols.forEach(vol => {
              chapterCount += vol.chapters.length;
            });
            
            // 如果章节数量比之前更多，就用这个编码
            if (chapterCount > bestChapterCount) {
              bestChapterCount = chapterCount;
              bestEncoding = enc;
              bestText = text;
            }
            
            // 如果章节数大于10，我们认为这个编码比较合适，直接使用
            if (chapterCount >= 10) {
              currentImportingBook.encoding = enc;
              currentImportingBook.text = text;
              currentImportingBook.vols = vols;
              currentImportingBook.chapterCount = chapterCount;
              fixed = true;
              showToast(`已使用 ${enc} 编码重新解析，识别到 ${chapterCount} 章`, 'success');
              renderImportCheckPage(currentImportingBook);
              break;
            }
          } catch (e) {
            continue;
          }
        }
        
        if (!fixed && bestEncoding) {
          // 虽然没找到10章以上的，但用章节数最多的那个
          let bestVols = parseText(bestText);
          currentImportingBook.encoding = bestEncoding;
          currentImportingBook.text = bestText;
          currentImportingBook.vols = bestVols;
          currentImportingBook.chapterCount = bestChapterCount;
          showToast(`已使用 ${bestEncoding} 编码重新解析，识别到 ${bestChapterCount} 章`, 'success');
          renderImportCheckPage(currentImportingBook);
        } else if (!fixed) {
          showToast('未能找到合适的编码，请手动检查', 'warning');
        }
      };
    }
    
    // 删除正在导入的书籍
    function deleteImportingBook() {
      if (!currentImportingBook) return;
      
      ModalSystem.createModal({
        title: '确认删除',
        content: '确定要删除这本书籍吗？',
        buttons: [
          { text: '取消', type: 'secondary' },
          { 
            text: '删除', 
            type: 'danger',
            onClick: function() {
              currentImportingBook = null;
              switchToBooksPage();
              showToast('已删除', 'success');
            }
          }
        ]
      });
    }
    
    // 修改processFile函数，让它在导入前先进入检查页面
    // 先保存原processFile函数
    const originalProcessFile = processFile;
    
    // 重写processFile函数
    function processFile(file) {
      // 检查书籍是否已存在
      const fileId = file.name + '_' + file.size + '_' + file.lastModified;
      const recentFiles = JSON.parse(localStorage.getItem('reader_recent_files') || '[]');
      const existingBook = recentFiles.find(f => f.id === fileId);
      
      if (existingBook) {
        // 书籍已存在，直接打开
        loadCachedFile(fileId, file.name);
      } else {
        // 新书籍，进入检查页面
        switchToImportCheckPage(file);
      }
    }
    
    // 从检查页面完成导入后的实际处理
    function completeImportAndRead(bookInfo) {
      const file = bookInfo.file;
      const fileId = bookInfo.fileId;
      const text = bookInfo.text;
      
      try {
        // 解析文件内容 - 总是重新解析以确保编码正确
        volData = parseText(text);
        flatChapters = flatten(volData);
        currentIndex = 0;
        
        // 保存到IndexedDB
        saveFileToIndexedDB(fileId, text).then(() => {
          // 添加到最近文件列表
          const recentFiles = JSON.parse(localStorage.getItem('reader_recent_files') || '[]');
          const fileInfo = {
            id: fileId,
            name: file.name,
            size: file.size,
            lastModified: file.lastModified,
            lastRead: new Date().getTime(),
            chapterCount: bookInfo.chapterCount || flatChapters.length,
            title: file.name.replace(/\.txt$/, ''),
            encoding: bookInfo.encoding || 'utf-8'
          };
          
          recentFiles.unshift(fileInfo);
          localStorage.setItem('reader_recent_files', JSON.stringify(recentFiles));
          
          // 初始化阅读记录和统计
          initBookStatistics(fileId);
          
          // 隐藏导入检查页面，显示阅读器
          document.getElementById('importCheckPage').style.display = 'none';
          appContainer.style.display = 'flex';
          document.getElementById('booksPage').style.display = 'none';
          
          // 关闭所有侧边栏并恢复内容显示
          if (sidebarLeft) {
            sidebarLeft.classList.remove('show', 'fullscreen');
          }
          if (sidebarRight) {
            sidebarRight.classList.remove('show', 'fullscreen');
          }
          const readingArea = document.querySelector('.reading-area');
          const searchContainer = document.querySelector('.search-main-container');
          if (readingArea) readingArea.classList.remove('hide-mobile');
          if (searchContainer) searchContainer.classList.remove('hide-mobile');
          
          // 强制应用当前的渲染变量
          updateLocalRenderVariables();
          applyCurrentFontSettings();
          
          // 初始化界面
          resetDirectoryLoading();
          renderDirectory();
          renderChapter();
          renderFunctionContent();
          updateProgress();
          updateChapterJumpUI();
          showBookTitle(file.name);
          
          if (window.hideNav) window.hideNav();
          
          setTimeout(() => {
            initializeUIElements();
            chapterContent = enhanceAutoPaging();
            applyCurrentFontSettings();
            if (window.bindChapterContentClick) window.bindChapterContentClick();
          }, 100);
          
          currentFileId = fileId;
          currentFileName = file.name;
          saveCurrentFileInfo();
          saveProgress();
          
          recordBookAccess(fileId);
          
          showToast(`成功解析：共${volData.length}卷，${flatChapters.length}章`, 'success');
        }).catch(error => {
          console.error('保存文件失败:', error);
          showToast('保存文件失败: ' + error.message, 'error');
        });
      } catch (error) {
        console.error('文件解析错误:', error);
        showToast('文件解析错误: ' + error.message, 'error');
      }
    }
    
    // 修改confirmImport函数，使用新的完成逻辑
    function confirmImport() {
      const confirmBtn = document.getElementById('importConfirmBtn');
      if (!currentImportingBook || (confirmBtn && confirmBtn.disabled)) return;
      completeImportAndRead(currentImportingBook);
    }
    
    // ===== 书籍详情页面功能 =====
    
    // 切换到书籍详情页面
    function switchToBookDetailPage(bookInfo) {
      const booksPage = document.getElementById('booksPage');
      const bookDetailPage = document.getElementById('bookDetailPage');
      const importCheckPage = document.getElementById('importCheckPage');
      
      // 清理导入状态
      currentImportingBook = null;
      
      // 隐藏所有其他页面
      if (booksPage) booksPage.style.display = 'none';
      if (importCheckPage) importCheckPage.style.display = 'none';
      
      // 显示详情页面
      bookDetailPage.style.display = 'flex';
      
      currentDetailBook = bookInfo;
      
      const fileNameWithoutExt = bookInfo.name.replace(/\.[^.]+$/, '');
      document.getElementById('bookDetailTitle').textContent = fileNameWithoutExt + '详情';
      
      // 初始化图标
      initializeNavIcons();
      
      renderBookDetailPage(bookInfo);
    }
    
    // 渲染书籍详情页面
    async function renderBookDetailPage(bookInfo) {
      // 确保书籍信息完整
      await ensureBookInfoComplete(bookInfo);
      renderBookInfoGrid(bookInfo);
      renderBookStats(bookInfo.id);
      renderBookReadingHistory(bookInfo.id);
      await renderBookDirectory(bookInfo.id);
    }
    
    // 确保书籍信息完整，如果不完整则更新
    async function ensureBookInfoComplete(bookInfo) {
      let needsUpdate = false;
      
      // 尝试从文件内容中获取信息
      try {
        const text = await loadFileFromIndexedDB(bookInfo.id);
        if (text) {
          // 检查是否需要更新章节数
          if (!bookInfo.chapterCount || bookInfo.chapterCount === '未知') {
            const vols = parseText(text);
            const flatChapters = flatten(vols);
            bookInfo.chapterCount = flatChapters.length;
            needsUpdate = true;
          }
          
          // 检查是否需要更新编码
          if (!bookInfo.encoding) {
            // 检测编码
            const sampleSize = Math.min(text.length, 20000);
            const sample = text.substring(0, sampleSize);
            let binaryString = "";
            for (let i = 0; i < sample.length; i++) {
              binaryString += String.fromCharCode(sample.charCodeAt(i));
            }
            const detected = jschardet.detect(binaryString);
            let encoding = detected.encoding || 'utf-8';
            if (encoding.toLowerCase() === 'gb2312' || encoding.toLowerCase() === 'ascii') {
              encoding = 'gb18030';
            }
            bookInfo.encoding = encoding;
            needsUpdate = true;
          }
          
          // 如果需要更新，保存到localStorage
          if (needsUpdate) {
            const recentFiles = JSON.parse(localStorage.getItem('reader_recent_files') || '[]');
            const index = recentFiles.findIndex(f => f.id === bookInfo.id);
            if (index !== -1) {
              recentFiles[index] = { ...recentFiles[index], ...bookInfo };
              localStorage.setItem('reader_recent_files', JSON.stringify(recentFiles));
            }
          }
        }
      } catch (e) {
        console.error('确保书籍信息完整时出错:', e);
      }
    }
    
    // 渲染书籍基本信息 - 修复数据显示bug
    function renderBookInfoGrid(bookInfo) {
      const grid = document.getElementById('bookInfoGrid');
      
      // 安全获取文件大小
      let sizeKB = '未知';
      if (bookInfo && typeof bookInfo.size === 'number' && !isNaN(bookInfo.size)) {
        sizeKB = (bookInfo.size / 1024).toFixed(2);
      }
      
      // 安全获取书名
      let bookTitle = '未知';
      if (bookInfo) {
        if (bookInfo.title) {
          bookTitle = bookInfo.title;
        } else if (bookInfo.name) {
          bookTitle = bookInfo.name.replace(/\.[^.]+$/, '');
        }
      }
      
      // 安全获取章节数量
      let chapterCount = '未知';
      if (bookInfo && bookInfo.chapterCount && typeof bookInfo.chapterCount === 'number' && !isNaN(bookInfo.chapterCount)) {
        chapterCount = bookInfo.chapterCount;
      }
      
      // 获取人名数量
      let nameCount = 0;
      if (bookInfo && bookInfo.id) {
        const progressData = localStorage.getItem('reader_progress_' + bookInfo.id);
        if (progressData) {
          try {
            const data = JSON.parse(progressData);
            if (data.nameGroups && typeof data.nameGroups === 'object') {
              for (const groupId in data.nameGroups) {
                const group = data.nameGroups[groupId];
                if (group && group.names && Array.isArray(group.names)) {
                  nameCount += group.names.length;
                }
              }
            }
            if (data.currentNames && Array.isArray(data.currentNames)) {
              nameCount += data.currentNames.length;
            }
          } catch (e) {
            console.error('解析人名数据失败:', e);
          }
        }
      }
      
      // 获取书籍编码
      let encoding = '未知';
      if (bookInfo && bookInfo.encoding) {
        encoding = bookInfo.encoding;
      }
      
      grid.innerHTML = `
        <div class="info-item">
          <div class="info-item-label">书名</div>
          <div class="info-item-value">${bookTitle}</div>
        </div>
        <div class="info-item">
          <div class="info-item-label">章节数量</div>
          <div class="info-item-value">${chapterCount}</div>
        </div>
        <div class="info-item">
          <div class="info-item-label">人名数量</div>
          <div class="info-item-value">${nameCount}</div>
        </div>
        <div class="info-item">
          <div class="info-item-label">书籍编码</div>
          <div class="info-item-value">${encoding}</div>
        </div>
      `;
    }
    
    // 切换详情页面tab
    function switchDetailTab(tabName) {
      const tabs = document.querySelectorAll('.book-detail-tab');
      const tabContents = document.querySelectorAll('.book-detail-tab-content');
      
      tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabName) {
          tab.classList.add('active');
        }
      });
      
      tabContents.forEach(content => {
        content.classList.remove('active');
      });
      
      document.getElementById('detailTab' + tabName.charAt(0).toUpperCase() + tabName.slice(1)).classList.add('active');
    }
    
    // 初始化书籍统计数据
    function initBookStatistics(fileId) {
      const statsKey = 'reader_book_stats_' + fileId;
      if (!localStorage.getItem(statsKey)) {
        const stats = {
          accessCount: 0,
          readingDates: [],
          firstAccessDate: new Date().getTime(),
          totalReadingDays: 0
        };
        localStorage.setItem(statsKey, JSON.stringify(stats));
      }
    }
    
    // 记录书籍访问
    function recordBookAccess(fileId) {
      const statsKey = 'reader_book_stats_' + fileId;
      let stats = JSON.parse(localStorage.getItem(statsKey) || '{}');
      
      if (!stats.accessCount) stats.accessCount = 0;
      if (!stats.readingDates) stats.readingDates = [];
      if (!stats.firstAccessDate) stats.firstAccessDate = new Date().getTime();
      
      stats.accessCount++;
      
      const today = new Date().toDateString();
      if (!stats.readingDates.includes(today)) {
        stats.readingDates.push(today);
      }
      
      stats.totalReadingDays = stats.readingDates.length;
      stats.lastAccessDate = new Date().getTime();
      
      localStorage.setItem(statsKey, JSON.stringify(stats));
    }
    
    // 渲染书籍统计信息
    function renderBookStats(fileId) {
      const container = document.getElementById('bookStatsContainer');
      const statsKey = 'reader_book_stats_' + fileId;
      const stats = JSON.parse(localStorage.getItem(statsKey) || '{}');
      
      const accessCount = stats.accessCount || 0;
      const totalReadingDays = stats.totalReadingDays || 0;
      const firstAccessDate = stats.firstAccessDate ? new Date(stats.firstAccessDate).toLocaleDateString() : '未知';
      
      container.innerHTML = `
        <div class="stat-grid">
          <div class="stat-item">
            <div class="stat-value">${accessCount}</div>
            <div class="stat-label">访问次数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${totalReadingDays}</div>
            <div class="stat-label">阅读天数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${firstAccessDate}</div>
            <div class="stat-label">首次阅读</div>
          </div>
        </div>
      `;
    }
    
    // 渲染阅读记录
    function renderBookReadingHistory(fileId) {
      const container = document.getElementById('bookReadingHistory');
      const statsKey = 'reader_book_stats_' + fileId;
      const stats = JSON.parse(localStorage.getItem(statsKey) || '{}');
      
      const readingDates = stats.readingDates || [];
      
      if (readingDates.length === 0) {
        container.innerHTML = '<div class="check-detail">暂无阅读记录</div>';
        return;
      }
      
      const sortedDates = [...readingDates].reverse().slice(0, 10);
      
      container.innerHTML = `
        <div class="reading-history-list">
          ${sortedDates.map(dateStr => {
            const date = new Date(dateStr);
            return `
              <div class="history-item">
                <div>${date.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div class="history-date">${date.toLocaleTimeString()}</div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }
    
    // 渲染书籍目录 - 禁用点击
    async function renderBookDirectory(fileId) {
      const container = document.getElementById('bookDirectoryContainer');
      
      try {
        const text = await loadFileFromIndexedDB(fileId);
        if (!text) {
          container.innerHTML = '<div class="check-detail">无法加载书籍内容</div>';
          return;
        }
        
        const vols = parseText(text);
        
        let html = '<div class="book-directory-list">';
        
        vols.forEach((vol, volIndex) => {
          if (vols.length > 1) {
            html += `<div class="volume-title" style="padding: 12px 0; font-weight: 600; color: var(--nav-text);">${vol.volTitle}</div>`;
          }
          
          vol.chapters.forEach((chap, chapIndex) => {
            html += `<div class="book-directory-item" style="cursor: default;">${chap.title}</div>`;
          });
        });
        
        html += '</div>';
        container.innerHTML = html;
        
        currentDetailBook.vols = vols;
      } catch (error) {
        console.error('加载目录失败:', error);
        container.innerHTML = '<div class="check-detail">加载目录失败</div>';
      }
    }
    
    // 从详情页打开书籍
    function openBookFromDetail(volIndex = 0, chapIndex = 0) {
      if (!currentDetailBook) return;
      
      // 隐藏详情页面
      const bookDetailPage = document.getElementById('bookDetailPage');
      if (bookDetailPage) {
        bookDetailPage.style.display = 'none';
      }
      
      recordBookAccess(currentDetailBook.id);
      loadCachedFile(currentDetailBook.id, currentDetailBook.name);
    }
    
    // 修改createBookCard函数，添加点击进入详情页的功能
    // 先找到原createBookCard函数并修改
