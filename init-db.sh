#!/usr/bin/env bash
rm -f db.sqlite; sqlite3 db.sqlite < init.sql 

for f in images/*.jpg
do
    name=$(basename $f .jpg)
    data=$(base64 -i "$f")
    sql="insert into suspects(real_name, name, picture_data) values('$name','$name','data:image/jpeg;base64,$data')"
    sqlite3 db.sqlite "$sql"
done

while read -r name
do
    echo $name
    sql="update suspects set is_playing=1 where real_name='$name'"
    sqlite3 db.sqlite "$sql"
done < players.txt
