import axios from 'axios';

const SearchService = {
    search: async (query) => {
        const response = await axios.get(`/api/search?q=${query}`);
        return response.data;
    }
};

export default SearchService;
