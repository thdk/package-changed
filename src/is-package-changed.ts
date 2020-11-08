import fs from 'fs';
import path from 'path';
import { findPackage } from './find-package';
import { getPackageHash } from './get-package-hash';

interface PackageChangedResult {
    hash: string;
    oldHash: string | undefined;
    writeHash(): void;
    isChanged: boolean;
}

const isPackageChanged = ({
    hashFilename = '.packagehash',
    cwd = process.cwd(),
}: {
    hashFilename?: string;
    cwd?: string;
} = {}): PackageChangedResult => {
    const packagePath = findPackage({ cwd });
    if (!packagePath) {
        throw new Error('Cannot find package.json. Travelling up from current working directory.');
    }

    const packageHashPath = path.join(cwd, hashFilename);
    const writeHash = (hash: string | undefined) =>
        hash && fs.writeFileSync(packageHashPath, hash, {});

    const packageHashPathExists = fs.existsSync(packageHashPath);
    const recentDigest = getPackageHash(packagePath);
    const previousDigest = packageHashPathExists && fs.readFileSync(packageHashPath, 'utf-8');

    // if the hash file doesn't exist
    // or if it does and the hash is different
    const isChanged = !packageHashPathExists || previousDigest !== recentDigest;

    return {
        hash: recentDigest,
        isChanged,
        oldHash: previousDigest || undefined,
        writeHash: writeHash.bind(null, recentDigest),
    };
};

export default isPackageChanged;
