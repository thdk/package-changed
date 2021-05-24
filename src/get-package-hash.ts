import crypto from 'crypto';
import fs from 'fs';

export const getPackageHash = (packagePath: string): string => {
    const hashSum = crypto.createHash('md5');
    const lockFilePath = packagePath.replace('package.json', 'yarn.lock');
    let contents;
    try {
        contents = fs.readFileSync(lockFilePath, 'utf-8');
    } catch (e) {
        console.error('cant read ' + lockFilePath);
        throw e;
    }
    // const packageBlob = JSON.parse(contents);

    // const dependencies = {
    //     dependencies: packageBlob['dependencies'] || {},
    //     devDependencies: packageBlob['devDependencies'] || {},
    // };
    // const depsJson = JSON.stringify(dependencies);
    hashSum.update(Buffer.from(contents));
    return hashSum.digest('hex');
};
