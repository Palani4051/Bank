class BackAccount {
    constructor() {
        this.accounts = {};
    }

    openAccount(name, gender, dob, email, mobile, address, initialBalance, adharNo, panNo) {
        if (this.accounts[name]) {
            return "Account with this name already exists.";
        }
        this.accounts[name] = {
            name,
            gender,
            dob,
            email,
            mobile,
            address,
            balance: initialBalance,
            adharNo,
            panNo,
            isOpen: true,
            ledger: []
        };
        this.accounts[name].ledger.push({ type: 'OPEN_ACCOUNT', amount: initialBalance, balance: initialBalance });
        return "Account opened successfully.";
    }

    updateKYC(name, dob, email, mobile, adharNo, panNo) {
        const account = this.accounts[name];
        if (!account || !account.isOpen) {
            return "Account does not exist or is closed.";
        }
        account.dob = dob;
        account.email = email;
        account.mobile = mobile;
        account.adharNo = adharNo;
        account.panNo = panNo;
        return "KYC details updated successfully.";
    }

    depositMoney(name, amount) {
        const account = this.accounts[name];
        if (!account || !account.isOpen) {
            return "Account does not exist or is closed.";
        }
        if (amount <= 0) {
            return "Invalid amount.";
        }
        account.balance += amount;
        account.ledger.push({ type: 'DEPOSIT', amount, balance: account.balance });
        return "Money deposited successfully.";
    }

    withdrawMoney(name, amount) {
        const account = this.accounts[name];
        if (!account || !account.isOpen) {
            return "Account does not exist or is closed.";
        }
        if (amount <= 0 || amount > account.balance) {
            return "Invalid amount or insufficient funds.";
        }
        account.balance -= amount;
        account.ledger.push({ type: 'WITHDRAWAL', amount, balance: account.balance });
        return "Money withdrawn successfully.";
    }

    transferMoney(fromName, toName, amount) {
        const fromAccount = this.accounts[fromName];
        const toAccount = this.accounts[toName];
        if (!fromAccount || !fromAccount.isOpen || !toAccount || !toAccount.isOpen) {
            return "One or both accounts do not exist or are closed.";
        }
        if (amount <= 0 || amount > fromAccount.balance) {
            return "Invalid amount or insufficient funds.";
        }
        fromAccount.balance -= amount;
        toAccount.balance += amount;
        fromAccount.ledger.push({ type: 'TRANSFER_OUT', toName, amount, balance: fromAccount.balance });
        toAccount.ledger.push({ type: 'TRANSFER_IN', fromName, amount, balance: toAccount.balance });
        return "Money transferred successfully.";
    }

    receiveMoney(toName, fromName, amount) {
        const toAccount = this.accounts[toName];
        const fromAccount = this.accounts[fromName];
        if (!toAccount || !toAccount.isOpen || !fromAccount || !fromAccount.isOpen) {
            return "One or both accounts do not exist or are closed.";
        }
        if (amount <= 0 || amount > fromAccount.balance) {
            return "Invalid amount or insufficient funds.";
        }
        fromAccount.balance -= amount;
        toAccount.balance += amount;
        fromAccount.ledger.push({ type: 'TRANSFER_OUT', toName, amount, balance: fromAccount.balance });
        toAccount.ledger.push({ type: 'TRANSFER_IN', fromName, amount, balance: toAccount.balance });
        return "Money received successfully.";
    }

    printStatement(name) {
        const account = this.accounts[name];
        if (!account || !account.isOpen) {
            return "Account does not exist or is closed.";
        }
        let statement = `Account Statement for ${name}\n`;
        statement += `Name: ${account.name}\n`;
        statement += `Gender: ${account.gender}\n`;
        statement += `Date of Birth: ${account.dob}\n`;
        statement += `Email: ${account.email}\n`;
        statement += `Mobile: ${account.mobile}\n`;
        statement += `Address: ${account.address}\n`;
        statement += `Balance: ${account.balance}\n`;
        statement += `Aadhaar No: ${account.adharNo}\n`;
        statement += `PAN No: ${account.panNo}\n`;
        statement += `Transactions:\n`;
        account.ledger.forEach(entry => {
            statement += `  ${entry.type}: ${entry.amount} | Balance: ${entry.balance}\n`;
        });
        return statement;
    }

    closeAccount(name) {
        const account = this.accounts[name];
        if (!account || !account.isOpen) {
            return "Account does not exist or is already closed.";
        }
        account.isOpen = false;
        return "Account closed successfully.";
    }
}

// Create an instance of BackAccount to be used in the HTML interface
const bank = new BackAccount();

// HTML interface
document.addEventListener('DOMContentLoaded', () => {
    const openAccountForm = document.getElementById('openAccountForm');
    const updateKYCForm = document.getElementById('updateKYCForm');
    const depositMoneyForm = document.getElementById('depositMoneyForm');
    const withdrawMoneyForm = document.getElementById('withdrawMoneyForm');
    const transferMoneyForm = document.getElementById('transferMoneyForm');
    const receiveMoneyForm = document.getElementById('receiveMoneyForm');
    const printStatementForm = document.getElementById('printStatementForm');
    const closeAccountForm = document.getElementById('closeAccountForm');
    const output = document.getElementById('output');

    openAccountForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(openAccountForm);
        const data = Object.fromEntries(formData.entries());
        const result = bank.openAccount(data.name, data.gender, data.dob, data.email, data.mobile, data.address, parseFloat(data.initialBalance), data.adharNo, data.panNo);
        output.textContent = result;
    });

    updateKYCForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(updateKYCForm);
        const data = Object.fromEntries(formData.entries());
        const result = bank.updateKYC(data.name, data.dob, data.email, data.mobile, data.adharNo, data.panNo);
        output.textContent = result;
    });

    depositMoneyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(depositMoneyForm);
        const data = Object.fromEntries(formData.entries());
        const result = bank.depositMoney(data.name, parseFloat(data.amount));
        output.textContent = result;
    });

    withdrawMoneyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(withdrawMoneyForm);
        const data = Object.fromEntries(formData.entries());
        const result = bank.withdrawMoney(data.name, parseFloat(data.amount));
        output.textContent = result;
    });

    transferMoneyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(transferMoneyForm);
        const data = Object.fromEntries(formData.entries());
        const result = bank.transferMoney(data.fromName, data.toName, parseFloat(data.amount));
        output.textContent = result;
    });

    receiveMoneyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(receiveMoneyForm);
        const data = Object.fromEntries(formData.entries());
        const result = bank.receiveMoney(data.toName, data.fromName, parseFloat(data.amount));
        output.textContent = result;
    });

    printStatementForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(printStatementForm);
        const data = Object.fromEntries(formData.entries());
        const result = bank.printStatement(data.name);
        output.textContent = result;
    });

    closeAccountForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(closeAccountForm);
        const data = Object.fromEntries(formData.entries());
        const result = bank.closeAccount(data.name);
        output.textContent = result;
    });
});
