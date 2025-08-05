export async function sendMessageToUgaXRP(message: string): Promise<string> {
  try {
    const response = await fetch("/api/uga-xrp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to get response from Uga XRP");
    }

    const data = await response.json();
    return data.response || "King! The jungle signals are crossed right now, but Uga's wisdom flows eternal.";
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("King! The digital vines are tangled, but the jungle remembers all. Swing back soon!");
  }
}

export async function sendMessageToMidnightOracle(message: string): Promise<string> {
  try {
    const response = await fetch("/api/midnight-oracle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to get response from Midnight Oracle");
    }

    const data = await response.json();
    return data.response || "System reset complete. Awaiting new configuration.";
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("System reset complete. Awaiting new configuration.");
  }
}