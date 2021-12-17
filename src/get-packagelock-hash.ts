import crypto from 'crypto';
import fs from 'fs';

export const getPackagelockHash = (packagelockPath?: string): string | undefined => {
    if (!packagelockPath) return;
    const hashSum = crypto.createHash('md5');
    const contents = fs.readFileSync(packagelockPath, 'utf-8');
    hashSum.update(Buffer.from(contents));
    return hashSum.digest('hex');
};
