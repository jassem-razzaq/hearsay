FROM mysql:8.0

WORKDIR /import

COPY ../database/dump.sql ./dump.sql

CMD ["sh", "-c", "mysql -h \"$MYSQLHOST\" -P \"$MYSQLPORT\" -u \"$MYSQLUSER\" -p\"$MYSQLPASSWORD\" < /import/dump.sql"]
