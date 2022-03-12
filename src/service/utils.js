import axios from "axios";

export default axios.create({
    validateStatus: status => {
        return status == 200;
    }
});