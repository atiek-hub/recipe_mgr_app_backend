# Bun公式イメージを使用
FROM oven/bun:latest

# 作業ディレクトリ作成
WORKDIR /app

# プロジェクトファイルをコピー
COPY . .

# 依存関係のインストール
RUN cd /app/recipe-mgr && bun install

# ワークディレクトリを切り替え
WORKDIR /app/recipe-mgr

ENTRYPOINT ["./install-lib.sh"]
# アプリ起動
CMD ["bun", "run", "dev"]
