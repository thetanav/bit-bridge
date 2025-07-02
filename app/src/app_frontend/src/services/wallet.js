import { HttpAgent } from "@dfinity/agent";

const whitelist = ["your-canister-id"]; // replace with your actual canister ID

export const connectPlug = async () => {
  if (window.ic && window.ic.plug) {
    const isConnected = await window.ic.plug.requestConnect({
      whitelist,
    });

    if (isConnected) {
      const agent = new HttpAgent();
      const principal = await window.ic.plug.agent.getPrincipal();
      return { principal: principal.toText(), agent };
    } else {
      throw new Error("Connection rejected by user");
    }
  } else {
    throw new Error("Plug wallet not installed");
  }
};
