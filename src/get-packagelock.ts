import path from 'path';

export const getPackagelock = ({ packagePath }: { packagePath: string }): string | undefined => {
    return path.join(path.dirname(packagePath), 'package-lock.json');
};
