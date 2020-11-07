import path from 'path';
import fs from 'fs';

export const findPackage = () => {
    let current = process.cwd();
    let last = current;
    do {
        const search = path.join(current, 'package.json');
        if (fs.existsSync(search)) {
            return search;
        }
        last = current;
        current = path.dirname(current);
    } while (current !== last);
};
