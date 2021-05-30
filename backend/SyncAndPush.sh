#!/usr/bin/env sh
# abort on errors
set -e

# ============================================================================
# 1. main 브랜치의 최신 내용을 끌어오고 동기화.
# 2. 작업 내용을 커밋하고 푸쉬.
# ============================================================================

# 현재 브랜치 이름 가져오기
currentBranch=$(git symbolic-ref --short HEAD)
echo 현재 작업 브랜치 $currentBranch

# 커밋 메시지 입력
echo 무엇을 작업했나요?
read commitMessage

# main 브랜치 동기화
git stash clear
git stash
git fetch --all
git reset --hard origin/main

#
git stash pop
git add -A
git commit -m "$commitMessage"
git push -f origin $currentBranch