
console.log('Hello');

// Default Currencies
const baseCurrencies = ['CAD','HKD','ISK','PHP','DKK','HUF','CZK','AUD','RON','SEK','IDR','INR','BRL','RUB','HRK','JPY','THB','CHF','SGD','PLN','BGN','TRY','CNY','NOK','NZD','ZAR','USD','MXN','ILS','GBP','KRW','MYR','EUR'];
let currencies = ['USD', 'HKD', 'AUD', 'GBP', 'CNY'];
let baseCurrency = 'EUR';

// Create a Base Selection 
const createBaseCurrencyBtn = bases => {
    const baseSelectBtn = document.createElement('select');
    for (const base of bases){
        const baseOption = document.createElement('option');
        baseOption.value = base;
        baseOption.textContent = base;
        if (base === baseCurrency) {
            baseOption.selected = true;
        }
        baseSelectBtn.appendChild(baseOption);
    }
    const baseSelectElement = document.getElementById('base-selection')
    baseSelectElement.appendChild(baseSelectBtn);
    baseSelectElement.addEventListener('change', event => {
        baseCurrency = event.target.value;
        console.log(baseCurrency);

        updateBarChart(); 
    })
};


// Create a button and update the chart 
const createSelectBtn = currency => {
    let btn = document.createElement("button");
    btn.textContent = currency;
    if (currencies.includes(currency)) {
        btn.classList.add("btn--selected");
    }
    btn.addEventListener('click', ()=> {
        console.log(`Clicked button ${currency}`);
        btn.classList.toggle("btn--selected");
        if (btn.className === 'btn--selected') {
            currencies.push(currency);
            currencies = [...new Set(currencies)];
        } else {
            currencies = currencies.filter(val =>  val !== currency);
        }
        console.log(currencies);
        updateBarChart();
    });
    return btn;
}

// Create all buttons
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
    const maxHeight = 240;
    let height = maxHeight / ceiling * srcRate;
    let bar = document.createElement("div");
    bar.classList.add("BarChart-bar");
    bar.style.height = height + "px";
    bar.textContent = `${srcCurrency}: ${srcRate.toFixed(2)}`;
    bar.addEventListener('click', () => { 
        alert(`${srcCurrency}: ${srcRate}`) 
    } )
    chart.appendChild(bar);
};

// Create a Bar in a chart frame 
const createGraph = (rateMap, ceiling) => {
    // First clear the existing chart
    let chart = document.querySelector('#chart-location');
    chart.innerHTML = '';

    console.log("In createGraph...")
    for ( const [ k, v ] of Object.entries(rateMap)) {
        createBar(k, v, ceiling);
    }
};

let exchangeRates = "";
let exchangeBase = "";
let exchangeDate = "";

const updateBarChart = () => {

    url=`https://api.exchangeratesapi.io/latest?base=${baseCurrency}`;
    fetch(url)
    .then(res => res.json())
    .then(fetchedData => {
        console.log('fetch...');
        exchangeRates = fetchedData.rates;
        exchangeBase = fetchedData.base;
        exchangeDate = fetchedData.date;
        exchangeRates[baseCurrency] = 1.0;

        // Create Select Buttons if they do not exist 
        const listOfCountries = document.getElementById('list-box');
        if (! listOfCountries.children[0]) {
            createSelectBtnAll(exchangeRates);
        }

        // clean the content first
        let selectedCurrencies = {};
        // find the largest currency Rate among the selected currencies
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
};

createBaseCurrencyBtn(baseCurrencies) 
updateBarChart()