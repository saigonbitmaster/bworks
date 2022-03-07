import lodash from 'lodash';
import appMenu from '../../menu/employeeApp';

// const hasDeep = (object, ...keys) => {
//   let tmpObject = { ...object };
//   let stack = [...Object.keys(object)];
//   let seen = keys.map(key => ({ [key]: false })).reduce((acc, val) => ({ ...acc, ...val }), {});
//   while (stack.length > 0) {
//     const examinedKey = stack.pop();
//     if (lodash.has(seen, examinedKey)) {
//       seen[examinedKey] = true;
//     } else {
//       const pointedValue = tmpObject[examinedKey];
//       if (typeof pointedValue === 'object' && !Array.isArray(pointedValue)) {
//         stack = stack.concat(Object.keys(pointedValue));
//         tmpObject = pointedValue;
//       }
//     }
//   }

//   if (Object.values(seen).every(flag => flag)) {
//     return true;
//   } else {
//     return false;
//   }
// };

const openParentPermissionScreen = switchedIndex => {
  const secondPermissionScreen = lodash.compact(
    lodash.uniq(switchedIndex.map(index => index.slice(0, index.lastIndexOf('.')))),
  );
  const firstPermissionScreen = lodash.compact(
    lodash.uniq(secondPermissionScreen.map(index => index.slice(0, index.lastIndexOf('.')))),
  );

  return lodash.concat(secondPermissionScreen, firstPermissionScreen);
};

const hasRecurringAccess = screen => {
  const subFunction = (screen, count) => {
    if (!screen.menu) {
      return count;
    } else {
      return subFunction(screen.menu, count + 1);
    }
  };

  const result = subFunction(screen, 1);

  if (result === 1) {
    return false;
  } else {
    return true;
  }
};

const buildTreeFromIndex = indices => {
  const tree = {};
  const [firstChildren, rest] = lodash.partition(indices, index => index.lastIndexOf('.') !== -1);

  for (let child of rest) {
    lodash.setWith(tree, child, {}, Object);
  }

  for (let child of firstChildren) {
    lodash.setWith(tree, child, {}, Object);
  }

  return tree;
};

const buildTreeFromFlattenedObject = (firstLetter, flattenedObject) => {
  const flattenedObjectKeys = Object.keys(flattenedObject);
  const tree = buildTreeFromIndex(flattenedObjectKeys);

  for (let key of flattenedObjectKeys) {
    const examinedValue = lodash.get(tree, key);
    const trueValue = lodash.get(flattenedObject, key);
    if (lodash.isEmpty(examinedValue)) {
      lodash.set(tree, key, trueValue);
    }
  }

  const treeTraverse = (tree, index, aggregation) => {
    if (typeof tree === 'boolean') {
      aggregation[index] = tree;
      return tree;
    } else {
      const subTrees = Object.entries(tree).map(([stree, streeValue]) => {
        if (index === '') {
          return treeTraverse(streeValue, `${stree}`, aggregation);
        } else {
          return treeTraverse(streeValue, `${index}.${stree}`, aggregation);
        }
      });
      const parentIsSwitched = subTrees.every(stree => stree);
      if (index !== '') {
        aggregation[index] = parentIsSwitched;
      }
      return parentIsSwitched;
    }
  };

  const newSwitchStatus = {};
  treeTraverse(tree, '', newSwitchStatus);

  return newSwitchStatus;
};

// const triggerParentSwitch = indices => {
//   const tree = buildTreeFromIndex(indices);

//   const switchedParents = [];

//   /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
//   while (true) {
//     let prefixesAndFollowers = lodash.groupBy(indices, i => i.slice(0, i.lastIndexOf('.')));

//     indices = Object.keys(prefixesAndFollowers);

//     if (lodash.isEmpty(lodash.compact(indices))) {
//       break;
//     }

//     for (let key of indices) {
//       const de = lodash.keys(lodash.get(tree, key));
//       if (!lodash.isEmpty(de)) {
//         switchedParents.push(key);
//       }
//     }
//   }

