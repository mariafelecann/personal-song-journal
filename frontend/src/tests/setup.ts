// import matchers from '@testing-library/jest-dom/matchers';
// import matchers from '@testing-library/jest-dom/vitest';
// import {expect} from 'vitest';
// import '@testing-library/jest-dom/vitest';
// import {expect} from 'vitest';
// expect.extend(matchers);
import {expect} from 'vitest';

expect.extend({
    toBeFoo(received, expected) {
        const {isNot} = this;
        return {
            // do not alter your "pass" based on isNot. Vitest does it for you
            pass: received === 'foo',
            message: () => `${received} is${isNot ? ' not' : ''} foo`,
        };
    },
});
