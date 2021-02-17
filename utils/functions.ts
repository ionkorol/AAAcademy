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

export const getRemainingWeeks = () => {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  let nextSaturday: Date;
  let weeksLeft = 0;

  if (now.getDay() === 7) {
    nextSaturday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 6
    );
  } else if (now.getDay() === 6) {
    nextSaturday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 7
    );
    weeksLeft += 1;
  } else {
    nextSaturday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + (6 - now.getDay())
    );
    weeksLeft += 1;
  }

  weeksLeft += Math.floor((next.getDate() - nextSaturday.getDate()) / 7);

  if (weeksLeft > 4) {
    weeksLeft = 4;
  }

  return weeksLeft;
};
