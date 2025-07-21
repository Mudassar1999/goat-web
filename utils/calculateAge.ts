export const calculateAge = (dob: any) => {
     const currentDate = new Date();
     const birthDate = new Date(dob);
     let age = currentDate.getFullYear() - birthDate.getFullYear();

     // Adjust age if birthday hasn't occurred yet this year
     if (
          currentDate.getMonth() < birthDate.getMonth() ||
          (currentDate.getMonth() === birthDate.getMonth() &&
               currentDate.getDate() < birthDate.getDate())
     ) {
          age--;
     }

     return age
};