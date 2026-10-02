/**
 * TASKMASTER - DESKTOP TODOLIST APPLICATION
 * Professional Local Web Application with Offline Persistence
 */

// Initial Seed Data
const DEFAULT_CATEGORIES = [
  { id: 'cat-work', name: 'Công việc', color: '#6366f1', icon: 'briefcase' },
  { id: 'cat-personal', name: 'Cá nhân', color: '#10b981', icon: 'user' },
  { id: 'cat-study', name: 'Học tập', color: '#f59e0b', icon: 'book' },
  { id: 'cat-shopping', name: 'Mua sắm', color: '#ec4899', icon: 'shopping' }
];

const PRESET_COLORS = [
  '#6366f1', '#3b82f6', '#06b6d4', '#10b981', 
  '#84cc16', '#f59e0b', '#f97316', '#ef4444', 
  '#ec4899', '#8b5cf6', '#64748b'
];

const SAMPLE_TASKS = [
  {
    id: 'task-1',
    title: 'Lập kế hoạch công việc tuần mới',
    description: 'Rà soát danh sách công việc cần làm, phân bổ thời gian cho từng mục tiêu ưu tiên.',
    categoryId: 'cat-work',
    priority: 'high',
    dueDate: new Date().toISOString().split('T')[0],
    tags: ['kế-hoạch', 'ưu-tiên'],
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-2',
    title: 'Đọc 30 trang sách phát triển bản thân',
    description: 'Dành 30 phút buổi tối đọc sách và ghi lại các bài học tâm đắc.',
    categoryId: 'cat-study',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    tags: ['thói-quen', 'sách'],
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-3',
    title: 'Tập thể dục 45 phút buổi chiều',
    description: 'Chạy bộ hoặc tập cardio nâng cao sức bền.',
    categoryId: 'cat-personal',
    priority: 'low',
    dueDate: new Date().toISOString().split('T')[0],
    tags: ['sức-khỏe'],
    completed: true,
    completedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
];

// App State
class TaskManager {
  constructor() {
    this.tasks = [];
    this.categories = [];
    this.activeFilter = { type: 'view', value: 'all' }; // type: 'view' | 'category' | 'tag'
    this.searchQuery = '';
    this.sortBy = 'createdAt_desc';
    this.theme = 'dark';

    this.init();
  }

  init() {
    this.loadData();
    this.applyTheme(this.theme);
    this.renderColorPicker();
    this.populateCategorySelects();
    this.render();
    this.bindEvents();
  }

  // LocalStorage Persistence
  loadData() {
    try {
      const storedCategories = localStorage.getItem('tm_categories');
      this.categories = storedCategories ? JSON.parse(storedCategories) : DEFAULT_CATEGORIES;

      const storedTasks = localStorage.getItem('tm_tasks');
      this.tasks = storedTasks ? JSON.parse(storedTasks) : SAMPLE_TASKS;

      const storedTheme = localStorage.getItem('tm_theme');
      if (storedTheme) this.theme = storedTheme;

      const storedSort = localStorage.getItem('tm_sort');
      if (storedSort) this.sortBy = storedSort;
    } catch (err) {
      console.error('Lỗi khi đọc LocalStorage:', err);
      this.categories = DEFAULT_CATEGORIES;
      this.tasks = SAMPLE_TASKS;
    }
  }

  saveData() {
    try {
      localStorage.setItem('tm_categories', JSON.stringify(this.categories));
      localStorage.setItem('tm_tasks', JSON.stringify(this.tasks));
      localStorage.setItem('tm_theme', this.theme);
      localStorage.setItem('tm_sort', this.sortBy);
    } catch (err) {
      console.error('Lỗi khi lưu LocalStorage:', err);
      this.showToast('Không thể lưu dữ liệu vào bộ nhớ máy tính!', 'error');
    }
  }

  // Audio Feedback (Gentle synth chime)
  playChime(isDone) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      if (isDone) {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      } else {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.12);
      }

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
      // AudioContext may be restricted before interaction
    }
  }

  // Theme Management
  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(this.theme);
    this.saveData();
  }

  applyTheme(theme) {
    const body = document.body;
    const themeText = document.getElementById('themeText');
    const themeIcon = document.getElementById('themeIcon');

    if (theme === 'light') {
      body.classList.remove('theme-dark');
      body.classList.add('theme-light');
      themeText.textContent = 'Chế độ Tối';
      themeIcon.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
      `;
    } else {
      body.classList.remove('theme-light');
      body.classList.add('theme-dark');
      themeText.textContent = 'Chế độ Sáng';
      themeIcon.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
      `;
    }
  }

  // Toast Notification
  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease-out';
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }

  // Category Color Picker Render
  renderColorPicker() {
    const container = document.getElementById('colorPickerGrid');
    if (!container) return;
    container.innerHTML = '';
    PRESET_COLORS.forEach((color, idx) => {
      const opt = document.createElement('div');
      opt.className = `color-option ${idx === 0 ? 'selected' : ''}`;
      opt.style.backgroundColor = color;
      opt.dataset.color = color;
      opt.onclick = () => {
        container.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
        opt.classList.add('selected');
        document.getElementById('categoryColor').value = color;
      };
      container.appendChild(opt);
    });
  }

  populateCategorySelects() {
    const quickSelect = document.getElementById('quickAddCategory');
    const taskSelect = document.getElementById('taskCategory');

    const optionsHtml = this.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    if (quickSelect) quickSelect.innerHTML = optionsHtml;
    if (taskSelect) taskSelect.innerHTML = optionsHtml;
  }

  // Filtering & Sorting
  getFilteredTasks() {
    const todayStr = new Date().toISOString().split('T')[0];

    return this.tasks.filter(task => {
      // 1. Search filter
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase().trim();
        const category = this.categories.find(c => c.id === task.categoryId);
        const matchTitle = task.title.toLowerCase().includes(query);
        const matchDesc = (task.description || '').toLowerCase().includes(query);
        const matchCat = category && category.name.toLowerCase().includes(query);
        const matchTags = (task.tags || []).some(t => t.toLowerCase().includes(query));

        if (!matchTitle && !matchDesc && !matchCat && !matchTags) {
          return false;
        }
      }

      // 2. Active filter (View, Category, Tag)
      if (this.activeFilter.type === 'view') {
        if (this.activeFilter.value === 'today') {
          return task.dueDate === todayStr;
        } else if (this.activeFilter.value === 'pending') {
          return !task.completed;
        } else if (this.activeFilter.value === 'completed') {
          return task.completed;
        }
        return true; // 'all'
      } else if (this.activeFilter.type === 'category') {
        return task.categoryId === this.activeFilter.value;
      } else if (this.activeFilter.type === 'tag') {
        return (task.tags || []).includes(this.activeFilter.value);
      }

      return true;
    }).sort((a, b) => {
      // Priority weight
      const priorityWeight = { high: 3, medium: 2, low: 1 };

      switch (this.sortBy) {
        case 'createdAt_asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'dueDate_asc':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority_desc':
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        case 'title_asc':
          return a.title.localeCompare(b.title, 'vi');
        case 'createdAt_desc':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  }

  // Task Actions
  addTask(data) {
    const newTask = {
      id: 'task-' + Date.now(),
      title: data.title.trim(),
      description: data.description ? data.description.trim() : '',
      categoryId: data.categoryId || (this.categories[0] ? this.categories[0].id : 'cat-work'),
      priority: data.priority || 'medium',
      dueDate: data.dueDate || '',
      tags: data.tags || [],
      completed: false,
      createdAt: new Date().toISOString()
    };

    this.tasks.unshift(newTask);
    this.saveData();
    this.render();
    this.showToast('Đã thêm công việc mới thành công!', 'success');
  }

  updateTask(id, data) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      this.tasks[index] = {
        ...this.tasks[index],
        title: data.title.trim(),
        description: data.description ? data.description.trim() : '',
        categoryId: data.categoryId,
        priority: data.priority,
        dueDate: data.dueDate,
        tags: data.tags
      };
      this.saveData();
      this.render();
      this.showToast('Đã cập nhật công việc!', 'info');
    }
  }

  toggleTaskStatus(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      task.completedAt = task.completed ? new Date().toISOString() : null;
      this.playChime(task.completed);
      this.saveData();
      this.render();
      if (task.completed) {
        this.showToast('Tuyệt vời! Đã hoàn thành một công việc 🎉', 'success');
      }
    }
  }

  deleteTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;

    if (confirm(`Bạn có chắc chắn muốn xóa công việc "${task.title}"?`)) {
      this.tasks = this.tasks.filter(t => t.id !== id);
      this.saveData();
      this.render();
      this.showToast('Đã xóa công việc.', 'info');
    }
  }

  // Category Actions
  addCategory(name, color, icon) {
    const newCategory = {
      id: 'cat-' + Date.now(),
      name: name.trim(),
      color: color || '#6366f1',
      icon: icon || 'folder'
    };
    this.categories.push(newCategory);
    this.saveData();
    this.populateCategorySelects();
    this.render();
    this.showToast(`Đã thêm danh mục "${newCategory.name}"!`, 'success');
  }

  deleteCategory(catId) {
    const cat = this.categories.find(c => c.id === catId);
    if (!cat) return;

    if (this.categories.length <= 1) {
      alert('Bạn phải giữ lại ít nhất 1 danh mục!');
      return;
    }

    const taskCount = this.tasks.filter(t => t.categoryId === catId).length;
    let msg = `Bạn có chắc chắn muốn xóa danh mục "${cat.name}"?`;
    if (taskCount > 0) {
      msg += `\nLưu ý: Có ${taskCount} công việc thuộc danh mục này sẽ được chuyển sang danh mục mặc định.`;
    }

    if (confirm(msg)) {
      const remainingCat = this.categories.find(c => c.id !== catId);
      this.tasks.forEach(t => {
        if (t.categoryId === catId) {
          t.categoryId = remainingCat.id;
        }
      });

      this.categories = this.categories.filter(c => c.id !== catId);
      if (this.activeFilter.type === 'category' && this.activeFilter.value === catId) {
        this.activeFilter = { type: 'view', value: 'all' };
      }

      this.saveData();
      this.populateCategorySelects();
      this.render();
      this.showToast(`Đã xóa danh mục "${cat.name}".`, 'info');
    }
  }

  // Statistics Calculation
  calculateStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const pending = total - completed;

    const todayStr = new Date().toISOString().split('T')[0];
    const overdue = this.tasks.filter(t => !t.completed && t.dueDate && t.dueDate < todayStr).length;

    // Today stats
    const todayTasks = this.tasks.filter(t => t.dueDate === todayStr);
    const todayCompleted = todayTasks.filter(t => t.completed).length;
    const todayTotal = todayTasks.length;
    const todayPercent = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : (total > 0 ? Math.round((completed / total) * 100) : 0);

    return { total, completed, pending, overdue, todayTotal, todayCompleted, todayPercent };
  }

  // Render Functions
  render() {
    this.renderStats();
    this.renderNavCounts();
    this.renderCategoriesList();
    this.renderTagsCloud();
    this.renderActiveFilterBar();
    this.renderTaskList();
  }

  renderStats() {
    const stats = this.calculateStats();
    document.getElementById('statTotal').textContent = stats.total;
    document.getElementById('statPending').textContent = stats.pending;
    document.getElementById('statOverdue').textContent = stats.overdue;
    document.getElementById('statCompleted').textContent = stats.completed;

    // Sidebar Progress
    const sidebarPercent = document.getElementById('sidebarPercent');
    const sidebarProgressBar = document.getElementById('sidebarProgressBar');
    const sidebarProgressDetails = document.getElementById('sidebarProgressDetails');

    if (sidebarPercent && sidebarProgressBar && sidebarProgressDetails) {
      sidebarPercent.textContent = `${stats.todayPercent}%`;
      sidebarProgressBar.style.width = `${stats.todayPercent}%`;
      if (stats.todayTotal > 0) {
        sidebarProgressDetails.textContent = `${stats.todayCompleted}/${stats.todayTotal} công việc hôm nay`;
      } else {
        sidebarProgressDetails.textContent = `${stats.completed}/${stats.total} tổng công việc`;
      }
    }
  }

  renderNavCounts() {
    const todayStr = new Date().toISOString().split('T')[0];
    document.getElementById('countAll').textContent = this.tasks.length;
    document.getElementById('countToday').textContent = this.tasks.filter(t => t.dueDate === todayStr).length;
    document.getElementById('countPending').textContent = this.tasks.filter(t => !t.completed).length;
    document.getElementById('countCompleted').textContent = this.tasks.filter(t => t.completed).length;

    // Highlight active nav item
    document.querySelectorAll('.nav-item').forEach(btn => {
      const filter = btn.dataset.filter;
      if (this.activeFilter.type === 'view' && this.activeFilter.value === filter) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  renderCategoriesList() {
    const container = document.getElementById('categoriesList');
    if (!container) return;
    container.innerHTML = '';

    this.categories.forEach(cat => {
      const count = this.tasks.filter(t => t.categoryId === cat.id).length;
      const isActive = this.activeFilter.type === 'category' && this.activeFilter.value === cat.id;

      const item = document.createElement('div');
      item.className = `category-item ${isActive ? 'active' : ''}`;
      item.innerHTML = `
        <div class="category-left">
          <span class="category-color-dot" style="background-color: ${cat.color};"></span>
          <span class="category-name">${this.escapeHtml(cat.name)}</span>
        </div>
        <div class="category-actions">
          <span class="category-badge-count">${count}</span>
          <button class="category-delete-btn" title="Xóa danh mục" data-catid="${cat.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      `;

      item.onclick = (e) => {
        if (e.target.closest('.category-delete-btn')) {
          e.stopPropagation();
          this.deleteCategory(cat.id);
          return;
        }
        this.activeFilter = { type: 'category', value: cat.id };
        this.render();
      };

      container.appendChild(item);
    });
  }

  renderTagsCloud() {
    const container = document.getElementById('tagsCloud');
    if (!container) return;

    // Collect all unique tags and count
    const tagMap = {};
    this.tasks.forEach(t => {
      (t.tags || []).forEach(tag => {
        const clean = tag.trim();
        if (clean) tagMap[clean] = (tagMap[clean] || 0) + 1;
      });
    });

    const tags = Object.keys(tagMap).sort();
    if (tags.length === 0) {
      container.innerHTML = '<span style="font-size: 0.78rem; color: var(--text-muted); padding: 4px 8px;">Chưa có nhãn dán nào</span>';
      return;
    }

    container.innerHTML = '';
    tags.forEach(tag => {
      const isActive = this.activeFilter.type === 'tag' && this.activeFilter.value === tag;
      const chip = document.createElement('button');
      chip.className = `tag-chip ${isActive ? 'active' : ''}`;
      chip.innerHTML = `#${this.escapeHtml(tag)} <span style="font-size: 0.7rem; opacity: 0.8">(${tagMap[tag]})</span>`;
      chip.onclick = () => {
        if (this.activeFilter.type === 'tag' && this.activeFilter.value === tag) {
          this.activeFilter = { type: 'view', value: 'all' };
        } else {
          this.activeFilter = { type: 'tag', value: tag };
        }
        this.render();
      };
      container.appendChild(chip);
    });
  }

  renderActiveFilterBar() {
    const bar = document.getElementById('activeFiltersBar');
    const chipsList = document.getElementById('filterChipsList');
    const viewTitle = document.getElementById('currentViewTitle');
    const viewSubtitle = document.getElementById('currentViewSubtitle');

    let hasFilter = false;
    chipsList.innerHTML = '';

    if (this.activeFilter.type === 'category') {
      const cat = this.categories.find(c => c.id === this.activeFilter.value);
      if (cat) {
        hasFilter = true;
        viewTitle.textContent = `Danh mục: ${cat.name}`;
        viewSubtitle.textContent = `Các công việc được gán vào danh mục ${cat.name}`;
        chipsList.innerHTML += `<span class="active-filter-badge">Danh mục: ${this.escapeHtml(cat.name)}</span>`;
      }
    } else if (this.activeFilter.type === 'tag') {
      hasFilter = true;
      viewTitle.textContent = `Nhãn: #${this.activeFilter.value}`;
      viewSubtitle.textContent = `Các công việc có gắn nhãn #${this.activeFilter.value}`;
      chipsList.innerHTML += `<span class="active-filter-badge">Nhãn: #${this.escapeHtml(this.activeFilter.value)}</span>`;
    } else if (this.activeFilter.type === 'view') {
      if (this.activeFilter.value === 'today') {
        viewTitle.textContent = 'Công việc hôm nay';
        viewSubtitle.textContent = 'Tập trung hoàn thành các mục tiêu trong ngày';
      } else if (this.activeFilter.value === 'pending') {
        viewTitle.textContent = 'Công việc đang thực hiện';
        viewSubtitle.textContent = 'Các đầu việc chưa hoàn thành cần bạn giải quyết';
      } else if (this.activeFilter.value === 'completed') {
        viewTitle.textContent = 'Công việc đã hoàn thành';
        viewSubtitle.textContent = 'Xem lại những thành tựu bạn đã đạt được';
      } else {
        viewTitle.textContent = 'Tất cả công việc';
        viewSubtitle.textContent = 'Quản lý toàn bộ danh sách công việc của bạn';
      }
    }

    if (this.searchQuery.trim()) {
      hasFilter = true;
      chipsList.innerHTML += `<span class="active-filter-badge">Tìm kiếm: "${this.escapeHtml(this.searchQuery)}"</span>`;
    }

    bar.style.display = hasFilter ? 'flex' : 'none';
  }

  renderTaskList() {
    const container = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    const filteredTasks = this.getFilteredTasks();

    if (filteredTasks.length === 0) {
      container.innerHTML = '';
      emptyState.style.display = 'block';

      const emptyTitle = document.getElementById('emptyTitle');
      const emptyDesc = document.getElementById('emptyDesc');

      if (this.searchQuery.trim()) {
        emptyTitle.textContent = 'Không tìm thấy kết quả';
        emptyDesc.textContent = `Không có công việc nào khớp với từ khóa "${this.searchQuery}". Hãy thử tìm kiếm từ khác!`;
      } else if (this.activeFilter.type === 'view' && this.activeFilter.value === 'completed') {
        emptyTitle.textContent = 'Chưa có việc nào hoàn thành';
        emptyDesc.textContent = 'Hãy hoàn thành một vài công việc để tạo động lực!';
      } else {
        emptyTitle.textContent = 'Chưa có công việc nào';
        emptyDesc.textContent = 'Hãy tạo công việc mới để bắt đầu một ngày làm việc hiệu quả!';
      }
      return;
    }

    emptyState.style.display = 'none';
    const todayStr = new Date().toISOString().split('T')[0];

    container.innerHTML = filteredTasks.map(task => {
      const category = this.categories.find(c => c.id === task.categoryId) || { name: 'Chung', color: '#64748b' };
      
      // Due date badge formatting
      let dueDateBadge = '';
      if (task.dueDate) {
        let isOverdue = !task.completed && task.dueDate < todayStr;
        let isToday = task.dueDate === todayStr;
        let dateClass = isOverdue ? 'overdue' : (isToday ? 'today' : '');
        let label = this.formatDate(task.dueDate);
        if (isOverdue) label = `⚠️ Quá hạn (${label})`;
        else if (isToday) label = `⚡ Hôm nay (${label})`;

        dueDateBadge = `
          <span class="badge badge-due-date ${dateClass}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            ${label}
          </span>
        `;
      }

      // Priority badge
      const priorityLabel = { high: 'Cao', medium: 'Trung bình', low: 'Thấp' }[task.priority] || 'Bình thường';
      const priorityBadge = `
        <span class="badge badge-priority ${task.priority}">
          ${priorityLabel}
        </span>
      `;

      // Tags badges
      const tagsBadges = (task.tags || []).map(t => `
        <span class="badge badge-tag" data-tag="${this.escapeHtml(t)}">#${this.escapeHtml(t)}</span>
      `).join('');

      return `
        <div class="task-item priority-${task.priority} ${task.completed ? 'completed' : ''}" data-id="${task.id}">
          <div class="task-checkbox-wrapper">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}" title="Đánh dấu hoàn thành">
          </div>

          <div class="task-main">
            <div class="task-header-row">
              <h3 class="task-title">${this.escapeHtml(task.title)}</h3>
              <div class="task-actions">
                <button class="btn-icon edit-task-btn" title="Chỉnh sửa công việc" data-id="${task.id}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="btn-icon delete delete-task-btn" title="Xóa công việc" data-id="${task.id}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>

            ${task.description ? `<p class="task-description">${this.escapeHtml(task.description)}</p>` : ''}

            <div class="task-metadata">
              <span class="badge badge-category" data-catid="${category.id}">
                <span class="badge-category-dot" style="background-color: ${category.color}"></span>
                ${this.escapeHtml(category.name)}
              </span>
              ${priorityBadge}
              ${dueDateBadge}
              ${tagsBadges}
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Bind event listeners on task list items
    container.querySelectorAll('.task-checkbox').forEach(chk => {
      chk.onchange = () => this.toggleTaskStatus(chk.dataset.id);
    });

    container.querySelectorAll('.edit-task-btn').forEach(btn => {
      btn.onclick = () => this.openEditTaskModal(btn.dataset.id);
    });

    container.querySelectorAll('.delete-task-btn').forEach(btn => {
      btn.onclick = () => this.deleteTask(btn.dataset.id);
    });

    container.querySelectorAll('.badge-tag').forEach(tagEl => {
      tagEl.onclick = (e) => {
        e.stopPropagation();
        this.activeFilter = { type: 'tag', value: tagEl.dataset.tag };
        this.render();
      };
    });

    container.querySelectorAll('.badge-category').forEach(catEl => {
      catEl.onclick = (e) => {
        e.stopPropagation();
        this.activeFilter = { type: 'category', value: catEl.dataset.catid };
        this.render();
      };
    });
  }

  // Modals & UI Controls
  openAddTaskModal() {
    document.getElementById('taskModalTitle').textContent = 'Thêm công việc mới';
    document.getElementById('taskEditId').value = '';
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskCategory').value = this.categories[0] ? this.categories[0].id : '';
    document.getElementById('taskPriority').value = 'medium';
    document.getElementById('taskDueDate').value = '';
    document.getElementById('taskTagsInput').value = '';

    document.getElementById('taskModal').classList.add('active');
    setTimeout(() => document.getElementById('taskTitle').focus(), 100);
  }

  openEditTaskModal(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;

    document.getElementById('taskModalTitle').textContent = 'Chỉnh sửa công việc';
    document.getElementById('taskEditId').value = task.id;
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description || '';
    document.getElementById('taskCategory').value = task.categoryId;
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskDueDate').value = task.dueDate || '';
    document.getElementById('taskTagsInput').value = (task.tags || []).join(', ');

    document.getElementById('taskModal').classList.add('active');
    setTimeout(() => document.getElementById('taskTitle').focus(), 100);
  }

  closeTaskModal() {
    document.getElementById('taskModal').classList.remove('active');
  }

  openCategoryModal() {
    document.getElementById('categoryName').value = '';
    document.getElementById('categoryColor').value = PRESET_COLORS[0];
    this.renderColorPicker();
    document.getElementById('categoryModal').classList.add('active');
    setTimeout(() => document.getElementById('categoryName').focus(), 100);
  }

  closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('active');
  }

  openBackupModal() {
    document.getElementById('backupModal').classList.add('active');
  }

  closeBackupModal() {
    document.getElementById('backupModal').classList.remove('active');
  }

  // Export / Import
  exportData() {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tasks: this.tasks,
      categories: this.categories
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `TaskMaster_Backup_${dateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);

    this.showToast('Đã tải xuống file sao lưu!', 'success');
  }

  importData(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.tasks || !data.categories) {
          throw new Error('Định dạng tệp không hợp lệ!');
        }

        if (confirm(`Bạn có muốn thay thế dữ liệu hiện tại bằng bản sao lưu có ${data.tasks.length} công việc và ${data.categories.length} danh mục?`)) {
          this.tasks = data.tasks;
          this.categories = data.categories;
          this.saveData();
          this.populateCategorySelects();
          this.render();
          this.closeBackupModal();
          this.showToast('Khôi phục dữ liệu thành công!', 'success');
        }
      } catch (err) {
        alert('Lỗi: File JSON không đúng định dạng của TaskMaster!');
      }
    };
    reader.readAsText(file);
  }

  resetSampleData() {
    if (confirm('Khôi phục dữ liệu mẫu ban đầu? Các công việc hiện tại sẽ được thay bằng dữ liệu mẫu.')) {
      this.categories = DEFAULT_CATEGORIES;
      this.tasks = SAMPLE_TASKS;
      this.saveData();
      this.populateCategorySelects();
      this.render();
      this.closeBackupModal();
      this.showToast('Đã khôi phục dữ liệu mẫu!', 'success');
    }
  }

  // Events Binding
  bindEvents() {
    // Nav filters
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.onclick = () => {
        this.activeFilter = { type: 'view', value: btn.dataset.filter };
        this.render();
      };
    });

    // Theme toggle
    document.getElementById('btnThemeToggle').onclick = () => this.toggleTheme();

    // Modals open/close
    document.getElementById('btnOpenAddTaskModal').onclick = () => this.openAddTaskModal();
    document.getElementById('btnEmptyStateAdd').onclick = () => this.openAddTaskModal();
    document.getElementById('btnCloseTaskModal').onclick = () => this.closeTaskModal();
    document.getElementById('btnCancelTaskModal').onclick = () => this.closeTaskModal();

    document.getElementById('btnOpenAddCategory').onclick = () => this.openCategoryModal();
    document.getElementById('btnCloseCategoryModal').onclick = () => this.closeCategoryModal();
    document.getElementById('btnCancelCategoryModal').onclick = () => this.closeCategoryModal();

    document.getElementById('btnOpenBackupModal').onclick = () => this.openBackupModal();
    document.getElementById('btnCloseBackupModal').onclick = () => this.closeBackupModal();

    // Clear filters button
    document.getElementById('btnClearAllFilters').onclick = () => {
      this.activeFilter = { type: 'view', value: 'all' };
      this.searchQuery = '';
      document.getElementById('searchInput').value = '';
      document.getElementById('btnClearSearch').classList.remove('visible');
      this.render();
    };

    // Task Form submit
    document.getElementById('taskForm').onsubmit = (e) => {
      e.preventDefault();
      const editId = document.getElementById('taskEditId').value;
      const title = document.getElementById('taskTitle').value;
      const description = document.getElementById('taskDescription').value;
      const categoryId = document.getElementById('taskCategory').value;
      const priority = document.getElementById('taskPriority').value;
      const dueDate = document.getElementById('taskDueDate').value;
      const rawTags = document.getElementById('taskTagsInput').value;
      const tags = rawTags.split(',').map(t => t.trim()).filter(Boolean);

      if (editId) {
        this.updateTask(editId, { title, description, categoryId, priority, dueDate, tags });
      } else {
        this.addTask({ title, description, categoryId, priority, dueDate, tags });
      }

      this.closeTaskModal();
    };

    // Quick Add Form
    document.getElementById('quickAddForm').onsubmit = (e) => {
      e.preventDefault();
      const input = document.getElementById('quickAddInput');
      const text = input.value.trim();
      if (!text) return;

      // Parse tags if written as #tag or @priority
      let title = text;
      let tags = [];
      const tagMatches = text.match(/#([\w\u00C0-\u1EF9\-]+)/g);
      if (tagMatches) {
        tags = tagMatches.map(t => t.slice(1));
        title = title.replace(/#([\w\u00C0-\u1EF9\-]+)/g, '').trim();
      }

      const categoryId = document.getElementById('quickAddCategory').value;
      const priority = document.getElementById('quickAddPriority').value;
      const dueDate = document.getElementById('quickAddDueDate').value;

      this.addTask({
        title,
        description: '',
        categoryId,
        priority,
        dueDate,
        tags
      });

      input.value = '';
      document.getElementById('quickAddDueDate').value = '';
    };

    // Category Form submit
    document.getElementById('categoryForm').onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById('categoryName').value;
      const color = document.getElementById('categoryColor').value;
      const icon = document.getElementById('categoryIcon').value;
      this.addCategory(name, color, icon);
      this.closeCategoryModal();
    };

    // Search Box
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('btnClearSearch');

    searchInput.oninput = (e) => {
      this.searchQuery = e.target.value;
      if (this.searchQuery.trim()) {
        clearSearchBtn.classList.add('visible');
      } else {
        clearSearchBtn.classList.remove('visible');
      }
      this.render();
    };

    clearSearchBtn.onclick = () => {
      searchInput.value = '';
      this.searchQuery = '';
      clearSearchBtn.classList.remove('visible');
      this.render();
      searchInput.focus();
    };

    // Sort select
    const sortSelect = document.getElementById('sortSelect');
    sortSelect.value = this.sortBy;
    sortSelect.onchange = (e) => {
      this.sortBy = e.target.value;
      this.saveData();
      this.renderTaskList();
    };

    // Mobile sidebar toggle
    const mobileBtn = document.getElementById('btnToggleSidebar');
    const sidebar = document.getElementById('sidebar');
    if (mobileBtn && sidebar) {
      mobileBtn.onclick = () => sidebar.classList.toggle('open');
      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !mobileBtn.contains(e.target)) {
          sidebar.classList.remove('open');
        }
      });
    }

    // Backup & Restore buttons
    document.getElementById('btnExportData').onclick = () => this.exportData();
    document.getElementById('btnTriggerImport').onclick = () => document.getElementById('importFileInput').click();
    document.getElementById('importFileInput').onchange = (e) => {
      if (e.target.files && e.target.files[0]) {
        this.importData(e.target.files[0]);
        e.target.value = '';
      }
    };
    document.getElementById('btnResetSampleData').onclick = () => this.resetSampleData();

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl+N or Alt+N to open task modal
      if ((e.ctrlKey || e.altKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        this.openAddTaskModal();
      }
      // Esc to close any open modal
      if (e.key === 'Escape') {
        this.closeTaskModal();
        this.closeCategoryModal();
        this.closeBackupModal();
      }
      // '/' to focus search if not in an input
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        document.getElementById('searchInput').focus();
      }
    });
  }

  // Utilities
  formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new TaskManager();
});
