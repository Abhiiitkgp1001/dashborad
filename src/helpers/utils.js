export function mean(numbers) {
    for(var i=0;i<numbers.length;i++){
        numbers[i] = parseFloat(numbers[i].toString());
    }
    var total = 0, i;
    for (i = 0; i < numbers.length; i += 1) {
        total += numbers[i];
    }
    return total / numbers.length;
}
 
export function median(numbers) {
    // median of [3, 5, 4, 4, 1, 1, 2, 3] = 3
    for(var i=0;i<numbers.length;i++){
        numbers[i] = parseFloat(numbers[i].toString());
    }
    var median = 0, numsLen = numbers.length;
    numbers.sort();
 
    if (
        numsLen % 2 === 0 // is even
    ) {
        // average of two middle numbers
        median = (numbers[numsLen / 2 - 1] + numbers[numsLen / 2]) / 2;
    } else { // is odd
        // middle number only
        median = numbers[(numsLen - 1) / 2];
    }
 
    return median;
}
 
export function mode(numbers) {
    var modes = [], count = [], i, number, maxIndex = 0;
    for(var i=0;i<numbers.length;i++){
        numbers[i] = parseFloat(numbers[i].toString());
    }
    for (i = 0; i < numbers.length; i += 1) {
        number = numbers[i];
        count[number] = (count[number] || 0) + 1;
        if (count[number] > maxIndex) {
            maxIndex = count[number];
        }
    }
 
    for (i in count)
        if (count.hasOwnProperty(i)) {
            if (count[i] === maxIndex) {
                modes.push(Number(i));
            }
        }
 
    return modes;
}

export function standardDeviation(arr) {
    for(var i=0;i<arr.length;i++){
        arr[i] = parseFloat(arr[i].toString());
    }
    const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
    return Math.sqrt(
        arr.reduce((acc, val) => acc.concat((val - mean) ** 2), []).reduce((acc, val) => acc + val, 0) /
        (arr.length)
    );
};

export function convertDate(date){

    const seconds = date / 1000;
    const dt = new Date(seconds * 1000).toISOString(); 
    return dt;
}