# ИКП — API Конвенции

## Base URL
http://localhost:8080/api

## Authentication
Сите endpoints (освен /auth/login) бараат:
Authorization: Bearer <JWT_TOKEN>

## Endpoint конвенции
- REST APIS URL: /predmeti, /isprakjaci
- Акции како под-ресурси APIS: /predmeti/{id}/potpis
- со повеќе зборови: /vidovi-predmet

## Response формат
- Единечен: гол JSON објект
- Листа: { data, page, size, totalElements, totalPages }

## Error формат
{ timestamp, status, error, message, path }

## HTTP статуси
200 OK | 201 Created | 204 No Content
400 валидација | 401 unauth | 403 forbidden | 404 not found

## Naming
- DB: со _ пр: тип_предмет
- Java/JSON/React: со голема буква типПредмет
- URL: тип-предмет

## Git
- Гранки: <таск име>