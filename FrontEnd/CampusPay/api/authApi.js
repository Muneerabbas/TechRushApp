import axiosInstance from './axiosInstance';

export const loginUser = (email, password) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    return axiosInstance.post('/auth/login', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const registerUser = (name, email, password) => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('password', password);

  return axiosInstance.post('/auth/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

