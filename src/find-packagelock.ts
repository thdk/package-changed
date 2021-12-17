import path from 'path';
import fs from 'fs';

export const findPackagelock = (
    { cwd }: { cwd: string } = {
        cwd: process.cwd(),
    },
): string | undefined => {
    let current = cwd;
    let last = current;
    do {
        const search = path.join(current, 'package-lock.json');
        if (fs.existsSync(search)) {
            return search;
        }
        last = current;
        current = path.dirname(current);
    } while (current !== last);
};
