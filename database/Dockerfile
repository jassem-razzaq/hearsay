FROM mysql:8.0

WORKDIR /import

COPY hearsay_db.sql /import/hearsay_db.sql

CMD ["sh", "-c", "mysql -h \"$MYSQLHOST\" -P \"$MYSQLPORT\" -u \"$MYSQLUSER\" -p\"$MYSQLPASSWORD\" \"$MYSQLDATABASE\" < /import/hearsay_db.sql"]
