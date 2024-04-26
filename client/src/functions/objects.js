import { generateRandom } from "./common";

export function findChangedFields(newRow, oldRow) {
  const changedFields = [];

  for (const key in oldRow) {
    if (oldRow.hasOwnProperty(key) && newRow.hasOwnProperty(key)) {
      if (oldRow[key] !== newRow[key]) {
        changedFields.push({
            id: generateRandom(4, "numeric"),
            name: key,
            oldValue: oldRow[key],
            newValue: newRow[key],
        });
      }
    }
  }
  return changedFields;
}