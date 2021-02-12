export const getAge = (birthDate: string) => {
  const dobArray = birthDate.split("-");
  const dobYear = dobArray[0];
  const dobMonth = dobArray[1];
  const dobDay = dobArray[2];
  const today = new Date();
  let age = today.getFullYear() - Number(dobYear);
  const m = today.getMonth() - Number(dobMonth);
  if (m < 0 || (m === 0 && today.getDate() < Number(dobDay))) {
    age--;
  }
  return age;
};