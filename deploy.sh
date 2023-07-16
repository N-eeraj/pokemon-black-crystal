#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd ./dist && cp index.html 404.html

git init
git add -A
git commit -m 'deploy'


# deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:N-eeraj/pokemon-black-crystal.git main:gh-pages

cd -