# SiYuan CLI 技术设计

## 1. 架构设计

### 1.1 整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLI Layer (Commander.js)               │
│  - 命令解析                                          │
│  - 选项管理                                          │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
┌───────▼────────┐        ┌───────▼────────┐
│ Config Manager  │        │  API Client   │
│ (cosmiconfig)  │        │   (Axios)     │
└─────────────────┘        └───────┬────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                          │
        ┌───────────▼─────────┐  ┌───────▼─────────┐
        │ Notebook API          │  │ Document API    │
        └──────────────────────┘  └────────────────┘
```

### 1.2 模块职责

| 模块 | 职责 | 文件 |
|-----|------|------|
| CLI 入口 | 命令解析、选项处理 | src/cli/index.ts |
| 命令 | 具体命令实现 | src/cli/commands/*.ts |
| API 客户端 | HTTP 请求封装 | src/api/*.ts |
| 配置管理 | 配置加载、验证 | src/config/index.ts |
| 工具函数 | 格式化、日志 | src/utils/*.ts |
| 类型定义 | TypeScript 类型 | src/types/index.ts |

## 2. 数据流设计

### 2.1 配置加载流程

```
1. 检查命令行参数 (优先级最高)
   ↓
2. 检查环境变量
   ↓
3. 检查配置文件 (~/.siyuancli/config.json)
   ↓
4. 使用默认值
```

### 2.2 API 请求流程

```
1. 加载配置
   ↓
2. 创建 API 客户端实例
   ↓
3. 验证 Token
   ↓
4. 发送 POST 请求
   ↓
5. 检查响应 code (0 = 成功)
   ↓
6. 返回 data 或抛出错误
```

## 3. 错误处理策略

### 3.1 错误类型

| 错误类型 | 处理方式 | 示例 |
|---------|---------|------|
| 配置缺失 | 提示运行 init 命令 | Token 未配置 |
| 网络错误 | 显示连接信息 | 无法连接 API |
| API 错误 | 显示 API 返回的 msg | Code ≠ 0 |
| 参数错误 | 显示用法提示 | 缺少必需参数 |

### 3.2 错误响应格式

```
Error: <error message>

Usage: siyuan <command> [options]

For more help, run: siyuan <command> --help
```

## 4. 输出格式设计

### 4.1 Table 格式

```
┌─────────────────┬──────────────┬────────┬────────┐
│ ID            │ Name         │ Icon   │ Closed │
├─────────────────┼──────────────┼────────┼────────┤
│ 2021xxx      │ 测试笔记本   │ 📁     │ false  │
└─────────────────┴──────────────┴────────┴────────┘
```

### 4.2 JSON 格式

```json
{
  "id": "2021xxx",
  "name": "测试笔记本",
  "icon": "📁",
  "closed": false
}
```

### 4.3 Markdown 格式

```markdown
# 笔记本列表

| ID | 名称 | 图标 | 已关闭 |
|-----|------|------|--------|
| 2021xxx | 测试笔记本 | 📁 | 否 |
```

## 5. API 映射设计

| 功能 | 命令 | API 端点 | HTTP 方法 |
|-----|------|---------|---------|
| 列出笔记本 | notebook list | /api/notebook/lsNotebooks | POST |
| 创建笔记本 | notebook create | /api/notebook/createNotebook | POST |
| 创建文档 | doc create | /api/filetree/createDocWithMd | POST |
| 获取块 | block get | /api/block/getBlockKramdown | POST |
| 搜索 | search | /api/query/sql | POST |

## 6. 扩展性设计

### 6.1 添加新命令

1. 在 `src/cli/commands/` 创建新文件
2. 继承 `Command` 类
3. 在 `src/cli/index.ts` 注册命令
4. 实现对应的 API 函数

### 6.2 添加新的 API 端点

1. 在 `src/api/` 创建新的 API 文件
2. 使用 `SiYuanClient.post()` 发送请求
3. 在命令中调用新的 API 函数

## 7. 测试策略

### 7.1 单元测试

- 测试配置加载和验证
- 测试 API 客户端错误处理
- 测试格式化函数

### 7.2 集成测试

- 测试命令完整流程
- 测试与实际 SiYuan 实例的交互
- 测试不同输出格式
