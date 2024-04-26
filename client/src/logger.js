
let logging = true;
let loggingType = "log";

export default function logger(string, string2, string3){
    if (logging) {
        if (string3) {
            console[loggingType](string, string2, string3);
        }
        else if (string2) {
            console[loggingType](string, string2);
        }
        else{
            console[loggingType](string);
        }
    }
}