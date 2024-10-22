const getToken = (): string | null => {
  return localStorage.getItem("accessToken");
}


const userUtils = {
  getToken,
}

export default userUtils;
