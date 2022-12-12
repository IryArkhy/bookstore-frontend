module.exports = {
    singleQuote: true,
    semi: true,
    printWidth: 100,
    trailingComma: 'all',
    arrowParens: 'always',
    importOrder: ['<THIRD_PARTY_MODULES>', '^(../)', '^(./)'],
    importOrderSeparation: true,
    importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
    importOrderSortSpecifiers: true,
  };