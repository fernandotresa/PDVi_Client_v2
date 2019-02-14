#!/bin/bash

ionic cordova build browser

zip -y -6 /home/diego/Documents/Projetos/PDVi/woocommerce-client/www.zip -- www www/service-worker.js www/manifest.json www/index.html www/assets www/build www/build/main.css.map www/build/main.css www/build/vendor.js.map www/build/main.js.map www/build/vendor.js www/build/main.js www/build/sw-toolbox.js www/build/polyfills.js www/assets/imgs www/assets/imgs/logo.png www/assets/imgs/background.jpg www/assets/imgs/logo.jpg www/assets/imgs/agenda.jpg www/assets/imgs/100x100.png www/assets/icon www/assets/icon/favicon.ico www/assets/fonts www/assets/fonts/roboto-medium.woff2 www/assets/fonts/roboto.scss www/assets/fonts/roboto-regular.woff2 www/assets/fonts/roboto-regular.woff www/assets/fonts/roboto-regular.ttf www/assets/fonts/roboto-medium.woff www/assets/fonts/roboto-medium.ttf www/assets/fonts/roboto-light.woff2 www/assets/fonts/roboto-light.woff www/assets/fonts/roboto-light.ttf www/assets/fonts/roboto-bold.woff2 www/assets/fonts/roboto-bold.woff www/assets/fonts/roboto-bold.ttf www/assets/fonts/noto-sans.scss www/assets/fonts/noto-sans-regular.woff www/assets/fonts/noto-sans-regular.ttf www/assets/fonts/noto-sans-bold.woff www/assets/fonts/noto-sans-bold.ttf www/assets/fonts/ionicons.scss www/assets/fonts/ionicons.woff2 www/assets/fonts/ionicons.woff www/assets/fonts/ionicons.ttf www/assets/fonts/ionicons.svg www/assets/fonts/ionicons.eot

scp www.zip root@10.8.0.86:/tmp/
#scp www.zip root@suporte.3a.com.br:/var/www/html/pdvi/
