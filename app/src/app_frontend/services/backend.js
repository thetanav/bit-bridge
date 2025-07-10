import { Actor, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";

// Candid interface for the backend canister
const idlFactory = ({ IDL }) => {
  return IDL.Service({
    get_balance: IDL.Func([IDL.Principal], [IDL.Nat64], ["query"]),
    deposit: IDL.Func([IDL.Nat64], [IDL.Text], []),
    withdraw: IDL.Func([IDL.Nat64], [IDL.Text], []),
    lend: IDL.Func([IDL.Nat64], [IDL.Text], []),
    borrow: IDL.Func([IDL.Nat64], [IDL.Text], []),
    yield_farm: IDL.Func([], [IDL.Text], []),
  });
};

// Get canister ID from environment or use local development ID
const canisterId =
  import.meta.env.VITE_CANISTER_ID_APP_BACKEND ||
  process.env.CANISTER_ID_APP_BACKEND ||
  "be2us-64aaa-aaaaa-qaabq-cai";

// Determine the host based on environment
const host =
  import.meta.env.VITE_DFX_NETWORK === "ic" || process.env.DFX_NETWORK === "ic"
    ? import.meta.env.VITE_IC_HOST || "https://ic0.app"
    : import.meta.env.VITE_HOST || "http://localhost:4943";

class BackendService {
  constructor() {
    this.agent = null;
    this.actor = null;
    this.authClient = null;
    this.isAuthenticated = false;
  }

  async initialize() {
    try {
      // Create auth client
      this.authClient = await AuthClient.create();

      // Create agent
      this.agent = new HttpAgent({
        host: host,
        identity: this.authClient.getIdentity(),
      });

      // Only fetch root key in local development
      if (
        import.meta.env.VITE_DFX_NETWORK !== "ic" &&
        process.env.DFX_NETWORK !== "ic"
      ) {
        await this.agent.fetchRootKey();
      }

      // Create actor
      this.actor = Actor.createActor(idlFactory, {
        agent: this.agent,
        canisterId: canisterId,
      });

      // Check if user is authenticated
      this.isAuthenticated = await this.authClient.isAuthenticated();

      console.log("Backend service initialized successfully");
      return true;
    } catch (error) {
      console.error("Failed to initialize backend service:", error);
      return false;
    }
  }

  async login() {
    try {
      if (!this.authClient) {
        await this.initialize();
      }

      return new Promise((resolve, reject) => {
        this.authClient.login({
          identityProvider:
            import.meta.env.VITE_DFX_NETWORK === "ic" ||
            process.env.DFX_NETWORK === "ic"
              ? "https://identity.ic0.app/#authorize"
              : `http://localhost:4943?canisterId=${import.meta.env.VITE_CANISTER_ID_INTERNET_IDENTITY || process.env.CANISTER_ID_INTERNET_IDENTITY}`,
          onSuccess: async () => {
            this.isAuthenticated = true;
            // Recreate agent with new identity
            this.agent = new HttpAgent({
              host: host,
              identity: this.authClient.getIdentity(),
            });

            if (
              import.meta.env.VITE_DFX_NETWORK !== "ic" &&
              process.env.DFX_NETWORK !== "ic"
            ) {
              await this.agent.fetchRootKey();
            }

            // Recreate actor with new agent
            this.actor = Actor.createActor(idlFactory, {
              agent: this.agent,
              canisterId: canisterId,
            });

            resolve(true);
          },
          onError: (error) => {
            console.error("Login failed:", error);
            reject(error);
          },
        });
      });
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async logout() {
    try {
      if (this.authClient) {
        await this.authClient.logout();
        this.isAuthenticated = false;

        // Recreate agent with anonymous identity
        this.agent = new HttpAgent({
          host: host,
        });

        if (
          import.meta.env.VITE_DFX_NETWORK !== "ic" &&
          process.env.DFX_NETWORK !== "ic"
        ) {
          await this.agent.fetchRootKey();
        }

        // Recreate actor with anonymous agent
        this.actor = Actor.createActor(idlFactory, {
          agent: this.agent,
          canisterId: canisterId,
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  async getPrincipal() {
    if (!this.authClient) {
      await this.initialize();
    }
    return this.authClient.getIdentity().getPrincipal();
  }

  // Backend canister methods
  async getBalance(principal) {
    try {
      if (!this.actor) {
        await this.initialize();
      }
      const balance = await this.actor.get_balance(principal);
      return Number(balance);
    } catch (error) {
      console.error("Error getting balance:", error);
      throw error;
    }
  }

  async deposit(amount) {
    try {
      if (!this.actor) {
        await this.initialize();
      }
      if (!this.isAuthenticated) {
        throw new Error("User must be authenticated to deposit");
      }
      const result = await this.actor.deposit(BigInt(amount));
      return result;
    } catch (error) {
      console.error("Error depositing:", error);
      throw error;
    }
  }

  async withdraw(amount) {
    try {
      if (!this.actor) {
        await this.initialize();
      }
      if (!this.isAuthenticated) {
        throw new Error("User must be authenticated to withdraw");
      }
      const result = await this.actor.withdraw(BigInt(amount));
      return result;
    } catch (error) {
      console.error("Error withdrawing:", error);
      throw error;
    }
  }

  async lend(amount) {
    try {
      if (!this.actor) {
        await this.initialize();
      }
      if (!this.isAuthenticated) {
        throw new Error("User must be authenticated to lend");
      }
      const result = await this.actor.lend(BigInt(amount));
      return result;
    } catch (error) {
      console.error("Error lending:", error);
      throw error;
    }
  }

  async borrow(amount) {
    try {
      if (!this.actor) {
        await this.initialize();
      }
      if (!this.isAuthenticated) {
        throw new Error("User must be authenticated to borrow");
      }
      const result = await this.actor.borrow(BigInt(amount));
      return result;
    } catch (error) {
      console.error("Error borrowing:", error);
      throw error;
    }
  }

  async yieldFarm() {
    try {
      if (!this.actor) {
        await this.initialize();
      }
      if (!this.isAuthenticated) {
        throw new Error("User must be authenticated to yield farm");
      }
      const result = await this.actor.yield_farm();
      return result;
    } catch (error) {
      console.error("Error yield farming:", error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const backendService = new BackendService();

export default backendService;
