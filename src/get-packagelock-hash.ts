import crypto from 'crypto';
import fs from 'fs';

export const getPackagelockHash = (packagelockPath?: string): string | undefined => {
    if (!packagelockPath) return;
    const hashSum = crypto.createHash('md5');

    // read package-lock.json
    const contents = fs.readFileSync(packagelockPath, 'utf-8');

    // parse it
    const packageBlob = JSON.parse(contents);

    // exclude name and version of the main package from the hash
    delete packageBlob.name;
    delete packageBlob['packages']?.['']?.name;
    delete packageBlob.version;
    delete packageBlob['packages']?.['']?.version;

    // calculate hash
    const fileJson = JSON.stringify(packageBlob);
    hashSum.update(Buffer.from(fileJson));
    return hashSum.digest('hex');
};
