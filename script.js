console.log('Hello World!');

// Don't Submit form on Enter Button Click

document.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
  }
});

// Multiple Step Navigation and Paging indicator
let stepBoxElems = document.querySelectorAll('[data-step]');
let pagingElems = document.querySelectorAll('.paging');

// Function to change the step and paging indicator taking the destination step
function changeStep(destinationStep) {
  let index = destinationStep - 1;

  for (let i = 0; i < stepBoxElems.length; i++) {
    stepBoxElems[i].classList.remove('active');
    if (pagingElems[i]) {
      pagingElems[i].classList.remove('active');
    }
  }

  stepBoxElems[index].classList.add('active');
  if (pagingElems[index]) {
    pagingElems[index].classList.add('active');
  }
}

// Validating Input Elements and Setting or Removing error messages
// Input elements and Regex -
let nameInput = document.getElementById('name');
let emailInput = document.getElementById('email');
let phoneInput = document.getElementById('phone');

let namePattern = /^[A-Za-z\s]+$/;
let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
let phonePattern = /^\d{10}$/;

// Functions for validation and error messages -
function setError(input, message) {
  input.classList.add('error');
  input.parentNode.querySelector('.error-msg').innerHTML = message;
}

function removeError(input) {
  input.classList.remove('error');
  input.parentNode.querySelector('.error-msg').innerHTML = '';
}

function validateInput(input, pattern, errorMessage, isRequired = true) {
  input.value = input.value.trim();
  let value = input.value.trim();

  if (isRequired == true && value == '') {
    setError(input, 'This field is required');
  } else if (!pattern.test(value)) {
    setError(input, errorMessage);
  } else {
    removeError(input);
    return true;
  }

  return false;
}

// Each change step button and changing the steps

let step1_2Btn = document.getElementById('step1_2');
let step2_1Btn = document.getElementById('step2_1');
let step2_3Btn = document.getElementById('step2_3');
let step3_2Btn = document.getElementById('step3_2');
let step3_4Btn = document.getElementById('step3_4');
let step4_3Btn = document.getElementById('step4_3');
let confirm_btn = document.getElementById('confirm_btn');
let changePlanLink = document.getElementById('change_plan_link');
let addAddOnsBtn = document.getElementById('add_add_ons');

// Step 1 to 2 - Validate inputs then change
step1_2Btn.addEventListener('click', function () {
  let errorArr = [];

  // Pushing all name and email and Phone num Verification in error Array
  errorArr.push(
    validateInput(nameInput, namePattern, 'Enter valid full name.')
  );
  errorArr.push(
    validateInput(emailInput, emailPattern, 'Enter valid email address.')
  );
  errorArr.push(
    validateInput(phoneInput, phonePattern, 'Enter valid phone number.')
  );

  // Storing if not any error then go to next step
  let hasFalse = errorArr.includes(false);
  // console.log(!hasFalse);

  if (!hasFalse) {
    changeStep(2);
  }
});

// Navigate through other Steps hence and forth
step2_1Btn.addEventListener('click', function () {
  changeStep(1);
});

step2_3Btn.addEventListener('click', function () {
  changeStep(3);
});

step3_2Btn.addEventListener('click', function () {
  changeStep(2);
});

step3_4Btn.addEventListener('click', function () {
  changeStep(4);
});

step4_3Btn.addEventListener('click', function () {
  changeStep(3);
});

confirm_btn.addEventListener('click', function (e) {
  e.preventDefault();
  changeStep(5);
  pagingElems[pagingElems.length - 1].classList.add('active');
});

changePlanLink.addEventListener('click', function () {
  changeStep(2);
});

addAddOnsBtn.addEventListener('click', function () {
  changeStep(3);
});

// Populating prices on Plan and Add ons.
// The prices must be changed according to plan on the frontend and even in the JSON.

