const axios = require('axios').default;

const url = process.env.MONGO_HOST;

const getAllLogs = async () => {
    try {

        const data = axios.get(url)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.error(error);
                return [];
            });
        return data;
    } catch (error) {
        console.error(error)
        return [];
    }
}

export {
    getAllLogs
}