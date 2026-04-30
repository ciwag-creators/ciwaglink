export function detectNetwork(phone) {
  if (!phone) return null;

  // normalize
  let cleaned = phone.replace(/\s+/g, "");

  if (cleaned.startsWith("+234")) {
    cleaned = "0" + cleaned.slice(4);
  }

  if (cleaned.length < 4) return null;

  const prefix = cleaned.slice(0, 4);

  const prefixes = {
    mtn: ["0803","0806","0703","0706","0810","0813","0814","0816","0903","0906"],
    airtel: ["0802","0808","0708","0812","0902","0907","0901","07010"],
    glo: ["0805","0807","0705","0811","0905"],
    "9mobile": ["0809","0817","0818","0909","0908"]
  };

  for (let net in prefixes) {
    if (prefixes[net].includes(prefix)) {
      return net;
    }
  }

  return null;
}