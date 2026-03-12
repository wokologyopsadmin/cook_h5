/**
 * Unified Storage Layer - 解决 Firefox file:// 协议下 localStorage 不可用问题
 * 自动检测并选择可用的存储方式：localStorage > 内存存储
 */

const Storage = {
  // 内存存储 fallback
  _memory: {},
  _available: null,

  // 检测 localStorage 是否可用
  isAvailable() {
    if (this._available !== null) return this._available;
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      this._available = true;
    } catch (e) {
      this._available = false;
      console.warn('localStorage not available, using memory storage (Firefox file:// mode)');
    }
    return this._available;
  },

  // 获取数据
  get(key) {
    if (this.isAvailable()) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        return this._memory[key] || null;
      }
    }
    return this._memory[key] || null;
  },

  // 设置数据
  set(key, value) {
    if (this.isAvailable()) {
      try {
        localStorage.setItem(key, value);
        return;
      } catch (e) {
        // fallback to memory
      }
    }
    this._memory[key] = value;
  },

  // 删除数据
  remove(key) {
    if (this.isAvailable()) {
      try {
        localStorage.removeItem(key);
        return;
      } catch (e) {
        // fallback to memory
      }
    }
    delete this._memory[key];
  },

  // 获取 JSON 对象
  getJSON(key) {
    const val = this.get(key);
    if (!val) return null;
    try {
      return JSON.parse(val);
    } catch (e) {
      return null;
    }
  },

  // 设置 JSON 对象
  setJSON(key, obj) {
    this.set(key, JSON.stringify(obj));
  },

  // 清空所有数据
  clear() {
    if (this.isAvailable()) {
      try {
        localStorage.clear();
        return;
      } catch (e) {
        // fallback to memory
      }
    }
    this._memory = {};
  }
};

// 导出（兼容非模块环境）
if (typeof window !== 'undefined') {
  window.Storage = Storage;
}
