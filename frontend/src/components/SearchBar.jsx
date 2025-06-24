import React, { useState } from 'react';

import SearchResults from './SearchResults';
import SearchService from '../services/SearchService';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isFocused, setIsFocused] = useState(false);

    const handleSearch = async () => {
        try {
            const searchResults = await SearchService.search(query);
            setResults(searchResults);
        } catch (error) {
            console.error('Search failed:', error);
        }
    };

    const handleFocus = () => {
        if (!isFocused) {
            setQuery('');
            setIsFocused(true);
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Search..."
                className="search-input"
            />
            <button onClick={handleSearch} className="search-button">
                Search
            </button>
            <SearchResults results={results} />
        </div>
    );
};

export default SearchBar;
