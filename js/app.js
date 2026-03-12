// ── ChefHub Shared App Logic ────────────────────────

// ── Demo Users ────────────────────────────────────────
const DEMO_USERS = [
  {
    id: 1,
    account: 'admin',
    password: 'admin123',
    name: '管理员',
    nameEn: 'Admin',
    role: 'admin',
    roleLabel: '系统管理员',
    roleLabelEn: 'System Admin',
    storeIds: [], // admin sees all stores
    email: 'admin@chefhub.com',
    emailVerified: true,
    status: 'active' // active, inactive
  },
  {
    id: 2,
    account: 'newuser',
    password: '123456',
    name: '新用户',
    nameEn: 'New User',
    role: 'new_user',
    roleLabel: '新用户',
    roleLabelEn: 'New User',
    storeIds: [], // no stores yet
    email: '',
    emailVerified: false,
    status: 'active'
  },
  {
    id: 3,
    account: 'manager1',
    password: '123456',
    name: '张店长',
    nameEn: 'Manager Zhang',
    role: 'store_manager',
    roleLabel: '店长',
    roleLabelEn: 'Store Manager',
    storeIds: [1], // manages 市中心店
    email: 'zhang@chefhub.com',
    emailVerified: true,
    status: 'active'
  },
  {
    id: 4,
    account: 'manager2',
    password: '123456',
    name: '李店长',
    nameEn: 'Manager Li',
    role: 'store_manager',
    roleLabel: '店长',
    roleLabelEn: 'Store Manager',
    storeIds: [2], // manages 西区门店
    email: 'li@chefhub.com',
    emailVerified: true,
    status: 'active'
  },
  {
    id: 5,
    account: 'manager3',
    password: '123456',
    name: '王店长',
    nameEn: 'Manager Wang',
    role: 'store_manager',
    roleLabel: '店长',
    roleLabelEn: 'Store Manager',
    storeIds: [], // 待分配门店
    email: '',
    emailVerified: false,
    status: 'inactive' // 示例：停用账号
  }
];

// 存储管理人员账号（localStorage 持久化）
function getManagers() {
  try {
    return JSON.parse(localStorage.getItem('chefhub_managers') || '[]');
  } catch (e) {
    return [];
  }
}

function saveManagers(list) {
  localStorage.setItem('chefhub_managers', JSON.stringify(list));
}

// 获取所有用户（包括动态创建的管理人员）
function getAllUsers() {
  const managers = getManagers();
  return [...DEMO_USERS, ...managers];
}

// 根据账号获取用户
function getUserByAccount(account) {
  return getAllUsers().find(u => u.account === account);
}

// 创建管理人员账号
function createManager(data) {
  const managers = getManagers();
  const newId = Math.max(...getAllUsers().map(u => u.id), 0) + 1;
  const newManager = {
    id: newId,
    account: data.account,
    password: data.password,
    name: data.name,
    nameEn: data.nameEn || data.name,
    role: 'store_manager',
    roleLabel: '店长',
    roleLabelEn: 'Store Manager',
    storeIds: data.storeIds || [],
    email: data.email || '',
    emailVerified: false,
    status: 'active',
    createdAt: new Date().toISOString()
  };
  managers.push(newManager);
  saveManagers(managers);
  return newManager;
}

// 更新管理人员账号
function updateManager(id, data) {
  const managers = getManagers();
  const idx = managers.findIndex(m => m.id === id);
  if (idx !== -1) {
    managers[idx] = { ...managers[idx], ...data };
    saveManagers(managers);
    return managers[idx];
  }
  return null;
}

// 删除管理人员账号
function deleteManager(id) {
  const managers = getManagers();
  const filtered = managers.filter(m => m.id !== id);
  saveManagers(filtered);
  return true;
}

// 重置密码
function resetManagerPassword(id, newPassword) {
  return updateManager(id, { password: newPassword });
}

// 停用/启用账号
function toggleManagerStatus(id) {
  const managers = getManagers();
  const idx = managers.findIndex(m => m.id === id);
  if (idx !== -1) {
    managers[idx].status = managers[idx].status === 'active' ? 'inactive' : 'active';
    saveManagers(managers);
    return managers[idx];
  }
  return null;
}

// 验证邮箱
function verifyEmail(account) {
  const managers = getManagers();
  const idx = managers.findIndex(m => m.account === account);
  if (idx !== -1) {
    managers[idx].emailVerified = true;
    saveManagers(managers);
    return true;
  }
  // 检查 DEMO_USERS
  const user = DEMO_USERS.find(u => u.account === account);
  if (user) {
    user.emailVerified = true;
  }
  return false;
}

