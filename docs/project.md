# SiYuan Note Master CLI 项目约定

## 项目信息

- **项目名称**: siyuan-note-master-cli
- **版本**: 1.0.0
- **语言**: TypeScript
- **许可证**: MIT

## 开发规范

- 遵循 SDD (Spec-Driven Development)
- 使用 Prettier 格式化代码
- 使用 ESLint 检查代码质量
- 所有函数必须有类型注解
- 所有 API 调用必须有错误处理

## 代码风格

- 使用 4 空格缩进
- 使用单引号
- 行尾分号
- 使用箭头函数
- 命名使用 camelCase

## 项目结构

```
siyuan-note-master-cli/
├── docs/               # SDD 文档规范（真理来源）
│   ├── project.md       # 项目约定与背景
│   ├── specs/          # 当前系统规范
│   └── changes/        # 进行中的变更
├── src/                # 源代码
│   ├── cli/          # CLI 入口和命令
│   ├── api/          # API 客户端
│   ├── config/       # 配置管理
│   ├── utils/        # 工具函数
│   └── types/        # TypeScript 类型定义
└── tests/              # 测试代码
```

## 技术栈

- **语言**: TypeScript 5.3+
- **运行时**: Node.js 16+
- **CLI 框架**: Commander.js
- **HTTP 客户端**: Axios
- **配置管理**: cosmiconfig
- **输出格式**: chalk, cli-table3

## 开发工作流

1. 修改代码
2. 运行 `npm run lint` 检查代码质量
3. 运行 `npm run format` 格式化代码
4. 运行 `npm test` 执行测试
5. 运行 `npm run build` 构建项目
6. 更新 SDD 文档

## 命名约定

- **文件名**: camelCase.ts (如 notebook.ts, document.ts)
- **函数名**: camelCase (如 listNotebooks, createNotebook)
- **常量名**: UPPER_SNAKE_CASE (如 API_ENDPOINT, DEFAULT_TIMEOUT)
- **接口名**: PascalCase (如 Notebook, Document)

## 提交规范

提交消息格式：

```
<type>(<scope>): <subject>

<body>
```

类型 (type):
- feat: 新功能
- fix: Bug 修复
- docs: 文档更新
- style: 代码格式（不影响功能）
- refactor: 重构
- test: 测试相关
- chore: 构建/工具相关
