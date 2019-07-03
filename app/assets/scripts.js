'use strict';

// import { tools, stuff } from './dep';

function main() {
    tools();
    stuff();

    fetch(document.getElementById('app').dataset.apiUrl + '/api')
        .then(result => {
            console.log(result);
            return result.json();
        })
        .then(result => {
            console.log(result);
        });
}
main();
