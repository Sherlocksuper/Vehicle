const getToken = (): string | null => {
  return localStorage.getItem("accessToken");
}

const setToken = (token: string): void => {
  localStorage.setItem("accessToken", token);
}

const removeToken = (): void => {
  localStorage.removeItem("accessToken");
}


const userUtils = {
  getToken,
  setToken,
  removeToken,
}

export default userUtils;
