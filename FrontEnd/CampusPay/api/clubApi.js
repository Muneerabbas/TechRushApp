import axiosInstance from './axiosInstance';

export const getAllClubs = () => {
    return axiosInstance.get('/clubs');
};

export const createClub = (clubData) => {
    return axiosInstance.post('/clubs', clubData);
};