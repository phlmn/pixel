#!/usr/bin/env sh
for UPLOAD_PORT in `ls /dev | grep cu.wchusbserial`; do
  echo "Uploading to $UPLOAD_PORT..."
  platformio run -t upload --upload-port /dev/$UPLOAD_PORT
done
