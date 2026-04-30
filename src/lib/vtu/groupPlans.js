export function groupPlans(plans) {
  const grouped = {};

  plans.forEach(plan => {
    const network = plan.network.toLowerCase();

    if (!grouped[network]) {
      grouped[network] = {
        "7_days": [],
        "1_3_days": [],
        "30_days": []
      };
    }

    const name = plan.name.toLowerCase();

    if (name.includes("30 days")) {
      grouped[network]["30_days"].push(plan);
    } 
    else if (name.includes("7 days")) {
      grouped[network]["7_days"].push(plan);
    } 
    else {
      grouped[network]["1_3_days"].push(plan);
    }
  });

  return grouped;
}