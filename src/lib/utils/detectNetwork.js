export function detectNetwork(phone) {
  if (!phone || phone.length < 4) return null;

  const prefix = phone.substring(0, 4);

  const mtn = [
    "0803","0806","0813","0816","0810","0814","0903","0906","0913","0916","0706"
  ];

  const airtel = [
    "0802","0808","0812","0701","0708","0902","0907","0912"
  ];

  const glo = [
    "0805","0807","0811","0815","0705","0905"
  ];

  const nineMobile = [
    "0809","0817","0818","0908","0909"
  ];

  if (mtn.includes(prefix)) return "mtn";
  if (airtel.includes(prefix)) return "airtel";
  if (glo.includes(prefix)) return "glo";
  if (nineMobile.includes(prefix)) return "9mobile";

  return null;
}