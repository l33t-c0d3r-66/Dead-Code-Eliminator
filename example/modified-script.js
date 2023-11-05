const testUsedFunction = () => {
    console.log('Used Function');
};
testUsedFunction();
function add(number1, number2) {
    return number1 + number2;
}
function multiply(number1, number2) {
    return number1 * number2;
}
multiply(1, 2);
const tester = () => {
    multiply(add(1 + 2), 3);
};
tester();