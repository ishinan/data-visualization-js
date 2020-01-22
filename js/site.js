console.log('Hello...')


// Default Currencies
let currencies = ['USD', 'HKD', 'AUD', 'GBP', 'CNY'];
let selectedCurrencies= {};



// Create a button 
const createSelectBtn = currency => {
    let btn = document.createElement("button");
    btn.textContent = currency;
    btn.addEventListener('click', ()=> {
        console.log("Clicked");
    });
    return btn;
}

const createSelectBtnAll = allCurrencies => {
    console.log('createSlectBtnAll');
    let listBox = document.querySelector('#list-box');
    for (const cur of Object.keys(allCurrencies)){
        let selectBtn = createSelectBtn(cur);
        listBox.appendChild(selectBtn);
    }
}

// Create a bar
const createBar = (srcCurrency, srcRate, ceiling) => {
    let chart = document.querySelector('#chart-location');
    // full hight is 220 px right now
    // let height = 70;
    const maxHeight = 220;
    let height = maxHeight / ceiling * srcRate;
    let bar = document.createElement("div");
    bar.classList.add("BarChart-bar");
    bar.style.height = height + "px";
    bar.textContent = `${srcCurrency}: ${srcRate.toFixed(2)}`;
    bar.addEventListener('click', () => { alert(`${srcCurrency}: ${srcRate}`) } )
    chart.appendChild(bar);
};

// Create a Bar in a chart frame 
const createGraph = (rateMap, ceiling) => {
    console.log("In createGraph...")
    for ( const [ k, v ] of Object.entries(rateMap)) {
        createBar(k, v, ceiling);
    }
};





let exchangeRates = "";
let exchangeBase = "";
let exchangeDate = "";

// API
url="https://api.exchangeratesapi.io/latest";
fetch(url)
.then(res => res.json())
.then(fetchedData => {
    console.log('fetch...');
    exchangeRates = fetchedData.rates;
    exchangeBase = fetchedData.base;
    exchangeDate = fetchedData.date;

    // console.log(exchangeRates);
    // console.log(exchangeBase);
    // console.log(exchangeDate);
    // for (const [key, value] of Object.entries(exchangeRates)) {
    //         console.log(`${key}: ${value}`);
    // }

    createSelectBtnAll(exchangeRates);

    let largest = 1;
    for (const i of currencies) {
        selectedCurrencies[i] = exchangeRates[i];

        if (exchangeRates[i] > largest) {
            largest = exchangeRates[i];
        }
    }

    console.log(`RateMap: ${selectedCurrencies}`);
    console.log(`Largest: ${largest}`);

    createGraph(selectedCurrencies, largest);
});
