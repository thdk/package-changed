import crypto from 'crypto';
import fs from 'fs';

export const getPackageHash = (packagePath: string) => {
    const hashSum = crypto.createHash('md5');
    const contents = fs.readFileSync(packagePath, 'utf-8');
    const packageBlob = JSON.parse(contents);

    const dependencies = {
        dependencies: packageBlob['dependencies'] || {},
        devDependencies: packageBlob['devDependencies'] || {},
    };
    const depsJson = JSON.stringify(dependencies);
    hashSum.update(Buffer.from(depsJson));
    return hashSum.digest('hex');
};
