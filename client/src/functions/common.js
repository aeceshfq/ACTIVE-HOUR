
export const getInitial = (name) => {
    var i = name.charAt(0).toUpperCase();
    return i;
}

export function findObjectByCategoryId(data, categoryId, marketplaceId) {
    const masterObject = {
        categories: [],
        categoryTreeId: null,
        applicableMarketplaceIds: null,
        marketplaceName: null,
        marketplaceId: null,
        categoryId: categoryId
    };

    function getCategoryRecursive(categoryId, categoryNode) {
        if (!categoryNode || !categoryNode.category) {
            return null;
        }

        if (categoryNode.category.categoryId === categoryId) {
            return categoryNode;
        }

        if (categoryNode?.childCategoryTreeNodes) {
            for (const childNode of categoryNode.childCategoryTreeNodes) {
                const foundCategory = getCategoryRecursive(categoryId, childNode);
                if (foundCategory) {
                    return foundCategory;
                }
            }
        }

        return null;
    }

    function getParentCategoryIdFromHref(href) {
        const queryString = href.split("?")[1];
        const params = new URLSearchParams(queryString);
        return params.get("category_id");
    }


    function buildMasterObject(categoryId) {
        for (const entry of data) {
            if (entry.marketplaceName !== marketplaceId) continue;
            const categoryNode = getCategoryRecursive(categoryId, entry.rootCategoryNode);
            if (categoryNode) {
                masterObject.applicableMarketplaceIds = entry.applicableMarketplaceIds;
                masterObject.categoryTreeId = entry.categoryTreeId;
                masterObject.marketplaceId = entry.marketplaceId;
                masterObject.marketplaceName = entry.marketplaceName;
                var mobject = {...categoryNode.category, ...{
                    categoryTreeNodeLevel: categoryNode.categoryTreeNodeLevel,
                    parentCategoryTreeNodeHref: categoryNode.parentCategoryTreeNodeHref,
                    leafCategoryTreeNode: categoryNode?.leafCategoryTreeNode
                }}
                masterObject.categories.push(mobject);
                if (categoryNode.categoryTreeNodeLevel !== 0) {
                    const prevCategoryId = getParentCategoryIdFromHref(categoryNode.parentCategoryTreeNodeHref);
                    buildMasterObject(prevCategoryId);
                }
            }
        }
    }

    buildMasterObject(categoryId);
    masterObject.categories = sortByCategoryTreeNodeLevel(masterObject.categories);
    return masterObject;
}

function sortByCategoryTreeNodeLevel(data) {
    return data.slice().sort((a, b) => a.categoryTreeNodeLevel - b.categoryTreeNodeLevel);
}

export function generateRandom(length, type, uppercase) {
    let charset = '';

    if (type === 'alpha') {
        charset = 'abcdefghijklmnopqrstuvwxyz';
    } else if (type === 'numeric') {
        charset = '0123456789';
    } else {
        charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    }

    if (uppercase) {
        charset = charset.toUpperCase();
    }

    let result = '';
    for (let i = 0; i < length; i++) {
        result += charset[Math.floor(Math.random() * charset.length)];
    }
    return type === 'numeric' ? StringToNumber(result):result;
}

export function reverseWords(inputString) {
  // Split the string into an array of words
  const wordsArray = inputString.split(" ");
  
  // Reverse the array
  const reversedArray = wordsArray.reverse();
  
  // Join the array back into a string
  const reversedString = reversedArray.join(" ");
  
  return reversedString;
}

export function formatFileSize(bytes) {
    if (bytes === 0 || !bytes) return '0 Bytes';

    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

export function abbreviateNumber(value = 0) {
  const suffixes = ["", "K", "M", "B", "T"];
  let suffixNum = 0;

  while (value >= 1000 && suffixNum < suffixes.length - 1) {
    value /= 1000;
    suffixNum++;
  }

  // Use toFixed to ensure a specific number of decimal places (e.g., 2)
  return Number(value.toFixed(2)).toString() + suffixes[suffixNum];
}

export function convertCamelCaseToWords(camelCaseKey) {
  // Use a regular expression to split the camelCase key into words
  const words = String(camelCaseKey).split(/(?=[A-Z])/);

  // Capitalize the first letter of each word and join them with a space
  const fullKey = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return fullKey;
}

export function capitalizeText(inputText) {
  // Split the text into words
  const words = inputText.split(' ');

  // Capitalize the first letter of each word
  const capitalizedWords = words.map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the words back into a sentence
  const capitalizedText = capitalizedWords.join(' ');

  return capitalizedText;
}

export function StringToNumber(string = "", precision = 2){
    return ParseNumber(string, 0, precision);
}

export function ParseNumber(value, default_value = 0, fixed = null){
    let a = String(value).replace(/[^0-9.-]/g, "");
    if (fixed === null && a.indexOf(".") > -1) {
        fixed = String(a.split(".")?.[1]).length;
    }
    if (!isNaN(fixed)) {
        a = Number(a).toFixed(fixed);
    }
    if (!isNaN(a)) {
        return Number(a);
    }
    return Number(default_value??0);
}

export function moneyFormat(number, currency = "$ "){
    return `${currency}${ParseNumber(number, 0, 2)}`
}
