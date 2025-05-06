export async function onRequest(context) {
  const { request, env, params } = context;
  const url = new URL(request.url);
  const path = params.path;
  
  // 只处理GET请求
  if (request.method !== 'GET') {
    return context.next();
  }
  
  // 处理compose页面
  if (path === 'compose') {
    const response = await fetch(new URL('/compose.html', url.origin));
    return response;
  }
  
  // 处理manage页面
  if (path === 'manage') {
    const response = await fetch(new URL('/manage.html', url.origin));
    return response;
  }
  
  // 非特定路由，继续执行后续处理
  return context.next();
} 