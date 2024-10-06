import { Ability, AbilityBuilder } from "@casl/ability";

export const defineRulesFor = (user) => {
  const { can, rules } = new AbilityBuilder(Ability);

  switch (user.role) {
    case "cat_sitter":
      // Cat sitter có thể quản lý các dịch vụ, hồ sơ của họ và xem các yêu cầu từ khách hàng
      can("manage", "Service");
      can("update", "Profile");
      can("view", "BookingRequests");
      break;
    case "user":
      // User có thể xem và đặt dịch vụ, cũng như cập nhật hồ sơ của họ
      can("view", "Service");
      can("create", "Booking");
      can("update", "Profile");
      break;
    default:
      // Xử lý trường hợp role không xác định, có thể không có quyền
      break;
  }

  return rules;
};
