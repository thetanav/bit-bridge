use std::cell::RefCell;
use std::collections::HashMap;

use candid::{candid_method, Principal};
use ic_cdk::api::caller;
use ic_cdk_macros::{query, update};


thread_local! {
    static BALANCES: RefCell<HashMap<Principal, u64>> = RefCell::new(HashMap::new());
}

#[query]
#[candid_method(query)]
fn get_balance(user: Principal) -> u64 {
    BALANCES.with(|b| *b.borrow().get(&user).unwrap_or(&0))
}

#[update]
#[candid_method(update)]
fn deposit(amount: u64) -> String {
    let user = caller();
    BALANCES.with(|b| {
        let mut balances = b.borrow_mut();
        let entry = balances.entry(user).or_insert(0);
        *entry += amount;
        format!(
            "Deposited {} sats. New balance: {}",
            amount, *entry
        )
    })
}

#[update]
#[candid_method(update)]
fn withdraw(amount: u64) -> String {
    let user = caller();
    BALANCES.with(|b| {
        let mut balances = b.borrow_mut();
        let balance = balances.entry(user).or_insert(0);
        if *balance < amount {
            "Insufficient balance.".to_string()
        } else {
            *balance -= amount;
            format!(
                "Withdrew {} sats. New balance: {}",
                amount, *balance
            )
        }
    })
}

#[update]
#[candid_method(update)]
fn lend(amount: u64) -> String {
    let user = caller();
    BALANCES.with(|b| {
        let mut balances = b.borrow_mut();
        let balance = balances.entry(user).or_insert(0);
        if *balance < amount {
            "Insufficient balance to lend.".to_string()
        } else {
            *balance -= amount;
            format!("Lent {} sats. (Simulated)", amount)
        }
    })
}

#[update]
#[candid_method(update)]
fn borrow(amount: u64) -> String {
    let user = caller();
    BALANCES.with(|b| {
        let mut balances = b.borrow_mut();
        let entry = balances.entry(user).or_insert(0);
        *entry += amount;
        format!("Borrowed {} sats. (Simulated)", amount)
    })
}

#[update]
#[candid_method(update)]
fn yield_farm() -> String {
    "Yield farming rewards distributed! (Simulated)".to_string()
}

#[cfg(test)]
mod tests {
    // Optional: Add unit tests here
}

