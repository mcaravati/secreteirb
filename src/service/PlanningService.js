import axiosInstance from "./utils";

export function getWeek(currentObject) {
    const id = currentObject.id;
    const name = currentObject.name;
    const weekId = currentObject.weekId;

    return new Promise((resolve, reject) => {
        axiosInstance
            // .get(`http://localhost:8081/week/${id}/${weekId}`)
            .get(`http://edmond.matteo-caravati.fr/planning/week/${id}/${weekId}`)
            .then(response => resolve([name, response.data]))
            .catch(reject);
    });
}

export function getDay(currentObject) {
    const id = currentObject.id;
    const day = currentObject.day;
    const name = currentObject.name;

    return new Promise((resolve, reject) => {
        axiosInstance
            // .post(`http://localhost:8081/day/${id}`, { date: day })
            .get(`http://edmond.matteo-caravati.fr/planning/day/${id}`, { date: day })
            .then(response => resolve([name, response.data]))
            .catch(reject);
    });
}