//   return switchedParents;
// };

const gatherAPIs = (access, name, index) => {
  if (!lodash.isEmpty(access)) {
    const filter = Object.entries(access).filter(([_, value]) => !lodash.isEmpty(value));
    // console.log('filter: ', filter, access, name, index);
    // console.log(
    //   'filter.map',
    //   filter.map(([functionName, { apis = [], icon, label }], subIndex) => ({
    //     access: apis.map(api => ({ ...api, functionName })),
    //     name,
    //     label,
    //     icon,
    //     index: `${index}.${subIndex}`,
    //     parentIndex: index,
    //   })),
    // );
    // console.log(
    //   'return: ',
    //   filter
    //     .map(([functionName, { apis = [], icon, label }], subIndex) => ({
    //       access: apis.map(api => ({ ...api, functionName })),
    //       name,
    //       label,
    //       icon,
    //       index: `${index}.${subIndex}`,
    //       parentIndex: index,
    //     }))
    //     .filter(obj => obj.access && obj.label && obj.icon),
    // );
    return Object.entries(access)
      .filter(([_, value]) => !lodash.isEmpty(value)) // eslint-disable-line
      .map(([functionName, { apis = [], icon, label }], subIndex) => ({
        access: apis.map(api => ({ ...api, functionName })),
        name,
        label,
        icon,
        index: `${index}.${subIndex}`,
        parentIndex: index,
      }))
      .filter(obj => obj.access && obj.label && obj.icon);
  } else {
    return [];
  }
};

// const createNestedList = menu => {
//   const f = (menuList, aggregation, prefix = '-1') => {
//     let newIndex = '';
//     let parentIndex = prefix;
//     for (let index = 0; index < menuList.length; index++) {
//       const screen = menuList[index];
//       const screenMenu = screen.menu;
//       const screenInfo = {};
//       newIndex = prefix !== '-1' ? `${prefix}.${index}` : `${index}`;
//       screenInfo.index = newIndex;
//       screenInfo.label = screen.label;
//       screenInfo.icon = screen.icon;
//       screenInfo.name = screen.name;
//       screenInfo.parentIndex = parentIndex;
//       const screenAccessKeys = Object.keys(screen.access || {});
//       if (!hasRecurringAccess(screen) && screenAccessKeys.length === 1 && screenAccessKeys[0] === 'view') {
//         // Push APIs into the screenInfo
//         screenInfo.access = Object.values(screen.access.view)[0].map(data => ({ ...data, functionName: 'view' }));
//         aggregation.push(screenInfo);
//       } else {
//         screenInfo.hasChild = true;
//         aggregation.push(screenInfo);
//         if (screen.access) {
//           if (lodash.values(screen.access).filter(apis => !lodash.isEmpty(apis)).length > 0) {
//             const gatheredAPIs = gatherAPIs(screen.access, screen.name, newIndex);
//             gatheredAPIs.forEach(gatheredAPI => aggregation.push(gatheredAPI));
//           }
//         }
//       }
//       if (screenMenu && Array.isArray(screenMenu)) {
//         screenInfo.hasChild = true;
//         f(screenMenu, aggregation, newIndex);
//       }
//     }
//   };

//   const aggregation = [];

//   f(menu, aggregation, '-1');

//   return aggregation;
// };

const createFlatList = menu => {
  const { screens, access } = appMenu;
  const permittedScreens = menu.filter(({ name }) => screens.includes(name));
  const formatedList = permittedScreens.map((screen, index) => {
    const { active, url, screens, name, ...temp } = screen;
    return { ...temp, index: `${index}`, parentIndex: '-1', name, access: access[name] || {} };
  });
  return formatedList;
};

export {
  openParentPermissionScreen,
  hasRecurringAccess,
  buildTreeFromIndex,
  buildTreeFromFlattenedObject,
  gatherAPIs,
  createFlatList,
};
