'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Display movements

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov} 💶</div></div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Display Balance

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} 💶`;
};

// Display summary

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} 💶`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)} 💶`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest} 💶`;
};

// Create Username

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(e => e[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// Event handler

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Upate UI
    updateUI(currentAccount);
  }
});

// Transfer
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  // Clear input field
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

// Request Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movements
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);

    // Clear input fields
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
  }
});

// Close account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  // Clear input fields
  inputClosePin.value = inputCloseUsername.value = '';
  inputClosePin.blur();
});

// Sort

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Array Methods Practice

// 1
// const bankDepositSum = accounts.map(acc => acc.movements).flat();
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);
// console.log(bankDepositSum);

// 2
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(acc => acc > 1000).length;
// console.log(numDeposits1000);

const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  // .reduce((acc, cur) => (cur >= 1000 ? acc + 1 : acc), 0);
  .reduce((acc, cur) => (cur >= 1000 ? ++acc : acc), 0);
// console.log(numDeposits1000);

// 3
const { deposit: d, withdrawals: w } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sum, cur) => {
      // cur > 0 ? (sum.deposit += cur) : (sum.withdrawals += cur);
      sum[cur > 0 ? 'deposit' : 'withdrawals'] += cur;
      return sum;
    },
    { deposit: 0, withdrawals: 0 }
  );
console.log(d, w);

// 4
/*
const convertTitleCase = function (title) {
  const exception = ['a', 'an', 'but', 'and', 'with', 'the', 'in', 'or', 'on'];
  const convert = title
    .toLowerCase()
    .split(' ')
    .map((word, _, arr) =>
      exception.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(' ');
  return convert;
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));
*/
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/*
const arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.push('g'));
console.log(arr);
// console.log(arr.slice(1, 2));
// console.log(arr.splice(1, 2));
// console.log(arr);

const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);
const letters = arr.concat(arr2);
// console.log(arr);
// console.log(letters);
// console.log([...arr, ...arr2]);

// console.log(arr.join('-'));
*/

/*
const arr = [1, 2, 3];

console.log(arr[0]);
console.log(arr.at(0));
console.log(arr.at(-1));
console.log(arr.slice(-1)[0]);

const text = 'giahoa';
console.log(text.at(-1));

const arr1 = [1, 2, 3, -3, -2, -1];
console.log(Math.abs(arr1.at(-1)));

const random = Math.trunc(Math.random() * 5);
console.log(random);
*/

/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}You deposited ${movement} `);
  } else {
    console.log(`Movement ${i + 1}You withdrew ${Math.abs(movement)}`);
  }
}

console.log('---- forEach ----');
movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`Movement ${i + 1}You deposited ${mov} `);
  } else {
    console.log(`Movement ${i + 1}You withdrew ${Math.abs(mov)}`);
  }
  console.log(arr);
});
*/

/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

// set
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
currenciesUnique.forEach(function (value, _, set) {
  console.log(`${value}: ${value}`);
});
*/

// const julia = [3, 5, 2, 12, 7];
// const kate = [4, 1, 15, 8, 3];

// // 1
// const checkDogs = function (dogsJulia, dogsKate) {
//   console.log(dogsJulia.slice(1, 3));
// };
// checkDogs(julia, kate);

// // 2
// const arr = julia.concat(kate);
// console.log(arr);

// arr.forEach(function (value, i, arr) {
//   if (value >= 3)
//     console.log(`Dog number ${i + 1} is an adult, and is ${value} years old`);
//   else console.log(`Dog number ${i + 1} is still a puppy`);
// });

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const euroToUsd = 1.1;

// const movementsUSD = movements.map(function (mov) {
// return mov * euroToUsd;
// });

// const movementsUSD = movements.map(mov => mov * euroToUsd);
// console.log(movements);
// console.log(movementsUSD);

// const movementsUSDfor = [];
// for (const mov of movements) {
//   const num = mov * euroToUsd;
//   movementsUSDfor.push(num);
// }
// console.log(movementsUSDfor);

// const movementsDescript = movements.map((mov, i, arr) => {
//   if (mov > 0) {
//     return `Movement ${i + 1} You deposited ${mov} `;
//   } else {
//     return `Movement ${i + 1} You withdrew ${Math.abs(mov)}`;
//   }
// });
// console.log(movementsDescript);

// const movementsDescript = movements.map(
//   (mov, i, arr) =>
//     `Movement ${i + 1} You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       mov
//     )}`
// );
// console.log(movementsDescript);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/*
const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(movements);
console.log(deposits);

