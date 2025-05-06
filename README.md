# 邮箱 API 客户端 - Cloudflare Pages 版本

这是一个使用 Cloudflare Pages 和 Pages Functions 部署的邮箱 API 客户端，用于管理多个邮箱账户，支持发送邮件和查看邮件。

## 项目结构

```
├── functions/            # Cloudflare Pages Functions 目录
│   ├── _routes.json      # 路由配置
│   ├── [[path]].js       # 动态路径处理
│   ├── accounts.js       # 账户API路由
│   ├── api.js            # API处理逻辑
│   ├── manage.js         # 账户管理API路由
│   └── send-mail.js      # 发送邮件API路由
├── public/               # 静态资源目录
│   ├── index.html        # 主页
│   ├── compose.html      # 撰写邮件页面
│   └── manage.html       # 账户管理页面
└── README.md             # 项目说明
```

## 部署步骤

1. 在 Cloudflare Dashboard 中创建一个新的 Pages 项目
2. 连接你的 Git 仓库或直接上传这些文件
3. 部署设置中，确保：
   - 构建命令留空
   - 构建输出目录设置为 `public`
   - 启用 Functions

4. 部署后，前往 Pages 项目设置 > Functions > KV 命名空间绑定：
   - 创建一个新的 KV 命名空间（如果没有的话）
   - 添加一个新的绑定，变量名为 `ACCOUNTS`，选择刚才创建的命名空间

## 使用方法

部署完成后，可以通过以下页面访问：

- `/` - 主页，显示所有邮箱账户列表
- `/compose` - 撰写邮件页面
- `/manage` - 管理邮箱账户（添加、导入、删除等）

## API 说明

项目提供以下 API 端点：

- `GET /accounts` - 获取所有账户列表
- `POST /manage` - 添加新账户
- `DELETE /manage?email=xxx` - 删除指定账户
- `POST /send-mail` - 发送邮件

## 注意事项

- 确保正确设置 KV 命名空间绑定，否则无法存储和读取账户信息
- 外部 API 基地址默认为 `https://ms-email-oscar.itvoyager.us/api`，可以在 `functions/api.js` 中修改 