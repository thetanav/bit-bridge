import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Trie "mo:base/Trie";

actor class BitFinance() = this {
  // Helper for tuple key equality
  func principalTupleEqual(a: (Principal,), b: (Principal,)) : Bool {
    Principal.equal(a.0, b.0)
  }

  // Store user balances (in satoshis)
  stable var btcBalances : Trie.Trie<(Principal,), Nat> = Trie.empty();

  // Helper: get balance
  public query func getBalance(user: Principal) : async Nat {
    switch (Trie.get(btcBalances, (user,), principalTupleEqual)) {
      case (?bal) bal;
      case null 0;
    }
  };

  // Deposit BTC (simulated)
  public shared(msg) func deposit(amount: Nat) : async Text {
    let user = msg.caller;
    let current = switch (Trie.get(btcBalances, (user,), principalTupleEqual)) {
      case (?bal) bal;
      case null 0;
    };
    btcBalances := Trie.put(btcBalances, (user,), principalTupleEqual, current + amount).0;
    return "Deposited " # Nat.toText(amount) # " sats. New balance: " # Nat.toText(current + amount);
  };

  // Withdraw BTC (simulated)
  public shared(msg) func withdraw(amount: Nat) : async Text {
    let user = msg.caller;
    let current = switch (Trie.get(btcBalances, (user,), principalTupleEqual)) {
      case (?bal) bal;
      case null 0;
    };
    if (current < amount) {
      return "Insufficient balance.";
    } else {
      btcBalances := Trie.put(btcBalances, (user,), principalTupleEqual, current - amount).0;
      return "Withdrew " # Nat.toText(amount) # " sats. New balance: " # Nat.toText(current - amount);
    }
  };

  // Lend BTC (simulated)
  public shared(msg) func lend(amount: Nat) : async Text {
    // For demo: just deduct from balance
    let user = msg.caller;
    let current = switch (Trie.get(btcBalances, (user,), principalTupleEqual)) {
      case (?bal) bal;
      case null 0;
    };
    if (current < amount) {
      return "Insufficient balance to lend.";
    } else {
      btcBalances := Trie.put(btcBalances, (user,), principalTupleEqual, current - amount).0;
      return "Lent " # Nat.toText(amount) # " sats. (Simulated)";
    }
  };

  // Borrow BTC (simulated)
  public shared(msg) func borrow(amount: Nat) : async Text {
    // For demo: just add to balance
    let user = msg.caller;
    let current = switch (Trie.get(btcBalances, (user,), principalTupleEqual)) {
      case (?bal) bal;
      case null 0;
    };
    btcBalances := Trie.put(btcBalances, (user,), principalTupleEqual, current + amount).0;
    return "Borrowed " # Nat.toText(amount) # " sats. (Simulated)";
  };

  // Yield farming (simulated)
  public shared(msg) func yieldFarm() : async Text {
    // For demo: just return a message
    return "Yield farming rewards distributed! (Simulated)";
  };
}