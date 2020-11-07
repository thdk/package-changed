import fs from 'fs';
import path from 'path';
import { findPackage } from './find-package';
import { getPackageHash } from './get-package-hash';

const isPackageChanged = ({ hashFilename = '.packagehash' } = {}) => {
    const packagePath = findPackage();
    const writeHash = (hash: string | undefined) => hash && fs.writeFileSync(packageHashPath, hash);

    if (!packagePath) {
        throw new Error('Cannot find package.json. Travelling up from current working directory.');
    }

    const packageHashPath = path.join(path.dirname(packagePath), hashFilename);
    const packageHashPathExists = fs.existsSync(packageHashPath);
    const recentDigest = getPackageHash(packagePath);
    const previousDigest = packageHashPathExists && fs.readFileSync(packageHashPath, 'utf-8');

    // if the hash file doesn't exist
    // or if it does and the hash is different
    const isChanged = !packageHashPathExists || previousDigest !== recentDigest;

    return {
        hash: isChanged && recentDigest,
        isChanged,
        newHash: recentDigest,
        oldHash: previousDigest,
        writeHash: writeHash.bind(null, recentDigest),
    };
};

export default isPackageChanged;
