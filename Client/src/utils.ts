// // Function to call the server-side route and set API key for user
// async function setApiKeyForUser(userId: string, token: string) {
//     const endpoint = "http://localhost:3000/auth/set-api-key";
//     try {
//       const response = await axios.post(
//         endpoint,
//         {
//           userId,
//           service: "converta",
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`, // Include authentication token if required
//           },
//         }
//       );

//       if (response.status !== 200) {
//         throw new Error("Failed to set API key");
//       }
//       console.log("API key set successfully");
//       return response.data; // Return the response data as apiKey
//     } catch (error) {
//       console.error("Error setting API key:", error);
//       throw error;
//     }
//   }

//   async function getApiKeyForUser(userId: string, token: string) {
//     const endpoint = "http://localhost:3000/auth/get-api-key";
//     try {
//       const response = await axios.post(
//         endpoint,
//         {
//           userId,
//           service: "converta",
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`, // Include authentication token if required
//           },
//         }
//       );

//       if (response.status !== 200) {
//         throw new Error("Failed to get API key");
//       }

//       console.log("API key retrieved successfully");
//       return response.data; // Return the response data as apiKey
//     } catch (error) {
//       console.error("Error getting API key:", error);
//       throw error;
//     }
//   }
