export const getFirstCharCap = (inputString: string) => {
     let capitalizedString = inputString.charAt(0).toUpperCase() + inputString.slice(1);
     return capitalizedString
}