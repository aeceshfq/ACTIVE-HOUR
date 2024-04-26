const SIZE_NAMES = String(process.env.VARIANT_OPTION_SIZE_NAME).split(",");
const COLOR_NAMES = String(process.env.VARIANT_OPTION_COLOR_NAME).split(",");

function replaceGermanCharacters(word) {
    const replacements = {
        'Ä': 'A',
        'Ö': 'O',
        'Ü': 'U',
        'ä': 'a',
        'ö': 'o',
        'ü': 'u',
        'ß': 's'
    };

    return word.replace(/[ÄÖÜäöüß]/g, match => replacements[match] || match);
}


function hasDefaultVariant(product){
    let options = product?.options ?? [];
    if (options.length === 1) {
        if (options?.[0]?.name === "Title" && options?.[0]?.position === 1) {
            return true;
        }
    }
    return false;
}

function hasOnlyColorOption(product){
    let options = product?.options ?? [];
    if (options.length === 1) {
        if (hasColor(options?.[0]?.name) && options?.[0]?.position === 1) {
            return true;
        }
    }
    return false;
}

function getColorOption(product, variant){
    let options = product?.options ?? [];
    let color = "NON";
    if (variant && options.length) {
        for (let index = 0; index < options.length; index++) {
            const option = options[index];
            if (hasColor(option?.name)) {
                color = variant?.[`option${option?.position}`];
                color = extractOptionCode(color);
                break;
            }
        }
    }
    return color;
}

function hasSize(name){
    return SIZE_NAMES.findIndex(x => String(x).toLowerCase() === String(name).toLowerCase()) > -1;
}

function hasColor(name){
    return COLOR_NAMES.findIndex(x => String(x).toLowerCase() === String(name).toLowerCase()) > -1;
}

function getSizeOption(product, variant){
    let options = product?.options ?? [];
    let size = "";
    if (variant && options.length) {
        for (let index = 0; index < options.length; index++) {
            const option = options[index];
            if (hasSize(option?.name)) {
                size = variant?.[`option${option?.position}`]?.toUpperCase();
                break;
            }
        }
    }
    // if there is no size available for secondary option then take other options
    if (!size) {
        return getOtherOptionCode(product, variant);
    }

    return extractOptionCode(size);
}

function getOtherOptionCode(product, variant){
    let options = product?.options ?? [];
    let code = "";
    if (variant && options.length) {
        let words = "";
        for (let index = 0; index < options.length; index++) {
            const option = options[index];
            if (!hasSize(option?.name) && !hasColor(option?.name)) {
                words += `${variant?.[`option${option?.position}`]} `;
            }
        }
        code = extractOptionCode(words.trim());
    }
    
    return code;
}

function hasSizeOption(product){
    let options = product?.options ?? [];
    let has_size_option = false;
    for (let index = 0; index < options.length; index++) {
        const option = options[index];
        if (hasSize(option?.name)) {
            has_size_option = true;
            break;
        }
    }
    return has_size_option;
}

function hasOnlyColorOption(product){
    let options = product?.options ?? [];
    if (options.length === 1) {
        if (hasColor(options?.[0]?.name) && options?.[0]?.position === 1) {
            return true;
        }
    }
    return false;
}

function extractOptionCode(optionValue) {
    // Replace German characters with English equivalents
    optionValue = replaceGermanCharacters(optionValue);

    // Remove special characters from the color name
    optionValue = optionValue.replace(/[^a-zA-Z0-9\/ ]/g, '');

    // Split the color name into words separated by "/" or space
    const words = optionValue.split(/[\/\s]+/);

    let code = '';
    // If there's only one word, take the first three characters
    if (words.length === 1) {
        code = words[0].substring(0, 3).toUpperCase();
    }
    else if (words.length === 2) {
        if (words[0].length === 1) {
            // If 1st word contains only 1 digit, take that and from 2nd word take 2 digits
            code = words[0].toUpperCase() + words[1].substring(0, 2).toUpperCase();
        }
        else{
            // If 1st word has more than 1 character, take 2 digits from 1st word and 1 digit from 2nd word
            code = words[0].substring(0, 2).toUpperCase() + words[1].substring(0, 1).toUpperCase();
        }
    }
    else if (words.length >= 3) {
        // If there are three words, take 1 digit from each word
        for (let i = 0; i < 3; i++) {
            code += words[i].substring(0, 1).toUpperCase();
        }
    }

    return code;
}

function primaryOption(product, variant) {
    // primary option will be always color
    return getColorOption(product, variant);
}

function secondaryOption(product, variant) {
    let options = product?.options ?? [];
    let defaultVariant = hasDefaultVariant(product);
    let onlyColor = hasOnlyColorOption(product);
    if (defaultVariant || onlyColor) { // if only default variant, or if has only color variant then return 1
        return 1;
    }
    if (hasSizeOption(product)) {
        return getSizeOption(product, variant);
    }
    return getOtherOptionCode(product, variant)
}

function convertToUpperCase(str) {
    if (!str) {
        return ""; // Return an empty string if str is falsy
    }
    return str.toUpperCase();
}


module.exports = {
    secondaryOption, primaryOption, convertToUpperCase
};