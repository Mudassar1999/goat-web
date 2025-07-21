export const RoleName = (roleId: number) => {
     const roleName = roleId === 1 ? "Player"
          : roleId === 2 ? "coach"
               : roleId === 3 ? "scount"
                    : "fan"

     return roleName;
};