// ── Auth ────────────────────────────────────────────
function requireAuth() {
  if (!localStorage.getItem('chefhub_logged_in')) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

function getUser() {
  try { return JSON.parse(localStorage.getItem('chefhub_user') || '{}'); }
  catch (e) { return {}; }
}

function getCurrentDemoUser() {
  const user = getUser();
  return DEMO_USERS.find(u => u.account === user.account) || DEMO_USERS[0];
}

function switchDemoUser(account) {
  const demoUser = DEMO_USERS.find(u => u.account === account);
  if (demoUser) {
    const userData = {
      id: demoUser.id,
      name: getLang() === 'en' ? demoUser.nameEn : demoUser.name,
      account: demoUser.account,
      role: demoUser.role,
      roleLabel: getLang() === 'en' ? demoUser.roleLabelEn : demoUser.roleLabel
    };
    localStorage.setItem('chefhub_user', JSON.stringify(userData));
    window.location.reload();
  }
}

function doLogout() {
  if (confirm(t('profile.logout_confirm'))) {
    localStorage.removeItem('chefhub_logged_in');
    window.location.href = 'index.html';
  }
}

// ── Toast ────────────────────────────────────────────
let _toastTimer;
function showToast(msg) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = '1';
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { el.style.opacity = '0'; }, 2600);
}

// ── Bottom Nav active state ──────────────────────────
function initNavBar(activeId) {
  document.querySelectorAll('a.nav-btn').forEach(a => a.classList.remove('active'));
  const el = document.getElementById(activeId);
  if (el) el.classList.add('active');
}

// ── Greeting ─────────────────────────────────────────
function getGreeting(name) {
  const h = new Date().getHours();
  const lang = getLang();
  let time;
  if (lang === 'zh') {
    time = h < 12 ? '早上好' : h < 18 ? '下午好' : '晚上好';
    return time + (name ? '，' + name : '') + ' 👋';
  } else {
    time = h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening';
    return time + (name ? ', ' + name : '') + ' 👋';
  }
}

// ── Demo Data ─────────────────────────────────────────
const DEMO_STORES = [
  {
    id: 1,
    name: '市中心店', nameEn: 'Market Central',
    address: '布达佩斯市中心广场1号', addressEn: '1 Central Plaza, Budapest',
    machineIds: [1, 2], todayDishes: 24
  },
  {
    id: 2,
    name: '西区门店', nameEn: 'West Budapest Branch',
    address: '布达佩斯西区大街88号', addressEn: '88 West Ave, Budapest',
    machineIds: [3], todayDishes: 17
  }
];

const DEMO_MACHINES = [
  { id: 1, serial: 'CRB-001', status: 'cooking', storeId: 1, temp: 185, totalDishes: 1247, lastActiveZh: '刚刚', lastActiveEn: 'Just now' },
  { id: 2, serial: 'CRB-002', status: 'idle',    storeId: 1, temp: 45,  totalDishes: 893,  lastActiveZh: '3分钟前', lastActiveEn: '3 min ago' },
  { id: 3, serial: 'CRB-003', status: 'online',  storeId: 2, temp: 120, totalDishes: 562,  lastActiveZh: '10分钟前', lastActiveEn: '10 min ago' },
  { id: 4, serial: 'CRB-004', status: 'offline', storeId: null, temp: 0, totalDishes: 78,  lastActiveZh: '2天前', lastActiveEn: '2 days ago' }
];

