export const base_url = "http://localhost:8000/";
export const xAuthToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlJZCI6ImFwaS1lbmRwb2ludC1pZCIsImlhdCI6MTY5OTA5ODI4OH0.FX5q1nl41eQA02-dmrJyvAinH_4dL-QXJu0MiBc6sY4"; 
export const headers = {
    "x-auth-token": xAuthToken
};

export const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
export const phoneRegex = /^[1-9]\d{9}$/;