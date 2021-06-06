#!/usr/bin/env sh
# abort on errors
set -e

#임시 저장함 초기화
git stash clear

#임시 저장
git stash -u

#main 브랜치 다운로드
git fetch --all

#main 브랜치의 가장 최신 버전으로 초기화
git reset --hard origin/main

#작업 가져오기
git stash pop