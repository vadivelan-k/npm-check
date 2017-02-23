import _ from 'lodash';
import path from 'path';
import globalModulesPath from 'global-modules';
import readPackageJson from '../in/read-package-json';
import globalPackages from '../in/get-installed-packages';
import { enabled } from '../out/emoji';

/* eslint promise/avoid-new: 1 */

export default function init(currentState, userOptions) {
  return new Promise((resolve, reject) => {
    _.each(userOptions, (value, key) => currentState.set(key, value));

    if (currentState.get('global')) {
      currentState.set('cwd', globalModulesPath);
      currentState.set('nodeModulesPath', globalModulesPath);
      currentState.set('globalPackages', globalPackages(globalModulesPath));
    } else {
      const cwd = path.resolve(currentState.get('cwd'));
      const pkg = readPackageJson(path.join(cwd, 'package.json'));
      currentState.set('cwdPackageJson', pkg);
      currentState.set('cwd', cwd);
      currentState.set('nodeModulesPath', path.join(cwd, 'node_modules'));
    }

    enabled(currentState.get('emoji'));

    if (currentState.get('cwdPackageJson').error) {
      return reject(currentState.get('cwdPackageJson').error);
    }

    return resolve(currentState);
  });
}