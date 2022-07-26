export const getCountryCodes = () => {
  return fetch("https://flagcdn.com/en/codes.json", {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      return err;
    });
};




