# 📚 LibraTech 图书馆管理系统 (LMS)

LibraTech LMS 是一款专为现代化图书馆设计的全栈能力管理系统。它集成了书籍编目、流转管理、读者服务以及基于 Google Gemini API 的 AI 智能助理，旨在提供极致的用户体验和高效的管理效率。

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)
![AI](https://img.shields.io/badge/Powered%20By-Gemini%203%20Flash-orange.svg)

---

## ✨ 核心功能

### 🛡️ 管理端 (Admin Portal)
- **可视化仪表盘**：使用 Recharts 提供实时馆藏分布图及借阅活跃度分析。
- **图书编目**：完整的图书增删改查逻辑，支持 ISBN 和架位管理。
- **流通控制**：优化的借书（Checkout）与还书（Check-in）工作流，支持扫码模拟。
- **会员管理**：管理读者账号、借阅权限、逾期罚金状态。
- **权限管理**：支持添加和撤销管理员，保护系统安全。

### 📖 读者端 (Reader Portal)
- **公共目录检索**：精美的图书展示界面，实时查看书籍在馆状态。
- **图书预约**：当书籍无库存时，支持在线预约排队。
- **个人借阅历史**：跟踪已借书籍、还书期限及逾期记录。
- **通知中心**：实时接收借阅成功、还书提醒及预约到馆通知。

### 🤖 AI 智能馆员
- **智能咨询**：基于 Google Gemini 3 Flash 模型，熟悉全馆目录。
- **个性化推荐**：根据现有馆藏为读者推荐感兴趣的书籍。
- **馆务解答**：回答关于图书馆规章制度和书籍位置的问题。

---

## 🚀 技术架构

- **前端框架**：React 19 (ES ES6+ 模块化)
- **样式方案**：Tailwind CSS (响应式设计、高度自定义)
- **图标库**：Lucide React
- **图表库**：Recharts
- **人工智能**：@google/genai (Gemini 3 Flash Preview)
- **国际化**：内置 i18n 引擎，支持中英文即时切换。

---

## 🛠️ 快速上手

### 环境要求
- 现代浏览器 (Chrome, Edge, Safari, Firefox)
- 有效的 Gemini API Key (用于 AI 功能)

### 运行步骤
1. 将项目部署在支持 ES Module 的静态服务器上。
2. 在环境变量中配置 `API_KEY`：
   ```env
   API_KEY=您的_GEMINI_API_密钥
   ```
3. 打开 `index.html` 即可启动系统。

### 默认账户
- **管理员**：
  - 用户名：`admin`
  - 密码：`admin`
- **读者**：
  - 证件号：使用内置 Mock 数据（如 `S2023001`）
  - 默认密码：`123456`

---

## 📂 项目结构

```text
├── components/          # UI 组件库
│   ├── AIAssistant.tsx  # AI 聊天界面
│   ├── Circulation.tsx  # 借还书流转逻辑
│   ├── Dashboard.tsx    # 数据统计仪表盘
│   └── ...              # 其他业务组件
├── services/            # 外部服务集成
│   └── geminiService.ts # Gemini API 交互逻辑
├── utils/               # 工具类
│   └── i18n.ts          # 多语言翻译字典
├── types.ts             # 全局 TypeScript 接口定义
├── constants.ts         # Mock 数据与常量
└── App.tsx              # 核心应用逻辑与状态管理
```

---

## 🎨 UI 设计哲学
- **响应式**：完美适配从 4K 显示器到智能手机的各种屏幕。
- **可访问性**：遵循 ARIA 标准，确保所有用户都能无障碍使用。
- **性能优化**：采用按需加载和极简的样式定义，确保秒开体验。

---

## 📄 许可证
本项目采用 MIT 许可证。您可以自由地进行二次开发和商业使用。

---

*由全栈工程师精心打造，LibraTech LMS 助力知识传递。*