const DEMO_RECIPES = [
  // Beef
  {
    id: 1, cat: 'beef',
    nameZh: '匈牙利牛肉炖', nameEn: 'Hungarian Beef Goulash',
    time: 45, diff: 'medium', free: true,
    img: 'img/recipe-1-beef.jpg',
    ingredients: ['牛肉 / Beef 500g', '土豆 / Potato 300g', '番茄 / Tomato 200g', '洋葱 / Onion 150g', '甜椒粉 / Paprika 2 tsp']
  },
  {
    id: 2, cat: 'beef',
    nameZh: '黑椒牛柳', nameEn: 'Black Pepper Beef Tenderloin',
    time: 20, diff: 'easy', free: true,
    img: 'img/recipe-2-beef.jpg',
    ingredients: ['牛里脊 / Beef tenderloin 300g', '黑胡椒 / Black pepper 1 tbsp', '黄油 / Butter 30g', '大蒜 / Garlic 3 cloves']
  },
  {
    id: 3, cat: 'beef',
    nameZh: '红酒炖牛腩', nameEn: 'Red Wine Braised Beef',
    time: 90, diff: 'hard', free: false,
    img: 'img/recipe-3-beef.jpg',
    ingredients: ['牛腩 / Beef brisket 600g', '红酒 / Red wine 200ml', '胡萝卜 / Carrot 100g', '芹菜 / Celery 50g']
  },
  // Lamb
  {
    id: 4, cat: 'lamb',
    nameZh: '香草烤羊排', nameEn: 'Herb-Crusted Lamb Chops',
    time: 30, diff: 'medium', free: true,
    img: 'img/recipe-4-lamb.jpg',
    ingredients: ['羊排 / Lamb chops 500g', '迷迭香 / Rosemary 3 sprigs', '大蒜 / Garlic 4 cloves', '橄榄油 / Olive oil 3 tbsp']
  },
  {
    id: 5, cat: 'lamb',
    nameZh: '慢炖羊肩肉', nameEn: 'Slow-Cooked Lamb Shoulder',
    time: 120, diff: 'hard', free: false,
    img: 'img/recipe-5-lamb.jpg',
    ingredients: ['羊肩肉 / Lamb shoulder 800g', '洋葱 / Onion 2 pcs', '香料 / Spice mix 2 tbsp', '高汤 / Stock 300ml']
  },
  // Pork
  {
    id: 6, cat: 'pork',
    nameZh: '焦糖猪肋排', nameEn: 'Caramelized Pork Ribs',
    time: 60, diff: 'medium', free: true,
    img: 'img/recipe-6-pork.jpg',
    ingredients: ['猪肋排 / Pork ribs 700g', '蜂蜜 / Honey 3 tbsp', '酱油 / Soy sauce 2 tbsp', '大蒜 / Garlic 3 cloves']
  },
  {
    id: 7, cat: 'pork',
    nameZh: '匈牙利猪肉炖', nameEn: 'Hungarian Pork Stew',
    time: 50, diff: 'easy', free: true,
    img: 'img/recipe-7-pork.jpg',
    ingredients: ['猪肉 / Pork 500g', '甜椒粉 / Paprika 3 tsp', '洋葱 / Onion 2 pcs', '酸奶油 / Sour cream 100ml']
  },
  // Chicken
  {
    id: 8, cat: 'chicken',
    nameZh: '香草烤全鸡', nameEn: 'Herb Roasted Whole Chicken',
    time: 75, diff: 'medium', free: true,
    img: 'img/recipe-8-chicken.jpg',
    ingredients: ['整鸡 / Whole chicken 1.5kg', '柠檬 / Lemon 1 pc', '黄油 / Butter 50g', '混合香草 / Herb mix 3 tbsp']
  },
  {
    id: 9, cat: 'chicken',
    nameZh: '红椒鸡肉炖', nameEn: 'Chicken Paprikash',
    time: 35, diff: 'easy', free: true,
    img: 'img/recipe-9-chicken.jpg',
    ingredients: ['鸡腿 / Chicken thighs 600g', '红椒粉 / Sweet paprika 3 tsp', '洋葱 / Onion 1 pc', '酸奶油 / Sour cream 150ml']
  },
  // Seafood
  {
    id: 10, cat: 'seafood',
    nameZh: '黄油蒜香虾', nameEn: 'Garlic Butter Shrimp',
    time: 15, diff: 'easy', free: true,
    img: 'img/recipe-10-seafood.jpg',
    ingredients: ['大虾 / Shrimp 500g', '黄油 / Butter 40g', '大蒜 / Garlic 5 cloves', '柠檬 / Lemon 1 pc']
  },
  {
    id: 11, cat: 'seafood',
    nameZh: '煎三文鱼', nameEn: 'Pan-Seared Salmon',
    time: 20, diff: 'easy', free: false,
    img: 'img/recipe-11-seafood.jpg',
    ingredients: ['三文鱼 / Salmon fillet 400g', '柠檬 / Lemon 1 pc', '新鲜香草 / Fresh herbs 2 tbsp', '橄榄油 / Olive oil 2 tbsp']
  },
  {
    id: 12, cat: 'seafood',
    nameZh: '海鲜意面', nameEn: 'Seafood Pasta',
    time: 25, diff: 'medium', free: false,
    img: 'img/recipe-12-seafood.jpg',
    ingredients: ['意面 / Pasta 200g', '虾 / Shrimp 200g', '扇贝 / Scallops 100g', '番茄酱 / Tomato sauce 200ml']
  },
  // Vegetarian
  {
    id: 13, cat: 'veg',
    nameZh: '烤时令蔬菜', nameEn: 'Roasted Seasonal Vegetables',
    time: 30, diff: 'easy', free: true,
    img: 'img/recipe-13-veg.jpg',
    ingredients: ['彩椒 / Bell peppers 2 pcs', '西葫芦 / Zucchini 1 pc', '茄子 / Eggplant 1 pc', '橄榄油 / Olive oil 3 tbsp']
  },
  {
    id: 14, cat: 'veg',
    nameZh: '蘑菇素炒', nameEn: 'Sautéed Mixed Mushrooms',
    time: 15, diff: 'easy', free: true,
    img: 'img/recipe-14-veg.jpg',
    ingredients: ['混合蘑菇 / Mixed mushrooms 400g', '大蒜 / Garlic 3 cloves', '黄油 / Butter 30g', '百里香 / Thyme 2 sprigs']
  },
  // Hungarian Traditional
  {
    id: 15, cat: 'seafood',
    nameZh: '匈牙利渔夫汤', nameEn: 'Hungarian Fisherman\'s Soup (Halászlé)',
    time: 40, diff: 'medium', free: true,
    img: 'img/recipe-15-seafood.jpg',
    ingredients: ['鲤鱼 / Carp 600g', '红椒粉 / Paprika 4 tsp', '洋葱 / Onion 3 pcs', '番茄 / Tomato 200g', '大蒜 / Garlic 2 cloves']
  },
  {
    id: 16, cat: 'veg',
    nameZh: '匈牙利白菜卷', nameEn: 'Hungarian Stuffed Cabbage (Töltött Káposzta)',
    time: 60, diff: 'medium', free: true,
    img: 'img/recipe-16-veg.jpg',
    ingredients: ['白菜叶 / Cabbage leaves 12 pcs', '猪肉馅 / Ground pork 400g', '米饭 / Rice 150g', '红椒粉 / Paprika 2 tsp', '酸奶油 / Sour cream 100ml']
  },
  {
    id: 17, cat: 'veg',
    nameZh: '匈牙利蔬菜浓汤', nameEn: 'Hungarian Vegetable Stew (Főzelék)',
    time: 25, diff: 'easy', free: true,
    img: 'img/recipe-17-veg.jpg',
    ingredients: ['豌豆 / Peas 300g', '土豆 / Potato 200g', '胡萝卜 / Carrot 100g', '面粉 / Flour 2 tbsp', '酸奶油 / Sour cream 50ml']
  },
  {
    id: 18, cat: 'pork',
    nameZh: '匈牙利炖豆汤', nameEn: 'Hungarian Bean Goulash (Bableves)',
    time: 50, diff: 'medium', free: true,
    img: 'img/recipe-18-pork.jpg',
    ingredients: ['白豆 / White beans 300g', '烟熏猪肘 / Smoked pork knuckle 400g', '红椒粉 / Paprika 2 tsp', '胡萝卜 / Carrot 1 pc', '月桂叶 / Bay leaf 2 pcs']
  },
  {
    id: 19, cat: 'chicken',
    nameZh: '匈牙利炖鸡配面疙瘩', nameEn: 'Chicken Paprikash with Nokedli',
    time: 45, diff: 'medium', free: true,
    img: 'img/recipe-19-chicken.jpg',
    ingredients: ['鸡腿 / Chicken thighs 700g', '红椒粉 / Sweet paprika 4 tsp', '酸奶油 / Sour cream 200ml', '面粉 / Flour 200g', '鸡蛋 / Egg 2 pcs']
  },
  {
    id: 20, cat: 'beef',
    nameZh: '匈牙利炖牛肉汤', nameEn: 'Hungarian Beef Soup (Húsleves)',
    time: 90, diff: 'medium', free: true,
    img: 'img/recipe-20-beef.jpg',
    ingredients: ['牛肉 / Beef 500g', '胡萝卜 / Carrot 2 pcs', '欧芹根 / Parsley root 1 pc', '洋葱 / Onion 1 pc', '细面条 / Fine noodles 100g']
  },
  {
    id: 21, cat: 'lamb',
    nameZh: '匈牙利烤羊腿', nameEn: 'Hungarian Roasted Lamb Leg',
    time: 120, diff: 'hard', free: false,
    img: 'img/recipe-21-lamb.jpg',
    ingredients: ['羊腿 / Lamb leg 1.5kg', '大蒜 / Garlic 6 cloves', '迷迭香 / Rosemary 4 sprigs', '红椒粉 / Paprika 1 tbsp', '橄榄油 / Olive oil 4 tbsp']
  },
  {
    id: 22, cat: 'veg',
    nameZh: '樱桃冷汤', nameEn: 'Cold Cherry Soup (Meggyleves)',
    time: 20, diff: 'easy', free: true,
    img: 'img/recipe-22-veg.jpg',
    ingredients: ['酸樱桃 / Sour cherries 500g', '红酒 / Red wine 100ml', '糖 / Sugar 3 tbsp', '酸奶油 / Sour cream 100ml', '肉桂 / Cinnamon 1 stick']
  },
  {
    id: 23, cat: 'pork',
    nameZh: '匈牙利烟熏香肠', nameEn: 'Hungarian Smoked Sausage (Kolbász)',
    time: 30, diff: 'easy', free: true,
    img: 'img/recipe-23-pork.jpg',
    ingredients: ['猪肉馅 / Ground pork 1kg', '红椒粉 / Paprika 3 tbsp', '大蒜 / Garlic 4 cloves', '盐 / Salt 2 tsp', '肠衣 / Sausage casing 2m']
  },
  {
    id: 24, cat: 'chicken',
    nameZh: '匈牙利鹅肝煎', nameEn: 'Hungarian Goose Liver (Libamáj)',
    time: 15, diff: 'hard', free: false,
    img: 'img/recipe-24-chicken.jpg',
    ingredients: ['鹅肝 / Goose liver 300g', '洋葱 / Onion 1 pc', '苹果 / Apple 1 pc', '红酒 / Red wine 50ml', '黄油 / Butter 20g']
  }
];