// Invoice Elements
let invoicePlanNameElem = document.getElementById('invoice_plan_name');
let invoicePlanTypeElem = document.getElementById('invoice_plan_type');
let invoicePlanPriceElem = document.getElementById('invoice_plan_price');
let invoiceAddOnsListElem = document.getElementById('invoice_add_ons_list');
let invoiceTotalPlanTypeElem = document.getElementById(
  'invoice_total_plan_type'
);
let invoiceTotalElem = document.getElementById('invoice_total');

// Subscription Data and Order Summary

let subscriptionInfo = {
  isYearly: false,
  selectedPlan: 'arcade',
  plansPrices: {},
  addOnPrices: {},
};

let orderSummary = {
  planName: 'arcade',
  planType: '(monthly)',
  totalPlanType: 'month',
  planPrice: 9,
  addOns: [{ name: 'Online Service', price: 1 }],
  total: 10,
};

function priceFormat(price, element = null, prefix = '') {
  price = prefix + price + '';
  price = subscriptionInfo.isYearly ? price + '/yr' : price + '/mo';
  if (element != null) {
    element.innerHTML = price;
  }
  return price;
}

function updatePricesByType() {
  let multiplier = subscriptionInfo.isYearly ? 10 : 1;

  subscriptionInfo.plansPrices = {
    arcade: 9 * multiplier,
    advanced: 12 * multiplier,
    pro: 15 * multiplier,
  };

  subscriptionInfo.addOnPrices = {
    service: 1 * multiplier,
    storage: 2 * multiplier,
    profile: 2 * multiplier,
  };

  let addOnsPriceList = [];

  if (subscriptionInfo.isYearly) {
    addOnsPriceList = [10, 20, 20];
  } else {
    addOnsPriceList = [1, 2, 2];
  }

  orderSummary.planPrice =
    subscriptionInfo.plansPrices[orderSummary.planName] || 0;

  orderSummary.addOns.forEach((element) => {
    switch (element.name) {
      case 'Online Service':
        element.price = addOnsPriceList[0];
        break;

      case 'Larger Storage':
        element.price = addOnsPriceList[1];
        break;

      case 'Customizable profile':
        element.price = addOnsPriceList[2];
        break;
    }
  });

  populatePrices();
  populateInvoice();
}

updatePricesByType();

function populatePrices() {
  let priceElems = document.querySelectorAll('[data-price]');
  let planPriceList = subscriptionInfo.plansPrices;
  let addOnPriceList = subscriptionInfo.addOnPrices;

  priceElems.forEach((element) => {
    switch (element.getAttribute('data-price').toLowerCase()) {
      case 'arcade':
        priceFormat(planPriceList.arcade, element, '$');
        break;

      case 'advanced':
        priceFormat(planPriceList.advanced, element, '$');
        break;

      case 'pro':
        priceFormat(planPriceList.pro, element, '$');
        break;

      case 'service':
        priceFormat(addOnPriceList.service, element, '+$');
        break;

      case 'storage':
        priceFormat(addOnPriceList.storage, element, '+$');
        break;

      case 'profile':
        priceFormat(addOnPriceList.profile, element, '+$');
        break;
    }
  });

  let yearlyOfferElems = document.querySelectorAll('.yearlyOffer');

  let offerStr = subscriptionInfo.isYearly ? '2 Months Free' : '';

  yearlyOfferElems.forEach((element) => {
    element.innerHTML = offerStr;
  });
}

populatePrices();

// Switch Yearly or Monthly Plan Type using the Switch Button
// This results in changing the prices of -
// Plans (Arcade, Advanced and Pro), Add ons (Services, Storage and Profile), Invoicing.

let switchMonthlyBtn = document.getElementById('switch_monthly');
let planTypeSwitch = document.getElementById('plan_type_switch');
let switchYearlyBtn = document.getElementById('switch_yearly');

function switchPlanTypes() {
  subscriptionInfo.isYearly = planTypeSwitch.classList.toggle('on');
  switchMonthlyBtn.classList.toggle('active', !subscriptionInfo.isYearly);
  switchYearlyBtn.classList.toggle('active', subscriptionInfo.isYearly);

  choosePlanType();
}

