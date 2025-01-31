# RegeLook

# 超重要:
* 現在下記の問題により適切な処理をしないとゲームは動きません.
* そのためgithub pages上のページは現在公開していません.
> * cloneし適切な処理を行えば動作します.    
> * 提出動画ではそのような対応をして動かしています.


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
## データベースの初期化・起動
* 以下のコマンドでローカルホスト上にアプリが起動します.
```
    npm run dev
```
* その後src/App.jsx内のresetFirebase()のコメントアウトを外し,ページを読み込んでください.
* 上の行程を実行したら,resetFirebase()は再びコメントアウトしてください.

## 問題
* ページをリロード・閉じた際にGameRoomのデータを初期化する処理が適切に動かず,ゲームプレイの際はresetFirebaseを動かさなければならない.
