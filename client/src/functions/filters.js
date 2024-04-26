import ColumnsJson from "../components/ColumnsJson";

export function renderCondition(condition){
    let c = "";
    switch (condition) {
        case "contains":
            c = "*_";
            break;
        case "not_contains":
            c = "not*_";
            break;
        case "eq":
            c = "";
            break;
        case "gt":
            c = ">";
            break;
        case "lt":
            c = "<";
            break;
    
        default:
            c = "";
            break;
    }
    return c;
}

export function renderConditionView(condition){
    let c = "";
    switch (condition) {
        case "contains":
            c = "contains: ";
            break;
        case "not_contains":
            c = "not contains:";
            break;
        case "eq":
            c = "";
            break;
        case "gt":
            c = ">";
            break;
        case "lt":
            c = "<";
            break;
    
        default:
            c = "";
            break;
    }
    return c;
}

export function visible_columns_initial(){
    let a = {};
    try {
        a = ColumnsJson().reduce((acc, obj) => {
            const { field } = obj;
            if (field) {
                acc[field] = true;
            }
            return acc;
        }, {});
    } catch (error) {
        console.error(error);
    }
    return a;
}