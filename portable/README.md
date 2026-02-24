# SiYuan CLI 便携版

## 使用方法

### Windows

直接运行 `snmcli.bat`：

```bash
# 查看帮助
snmcli.bat --help

# 列出笔记本
snmcli.bat -t YOUR_TOKEN notebook list

# 使用 JSON 格式
snmcli.bat -t YOUR_TOKEN notebook list -f json
```

### Linux/Mac

```bash
# 添加执行权限
chmod +x snmcli

# 运行
./snmcli -t YOUR_TOKEN notebook list
```

## 配置文件

首次使用需要配置 Token，有三种方式：

### 方式1: 命令行参数（每次）
```bash
snmcli.bat -t YOUR_TOKEN notebook list
```

### 方式2: 环境变量
```bash
set SIYUAN_TOKEN=YOUR_TOKEN
snmcli.bat notebook list
```

### 方式3: 配置文件
在用户目录创建 `~/.snmclirc.json`：

```json
{
  "token": "YOUR_TOKEN_HERE",
  "endpoint": "http://127.0.0.1:6806",
  "outputFormat": "json"
}
```

## 依赖

需要安装 Node.js (>=16.0.0)

如缺少依赖，请运行：
```bash
npm install
```

## 目录结构

```
portable/
├── snmcli              # Linux/Mac 启动脚本
├── snmcli.bat          # Windows 启动脚本
├── dist/               # 编译后的代码
│   ├── cli/
│   ├── api/
│   └── ...
├── package.json
└── README.md
```
