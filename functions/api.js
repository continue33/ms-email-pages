// API URL
const API_BASE_URL = 'https://ms-email-oscar.itvoyager.us/api';

// 处理账号API请求
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  
  // 获取账号列表的路由
  if (path === '/accounts' && request.method === 'GET') {
    try {
      const keys = await env.ACCOUNTS.list();
      const accounts = {};
      for (const key of keys.keys) {
        const account = await env.ACCOUNTS.get(key.name, 'json');
        accounts[key.name] = account;
      }
      return new Response(JSON.stringify(accounts), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response('Error fetching accounts: ' + error.message, { status: 500 });
    }
  }

  // 添加账号的路由
  if (path === '/manage' && request.method === 'POST') {
    try {
      const body = await request.json();
      const { email, refresh_token, client_id } = body;

      if (!email || !refresh_token || !client_id) {
        return new Response('Missing required fields', { status: 400 });
      }

      await env.ACCOUNTS.put(email, JSON.stringify({ refresh_token, client_id }));
      return new Response('Account added', { status: 200 });
    } catch (error) {
      return new Response('Error adding account: ' + error.message, { status: 500 });
    }
  }

  // 删除账号的路由
  if (path === '/manage' && request.method === 'DELETE') {
    try {
      const email = url.searchParams.get('email');
      if (!email) {
        return new Response('Email is required', { status: 400 });
      }

      await env.ACCOUNTS.delete(email);
      return new Response('Account deleted', { status: 200 });
    } catch (error) {
      return new Response('Error deleting account: ' + error.message, { status: 500 });
    }
  }
  
  // 发送邮件的路由
  if (path === '/send-mail' && request.method === 'POST') {
    try {
      const body = await request.json();
      const { email, to, subject, content, format } = body;
      
      if (!email || !to || !subject || !content) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: '缺少必要参数' 
        }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' } 
        });
      }
      
      // 获取账号信息
      const account = await env.ACCOUNTS.get(email, 'json');
      if (!account) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: '账号不存在' 
        }), { 
          status: 404,
          headers: { 'Content-Type': 'application/json' } 
        });
      }
      
      const { refresh_token, client_id } = account;
      
      // 创建API请求体
      const apiBody = {
        refresh_token,
        client_id,
        email,
        to,
        subject
      };
      
      // 根据格式选择添加text或html参数
      if (format === 'html') {
        apiBody.html = content;
      } else {
        apiBody.text = content;
      }
      
      // 调用外部API发送邮件
      const apiUrl = `${API_BASE_URL}/send-mail`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiBody)
      });
      
      const apiResponse = await response.json();
      
      if (response.ok) {
        return new Response(JSON.stringify({ 
          success: true, 
          message: '邮件发送成功' 
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' } 
        });
      } else {
        return new Response(JSON.stringify({ 
          success: false, 
          error: apiResponse.error || '发送失败' 
        }), { 
          status: response.status,
          headers: { 'Content-Type': 'application/json' } 
        });
      }
    } catch (error) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message || '服务器错误' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' } 
      });
    }
  }

  // 如果不是API路由，返回404
  return new Response('Not Found', { status: 404 });
} 