// ── Helpers ───────────────────────────────────────────
function getStoreName(store) {
  return getLang() === 'en' ? store.nameEn : store.name;
}
function getStoreAddress(store) {
  return getLang() === 'en' ? store.addressEn : store.address;
}
function getRecipeName(r) {
  return getLang() === 'en' ? r.nameEn : r.nameZh;
}
function getMachineLastActive(m) {
  return getLang() === 'en' ? m.lastActiveEn : m.lastActiveZh;
}

function getMachineStatusLabel(status) {
  const map = {
    zh: { cooking: '烹饪中', idle: '空闲', online: '在线', offline: '离线', error: '故障' },
    en: { cooking: 'Cooking', idle: 'Idle', online: 'Online', offline: 'Offline', error: 'Error' }
  };
  return (map[getLang()] || map.zh)[status] || status;
}
function getMachineStatusClass(status) {
  const map = { cooking: 's-cooking', idle: 's-idle', online: 's-online', offline: 's-offline', error: 's-error' };
  return map[status] || 's-offline';
}
function getStoreById(id) {
  return DEMO_STORES.find(s => s.id === id) || null;
}
function getDiffLabel(diff) {
  const map = { easy: 'recipes.diff_easy', medium: 'recipes.diff_medium', hard: 'recipes.diff_hard' };
  return t(map[diff] || 'recipes.diff_easy');
}

