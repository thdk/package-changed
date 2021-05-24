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

interface PackageChangedOptions {
    hashFilename?: string;
    cwd?: string;
}

interface PackageChangedCallback {
    (result: Omit<PackageChangedResult, 'writeHash'>): Promise<boolean | undefined>;
}

async function isPackageChanged(options?: PackageChangedOptions): Promise<PackageChangedResult>;

async function isPackageChanged(
    options?: PackageChangedOptions,
    callback?: PackageChangedCallback,
): Promise<PackageChangedResult | Omit<PackageChangedResult, 'writeHash'>>;

async function isPackageChanged(
    options: PackageChangedOptions = {},
    callback?: PackageChangedCallback,
): Promise<PackageChangedResult | Omit<PackageChangedResult, 'writeHash'>> {
    const { hashFilename = '.packagehash', cwd = process.cwd() } = options;
    const packagePath = findPackage({ cwd });
    if (!packagePath) {
        throw new Error('Cannot find yarn.lock. Crawled up from current working directory: ' + cwd);
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

    const result = {
        hash: recentDigest,
        isChanged,
        oldHash: previousDigest || undefined,
    };

    if (callback) {
        let canWriteHash = await callback(result);
        if (canWriteHash === undefined) {
            canWriteHash = process.env.CI !== 'true';
        }
        if (canWriteHash) {
            writeHash(recentDigest);
        }
    }

    return {
        ...result,
        writeHash: writeHash.bind(null, recentDigest),
    };
}

export default isPackageChanged;
