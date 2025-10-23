# front-security-sample

### XSS攻撃サンプル
```html
<img src="x" onerror="console.log(`セッションID: ${document.cookie.split(';').map(s => s.trim()).find(s => s.startsWith('session_id='))}`)" />
```

### CSRF攻撃サンプル
<a href="http://localhost:3002">ここをクリック！</a>