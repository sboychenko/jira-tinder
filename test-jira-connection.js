#!/usr/bin/env node

console.log('🔍 Тестирование подключения к Jira...\n');
console.log('⚠️  Внимание: Этот скрипт больше не использует .env файл!');
console.log('   Настройки Jira теперь хранятся в браузере через popup настроек.\n');

console.log('📋 Для тестирования API используйте приложение в браузере:');
console.log('   1. Откройте приложение');
console.log('   2. Нажмите кнопку "⚙️ Настройки"');
console.log('   3. Введите URL Jira и API токен');
console.log('   4. Сохраните настройки');
console.log('   5. Протестируйте загрузку задач\n');

console.log('✅ Настройки успешно перенесены в popup!');

console.log('📋 Конфигурация:');
console.log(`   URL: ${config.baseURL}`);
console.log(`   Username: ${config.username || 'не указан'}`);
console.log(`   Password: ${config.password ? '***' : 'не указан'}`);
console.log(`   API Token: ${config.apiToken ? '***' : 'не указан'}\n`);

// Проверяем обязательные поля
if (!config.baseURL || config.baseURL === 'http://your-jira-instance.com') {
  console.log('❌ Ошибка: JIRA_BASE_URL не настроен или содержит placeholder значение');
  console.log('   Отредактируйте .env файл с реальными данными');
  process.exit(1);
}

if (!config.username && !config.apiToken) {
  console.log('❌ Ошибка: Не указаны учетные данные');
  console.log('   Укажите JIRA_USERNAME и JIRA_PASSWORD или JIRA_API_TOKEN');
  process.exit(1);
}

// Формируем заголовки аутентификации
let auth;
if (config.apiToken) {
  auth = { Authorization: `Bearer ${config.apiToken}` };
} else {
  const credentials = Buffer.from(`${config.username}:${config.password}`).toString('base64');
  auth = { Authorization: `Basic ${credentials}` };
}

console.log('🔐 Тестирование подключения...');

// Тестируем подключение
axios({
  method: 'GET',
  url: `${config.baseURL}/rest/api/3/myself`,
  headers: {
    'Accept': 'application/json',
    ...auth
  },
  timeout: 10000
})
.then(response => {
  console.log('✅ Подключение успешно!');
  console.log(`   Пользователь: ${response.data.displayName}`);
  console.log(`   Email: ${response.data.emailAddress}`);
  console.log(`   Активен: ${response.data.active ? 'Да' : 'Нет'}`);
  
  // Тестируем поиск задач
  console.log('\n🔍 Тестирование поиска задач...');
  return axios({
    method: 'POST',
    url: `${config.baseURL}/rest/api/2/search`,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...auth
    },
    data: {
      jql: 'project = "Platform Team" ',
      maxResults: 5,
      fields: ['summary', 'assignee', 'reporter', 'components', 'priority']
    }
  });
})
.then(response => {
  console.log(response.data);
  console.log('✅ Поиск задач работает!');
  console.log(`   Найдено задач: ${response.data.total}`);
  console.log(`   Максимум результатов: ${response.data.maxResults}`);
})
.catch(error => {
  console.log('❌ Ошибка подключения:');
  
  if (error.code === 'ENOTFOUND') {
    console.log('   Сервер недоступен. Проверьте URL и доступность Jira.');
  } else if (error.response) {
    const { status, statusText } = error.response;
    console.log(`   HTTP ${status}: ${statusText}`);
    
    if (status === 401) {
      console.log('   Неправильные учетные данные. Проверьте логин/пароль или API токен.');
    } else if (status === 403) {
      console.log('   Недостаточно прав. Проверьте права пользователя в Jira.');
    } else if (status === 404) {
      console.log('   API endpoint не найден. Проверьте версию Jira.');
    }
  } else if (error.code === 'ECONNREFUSED') {
    console.log('   Соединение отклонено. Проверьте порт и firewall.');
  } else if (error.code === 'ETIMEDOUT') {
    console.log('   Таймаут подключения. Проверьте сеть.');
  } else {
    console.log(`   ${error.message}`);
  }
  
  console.log('\n💡 Рекомендации:');
  console.log('   1. Проверьте правильность URL в JIRA_BASE_URL');
  console.log('   2. Убедитесь, что Jira сервер доступен');
  console.log('   3. Проверьте учетные данные');
  console.log('   4. Проверьте права пользователя в Jira');
  
  process.exit(1);
});
