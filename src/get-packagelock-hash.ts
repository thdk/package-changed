import crypto from 'crypto';
import fs from 'fs';

export const getPackagelockHash = (packagelockPath?: string): string | undefined => {
    if (!packagelockPath) return;
    const hashSum = crypto.createHash('md5');
    const contents = fs.readFileSync(packagelockPath, 'utf-8');
    const packageBlob = JSON.parse(contents);

    delete packageBlob.name;
    delete packageBlob['packages']?.['']?.name;
    delete packageBlob.version;
    delete packageBlob['packages']?.['']?.version;
    const fileJson = JSON.stringify(packageBlob);
    hashSum.update(Buffer.from(fileJson));
    return hashSum.digest('hex');
};
