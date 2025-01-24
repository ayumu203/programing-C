# RegeLook

## 実行方法
### フォルダのダウンロードから環境変数の設定画面まで
 ```
    $ git clone git@github.com:ayumu203/programing-C.git
    $ cd programing-C
    $ npm i
    $ vi .env
```

### .envに書き込む内容
* ＊にはFirebaseのAPIキーを入れてください.
``` 
    VITE_FIREBASE_API_KEY = "*"
    VITE_FIREBASE_AUTH_DOMAIN = "*"
    VITE_FIREBASE_PROJECT_ID = "*"
    VITE_FIREBASE_STORAGE_BUCKET = "*"
    VITE_FIREBASE_MESSAGING_SENDER_ID = "*"
    VITE_FIREBASE_APP_ID = "*"
```
### データベースの初期設定
* ResetDatabaseをがんばって動かしてください.

## 起動
* 以下のコマンドでローカルホスト上にアプリが起動します.
```
    npm run dev
```