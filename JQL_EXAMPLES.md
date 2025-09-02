# Примеры JQL запросов для Jira Tinder 🎯

Вот полезные JQL запросы для различных сценариев работы с задачами:

## 🔍 Базовые запросы

### Все открытые задачи в проекте
```sql
project = "PROJECT_KEY" AND status != "Done"
```

### Задачи определенного типа
```sql
issuetype = "Story" AND status != "Done"
```

### Задачи с высоким приоритетом
```sql
priority in (High, Highest) AND status != "Done"
```

## 📅 Временные фильтры

### Задачи за последнюю неделю
```sql
created >= -1w AND status != "Done"
```

### Задачи за последний месяц
```sql
created >= -1m AND status != "Done"
```

### Задачи с истекшим сроком
```sql
due < now() AND status != "Done"
```

### Задачи без оценки времени
```sql
timeoriginalestimate is EMPTY AND status != "Done"
```

## 👥 Назначенные задачи

### Мои задачи
```sql
assignee = currentUser() AND status != "Done"
```

### Не назначенные задачи
```sql
assignee is EMPTY AND status != "Done"
```

### Задачи определенного пользователя
```sql
assignee = "username" AND status != "Done"
```

### Задачи, созданные определенным пользователем
```sql
reporter = "username" AND status != "Done"
```

### Задачи без назначения с высоким приоритетом
```sql
assignee is EMPTY AND priority in (High, Highest) AND status != "Done"
```

## 🏷️ По лейблам и компонентам

### Задачи без лейблов run/change
```sql
labels not in ("run", "change") AND status != "Done"
```

### Задачи с определенным лейблом
```sql
labels = "run" AND status != "Done"
labels = "change" AND status != "Done"
```

### Задачи определенного компонента
```sql
component = "Frontend" AND status != "Done"
```

## 📊 Статусы и переходы

### Задачи в определенном статусе
```sql
status = "In Progress" OR status = "To Do"
```

### Задачи, которые не двигались неделю
```sql
statusChanged < -1w AND status != "Done"
```

### Задачи в спринте
```sql
sprint in openSprints() AND status != "Done"
```

## 🔧 Технические задачи

### Баги
```sql
issuetype = "Bug" AND status != "Done"
```

### Технические долги
```sql
labels = "technical-debt" AND status != "Done"
```

### Задачи с определенным эпиком
```sql
"Epic Link" = "EPIC-123" AND status != "Done"
```

## 📈 Сложные комбинации

### Критические баги с высоким приоритетом
```sql
issuetype = "Bug" AND priority = "Highest" AND status != "Done"
```

### Задачи для code review
```sql
status = "Code Review" OR status = "Review"
```

### Задачи без описания
```sql
description is EMPTY AND status != "Done"
```

### Задачи с большим количеством комментариев
```sql
commentCount > 5 AND status != "Done"
```

## 🎯 Специфичные для команд

### Задачи для frontend команды
```sql
component in ("Frontend", "UI/UX") AND status != "Done"
```

### Задачи для backend команды
```sql
component in ("Backend", "API") AND status != "Done"
```

### Задачи для DevOps
```sql
component in ("Infrastructure", "DevOps") AND status != "Done"
```

## 💡 Советы по составлению запросов

1. **Всегда добавляйте `AND status != "Done"`** - чтобы исключить завершенные задачи
2. **Используйте кавычки** для значений с пробелами: `project = "My Project"`
3. **Группируйте условия** скобками для сложной логики
4. **Тестируйте запросы** в Jira перед использованием в приложении

## 🚀 Готовые шаблоны

### Для ежедневного обзора
```sql
project = "TEAM_PROJECT" AND status != "Done" AND priority in (High, Highest) ORDER BY priority DESC, created DESC
```

### Для планирования спринта
```sql
project = "TEAM_PROJECT" AND status = "To Do" AND assignee is EMPTY ORDER BY priority DESC
```

### Для технического долга
```sql
project = "TEAM_PROJECT" AND labels = "technical-debt" AND status != "Done" ORDER BY created ASC
```

---

**Примечание**: Замените `PROJECT_KEY` и `TEAM_PROJECT` на реальные ключи ваших проектов в Jira.
