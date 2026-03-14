// ── WOKOLOGY Shared App Logic ────────────────────────

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
    img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80',
    ingredients: ['牛肉 / Beef 500g', '土豆 / Potato 300g', '番茄 / Tomato 200g', '洋葱 / Onion 150g', '甜椒粉 / Paprika 2 tsp']
  },
  {
    id: 2, cat: 'beef',
    nameZh: '黑椒牛柳', nameEn: 'Black Pepper Beef Tenderloin',
    time: 20, diff: 'easy', free: true,
    img: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&q=80',
    ingredients: ['牛里脊 / Beef tenderloin 300g', '黑胡椒 / Black pepper 1 tbsp', '黄油 / Butter 30g', '大蒜 / Garlic 3 cloves']
  },
  {
    id: 3, cat: 'beef',
    nameZh: '红酒炖牛腩', nameEn: 'Red Wine Braised Beef',
    time: 90, diff: 'hard', free: false,
    img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
    ingredients: ['牛腩 / Beef brisket 600g', '红酒 / Red wine 200ml', '胡萝卜 / Carrot 100g', '芹菜 / Celery 50g']
  },
  // Lamb
  {
    id: 4, cat: 'lamb',
    nameZh: '香草烤羊排', nameEn: 'Herb-Crusted Lamb Chops',
    time: 30, diff: 'medium', free: true,
    img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80',
    ingredients: ['羊排 / Lamb chops 500g', '迷迭香 / Rosemary 3 sprigs', '大蒜 / Garlic 4 cloves', '橄榄油 / Olive oil 3 tbsp']
  },
  {
    id: 5, cat: 'lamb',
    nameZh: '慢炖羊肩肉', nameEn: 'Slow-Cooked Lamb Shoulder',
    time: 120, diff: 'hard', free: false,
    img: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80',
    ingredients: ['羊肩肉 / Lamb shoulder 800g', '洋葱 / Onion 2 pcs', '香料 / Spice mix 2 tbsp', '高汤 / Stock 300ml']
  },
  // Pork
  {
    id: 6, cat: 'pork',
    nameZh: '焦糖猪肋排', nameEn: 'Caramelized Pork Ribs',
    time: 60, diff: 'medium', free: true,
    img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
    ingredients: ['猪肋排 / Pork ribs 700g', '蜂蜜 / Honey 3 tbsp', '酱油 / Soy sauce 2 tbsp', '大蒜 / Garlic 3 cloves']
  },
  {
    id: 7, cat: 'pork',
    nameZh: '匈牙利猪肉炖', nameEn: 'Hungarian Pork Stew',
    time: 50, diff: 'easy', free: true,
    img: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&q=80',
    ingredients: ['猪肉 / Pork 500g', '甜椒粉 / Paprika 3 tsp', '洋葱 / Onion 2 pcs', '酸奶油 / Sour cream 100ml']
  },
  // Chicken
  {
    id: 8, cat: 'chicken',
    nameZh: '香草烤全鸡', nameEn: 'Herb Roasted Whole Chicken',
    time: 75, diff: 'medium', free: true,
    img: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c1?w=400&q=80',
    ingredients: ['整鸡 / Whole chicken 1.5kg', '柠檬 / Lemon 1 pc', '黄油 / Butter 50g', '混合香草 / Herb mix 3 tbsp']
  },
  {
    id: 9, cat: 'chicken',
    nameZh: '红椒鸡肉炖', nameEn: 'Chicken Paprikash',
    time: 35, diff: 'easy', free: true,
    img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80',
    ingredients: ['鸡腿 / Chicken thighs 600g', '红椒粉 / Sweet paprika 3 tsp', '洋葱 / Onion 1 pc', '酸奶油 / Sour cream 150ml']
  },
  // Seafood
  {
    id: 10, cat: 'seafood',
    nameZh: '黄油蒜香虾', nameEn: 'Garlic Butter Shrimp',
    time: 15, diff: 'easy', free: true,
    img: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=400&q=80',
    ingredients: ['大虾 / Shrimp 500g', '黄油 / Butter 40g', '大蒜 / Garlic 5 cloves', '柠檬 / Lemon 1 pc']
  },
  {
    id: 11, cat: 'seafood',
    nameZh: '煎三文鱼', nameEn: 'Pan-Seared Salmon',
    time: 20, diff: 'easy', free: false,
    img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80',
    ingredients: ['三文鱼 / Salmon fillet 400g', '柠檬 / Lemon 1 pc', '新鲜香草 / Fresh herbs 2 tbsp', '橄榄油 / Olive oil 2 tbsp']
  },
  {
    id: 12, cat: 'seafood',
    nameZh: '海鲜意面', nameEn: 'Seafood Pasta',
    time: 25, diff: 'medium', free: false,
    img: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&q=80',
    ingredients: ['意面 / Pasta 200g', '虾 / Shrimp 200g', '扇贝 / Scallops 100g', '番茄酱 / Tomato sauce 200ml']
  },
  // Vegetarian
  {
    id: 13, cat: 'veg',
    nameZh: '烤时令蔬菜', nameEn: 'Roasted Seasonal Vegetables',
    time: 30, diff: 'easy', free: true,
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80',
    ingredients: ['彩椒 / Bell peppers 2 pcs', '西葫芦 / Zucchini 1 pc', '茄子 / Eggplant 1 pc', '橄榄油 / Olive oil 3 tbsp']
  },
  {
    id: 14, cat: 'veg',
    nameZh: '蘑菇素炒', nameEn: 'Sautéed Mixed Mushrooms',
    time: 15, diff: 'easy', free: true,
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
    ingredients: ['混合蘑菇 / Mixed mushrooms 400g', '大蒜 / Garlic 3 cloves', '黄油 / Butter 30g', '百里香 / Thyme 2 sprigs']
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
