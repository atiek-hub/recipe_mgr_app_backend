#!/bin/bash

# Prismaのインストール
bun add -d prisma

# PrismaClientのインストール
bun add @prisma/client


exec "$@"
