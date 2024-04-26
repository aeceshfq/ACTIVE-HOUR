function ShopifyPagination(header) {
    if(typeof header === "undefined") return undefined;
    if(header === null) return undefined;
    return header.split(',').reduce(reducer, {});
}
function reducer(a, cur) {
    const pieces = cur.trim().split(';');
    let uri = pieces[0].trim().slice(1, -1);
    const rel = pieces[1].trim().slice(4);
    if (rel === '"next"') a.nextPage = uri;
    else a.previousPage = uri;
    return a;
}

module.exports = ShopifyPagination;