#!/usr/bin/bash

OLD_NAME="index.js"
NEW_NAME="smart-recall.js"

AGI_DIR="/usr/share/asterisk/agi-bin/smart-recall"

OLD_PATH="${AGI_DIR}/${OLD_NAME}"
NEW_PATH="${AGI_DIR}/${NEW_NAME}"

NODE_PATH="/root/.nvm/versions/node/v20.20.2/bin/node"
SHEBANG="#!${NODE_PATH}"

set -e

# исходный файл обязан существовать в AGI_DIR
[ -f "$OLD_PATH" ] || exit 1

# подготовка прав
chmod +x "$OLD_PATH"

# корректный shebang
FIRST_LINE=$(head -n 1 "$OLD_PATH")
if [ "$FIRST_LINE" != "$SHEBANG" ]; then
  sed -i "1s|^|$SHEBANG\n|" "$OLD_PATH"
fi

# если старая версия существует — удалить
if [ -f "$NEW_PATH" ]; then
  rm -f "$NEW_PATH"
fi

# атомарная замена
mv "$OLD_PATH" "$NEW_PATH"
