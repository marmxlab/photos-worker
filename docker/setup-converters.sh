#!/usr/bin/env bash
apt-get -y update
apt-get -y upgrade

# install ffmpeg
apt-get install -y ffmpeg

# install imagemagick with HEIC support
# https://medium.com/@eplt/5-minutes-to-install-imagemagick-with-heic-support-on-ubuntu-18-04-digitalocean-fe2d09dcef1
apt-get install build-essential autoconf libtool git-core
apt-get build-dep imagemagick libmagickcore-dev libde265 libheif
cd /usr/src/
git clone https://github.com/strukturag/libde265.git
git clone https://github.com/strukturag/libheif.git
cd libde265/
./autogen.sh
./configure
make
make install
cd /usr/src/libheif/
./autogen.sh
./configure
make
make install
cd /usr/src/
wget https://www.imagemagick.org/download/ImageMagick.tar.gz
tar xf ImageMagick.tar.gz
cd ImageMagick-7*
./configure --with-heic=yes
make
make install
ldconfig
