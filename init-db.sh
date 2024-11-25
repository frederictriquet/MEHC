#!/usr/bin/env bash
rm -f db.sqlite; sqlite3 db.sqlite < init.sql 

for f in images/*.jpg
do
    name=$(basename $f .jpg)
    data=$(base64 -i "$f")
    sql="insert into suspects(real_name, name, picture_data) values('$name','$name','data:image/jpeg;base64,$data')"
    sqlite3 db.sqlite "$sql"
done