planTypeSwitch.addEventListener('click', function () {
  switchPlanTypes();
});

switchMonthlyBtn.addEventListener('click', function () {
  if (subscriptionInfo.isYearly) {
    switchPlanTypes();
  }
});

switchYearlyBtn.addEventListener('click', function () {
  if (!subscriptionInfo.isYearly) {
    switchPlanTypes();
  }
});

// Making Plan and Add on Selections
// User can choose 1 among 3 Plans from Radios
// And 1 to 3 Add ons from Checkboxes

// Choosing Plan
let planArcadeRadio = document.getElementById('plan_arcade');
let planAdvancedRadio = document.getElementById('plan_advanced');
let planProRadio = document.getElementById('plan_pro');

function choosePlanType() {
  orderSummary.planType = subscriptionInfo.isYearly ? '(Yearly)' : '(Monthly)';
  orderSummary.totalPlanType = subscriptionInfo.isYearly ? 'year' : 'month';

  updatePricesByType();
}

function choosePlan(event) {
  orderSummary.planName = event.target.value;
  orderSummary.planPrice =
    subscriptionInfo.plansPrices[orderSummary.planName] || 0;

  populateInvoice();
}

planArcadeRadio.addEventListener('change', choosePlan);
planAdvancedRadio.addEventListener('change', choosePlan);
planProRadio.addEventListener('change', choosePlan);

// Selecting Add Ons
let addOnServiceChk = document.getElementById('add_on_service');
let addOnStorageChk = document.getElementById('add_on_storage');
let addOnProfileChk = document.getElementById('add_on_profile');

function selectAddOns(event) {
  let value = event.target.value;
  let isChecked = event.target.checked;
  let addOnPrice = subscriptionInfo.addOnPrices;
  let addOnList = orderSummary.addOns;

  if (isChecked) {
    switch (value) {
      case 'Online Service':
        addOnList.unshift({ name: value, price: addOnPrice.service });
        break;

      case 'Larger Storage':
        addOnList.splice(1, 0, { name: value, price: addOnPrice.storage });
        break;

      case 'Customizable profile':
        addOnList.push({ name: value, price: addOnPrice.profile });
        break;
    }
  } else {
    addOnList.forEach((element, index) => {
      if (element.name == value) {
        addOnList.splice(index, 1);
      }
    });
  }

  populateInvoice();
}

addOnServiceChk.addEventListener('change', selectAddOns);
addOnStorageChk.addEventListener('change', selectAddOns);
addOnProfileChk.addEventListener('change', selectAddOns);

// Creating Invoice having information -
// Plan Name, Plan Type, Plan Price, Add Ons (Name + Price) and Total

function populateInvoice() {
  let addOnTotal = 0;

  orderSummary.addOns.forEach((element) => {
    addOnTotal += element.price;
  });

  orderSummary.total = orderSummary.planPrice + addOnTotal;

  invoicePlanNameElem.innerHTML = orderSummary.planName;
  invoicePlanTypeElem.innerHTML = orderSummary.planType;
  invoiceTotalPlanTypeElem.innerHTML = orderSummary.totalPlanType;
  priceFormat(orderSummary.total, invoiceTotalElem, '$');
  priceFormat(orderSummary.planPrice, invoicePlanPriceElem, '$');

  // Populating Add Ons
  invoiceAddOnsListElem.innerHTML = '';

  if (orderSummary.addOns.length == 0) {
    addAddOnsBtn.style.display = 'block';
  } else {
    orderSummary.addOns.forEach((element) => {
      let row = document.createElement('div');
      row.className = 'row';
      row.innerHTML = `
            <span>${element.name}</span>
            <span class="invoice-add-on-price">${priceFormat(
              element.price,
              null,
              '+$'
            )}</span>
            `;

      invoiceAddOnsListElem.appendChild(row);
      addAddOnsBtn.style.display = 'none';
    });
  }
}
