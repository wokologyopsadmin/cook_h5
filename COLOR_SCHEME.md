# WOKOLOGY K100 配色方案

基于 WOKOLOGY K100 智能爆炒系统宣传设计的配色方案

## 主色调 (Primary Colors)

### 深蓝色 (Deep Blue)
- **色值**: `#2B5A8E`
- **用途**: 主要背景、Hero 区域渐变起始色
- **CSS 类**: `.bg-blue-primary`, `.text-blue-primary`, `.border-blue-primary`

### 浅蓝色 (Light Blue)
- **色值**: `#5B8BC4`
- **用途**: Hero 区域渐变结束色、高亮元素
- **CSS 类**: `.bg-blue-light`, `.text-blue-light`, `.border-blue-light`

### 中间蓝色 (Mid Blue)
- **色值**: `#3D6FA8`
- **用途**: 渐变过渡色
- **应用**: 用于 Hero 区域的平滑渐变效果

## 辅助色 (Secondary Colors)

### 深灰色 (Dark Gray)
- **色值**: `#2C2C2C`
- **用途**: 产品展示背景、深色模式元素

### 浅灰色 (Light Gray)
- **色值**: `#D8D8D8`
- **用途**: 产品表面、分隔线

### 黑色 (Black)
- **色值**: `#000000`
- **用途**: 对比元素、文字

## 强调色 (Accent Colors)

### 金黄色 (Golden)
- **色值**: `#F5A623`
- **用途**: 品牌标志、按钮、重要操作
- **CSS 类**: `.bg-orange-500`, `.text-orange-500`
- **应用**: 登录按钮、导航激活状态、CTA 按钮

### 橙色 (Orange)
- **色值**: `#FF6B35`
- **用途**: 食物高亮、次要强调
- **应用**: 统计数据、特殊标记

## 中性色 (Neutral Colors)

### 白色 (White)
- **色值**: `#FFFFFF`
- **用途**: 文字、卡片背景

### 米白色 (Off-white / Warm Beige)
- **色值**: `#F7F3E9`
- **用途**: 页面背景、卡片背景
- **CSS 类**: `.bg-white-card`

### 奶白色 (Cream)
- **色值**: `#F8F6F0`
- **用途**: 主背景色
- **CSS 类**: `body.bg-gray-50`

## 渐变效果 (Gradients)

### 主渐变 (Primary Gradient)
```css
background: linear-gradient(135deg, #2B5A8E 0%, #3D6FA8 50%, #5B8BC4 100%);
```
- **CSS 类**: `.hero-gradient`, `.gradient-blue-primary`
- **应用**: Dashboard、Recipes、Machines、Profile 等页面的 Hero 区域

### 柔和渐变 (Soft Gradient)
```css
background: linear-gradient(160deg, #2B5A8E 0%, #3D6FA8 60%, #5B8BC4 100%);
```
- **CSS 类**: `.auth-hero`, `.gradient-blue-soft`
- **应用**: 登录页面、注册页面的 Hero 区域

## 应用场景

### 登录/注册页面
- **Hero 背景**: 蓝色柔和渐变 (`#2B5A8E` → `#3D6FA8` → `#5B8BC4`)
- **主按钮**: 金黄色 `#F5A623`
- **链接**: 金黄色 `#F5A623`
- **卡片背景**: 奶白色 `#F8F6F0`

### Dashboard/主页
- **Hero 背景**: 蓝色主渐变
- **统计数字**: 橙色 `#F5A623`（今日烹饪）、绿色（在线机器）、蓝色（门店数量）
- **导航激活**: 金黄色 `#F5A623`

### 菜谱/机器管理页面
- **Hero 背景**: 蓝色主渐变
- **操作按钮**: 金黄色 `#F5A623`
- **状态标签**: 保持原有语义色（绿色=在线，橙色=烹饪中，灰色=离线）

## 设计原则

1. **专业感**: 深蓝色传达科技感和专业性
2. **温暖感**: 金黄色和橙色提供温暖的视觉体验
3. **对比度**: 确保文字在蓝色背景上清晰可读
4. **一致性**: 所有页面使用统一的蓝色渐变系统
5. **品牌识别**: 金黄色作为品牌强调色，贯穿整个应用

## 更新日期
2026-03-17

## 参考来源
WOKOLOGY K100 智能爆炒系统宣传设计
