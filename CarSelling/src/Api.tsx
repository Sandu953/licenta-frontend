import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // Adjust this if your backend runs on a different port or host

export const registerUser = async (email: string, password: string, username: string) => {
    try {
        console.log("Sending registration request:", { email, password, username });

        const response = await axios.post(`${API_URL}/register`, { email, password, username }, {
            headers: { "Content-Type": "application/json" }
        });

        return response.data;
    } catch (error) {
        console.error("Registration failed:", error);
        throw error;
    }
};

export const loginUser = async (email: string, password: string) => {
    try {
        console.log("Sending login request:", { email, password });

        const response = await axios.post(`${API_URL}/login`, { email, password }, {
            headers: { "Content-Type": "application/json" }
        });

        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};