// ── Role-based Data Filtering ────────────────────────
function getVisibleStores() {
  const user = getCurrentDemoUser();
  if (user.role === 'admin') {
    return DEMO_STORES;
  }
  if (user.role === 'store_manager' && user.storeIds.length > 0) {
    return DEMO_STORES.filter(s => user.storeIds.includes(s.id));
  }
  // new_user or others: no stores
  return [];
}

function getVisibleMachines() {
  const stores = getVisibleStores();
  const storeIds = stores.map(s => s.id);
  // Include machines from visible stores plus unbound machines (for admin/new_user to bind)
  const user = getCurrentDemoUser();
  if (user.role === 'admin') {
    return DEMO_MACHINES;
  }
  // For store_manager, only show machines in their stores
  if (user.role === 'store_manager') {
    return DEMO_MACHINES.filter(m => storeIds.includes(m.storeId));
  }
  // For new_user, show no machines initially
  return [];
}

function canCreateStore() {
  const user = getCurrentDemoUser();
  return user.role === 'admin' || user.role === 'new_user';
}

function canBindMachine() {
  const user = getCurrentDemoUser();
  return user.role === 'admin' || user.role === 'new_user' || user.role === 'store_manager';
}

function getUserName(user) {
  const demoUser = DEMO_USERS.find(u => u.account === user.account);
  if (demoUser) {
    return getLang() === 'en' ? demoUser.nameEn : demoUser.name;
  }
  return user.name || '用户';
}

function getUserRoleLabel(user) {
  const demoUser = DEMO_USERS.find(u => u.account === user.account);
  if (demoUser) {
    return getLang() === 'en' ? demoUser.roleLabelEn : demoUser.roleLabel;
  }
  return '';
}
