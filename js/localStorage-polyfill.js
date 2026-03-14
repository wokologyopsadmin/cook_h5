/**
 * localStorage Polyfill for Firefox file:// protocol
 * 
 * Firefox 在 file:// 协议下会抛出 NS_ERROR_FILE_NOT_FOUND 错误
 * 这个脚本在页面加载最早期检测并替换 localStorage
 */

(function() {
  'use strict';

  // 内存存储
  const memoryStorage = {
    _data: {},
    getItem: function(key) {
      return this._data[key] || null;
    },
    setItem: function(key, value) {
      this._data[key] = String(value);
    },
    removeItem: function(key) {
      delete this._data[key];
    },
    clear: function() {
      this._data = {};
    },
    key: function(index) {
      const keys = Object.keys(this._data);
      return keys[index] || null;
    },
    get length() {
      return Object.keys(this._data).length;
    }
  };

  // 检测 localStorage 是否可用
  function isLocalStorageAvailable() {
    try {
      const test = '__ls_test_' + Date.now();
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  // 如果 localStorage 不可用，替换为内存存储
  if (!isLocalStorageAvailable()) {
    console.warn('[WOKOLOGY] localStorage not available (Firefox file:// mode), using memory storage');
    
    // 尝试替换 localStorage（在某些浏览器中可能无法替换）
    try {
      Object.defineProperty(window, 'localStorage', {
        value: memoryStorage,
        writable: false,
        configurable: true
      });
    } catch (e) {
      // 如果无法替换，创建一个全局替代
      window.localStorage = memoryStorage;
    }
  }
})();
