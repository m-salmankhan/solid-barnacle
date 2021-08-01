"use strict";
const init = require('../src/init');
test('hasBin for non-existent tool', () => {
    init
        .hasBin('thisToolDoesNotExist')
        .then((res) => expect(res).toBe(false));
});
//# sourceMappingURL=init.test.js.map