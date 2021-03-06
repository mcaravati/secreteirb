import axiosInstance from "./utils";

export function getWeek(currentObject) {
    const id = currentObject.id;
    const weekId = currentObject.weekId;

    return new Promise((resolve, reject) => {
        axiosInstance
            .get(`https://edmond.matteo-caravati.fr/planning/week/${id}/${weekId}`)
            .then(response => resolve(response.data))
            .catch(reject);
    });
}