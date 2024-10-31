import { Ability, AbilityBuilder } from "@casl/ability";

export const defineRulesFor = (user) => {
  const { can, rules } = new AbilityBuilder(Ability);

  const userRole = user?.roles?.[0]?.name;

  console.log("User role in defineRulesFor:", userRole);

  switch (userRole) {
    case "SITTER":
      can("manage", "Service");
      can("update", "Profile");
      can("view", "BookingRequests");
      break;
    case "USER":
      can("view", "Service");
      can("create", "Booking");
      can("update", "Profile");
      break;
    default:
      console.log("Unknown role:", userRole);
      break;
  }

  return rules;
};