const depositsFor = [];
for (const mov of movements) if (mov > 0) depositsFor.push(mov);
console.log(depositsFor);

// const withdrawals = movements.filter(mov => mov < 0);
const withdrawals = movements.filter(function (mov) {
  return mov < 0;
});
console.log(withdrawals);
*/

// const balance = movements.reduce(function (acc, cur, i, arr) {
//   // console.log(`Iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 0);
// console.log(balance);
// const balance = movements.reduce((acc, cur) => acc + cur, 0);
// console.log(balance);

// let sum = 0;
// for (const mov of movements) {
//   sum += mov;
// }
// console.log(sum);
// console.log(movements);
// const max = movements.reduce((acc, mov, i) => {
//   console.log(`Iteration ${i}: Acc ${acc}, Mov ${mov}`);
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);
// console.log(max);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const euroToUsd = 1.1;
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map((mov, i, arr) => {
//     // console.log(arr);
//     return mov * euroToUsd;
//   })
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);

/*
const testData1 = [5, 2, 4, 1, 15, 8, 3];
const testData2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = function (ages) {
  const calcAvarage = ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
  return calcAvarage;
};
console.log(calcAverageHumanAge(testData1));
console.log(calcAverageHumanAge(testData2));
*/

/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const firstWithdrawals = movements.find(mov => mov < 0);
// console.log(firstWithdrawals);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

for (const acc of accounts) {
  if (acc.owner === 'Jessica Davis') {
    console.log(acc);
    break;
  }
}
*/

// const arr = [1, 2, 5, 10, 11, 2];
// arr.splice(2); // [5, 10, 11, 2]
// arr.splice(2, 1); // [1, 2, 10, 11, 2]
// arr.splice(2, 1, 3); //[1, 2, 3, 10, 11, 2]
// arr.splice(2, 2, 3); //[1, 2, 3, 11, 2]
// arr.splice(2, 2, 3, 2); //[1, 2, 3, 2, 11, 2]
// console.log(arr);

/*
const movements = [200, 450, 400, -3000, 650, 130, 70, 1300];

console.log(movements);
console.log(movements.some(mov => mov > 0));
// console.log(movements.every(mov => mov > 0));

// const deposit = mov => mov > 0;
// console.log(movements.every(deposit));

const arr = [1, 2, -3, 5];
console.log(arr.every(arr => arr > 0));
console.log(arr.some(arr => arr > 0));
*/

// const allMovements = accounts.map(acc => acc.movements);
// console.log(allMovements);
// console.log(new Map(allMovements));
// const flat = allMovements.flat();
// console.log(flat);
// const reduce = flat.reduce((acc, mov) => acc + mov, 0);
// console.log(reduce);

// const overall = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overall);
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);
// Ascending

// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (b > a) return -1;
// });
// console.log(movements);

movements.sort((a, b) => a - b);

console.log(movements);

// Descending
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (b > a) return 1;
// });
// console.log(movements);

movements.sort((a, b) => a + b);
console.log(movements);
*/

/*
// String

const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());
console.log(owners); // Change original

// Number
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements.sort());
// Ascending
movements.sort((a, b) => {
  if (a > b) return 1; // switch order
  if (a < b) return -1; // keep order
});
console.log(movements);

// Descending
movements.sort((a, b) => {
  if (a < b) return 1; // switch order
  if (a > b) return -1; // keep order
});
console.log(movements);
*/

/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// Ascending
movements.sort((a, b) => a - b);
console.log(movements);

// Descending
movements.sort((a, b) => b - a);
console.log(movements);
*/

// const x = new Array(7);
// console.log(x); // empty value
// x.fill(7, 2, 5); // fill 7
// console.log(x);

/*
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 100 }, (_, i) => i + 1);
console.log(z);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('💶', ''))
  );
  console.log(movementsUI.reduce((acc, mov) => acc + mov, 0));

  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
});
*/

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('💶', ''))
//   );
//   console.log(movementsUI);
// });

// const arrNum = [-1, 3, -5, -6, 1];
// console.log(arrNum.sort());

const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const exception = ['a', 'an', 'but', 'and', 'with', 'the', 'in', 'or', 'on'];

  const convert = title
    .toLowerCase()
    .split(' ')
    .map(word => (exception.includes(word) ? word : capitalize(word)))
    .join(' ');
  return convert;
};
console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));
